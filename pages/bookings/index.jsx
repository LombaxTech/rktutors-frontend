import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { BookingsContext } from "../../context/BookingsContext";

import useRedirectAuth from "../../customHooks/useRedirectAuth";

import { db } from "../../firebase/firebaseClient";
import {
  onSnapshot,
  collection,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";

import { Select } from "@chakra-ui/react";

import { formatDate, smallBigString } from "../../helperFunctions";
import Link from "next/link";
import { useRouter } from "next/router";

import axios from "axios";

export default function Bookings() {
  useRedirectAuth();

  const { user, userLoading } = useContext(AuthContext);
  const {
    allBookings,
    activeBookings,
    futureBookings,
    pastBookings,
    cancelledBookings,
  } = useContext(BookingsContext);

  const [bookingType, setBookingType] = useState("Active Bookings");

  if (user)
    return (
      <div className="bg-gray-200 flex-1 flex p-4">
        {allBookings.length === 0 && <NoBookings />}
        {allBookings.length > 0 && (
          <div className="flex flex-col gap-4 flex-1 rounded-md shadow-md bg-white p-4">
            <h1 className="text-4xl font-bold text-center">Bookings</h1>
            {/* Filter  */}
            <div className="w-1/3 mx-auto">
              <Select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
              >
                <option value="Active Bookings">
                  Active Bookings ({activeBookings.length})
                </option>
                <option value="Cancelled Bookings">
                  Cancelled Bookings ({cancelledBookings.length})
                </option>
                <option value="Future Bookings">
                  Future Bookings ({futureBookings.length})
                </option>
                <option value="All Bookings">
                  All Bookings ({allBookings.length})
                </option>
              </Select>
            </div>
            <hr className="my-2" />
            <div className="flex flex-col gap-6 items-center">
              {bookingType === "Active Bookings" &&
                activeBookings.map((booking) => (
                  <Booking key={booking.id} booking={booking} user={user} />
                ))}
              {bookingType === "Cancelled Bookings" &&
                cancelledBookings.map((booking) => (
                  <Booking key={booking.id} booking={booking} user={user} />
                ))}
              {bookingType === "Future Bookings" &&
                futureBookings.map((booking) => (
                  <Booking key={booking.id} booking={booking} user={user} />
                ))}
              {bookingType === "All Bookings" &&
                allBookings.map((booking) => (
                  <Booking key={booking.id} booking={booking} user={user} />
                ))}
            </div>
          </div>
        )}
      </div>
    );
}

const Booking = ({ booking, user }) => {
  const router = useRouter();
  const {
    student,
    tutor,
    subject,
    note,
    meetingLink,
    selectedTime,
    paymentIntentId,
    status,
    isFreeTrial,
  } = booking;

  console.log(booking);

  const isStudent = user.type == "student";
  const isTutor = user.type == "tutor";

  const cancelLesson = async () => {
    try {
      console.log("pi id");
      console.log(paymentIntentId);

      if (!isFreeTrial) {
        let res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/stripe/refund`,
          {
            payment_intent: paymentIntentId,
          }
        );

        res = res.data;
        console.log(res);
      }

      await updateDoc(doc(db, "bookings", booking.id), { status: "cancelled" });
      console.log("updated booking status to cancelled");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`shadow-md bg-white w-fit p-4 rounded-md flex gap-8 border-2
    ${isFreeTrial && " border-pink-500"}`}
    >
      <div className="flex flex-col justify-around">
        <div className="">Subject: {subject}</div>
        <div className="">Date: {formatDate(selectedTime.toDate())}</div>
        {
          isTutor && <div className="">Student: {student.fullName}</div>

          // todo: add proofile pics
        }

        {isStudent && <div className="">Tutor: {tutor.fullName}</div>}
        {isFreeTrial && (
          <span className="font-bold text-lg text-pink-500">
            TRIAL LESSON REQUEST
          </span>
        )}
      </div>
      <div className="flex flex-col justify-center items-center">
        {status === "active" && (
          <div className="flex flex-col gap-2">
            <button
              className={`btn ${
                isFreeTrial ? "btn-secondary" : "btn-primary"
              } `}
              onClick={() => router.push(meetingLink)}
            >
              Join Lesson
            </button>
            <button className="btn btn-ghost" onClick={cancelLesson}>
              Cancel
            </button>
          </div>
        )}
        <Link
          href={`/chats/${smallBigString(tutor.id, student.id)}/?partnerId=${
            isStudent ? tutor.id : student.id
          }`}
        >
          <div className="text-center text-blue-500 underline cursor-pointer">
            Message
            {isStudent ? " tutor" : " student"}
          </div>
        </Link>
      </div>
    </div>
  );
};

const NoBookings = () => (
  <div className="flex-1 flex flex-col items-center gap-6 mt-16">
    <img src="img/void.svg" className="h-72" />
    <h1 className="text-4xl font-bold">No Bookings Available</h1>
  </div>
);
