import { useState, useEffect, createContext } from "react";
import useCustomAuth from "../customHooks/useCustomAuth";
import { db } from "../firebase/firebaseClient";
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { isToday } from "../helperFunctions";
import { RepeatWrapping } from "three";

export const BookingRequestsContext = createContext();

export const BookingRequestsProvider = ({ children }) => {
  const { user, userLoading } = useCustomAuth();

  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [declinedRequests, setDeclinedRequests] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        const isTutor = user.type === "tutor";

        let reqsRef = collection(db, "bookingRequests");
        let reqsQuery = query(
          reqsRef,
          where(isTutor ? "tutor.id" : "student.id", "==", user.uid),
          orderBy("selectedTime", "desc")
        );

        onSnapshot(reqsQuery, (reqsSnapshot) => {
          let reqs = [];

          reqsSnapshot.forEach((r) => reqs.push({ id: r.id, ...r.data() }));

          setRequests(reqs);

          let pendingReqs = reqs.filter((r) => r.status === "pending");
          let acceptedReqs = reqs.filter((r) => r.status === "accepted");
          let declinedReqs = reqs.filter((r) => r.status === "declined");

          setPendingRequests(pendingReqs);
          setAcceptedRequests(acceptedReqs);
          setDeclinedRequests(declinedReqs);
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (user && !userLoading) init();
  }, [user, userLoading]);

  return (
    <BookingRequestsContext.Provider
      value={{ requests, pendingRequests, acceptedRequests, declinedRequests }}
    >
      {children}
    </BookingRequestsContext.Provider>
  );
};
