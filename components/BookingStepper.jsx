import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import {
  Radio,
  Stack,
  RadioGroup,
  Spinner,
  Select,
  Textarea,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import FunctionalCalendar from "../components/functionalCalendar/calendar";

import axios from "axios";
import {
  updateDoc,
  doc,
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseClient";
import { FaPlusCircle } from "react-icons/fa";

import { formatDate, getLastNChars } from "../helperFunctions";
import Link from "next/link";
import moment from "moment";

const Card = ({ card, user }) => {
  const { name } = card.billing_details;
  let { brand, exp_month, exp_year, last4 } = card.card;

  if (exp_month.toString().length === 1) {
    exp_month = `0${exp_month.toString()}`;
  }
  exp_year = exp_year.toString().slice(-2);

  const isVisa = brand === "visa";
  const isMasterCard = brand === "mastercard";

  return (
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
  );
};

const AddCard = ({ user }) => {
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

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
    <div className="collapse">
      <input type="checkbox" />
      <button className="collapse-title btn btn-accent font-bold flex items-center gap-4">
        <span>Add New Payment Method</span>
        <FaPlusCircle className="text-xl" />
      </button>
      <div className="collapse-content">
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

const SelectPaymentMethod = ({ user, paymentMethodId, setPaymentMethodId }) => {
  const { paymentMethods } = user;

  const onRadioChange = (v) => {
    console.log(v);
    setPaymentMethodId(v);
  };

  return (
    <div className="">
      {(!paymentMethods || paymentMethods?.length === 0) && (
        <div className="">
          <h1 className="text-3xl font-bold">
            You have no saved payment methods
          </h1>

          <div className="flex flex-col items-center">
            <div className="mt-12">
              <AddCard user={user} />
            </div>
            <div className="font-light my-4">
              This card will be used for booking your lesson
            </div>
          </div>
        </div>
      )}

      {paymentMethods?.length > 0 && (
        <div className="flex gap-16 justify-between sm:flex-col sm:p-0 sm:justify-center">
          {/* Cards */}
          <div className="flex flex-col gap-8">
            {/* Title */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold text-center sm:text-xl">
                Choose payment method
              </h1>
              <h1 className="text-sm font-bold text-center">
                You will only be charged when the tutor accepts your lesson
                request
              </h1>
            </div>
            {/* Cards */}
            <div className="flex justify-center">
              <RadioGroup onChange={onRadioChange} value={paymentMethodId}>
                <Stack direction="column" gap={2}>
                  {/* <div className="flex justify-center flex-wrap gap-2"> */}
                  {paymentMethods.map((card, i) => (
                    <Radio value={card.id} key={i}>
                      <Card user={user} card={card} key={i} />
                    </Radio>
                  ))}
                  {/* </div> */}
                </Stack>
              </RadioGroup>
            </div>
          </div>
          {/* Add New Card */}
          <AddCard user={user} />
        </div>
      )}
    </div>
  );
};

export default function BookingStepper({ tutor, hasPrevBooked }) {
  const { user, userLoading } = useContext(AuthContext);

  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const [selectedTime, setSelectedTime] = useState(null);
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(false);

  const [bookedTimes, setBookedTimes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [boookingRequests, setBookingRequests] = useState([]);
  const [bookedTimesLoading, setBookedTimesLoading] = useState(true);

  const [bookingProcessing, setBookingProcessing] = useState(false);

  useEffect(() => {
    async function init() {
      setBookedTimesLoading(true);
      try {
        // todo: get bookings and set booked times
        let bookingsRef = collection(db, "bookings");
        let bookingsQuery = query(
          bookingsRef,
          where("tutor.id", "==", tutor.id)
        );

        let reqsRef = collection(db, "bookingRequests");
        let reqsQuery = query(reqsRef, where("tutor.id", "==", tutor.id));

        let bookingsSnapshot = await getDocs(bookingsQuery);
        let reqsSnapshot = await getDocs(reqsQuery);

        let bookings = [];
        let reqs = [];

        bookingsSnapshot.forEach((b) => {
          const { status } = b.data();
          if (status === "cancelled") return;

          bookings.push(b.data());
        });
        reqsSnapshot.forEach((r) => {
          const { status } = r.data();
          if (status === "pending") reqs.push(r.data());
        });

        let newBookedTimes = bookings.map((booking) =>
          moment(booking.selectedTime.toDate()).format("YYYY-MM-DD HH:mm")
        );
        let newReqsTime = reqs.map((r) =>
          moment(r.selectedTime.toDate()).format("YYYY-MM-DD HH:mm")
        );

        // todo: do same for student bookings and reqs
        let studentBookingsQuery = query(
          bookingsRef,
          where("student.id", "==", user.uid)
        );

        let studentReqsQuery = query(
          reqsRef,
          where("student.id", "==", user.uid)
        );

        let studentBookingsSnapshot = await getDocs(studentBookingsQuery);
        let studentReqsSnapshot = await getDocs(studentReqsQuery);

        let studentBookings = [];
        let studentReqs = [];

        studentBookingsSnapshot.forEach((b) => {
          const { status } = b.data();
          if (status === "cancelled") return;

          studentBookings.push(b.data());
        });
        studentReqsSnapshot.forEach((r) => {
          const { status } = r.data();
          if (status === "pending") studentReqs.push(r.data());
        });

        let newStudentBookedTimes = studentBookings.map((booking) =>
          moment(booking.selectedTime.toDate()).format("YYYY-MM-DD HH:mm")
        );
        let newStudentReqsTimes = studentReqs.map((r) =>
          moment(r.selectedTime.toDate()).format("YYYY-MM-DD HH:mm")
        );

        let bookedTimes = [
          ...newBookedTimes,
          ...newReqsTime,
          ...newStudentBookedTimes,
          ...newStudentReqsTimes,
        ];
        // console.log(bookedTimes);
        setBookedTimes(bookedTimes);
        setBookedTimesLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (paymentMethodId) {
      let pm = user.paymentMethods.filter((p) => p.id === paymentMethodId)[0];
      setPaymentMethod(pm);
    }
  }, [paymentMethodId]);

  const [lessonPrice, setLessonPrice] = useState();

  useEffect(() => {
    if (getLastNChars(subject, 4) === "GCSE") {
      setLessonPrice(tutor.lessonPrices["GCSE"]);
    } else if (getLastNChars(subject, 7) === "A-Level") {
      setLessonPrice(tutor.lessonPrices["A-Level"]);
    }
  }, [subject]);

  const isNextDisabled = () => {
    if (hasPrevBooked) {
      if (activeStep == 0 && !selectedTime) return true;
      if (activeStep == 1 && !subject) return true;

      // todo: make sure payment method is selected
      if (activeStep == 2 && !paymentMethod) return true;
      if (activeStep == 3) return true;
    } else if (!hasPrevBooked) {
      if (activeStep == 0 && !selectedTime) return true;
      if (activeStep == 1 && !subject) return true;
      if (activeStep == 3) return true;
    }

    if (bookingSuccess) return true;
  };

  const confirmBooking = async () => {
    setBookingProcessing(true);

    try {
      const bookingRequest = {
        student: {
          id: user.uid,
          fullName: user.fullName,
          email: user.email,
          stripeCustomerId: user.stripeCustomerId,
          ...(user.profilePictureUrl && {
            profilePictureUrl: user.profilePictureUrl,
          }),
          prevBookedTutors: user.prevBookedTutors || [],
        },
        tutor: {
          id: tutor.id,
          fullName: tutor.fullName,
          email: tutor.email,
          ...(tutor.profilePictureUrl && {
            profilePictureUrl: tutor.profilePictureUrl,
          }),
          connectedAccountId: tutor.stripeConnectedAccount.id,
          prevBookedStudents: tutor.prevBookedStudents || [],
        },
        subject,
        selectedTime,
        note,
        ...(hasPrevBooked && { paymentMethodId }),
        price: hasPrevBooked ? lessonPrice : 0,
        status: "pending",
        isFreeTrial: hasPrevBooked ? false : true,
        createdAt: serverTimestamp(),
      };

      // console.log(bookingRequest);

      await addDoc(collection(db, "bookingRequests"), bookingRequest);

      // send email to tutor
      let res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/sg/booking-request-received`,
        {
          tutorEmail: tutor.email,
          studentName: user.fullName,
          lesson: subject,
          lessonTime: formatDate(selectedTime),
          price: hasPrevBooked ? `£${lessonPrice}` : "Free Trial",
        }
      );

      res = res.data;
      console.log(res);

      console.log("created req...");
      setBookingProcessing(false);
      setBookingSuccess(true);
      successMessageRef.current?.scrollIntoView();
    } catch (error) {
      console.log(error);
      setBookingProcessing(false);
      setBookingError(true);
    }
  };

  const successMessageRef = useRef(null);

  if (user)
    return (
      <div className=" flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded">
          <Steps activeStep={activeStep}>
            {/* Time Picking */}
            <Step label="Choose A Time">
              <div className="mt-6">
                {!bookedTimesLoading && (
                  <FunctionalCalendar
                    disableDays={[new Date(2022, 7, 21)]}
                    interval={60}
                    disabledTimes={bookedTimes}
                    minDate={new Date()}
                    onChange={(value) => setSelectedTime(value)}
                    minHour={7}
                    maxHour={23}
                  />
                )}
              </div>
            </Step>

            {/* Subject Selection */}
            <Step label="Choose Subject">
              <div className="flex flex-col justify-center items-center mt-4 gap-8">
                <h1 className="text-3xl font-bold">Choose Subject</h1>
                <div className="w-5/12 flex flex-col gap-4 sm:w-full">
                  <Select
                    value={subject}
                    placeholder="Select Subject"
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    {tutor.profile.teachingSubjects?.map((subject, i) => (
                      <option
                        value={`${subject.subject} ${subject.level}`}
                        key={i}
                      >
                        {`${subject.subject} ${subject.level}`}
                      </option>
                    ))}
                  </Select>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add any notes you want for the lesson (optional)"
                    size="md"
                    rows={5}
                  />
                </div>
              </div>
            </Step>

            {/* Payment */}
            <Step label="Payment Details">
              <div className="flex flex-col justify-center items-center mt-4">
                {hasPrevBooked ? (
                  <SelectPaymentMethod
                    user={user}
                    paymentMethodId={paymentMethodId}
                    setPaymentMethodId={setPaymentMethodId}
                  />
                ) : (
                  <h1 className="text-3xl font-bold mt-6">
                    You May Skip This Step (Free Trial)
                  </h1>
                )}
              </div>
            </Step>

            <Step label="Confirm Booking">
              <div className="flex flex-col justify-center items-center mt-4 gap-8">
                <h1 className="text-3xl font-bold">Booking Overview</h1>
                <div className="flex flex-col gap-2">
                  <div className="">
                    <span>Lesson: </span>
                    {subject} with {tutor.fullName}
                    {!bookingSuccess && (
                      <span
                        className="ml-2 underline text-blue-500 cursor-pointer"
                        onClick={() => setStep(1)}
                      >
                        Edit
                      </span>
                    )}
                  </div>
                  <div className="">
                    <span className="">At: </span>
                    {formatDate(selectedTime)}
                    {!bookingSuccess && (
                      <span
                        className="ml-2 underline text-blue-500 cursor-pointer"
                        onClick={() => setStep(0)}
                      >
                        Edit
                      </span>
                    )}
                  </div>
                  <div className="">
                    <span className="">Additional Notes: </span>
                    {note}
                    {!bookingSuccess && (
                      <span
                        className="ml-2 underline text-blue-500 cursor-pointer"
                        onClick={() => setStep(1)}
                      >
                        Edit
                      </span>
                    )}
                  </div>
                  {hasPrevBooked ? (
                    <div className="">
                      <span className="">Paying with: </span>
                      Card ending in{" "}
                      <span>**** {paymentMethod?.card.last4}</span>
                      {!bookingSuccess && (
                        <span
                          className="ml-2 underline text-blue-500 cursor-pointer"
                          onClick={() => setStep(2)}
                        >
                          Edit
                        </span>
                      )}
                      <div className="mt-2">
                        <span className="">Price: </span>
                        <span className="font-bold">£{lessonPrice}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="">
                      <span className="">Price: </span>
                      <span className="font-bold">FREE Trial</span>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={confirmBooking}
                  disabled={bookingSuccess || bookingProcessing}
                >
                  Confirm Booking{" "}
                  {bookingProcessing && <Spinner className="ml-2" />}
                </button>
                <div className="w-1/3">
                  {bookingError && (
                    <Alert status="error">
                      <AlertIcon />
                      An error has occurred. Please try again or contact
                      support.
                    </Alert>
                  )}
                  {bookingSuccess && (
                    <div
                      className="flex flex-col gap-4"
                      ref={successMessageRef}
                    >
                      <Alert status="success">
                        <AlertIcon />
                        Booking request completed successfully. You will receive
                        an email shortly with confirmation details.
                      </Alert>
                      <div className="flex gap-4 mx-auto">
                        <Link href={`/bookings/requests`}>
                          <button className="btn btn-primary">
                            View Booking Requests
                          </button>
                        </Link>
                        <Link href={`/`}>
                          <button className="btn btn-secondary">Go Home</button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Step>
          </Steps>
        </div>

        <div className="flex gap-4 p-2">
          <button
            onClick={prevStep}
            disabled={activeStep === 0 || bookingSuccess}
            className="btn btn-primary"
          >
            {/* <ArrowBackIcon />  */}
            back
          </button>

          <button
            onClick={nextStep}
            disabled={isNextDisabled()}
            className="btn btn-secondary"
          >
            next
            {/* <ArrowForwardIcon size={"2xl"} /> */}
          </button>
        </div>
      </div>
    );
}
