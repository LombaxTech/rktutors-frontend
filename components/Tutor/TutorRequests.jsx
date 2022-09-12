import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { BookingRequestsContext } from "../../context/BookingRequestsContext";

import {
  Select,
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
  Avatar,
  Tag,
} from "@chakra-ui/react";

import {
  formatDate,
  smallBigString,
  makeId,
  isToday,
  isPast,
} from "../../helperFunctions";

import { db } from "../../firebase/firebaseClient";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  addDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import Link from "next/link";
import axios from "axios";

const NoBookingRequests = () => (
  <div className="flex-1 flex flex-col items-center gap-6 mt-16">
    <img src="/img/void.svg" className="h-72" />
    <h1 className="text-4xl font-bold">No Requests Yet</h1>
  </div>
);

export default function TutorRequests() {
  const { user, userLoading } = useContext(AuthContext);
  const {
    requests,
    pendingRequests,
    acceptedRequests,
    declinedRequests,
    cancelledRequests,
  } = useContext(BookingRequestsContext);

  const [bookingType, setBookingType] = useState("Pending Requests");

  return (
    <div className="bg-gray-200 flex-1 flex p-2">
      {requests.length === 0 && <NoBookingRequests />}
      {requests.length > 0 && (
        <div className="flex-1 rounded-md p-8 flex flex-col gap-8 bg-white">
          <h1 className="text-4xl font-bold text-center">Booking Requests</h1>
          {/* Filter  */}
          <div className="w-1/3 mx-auto">
            <Select
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
            >
              <option value="Pending Requests">
                Pending Requests ({pendingRequests.length})
              </option>
              <option value="Accepted Requests">
                Accepted Requests ({acceptedRequests.length})
              </option>
              <option value="Declined Requests">
                Declined Requests ({declinedRequests.length})
              </option>
              <option value="Cancelled Requests">
                Cancelled Requests ({cancelledRequests.length})
              </option>
              <option value="All Requests">
                All Requests ({requests.length})
              </option>
            </Select>
          </div>
          {/* Requests */}
          {/* <div className="flex justify-center gap-12 flex-wrap"> */}
          <div className="flex flex-col gap-6 w-full mx-auto">
            {bookingType === "Pending Requests" &&
              pendingRequests.map((bookingRequest) => (
                <BookingRequest
                  key={bookingRequest.id}
                  request={bookingRequest}
                  user={user}
                />
              ))}
            {bookingType === "Accepted Requests" &&
              acceptedRequests.map((bookingRequest) => (
                <BookingRequest
                  key={bookingRequest.id}
                  request={bookingRequest}
                  user={user}
                />
              ))}
            {bookingType === "Declined Requests" &&
              declinedRequests.map((bookingRequest) => (
                <BookingRequest
                  key={bookingRequest.id}
                  request={bookingRequest}
                  user={user}
                />
              ))}
            {bookingType === "Cancelled Requests" &&
              cancelledRequests.map((bookingRequest) => (
                <BookingRequest
                  key={bookingRequest.id}
                  request={bookingRequest}
                  user={user}
                />
              ))}
            {bookingType === "All Requests" &&
              requests.map((bookingRequest) => (
                <BookingRequest
                  key={bookingRequest.id}
                  request={bookingRequest}
                  user={user}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

const BookingRequest = ({ request, user }) => {
  const {
    subject,
    note,
    selectedTime,
    student,
    paymentMethodId,
    status,
    isFreeTrial,
    price,
  } = request;

  return (
    <div
      className={`shadow-md bg-white p-4 rounded-md border-2 ${
        isFreeTrial && "border-pink-500"
      } flex flex-1`}
    >
      <div className="flex-1 flex">
        {/* profile pic n name */}
        <div className="w-2/12">
          <div className="flex flex-col gap-2 justify-center items-center w-fit">
            <Avatar name={student.fullName} />
            <h3 className="font-semibold">{student.fullName}</h3>
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
            {isFreeTrial ? (
              <h3 className="font-semibold text-pink-500">Free Trial</h3>
            ) : (
              <h3 className="font-semibold">Price: £{price}</h3>
            )}
          </div>
        </div>
      </div>
      <div className={` ${status == "pending" ? "w-6/12" : "w-3/12"} `}>
        <div className="flex gap-1 items-center justify-center h-full">
          {status == "pending" && !isPast(selectedTime.toDate()) && (
            <div className="flex  gap-1">
              <AcceptModal request={request} user={user} />
              <DeclineModal request={request} user={user} />
            </div>
          )}
          <div className="flex flex-col items-center">
            {status === "cancelled" && (
              <Tag size="lg" colorScheme="red" borderRadius="full">
                Cancelled
              </Tag>
            )}
            {status === "declined" && (
              <Tag size="lg" colorScheme="red" borderRadius="full">
                Declined by tutor
              </Tag>
            )}
            {status === "accepted" && (
              <Tag size="lg" colorScheme="green" borderRadius="full">
                Accepted
              </Tag>
            )}
            <Link
              href={`/chats/${smallBigString(
                user.uid,
                student.id
              )}/?partnerId=${student.id}`}
            >
              <div className="text-center text-blue-500 underline cursor-pointer">
                Message student
              </div>
            </Link>
            <MoreInfoModal request={request} />
          </div>
        </div>
      </div>
    </div>
  );
};

function MoreInfoModal({ request }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { tutor, student, selectedTime, note, price, createdAt, isFreeTrial } =
    request;

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

function AcceptModal({ request, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    subject,
    note,
    selectedTime,
    student,
    paymentMethodId,
    status,
    tutor,
    isFreeTrial,
    price,
  } = request;

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const acceptBooking = async () => {
    setLoading(true);

    try {
      // if payment succeed, then create booking
      let paymentIntentId;
      if (!isFreeTrial) {
        let res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/stripe/accept-payment`,
          {
            paymentMethodId,
            stripeCustomerId: student.stripeCustomerId,
            connectedAccountId: tutor.connectedAccountId,
            price,
          }
        );
        res = res.data;
        paymentIntentId = res.paymentIntent.id;
        console.log(res);
      }

      const newBooking = {
        tutor: request.tutor,
        student,
        selectedTime,
        subject,
        note,
        meetingLink: `https://meet.jit.si/${makeId(7)}`,
        ...(!isFreeTrial && { paymentIntentId }),
        status: "active",
        isFreeTrial: isFreeTrial ? true : false,
        ...(!isFreeTrial && { price }),
      };

      await setDoc(doc(db, "bookings", request.id), newBooking);

      console.log("created booking");

      // update booking request status
      await updateDoc(doc(db, "bookingRequests", request.id), {
        status: "accepted",
      });

      console.log("accepted booking...");

      // add tutor to student prevbooked tutors
      const hasPrevBooked = tutor.prevBookedStudents.some(
        (student) => student.id === user.uid
      );

      if (!hasPrevBooked) {
        const newPrevBookedStudents = [
          ...tutor.prevBookedStudents,
          { id: student.id, fullName: student.fullName },
        ];

        await updateDoc(doc(db, "users", tutor.id), {
          prevBookedStudents: newPrevBookedStudents,
        });

        const newPrevBookedTutors = [
          ...student.prevBookedTutors,
          { id: tutor.id, fullName: tutor.fullName },
        ];

        await updateDoc(doc(db, "users", student.id), {
          prevBookedTutors: newPrevBookedTutors,
        });
      }

      // create a payment record if payment
      if (!isFreeTrial) {
        const paymentDetails = {
          student: {
            id: student.id,
            fullName: student.fullName,
          },
          tutor: {
            id: tutor.id,
            fullName: tutor.fullName,
          },
          price,
          status: "success",
          paymentDate: serverTimestamp(),
          lesson: subject,
          lessonTime: selectedTime,
        };

        await setDoc(doc(db, "payments", request.id), paymentDetails);
        console.log("payment saved...");
      }

      setLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className={`btn ${isFreeTrial ? "btn-secondary" : "btn-primary"} `}
        onClick={onOpen}
      >
        Accept Lesson
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
              Make sure you are able to attend the lesson on time
              <button
                className="btn btn-primary"
                onClick={acceptBooking}
                disabled={loading}
              >
                Confirm Booking
                {loading && <Spinner className="ml-4" />}
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

function DeclineModal({ request, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { subject, note, selectedTime, student, paymentMethodId, status } =
    request;

  const [cancelReason, setCancelReason] = useState("");

  const declineBooking = async () => {
    try {
      // todo: are you sure modal
      // todo: send a note to student why decline
      // update booking status
      await updateDoc(doc(db, "bookingRequests", request.id), {
        status: "declined",
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="btn btn-ghost" onClick={onOpen}>
        Decline Lesson
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody className="flex flex-col">
            <div className="p-8 flex flex-col gap-8">
              <span>Are you sure you want to decline?</span>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Send a message to the student (optional)"
                size="sm"
              />
              <div className="flex gap-2">
                <button
                  className="btn btn-ghost flex-1"
                  onClick={declineBooking}
                >
                  Decline booking
                </button>
                <button className="btn btn-primary flex-1" onClick={onClose}>
                  close
                </button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
