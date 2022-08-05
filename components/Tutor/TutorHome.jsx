import { useState } from "react";

import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

import axios from "axios";
import { useRouter } from "next/router";

import useCustomAuth from "../../customHooks/useCustomAuth";

const SetupAccount = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useCustomAuth();

  const setupGooglePermssions = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/gen-auth-link`
      );
      const url = res.data;
      console.log({ url });
      router.push(url);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const setupStripePermissions = async () => {
    try {
      let linkRes = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/stripe/onboarding/${user.stripeConnectedAccount.id}`
      );
      linkRes = linkRes.data;
      const { url } = linkRes;
      router.push(url);
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    let googleSetUp = user.googleAccount.setup;
    let stripeSetUp = user.stripeConnectedAccount.setup;

    console.log({ googleSetUp, stripeSetUp });

    return (
      <div className=" bg-white shadow-lg p-8 prose flex flex-col gap-8">
        <div className="flex">
          <div className="w-6/12">
            <img
              src="img/personal_settings.svg"
              alt=""
              srcset=""
              className="h-[300px] mx-auto"
            />
          </div>
          <div className="w-6/12">
            <div className=" mx-auto">
              {(!googleSetUp || !stripeSetUp) && (
                <Alert status="warning" className="flex justify-center">
                  <AlertIcon />
                  Your account is not active yet
                </Alert>
              )}
              {googleSetUp && stripeSetUp && (
                <Alert status="success" className="flex justify-center">
                  <AlertIcon />
                  Account is active
                </Alert>
              )}
            </div>
            <div className="text-3xl my-8 font-bold text-center">
              Complete the following steps to <br /> activate your account
            </div>
            <div className="flex justify-center">
              <ul className="steps">
                <li className={`step ${googleSetUp ? "step-primary" : ""}`}>
                  Set up Google Permissions
                </li>
                <li className={`step ${stripeSetUp ? "step-primary" : ""}`}>
                  Set up payments
                </li>
                <li
                  className={`step ${
                    stripeSetUp && googleSetUp ? "step-primary" : ""
                  }`}
                >
                  Complete
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-3" />
        <div className="flex justify-center">
          <div className="flex flex-col gap-8">
            <div className="flex justify-between gap-8 items-center text-xl font-semibold uppercase">
              <div className="flex gap-6 items-center">
                <FaCheckCircle
                  style={{ color: googleSetUp ? "#570DF8" : "#E5E6E6" }}
                />{" "}
                Set up google Permissions
              </div>
              <button
                className="btn btn-primary flex gap-4"
                onClick={setupGooglePermssions}
                disabled={loading || googleSetUp}
              >
                {googleSetUp ? "Completed" : "Start Now"}
              </button>
            </div>
            <div className="flex justify-between items-center text-xl font-semibold uppercase">
              <div className="flex gap-6 items-center">
                <FaCheckCircle
                  style={{ color: stripeSetUp ? "#570DF8" : "#E5E6E6" }}
                />
                Set up Payments
              </div>
              <button
                className="btn btn-primary flex gap-4"
                disabled={loading || stripeSetUp}
                onClick={setupStripePermissions}
              >
                {stripeSetUp ? "Completed" : "Start Now"}
              </button>
            </div>
          </div>
        </div>
        <hr className="my-3" />
      </div>
    );
  }
};

export default function TutorHome() {
  return (
    <div className="flex-1 p-8 bg-gray-200">
      <SetupAccount />
    </div>
  );
}
