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
  setDoc,
  query,
  where,
} from "firebase/firestore";

import {
  Select,
  Avatar,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Spinner,
} from "@chakra-ui/react";

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
            {/* <div className="flex flex-col gap-6 items-center"> */}
            <div className="flex flex-col gap-6 w-full mx-auto">
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
    price,
    refunded,
  } = booking;

  console.log(booking);

  const isStudent = user.type == "student";
  const isTutor = user.type == "tutor";

  return (
    <div
      className={`shadow-md bg-white p-4 rounded-md border-2 ${
        isFreeTrial && "border-pink-500"
      } flex flex-1 sm:flex-col`}
    >
      <div className="flex-1 flex sm:flex-col sm:justify-center sm:items-center">
        {/* profile pic n name */}
        <div className="w-2/12 sm:w-full">
          <div className="flex flex-col gap-2 justify-center items-center w-fit sm:w-full">
            {isStudent && (
              <Link href={`/tutors/${tutor.id}`}>
                <Avatar
                  name={tutor.fullName}
                  src={tutor.profilePictureUrl}
                  className="cursor-pointer"
                />
              </Link>
            )}

            {isTutor && (
              <Avatar name={student.fullName} className="cursor-pointer" />
            )}

            {isStudent && <h3 className="font-semibold">{tutor.fullName}</h3>}

            {isTutor && <h3 className="font-semibold">{student.fullName}</h3>}
          </div>
        </div>
        <div className="w-4/12 sm:w-full">
          <div className="flex justify-center items-center h-full">
            <h3 className="font-semibold">
              {formatDate(selectedTime.toDate())}
            </h3>
          </div>
        </div>
        <div className="w-4/12 sm:w-full">
          <div className="flex items-center h-full sm:justify-center">
            <h3 className="font-semibold">{subject}</h3>
          </div>
        </div>
        <div className="w-2/12 sm:w-full">
          <div className="flex items-center justify-center h-full">
            {isFreeTrial && (
              <h3 className="font-semibold text-pink-500">Free Trial</h3>
            )}
          </div>
        </div>
      </div>
      <div className={`w-5/12 sm:w-full`}>
        <div className="flex gap-8 items-center justify-center h-full sm:flex-col">
          <div className="flex items-center gap-4 sm:flex-col">
            <div className="flex items-center gap-4">
              {status === "cancelled" && (
                <div className="flex gap-2">
                  <Tag size="lg" colorScheme="red" borderRadius="full">
                    Cancelled
                  </Tag>
                  {refunded && (
                    <Tag size="lg" colorScheme="green" borderRadius="full">
                      Refunded
                    </Tag>
                  )}
                </div>
              )}

              {status === "active" && (
                <div className="flex gap-2">
                  <button
                    className={`btn ${
                      isFreeTrial ? "btn-secondary" : "btn-primary"
                    } `}
                    onClick={() => router.push(meetingLink)}
                  >
                    Join Lesson
                  </button>
                  <CancelModal user={user} booking={booking} />
                </div>
              )}
            </div>
            <div className="flex gap-4 items-end">
              <Link
                href={`/chats/${smallBigString(
                  student.id,
                  tutor.id
                )}/?partnerId=${isStudent ? tutor.id : student.id}`}
              >
                <div className="text-center text-blue-500 underline cursor-pointer">
                  Message
                  {isStudent ? " tutor" : " student"}
                </div>
              </Link>
              <MoreInfoModal booking={booking} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function MoreInfoModal({ booking }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { tutor, student, selectedTime, note, price, createdAt, isFreeTrial } =
    booking;

  return (
    <div>
      <div
        onClick={onOpen}
        className="text-blue-500 mt-2 underline cursor-pointer"
      >
        View more info
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="p-8 flex flex-col gap-2">
              <h1 className="font-semibold text-lg">Tutor: {tutor.fullName}</h1>
              <h1 className="font-semibold text-lg">
                Student: {student.fullName}
              </h1>
              {!isFreeTrial && (
                <h1 className="font-semibold text-lg">Price: £{price}</h1>
              )}
              {isFreeTrial && (
                <h1 className="font-semibold text-lg">Type: Free Trial</h1>
              )}
              <h1 className="font-semibold text-lg">
                Requested Time: {formatDate(selectedTime.toDate())}
              </h1>
              <h1 className="font-semibold text-lg">
                Extra Notes: {note ? note : "(No extra notes provided)"}
              </h1>
              {createdAt && (
                <h1 className="font-semibold text-lg">
                  Booking created at: {formatDate(createdAt.toDate())}
                </h1>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

function CancelModal({ booking, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    price,
    refunded,
  } = booking;

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const cancelLesson = async () => {
    setError(false);
    setLoading(true);
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

      // update booking status
      await updateDoc(doc(db, "bookings", booking.id), {
        status: "cancelled",
        ...(!isFreeTrial && {
          refunded: true,
        }),
        cancelledBy: user.uid,
      });
      console.log("updated booking status to cancelled");

      if (!isFreeTrial) {
        // update payment status
        await updateDoc(doc(db, "payments", booking.id), {
          status: "refunded",
        });
      }

      setLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="btn btn-ghost" onClick={onOpen}>
        Cancel
      </button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"lg"}
        isCentered
        closeOnOverlayClick={loading ? false : true}
      >
        <ModalOverlay />
        <ModalContent>
          {!loading && <ModalCloseButton />}
          <ModalBody>
            <div className="p-8 flex flex-col gap-8">
              Are you sure you want to cancel the lesson?
              <button
                className="btn btn-ghost"
                onClick={cancelLesson}
                disabled={loading}
              >
                Cancel Lesson
                {loading && <Spinner className="ml-2" />}
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

const NoBookings = () => (
  <div className="flex-1 flex flex-col items-center gap-6 mt-16">
    <img src="img/void.svg" className="h-72" />
    <h1 className="text-4xl font-bold">No Bookings Available</h1>
  </div>
);
