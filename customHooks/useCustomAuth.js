import { useState, useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

import { firebaseApp, db } from "../firebase/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
const auth = getAuth(firebaseApp);

export default function useCustomAuth() {
  const [authUser, authUserLoading, authUserError] = useAuthState(auth);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);

      //   If no one is logged in
      if (!authUserLoading && !authUser) {
        setUser(null);
        setLoading(false);
      }

      //   If there is a user logged in
      if (!authUserLoading && authUser) {
        const userRef = doc(db, "users", authUser.uid);

        try {
          onSnapshot(userRef, (userSnapshot) => {
            setUser({ id: userSnapshot.id, ...userSnapshot.data() });
            setLoading(false);
          });
        } catch (error) {
          setUser(null);
          setLoading(false);
        }
      }

      if (!authUserLoading && !authUserError) {
        setUser(null);
        setLoading(false);
      }
    }

    init();
  }, [authUser, authUserLoading]);

  return { user, loading };
}
