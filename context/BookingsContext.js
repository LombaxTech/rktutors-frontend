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

  const [bookings, setBookings] = useState([]);
  const [todaysBookings, setTodaysBookings] = useState([]);
  const [futureBookings, setFutureBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        const isTutor = user.type === "tutor";

        let bookingsRef = collection(db, "bookings");
        let bookingsQuery = query(
          bookingsRef,
          where(isTutor ? "tutor.id" : "student.id", "==", user.uid),
          orderBy("selectedTime", "desc")
        );

        onSnapshot(bookingsQuery, (bookingsSnapshot) => {
          let bookings = [];

          bookingsSnapshot.forEach((b) =>
            bookings.push({ id: b.id, ...b.data() })
          );

          setBookings(bookings);

          // get todays bookings
          let todaysBookings = bookings.filter((b) =>
            isToday(b.selectedTime.toDate())
          );
          console.log("todays bookings...");
          console.log(todaysBookings);
          setTodaysBookings(todaysBookings);

          // get future bookings
          let futureBookings = bookings.filter(
            (b) => b.selectedTime.toDate() > new Date()
          );
          console.log("future bookings...");
          console.log(futureBookings);
          setFutureBookings(futureBookings);
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (user && !userLoading) init();
  }, [user, userLoading]);

  return (
    <BookingsContext.Provider
      value={{ bookings, todaysBookings, futureBookings }}
    >
      {children}
    </BookingsContext.Provider>
  );
};
