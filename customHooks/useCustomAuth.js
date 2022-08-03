import { useState, useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

import { firebaseApp, db } from "../firebase/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
const auth = getAuth(firebaseApp);

export default function useCustomAuth() {
  const [authUser, authUserLoading, authUserError] = useAuthState(auth);

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setUserLoading(true);

      //   If no one is logged in
      if (!authUserLoading && !authUser) {
        setUser(null);
        setUserLoading(false);
      }

      //   If there is a user logged in
      if (!authUserLoading && authUser) {
        const userRef = doc(db, "users", authUser.uid);

        try {
          onSnapshot(userRef, (userSnapshot) => {
            setUser({ ...authUser, ...userSnapshot.data() });
            setUserLoading(false);
          });
        } catch (error) {
          setUser(null);
          setUserLoading(false);
        }
      }

      if (!authUserLoading && !authUserError) {
        setUser(null);
        setUserLoading(false);
      }
    }

    init();
  }, [authUser, authUserLoading]);

  return { user, userLoading };
}
