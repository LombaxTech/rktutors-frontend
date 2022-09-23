import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import axios from "axios";

import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseClient";

import Link from "next/link";

export default function StripeConnectStatusCheck() {
  const { user, userLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [setupError, setSetupError] = useState(false);

  async function init() {
    try {
      let connectedAccount = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/stripe/connected-account/${user.stripeConnectedAccount.id}`
      );
      connectedAccount = connectedAccount.data;
      console.log(connectedAccount);

      const {
        details_submitted,
        payouts_enabled,
        charges_enabled,
        requirements,
      } = connectedAccount;

      //   console.log({
      //     details_submitted,
      //     payouts_enabled,
      //     charges_enabled,
      //     requirements,
      //   });

      if (details_submitted && payouts_enabled && charges_enabled) {
        const userDocRef = doc(db, "users", user.uid);

        const profileSetup = user.profile.setup;

        await updateDoc(userDocRef, {
          "stripeConnectedAccount.setup": true,
          ...(profileSetup && { active: true }),
        });

        setSetupSuccess(true);
      }

      if (!details_submitted || !payouts_enabled || !charges_enabled) {
        setSetupError(true);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setSetupError(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user && !userLoading) {
      init();
    }
  }, [user, userLoading]);

  return (
    <div className="bg-gray-200 flex-1 flex justify-center items-center">
      {loading && (
        <h1 className="text-4xl font-bold">Checking set up status...</h1>
      )}
      {!loading && setupSuccess && (
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Set up complete!</h1>
          <Link href="/">
            <button className="btn btn-primary">Finish</button>
          </Link>
        </div>
      )}
      {!loading && setupError && (
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Set up incomplete</h1>
          <h1 className="text-2xl font-medium">Please go back and try again</h1>
          <Link href="/">
            <button className="btn btn-primary">Go Back</button>
          </Link>
        </div>
      )}
    </div>
  );
}
