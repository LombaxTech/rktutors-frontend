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
} from "@chakra-ui/react";

import {
  formatDate,
  smallBigString,
  makeId,
  isToday,
} from "../../helperFunctions";

import { db } from "../../firebase/firebaseClient";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore";

import Link from "next/link";

const NoBookingRequests = () => (
  <div className="flex-1 flex flex-col items-center gap-6 mt-16">
    <img src="/img/void.svg" className="h-72" />
    <h1 className="text-4xl font-bold">No Requests Yet</h1>
  </div>
);

export default function StudentRequests() {
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
          <div className="flex justify-center gap-12 flex-wrap">
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
    tutor,
  } = request;

  return (
    <div className="shadow-md bg-white w-fit p-4 rounded-md border-2">
      <div className="flex gap-8">
        <div className="flex flex-col justify-around">
          <div className="">Subject: {subject}</div>
          <div className="">Date: {formatDate(selectedTime.toDate())}</div>
          <div className="">Tutor: {tutor.fullName}</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          {request.status === "pending" && (
            <CancelModal request={request} user={user} />
          )}
          <Link
            href={`/chats/${smallBigString(user.uid, tutor.id)}/?partnerId=${
              tutor.id
            }`}
          >
            <div className="text-center text-blue-500 underline cursor-pointer mt-2">
              Message Tutor
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

function CancelModal({ request, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { subject, note, selectedTime, student, paymentMethodId, status } =
    request;

  const [success, setSuccess] = useState(false);

  const cancelBooking = async () => {
    try {
      const newBooking = {
        tutor: request.tutor,
        student,
        selectedTime,
        subject,
        note,
        paymentMethodId,
        meetingLink: `https://meet.jit.si/${makeId(7)}`,
      };

      await addDoc(collection(db, "bookings"), newBooking);

      console.log("created booking");

      // update booking status
      await updateDoc(doc(db, "bookingRequests", request.id), {
        status: "cancelled",
      });

      console.log("accepted booking...");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="btn btn-ghost" onClick={onOpen}>
        Cancel Request
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="p-8 flex flex-col gap-8">
              Are you sure you want to cancel your request?
              <button className="btn btn-ghost" onClick={cancelBooking}>
                Cancel Request
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
