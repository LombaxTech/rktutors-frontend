import { useState, useContext } from "react";

import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

import { AuthContext } from "../../context/AuthContext";

const SetupAccount = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

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
    let stripeSetUp = user.stripeConnectedAccount.setup;
    let profileSetUp = user.profile?.setup;

    console.log({ stripeSetUp });
    console.log(profileSetUp);

    return (
      <div className="flex-1 p-8 bg-gray-200">
        <div className=" bg-white shadow-lg p-8 prose flex flex-col gap-8">
          <div className="flex">
            <div className="w-6/12">
              <img
                src="img/personal_settings.svg"
                alt=""
                className="h-[300px] mx-auto"
              />
            </div>
            <div className="w-6/12">
              <div className=" mx-auto">
                {(!stripeSetUp || !profileSetUp) && (
                  <Alert status="warning" className="flex justify-center">
                    <AlertIcon />
                    Your account is not active yet
                  </Alert>
                )}
                {stripeSetUp && profileSetUp && (
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
                  <li className={`step ${profileSetUp ? "step-primary" : ""}`}>
                    Profile set up
                  </li>

                  <li className={`step ${stripeSetUp ? "step-primary" : ""}`}>
                    Payments set up
                  </li>
                  <li
                    className={`step ${
                      stripeSetUp && profileSetUp ? "step-primary" : ""
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
                    style={{ color: profileSetUp ? "#570DF8" : "#E5E6E6" }}
                  />{" "}
                  Set up your Profile
                </div>
                <Link href={`/profile-setup`}>
                  <button
                    className="btn btn-primary flex gap-4"
                    disabled={loading || profileSetUp}
                  >
                    {profileSetUp ? "Completed" : "Start Now"}
                  </button>
                </Link>
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
      </div>
    );
  }
};

export default SetupAccount;
