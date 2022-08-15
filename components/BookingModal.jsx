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

export default function BookingModal({ tutor }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <button className="btn btn-secondary w-full" onClick={onOpen}>
        Book Lesson
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book a Lesson with {tutor.fullName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col">
            <BookingStepper />
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
