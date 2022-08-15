import { useState, useEffect } from "react";

import { useRouter } from "next/router";
import useCustomAuth from "../customHooks/useCustomAuth";
import axios from "axios";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseClient";

export default function GauthStatusCheck() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { user, userLoading } = useCustomAuth();

  useEffect(() => {
    async function init() {
      if (router.isReady && user && !userLoading) {
        const { code } = router.query;

        try {
          let tokens = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER}/gen-tokens`,
            { code }
          );
          tokens = tokens.data;

          const { access_token, refresh_token, scope } = tokens;
          //   TODO: Check necessary scopes are included in scope, scope.includes(...)
          //   TODO: Check access_token and refresh_token are okay

          if (access_token && refresh_token) {
            let googleAccountDetails = await axios.get(
              `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
            );
            googleAccountDetails = googleAccountDetails.data;
            const googleEmailAddress = googleAccountDetails.email;

            console.log(googleEmailAddress);

            const stripeAndProfileSetup =
              user.profile.setup && user.stripeConnectedAccount.setup;

            const userDocRef = doc(db, "users", user.uid);
            const updateDetails = {
              ...(stripeAndProfileSetup && { active: true }),

              googleAccount: {
                refresh_token,
                googleEmailAddress,
                setup: true,
              },
            };

            await updateDoc(userDocRef, updateDetails);
            console.log("account updated");

            setLoading(false);
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      }
    }

    init();
  }, [router.isReady, user, userLoading]);

  if (loading) return <div className="">Checking your account...</div>;

  return <div>Account set up!</div>;
}
