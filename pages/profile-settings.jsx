import { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";

import {
  Input,
  Select,
  Tag,
  TagLabel,
  TagRightIcon,
  Alert,
  AlertIcon,
  Textarea,
  Spinner,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { SmallCloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaTrash } from "react-icons/fa";

import { db } from "../firebase/firebaseClient";
import {
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import axios from "axios";

import General from "../components/ProfileSettingComponents/General";
import Password from "../components/ProfileSettingComponents/Password";
import TutoringSubjects from "../components/ProfileSettingComponents/TutoringSubjects";
import ProfileInformation from "../components/ProfileSettingComponents/ProfileInformation";
import Availablity from "../components/ProfileSettingComponents/Availability";

export default function ProfileSettings() {
  const { user, userLoading } = useContext(AuthContext);

  if (user) {
    const isTutor = user.type === "tutor";
    const isStudent = user.type === "student";

    return (
      <div>
        <Sidebar>
          <div className="flex flex-col p-8 bg-white">
            <General user={user} />
            <Password user={user} />
            {isTutor && <TutoringSubjects user={user} />}
            {isTutor && <ProfileInformation user={user} />}
            {isTutor && <Availablity user={user} />}
            {isTutor && <PaymentSettings user={user} />}
            {isTutor && <LessonPriceSettings user={user} />}
            {isStudent && <PaymentMethods user={user} />}
          </div>
        </Sidebar>
      </div>
    );
  }
}

const LessonPriceSettings = ({ user }) => {
  const { lessonPrices } = user;

  return (
    <div id="lesson-price-settings" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Your Lesson Prices</h1>
      <div className="w-3/12">
        <div className="flex justify-between">
          GCSE: <span> £{lessonPrices["GCSE"]} per lesson</span>{" "}
        </div>
        <div className="flex justify-between">
          A-Level: <span> £{lessonPrices["A-Level"]} per lesson</span>
        </div>
      </div>
      <EditPricesModal user={user} />
    </div>
  );
};

const EditPricesModal = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { lessonPrices } = user;

  const [gcsePrice, setGcsePrice] = useState(lessonPrices.GCSE);
  const [aLevelPrice, setALevelPrice] = useState(lessonPrices["A-Level"]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const updatePrices = async () => {
    setSuccess(false);
    setError(false);
    try {
      setLoading(true);
      // console.log(aLevelPrice);

      await updateDoc(doc(db, "users", user.uid), {
        lessonPrices: {
          "A-Level": aLevelPrice,
          GCSE: gcsePrice,
        },
      });

      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
      setTimeout(() => setError(false), 5000);
    }
  };

  return (
    <>
      <button onClick={onOpen} className="btn btn-primary w-3/12">
        Edit Prices
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update lesson prices</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="p-8 flex flex-col items-center gap-8">
              <div className="w-11/12">
                <div className="flex items-center justify-between gap-1">
                  <span className="">GCSE </span>

                  <span className="flex items-center gap-1">
                    £
                    <NumberInput
                      value={gcsePrice}
                      min={10}
                      max={50}
                      onChange={(n) => setGcsePrice(Math.floor(n))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="">A-Level </span>
                  <span className="flex items-center gap-1">
                    £
                    <NumberInput
                      value={aLevelPrice}
                      min={10}
                      max={50}
                      onChange={(n) => setALevelPrice(Math.floor(n))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </span>
                </div>
              </div>

              <button
                className="btn btn-primary "
                onClick={updatePrices}
                disabled={loading}
              >
                Update prices
                {loading && <Spinner className="ml-4" />}
              </button>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  An error has occurred
                </Alert>
              )}
              {success && (
                <Alert status="success">
                  <AlertIcon />
                  Your prices have been updated successfully
                </Alert>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const PaymentSettings = ({ user }) => {
  const goToStripeDashboard = async () => {
    try {
      let loginLinkRes = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/stripe/login-link/${user.stripeConnectedAccount.id}`
      );
      loginLinkRes = loginLinkRes.data;
      const { url } = loginLinkRes;
      window.open(url, "_blank").focus();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="payment-settings" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Payment Settings</h1>
      <h1 className="">
        View your payments and settings through your Stripe dashboard
      </h1>
      <Tooltip label="Stripe is a world famouse online payment processing and commerce solutions for internet businesses of all sizes.">
        <div className="text-blue-500 font-normal cursor-pointer underline">
          What is Stripe?
        </div>
      </Tooltip>
      <button
        className="btn btn-secondary w-3/12"
        onClick={goToStripeDashboard}
      >
        Payment Dashboard
      </button>
      <hr className="my-4" />
    </div>
  );
};

const PaymentMethods = ({ user }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const saveCard = async () => {
    setLoading(true);
    try {
      if (!user.stripeCustomerId || elements == null) return;

      if (!fullName) {
        // todo: error of missing name
        return console.log("missing full name");
      }

      // fetch setup intent
      let setupIntent = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/stripe/setup-intent`,
        {
          customerId: user.stripeCustomerId,
        }
      );

      setupIntent = setupIntent.data;
      // console.log(setupIntent);
      const { client_secret } = setupIntent;

      const cardElement = elements.getElement("card");

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name: fullName },
      });

      if (paymentMethodReq.error) {
        // todo: handle error
        console.log("payment method req error");
        let { error } = paymentMethodReq;
        console.log(error);
        console.log(error.code);
        console.log(error.message);

        return;
      }

      console.log(paymentMethodReq.paymentMethod);

      let cardSetUpRes = await stripe.confirmCardSetup(client_secret, {
        payment_method: paymentMethodReq.paymentMethod.id,
      });

      // if successful, save the card details to firestore
      let currentPaymentMethods = user.paymentMethods || [];
      let newPaymentMethods = [
        ...currentPaymentMethods,
        paymentMethodReq.paymentMethod,
      ];

      await updateDoc(doc(db, "users", user.uid), {
        paymentMethods: newPaymentMethods,
      });
      console.log("saved to firestore...");

      elements.getElement(CardElement).clear();
      setFullName("");
      // console.log(cardSetUpRes);
      // let paymentMethodId = cardSetUpRes.setupIntent?.payment_method;
      // console.log(paymentMethodId);
      console.log("Success in setting up card");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div id="payment-methods" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Payment Methods</h1>
      <div className="w-5/12 flex flex-col gap-4">
        {user.paymentMethods?.length === 0 && (
          <h1 className="text-base font-semibold">
            You have no payment methods saved
          </h1>
        )}
        {user.paymentMethods?.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-base font-semibold">Saved Cards</h1>
            <div className="flex flex-wrap gap-2">
              {user.paymentMethods.map((card, i) => (
                <Card user={user} card={card} key={i} />
              ))}
            </div>
          </div>
        )}

        <hr className="my-4" />
        <h1 className="text-base font-semibold">Add Card</h1>

        <div className="flex flex-col gap-8 mt-4">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                },
              },
            }}
            className="shadow-md p-4 rounded-lg text-3xl "
          />
          <div className="flex gap-2 items-center">
            <label className="text-base">Full name as on card: </label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered input-ghost"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary flex gap-2"
            onClick={saveCard}
            disabled={loading}
          >
            <span>Add card</span>
            {loading && <Spinner />}
          </button>
        </div>
      </div>
    </div>
  );
};

