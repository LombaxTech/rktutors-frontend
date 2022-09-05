import { useState, useEffect } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import BookingStepper from "./BookingStepper";

export default function BookingModal({ tutor, hasPrevBooked }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <button className="btn btn-secondary w-full" onClick={onOpen}>
        {hasPrevBooked ? "Book Lesson" : "Book Free trial lesson"}
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
        <ModalOverlay />
        <ModalContent className="overflow-hidden max-h-screen">
          <ModalHeader>Book a Lesson with {tutor.fullName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col overflow-hidden">
            <BookingStepper tutor={tutor} hasPrevBooked={hasPrevBooked} />
          </ModalBody>

          {/* <ModalFooter>
            <button
              className="btn btn-secondary"
              colorScheme="blue"
              mr={3}
              onClick={onClose}
            >
              Close
            </button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </div>
  );
}
