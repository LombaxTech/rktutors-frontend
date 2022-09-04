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

export const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const { user, userLoading } = useCustomAuth();

  const [allBookings, setAllBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [todaysBookings, setTodaysBookings] = useState([]);
  const [futureBookings, setFutureBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        const isTutor = user.type === "tutor";

        let bookingsRef = collection(db, "bookings");
        let bookingsQuery = query(
          bookingsRef,
          where(isTutor ? "tutor.id" : "student.id", "==", user.uid),
          orderBy("selectedTime", "asc")
        );

        onSnapshot(bookingsQuery, (bookingsSnapshot) => {
          let allBookings = [];

          bookingsSnapshot.forEach((b) =>
            allBookings.push({ id: b.id, ...b.data() })
          );

          setAllBookings(allBookings);

          // get active bookings
          let activeBookings = allBookings.filter((b) => b.status === "active");
          setActiveBookings(activeBookings);

          // get todays bookings
          let todaysBookings = allBookings.filter(
            (b) => isToday(b.selectedTime.toDate()) && b.status === "active"
          );
          setTodaysBookings(todaysBookings);

          // get future bookings
          let futureBookings = allBookings.filter(
            (b) => b.selectedTime.toDate() > new Date() && b.status === "active"
          );
          setFutureBookings(futureBookings);

          // get past bookings
          let pastBookings = allBookings.filter(
            (b) => b.selectedTime.toDate() < new Date() && b.status === "active"
          );
          setPastBookings(pastBookings);

          // get cancelled bookings
          let cancelledBookings = allBookings.filter(
            (b) => b.status === "cancelled"
          );
          setCancelledBookings(cancelledBookings);
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (user && !userLoading) init();
  }, [user, userLoading]);

  return (
    <BookingsContext.Provider
      value={{
        allBookings,
        activeBookings,
        todaysBookings,
        futureBookings,
        pastBookings,
        cancelledBookings,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};