const Card = ({ card, user }) => {
  const { name } = card.billing_details;
  let { brand, exp_month, exp_year, last4 } = card.card;

  if (exp_month.toString().length === 1) {
    exp_month = `0${exp_month.toString()}`;
  }
  exp_year = exp_year.toString().slice(-2);

  const isVisa = brand === "visa";
  const isMasterCard = brand === "mastercard";

  const [loading, setLoading] = useState(false);

  const removePaymentMethod = async (paymentMethodId) => {
    setLoading(true);
    try {
      let res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/stripe/detach-payment-method`,
        { paymentMethodId }
      );
      res = res.data;
      console.log(res);

      let currentPaymentMethods = user.paymentMethods || [];
      let newPaymentMethods = currentPaymentMethods.filter(
        (pm) => pm.id !== paymentMethodId
      );
      await updateDoc(doc(db, "users", user.uid), {
        paymentMethods: newPaymentMethods,
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="p-4 shadow-md flex items-center gap-8 min-w-[350px]">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <div className="font-semibold flex items-center">
              **** **** **** {last4}
            </div>
            <div className="font-light text-sm">
              Expires {exp_month}/{exp_year}
            </div>
          </div>
          <div className="">{name}</div>
        </div>

        <div className="">
          {isVisa && <img src="/img/cardLogos/visa.svg" className="w-12" />}
          {isMasterCard && (
            <img src="/img/cardLogos/mc_symbol_light.svg" className="w-12" />
          )}
        </div>
      </div>
      <button
        className="btn btn-error flex gap-2"
        onClick={() => removePaymentMethod(card.id)}
        disabled={loading}
      >
        <FaTrash className="text-xl" /> <span>remove</span>
        {loading && <Spinner />}
      </button>
    </div>
  );
};
