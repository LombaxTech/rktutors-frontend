import { useEffect, useState, useContext } from "react";
import useAdminRedirect from "../../customHooks/useAdminRedirect";
import { AuthContext } from "../../context/AuthContext";

import { db } from "../../firebase/firebaseClient";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

import {
  Avatar,
  Select,
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

import Link from "next/link";
import { useRouter } from "next/router";
import { smallBigString, formatDate } from "../../helperFunctions";

export default function Bookings() {
  const { redirectLoading } = useAdminRedirect();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        let bookingsSnapshot = await getDocs(collection(db, "bookings"));

        let bookings = [];
        bookingsSnapshot.forEach((b) =>
          bookings.push({ id: b.id, ...b.data() })
        );
        // console.log(users);
        setBookings(bookings);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  if (redirectLoading) return <div className="">Nothing to see...</div>;

  return (
    <div className="flex-1 p-4 bg-gray-200 flex">
      <div className="flex-1 flex flex-col bg-white rounded-md shadow-md p-4">
        <h1 className="text-2xl font-bold">All Bookings</h1>
        {bookings &&
          bookings.map((booking) => (
            <Booking booking={booking} key={booking.id} />
          ))}
      </div>
    </div>
  );
}

const Booking = ({ booking }) => {
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

  return (
    <div
      className={`shadow-md bg-white p-4 rounded-md border-2 ${
        isFreeTrial && "border-pink-500"
      } flex flex-1`}
    >
      <div className="flex-1 flex">
        {/* profile pic n name */}
        <div className="flex  gap-4 w-4/12">
          <div className="flex flex-col gap-2 justify-center items-center w-fit">
            <Link href={`/tutors/${tutor.id}`}>
              <Avatar
                name={tutor.fullName}
                src={tutor.profilePictureUrl}
                className="cursor-pointer"
              />
            </Link>
            <h3 className="font-semibold">Tutor: {tutor.fullName}</h3>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center w-fit">
            <Avatar name={student.fullName} className="cursor-pointer" />
            <h3 className="font-semibold">Student: {student.fullName}</h3>
          </div>
        </div>
        <div className="w-4/12">
          <div className="flex justify-center items-center h-full">
            <h3 className="font-semibold">
              {formatDate(selectedTime.toDate())}
            </h3>
          </div>
        </div>
        <div className="w-4/12">
          <div className="flex items-center h-full">
            <h3 className="font-semibold">{subject}</h3>
          </div>
        </div>
        <div className="w-2/12">
          <div className="flex items-center justify-center h-full">
            {isFreeTrial && (
              <h3 className="font-semibold text-pink-500">Free Trial</h3>
            )}
          </div>
        </div>
      </div>
      <div className={`w-5/12 `}>
        <div className="flex gap-8 items-center justify-center h-full">
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
          </div>
        </div>
      </div>
    </div>
  );
};

function CancelModal({ booking }) {
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

      await updateDoc(doc(db, "bookings", booking.id), {
        status: "cancelled",
        ...(!isFreeTrial && {
          refunded: true,
        }),
      });
      console.log("updated booking status to cancelled");
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
          <ModalCloseButton />
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
