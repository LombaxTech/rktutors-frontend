import { useState, useEffect } from "react";
import useCustomAuth from "../customHooks/useCustomAuth";
import axios from "axios";

import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseClient";

export default function StripeConnectStatusCheck() {
  const { user, userLoading } = useCustomAuth();
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

        await updateDoc(userDocRef, {
          "stripeConnectedAccount.setup": true,
        });

        // user google n stripe need to be setup for account to be active
        if (user.googleAccount.setup) {
          await updateDoc(userDocRef, { active: true });
        }
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setSetupError(true);
    }
  }

  useEffect(() => {
    if (user && !userLoading) {
      init();
    }
  }, [user, userLoading]);

  if (loading) return <div className="loading">Checking account status...</div>;

  return <div>stripe-connect-status-check</div>;
}
