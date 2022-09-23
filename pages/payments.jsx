import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import useRedirectAuth from "../customHooks/useRedirectAuth";

import { db } from "../firebase/firebaseClient";
import {
  onSnapshot,
  collection,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  Tooltip,
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

import { formatMsgDate, smallBigString } from "../helperFunctions";
import Link from "next/link";
import { useRouter } from "next/router";

import axios from "axios";

export default function Payments() {
  useRedirectAuth();

  const { user, userLoading } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        let paymentsQuery = query(
          collection(db, "payments"),
          where("student.id", "==", user.uid)
        );

        onSnapshot(paymentsQuery, (paymentsSnapshot) => {
          let payments = [];
          paymentsSnapshot.forEach((p) =>
            payments.push({ id: p.id, ...p.data() })
          );
          setPayments(payments);
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (user) init();
  }, [user]);

  if (user)
    return (
      <div className="bg-gray-200 flex-1 flex p-4">
        {payments.length === 0 && <NoPayments />}
        {payments.length > 0 && (
          <div className="flex flex-col gap-4 flex-1 rounded-md shadow-md bg-white p-4">
            <h1 className="text-4xl font-bold text-center">Payments</h1>
            <hr className="my-2" />
            <div className="flex flex-col gap-6 items-center">
              {payments.map((payment) => (
                <Payment key={payment.id} payment={payment} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
}

const Payment = ({ payment, user }) => {
  const router = useRouter();
  const {
    student,
    tutor,
    price,
    paymentDate,
    status,
    lesson,
    lessonDate,
    paymentMethodId,
  } = payment;

  let paymentMethod = user.paymentMethods.find(
    (pm) => pm.id === paymentMethodId
  );
  let card = paymentMethod?.card;
  //   console.log(paymentCard);

  return (
    <div className={`shadow-md bg-white p-4 rounded-md border-2  w-full flex`}>
      <div className="w-2/12">
        <Tooltip label={`Payment date`}>
          {formatMsgDate(paymentDate.toDate())}
        </Tooltip>
      </div>
      <div className="w-2/12">£{price}</div>
      <div className="w-2/12">{lesson}</div>
      <div className="w-2/12">
        Tutor:
        <Link href={`/tutors/${tutor.id}`}>
          <span className="text-blue-500 cursor-pointer underline ml-2">
            {tutor.fullName}
          </span>
        </Link>
      </div>
      <div className="w-1/12">
        <Tag colorScheme={"green"}>{status}</Tag>
      </div>
      {card && (
        <div className="w-3/12">
          Card ending in
          <span className="font-medium"> {card.last4}</span>
        </div>
      )}
    </div>
  );
};

// function MoreInfoModal({ payment }) {
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const { tutor, student, selectedTime, note, price, createdAt, isFreeTrial } =
//     booking;

//   return (
//     <div>
//       <div
//         onClick={onOpen}
//         className="text-blue-500 mt-2 underline cursor-pointer"
//       >
//         View more info
//       </div>

//       <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalCloseButton />
//           <ModalBody>
//             <div className="p-8 flex flex-col gap-2">
//               <h1 className="font-semibold text-lg">Tutor: {tutor.fullName}</h1>
//               <h1 className="font-semibold text-lg">
//                 Student: {student.fullName}
//               </h1>
//               {!isFreeTrial && (
//                 <h1 className="font-semibold text-lg">Price: £{price}</h1>
//               )}
//               {isFreeTrial && (
//                 <h1 className="font-semibold text-lg">Type: Free Trial</h1>
//               )}
//               <h1 className="font-semibold text-lg">
//                 Requested Time: {formatDate(selectedTime.toDate())}
//               </h1>
//               <h1 className="font-semibold text-lg">
//                 Extra Notes: {note ? note : "(No extra notes provided)"}
//               </h1>
//               {createdAt && (
//                 <h1 className="font-semibold text-lg">
//                   Booking created at: {formatDate(createdAt.toDate())}
//                 </h1>
//               )}
//             </div>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

const NoPayments = () => (
  <div className="flex-1 flex flex-col items-center gap-6 mt-16">
    <img src="img/void.svg" className="h-72" />
    <h1 className="text-4xl font-bold">No payments to Show </h1>
  </div>
);
