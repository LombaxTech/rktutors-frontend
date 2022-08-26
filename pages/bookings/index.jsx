import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

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

import { formatDate, smallBigString } from "../../helperFunctions";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Bookings() {
  const { user, userLoading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        let q = query(
          collection(db, "bookings"),
          where(
            `${user.type === "tutor" ? "tutor.id" : "student.id"}`,
            "==",
            user.uid
          )
        );

        onSnapshot(q, (bookingsSnapshot) => {
          let bookings = [];
          bookingsSnapshot.forEach((booking) =>
            bookings.push({ id: booking.id, ...booking.data() })
          );
          console.log(bookings);
          setBookings(bookings);
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (user && !userLoading) init();
  }, [user, userLoading]);

  if (user)
    return (
      <div className="bg-gray-200 flex-1 flex p-4">
        {bookings.length === 0 && <NoBookings />}
        {bookings.length > 0 && (
          <div className="flex flex-col gap-4 flex-1 rounded-md shadow-md bg-white p-4">
            <h1 className="text-4xl font-bold text-center">Bookings</h1>
            <hr className="my-2" />
            {bookings.map((booking) => (
              <Booking key={booking.id} booking={booking} user={user} />
            ))}
          </div>
        )}
      </div>
    );
}

const Booking = ({ booking, user }) => {
  const router = useRouter();
  const { student, tutor, subject, note, meetingLink, selectedTime } = booking;

  const isStudent = user.type == "student";
  const isTutor = user.type == "tutor";

  return (
    <div className="shadow-md bg-white w-fit p-4 rounded-md">
      <div className="flex gap-8">
        <div className="flex flex-col justify-around">
          <div className="">Subject: {subject}</div>
          <div className="">Date: {formatDate(selectedTime.toDate())}</div>
          {
            isTutor && <div className="">Student: {student.fullName}</div>

            // todo: add proofile pics
          }

          {isStudent && <div className="">Tutor: {tutor.fullName}</div>}
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col gap-2">
            <button
              className="btn btn-primary"
              onClick={() => router.push(meetingLink)}
            >
              Join Lesson
            </button>
          </div>
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
    </div>
  );
};

const NoBookings = () => (
  <div className="flex-1 flex flex-col items-center gap-6 mt-16">
    <img src="img/void.svg" className="h-72" />
    <h1 className="text-4xl font-bold">No Bookings Available</h1>
  </div>
);
