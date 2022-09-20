import { React, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import Link from "next/link";
import { smallBigString } from "../helperFunctions";

import HowToSideBar from "../components/HowToSidebar";

export default function HowTo() {
  const { user, userLoading } = useContext(AuthContext);

  const isStudent = user.type === "student";
  const isTutor = user.type === "tutor";

  return (
    <div>
      <HowToSideBar>
        <div className="flex flex-col p-8 bg-white">
          {isStudent && <HowToBookALesson />}
          {isTutor && <TutorSettings />}
          <JoinLesson />
          {isTutor && <OnlineWhiteboard />}
          {isStudent && <Refunds />}
          <CancelBooking />
          {isStudent && <AddPaymentMethods />}
          <ContactUs />
        </div>
      </HowToSideBar>
    </div>
  );
}

const HowToBookALesson = () => {
  return (
    <div id="how-to-book-a-lesson" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">How to book a lesson</h1>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <img
            src={"/img/howTo/howToBook/p1.PNG"}
            alt=""
            className="rounded-md shadow-md brightness-75"
          />
          <h1 className="">
            Select TUTORS from the navbar. Pick a tutor and click Visit Profile.
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <img
            src={"/img/howTo/howToBook/p2.PNG"}
            alt=""
            className="rounded-md shadow-md brightness-75"
          />
          <h1 className="">
            Click the book button to start the booking process.
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <img
            src={"/img/howTo/howToBook/p3.PNG"}
            alt=""
            className="rounded-md shadow-md brightness-75"
          />
          <h1 className="">Select an available time slot</h1>
        </div>
        <div className="flex flex-col gap-4">
          <img
            src={"/img/howTo/howToBook/p4.PNG"}
            alt=""
            className="rounded-md shadow-md brightness-75"
          />
          <h1 className="">
            Select your desired subject and optionally add any notes for the
            tutor (Ex. any specific topics you want to go over)
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <img
            src={"/img/howTo/howToBook/p5.PNG"}
            alt=""
            className="rounded-md shadow-md brightness-75"
          />
          <h1 className="">
            Choose a payment method or add a payment method if you have none
            saved. (This step can be skipped if the lesson is a free trial)
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <img
            src={"/img/howTo/howToBook/p6.PNG"}
            alt=""
            className="rounded-md shadow-md brightness-75"
          />
          <h1 className="">
            Make sure all details are correct and click confirm to submit the
            booking request.
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <img
            src={"/img/howTo/howToBook/p7.PNG"}
            alt=""
            className="rounded-md shadow-md brightness-75"
          />
          <h1 className="">
            Click on VIEW BOOKING REQUESTS to view your current pending
            requests.
          </h1>
        </div>
      </div>
      <hr className="my-8" />
    </div>
  );
};

const JoinLesson = () => (
  <div id="join-lesson" className="flex flex-col gap-4">
    <h1 className="text-2xl font-semibold">How to join a lesson</h1>

    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/joinLesson/p1.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">
          From BOOKINGS, find your lesson and click JOIN LESSON. This will take
          you to a Jitsi Meet page.
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/joinLesson/p2.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">Click allow to allow mic and camera access.</h1>
      </div>
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/joinLesson/p3.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">
          Make sure your mic and camera is turned on and click Join meeting.
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/joinLesson/p4.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">Toggle any other settings using the bottom bar.</h1>
      </div>
    </div>
    <hr className="my-8" />
  </div>
);

const OnlineWhiteboard = () => (
  <div id="online-whiteboard" className="flex flex-col gap-4">
    <h1 className="text-2xl font-semibold">How to share a whiteboard</h1>
    <h2>
      We recommend using{" "}
      <Link href="https://webwhiteboard.com/home/">
        <span className="underline cursor-pointer">Web whiteboard</span>
      </Link>{" "}
      as an online collaborative whiteboard to teach your students.
    </h2>
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/whiteboard/p1.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">Click on Start a whiteboard.</h1>
      </div>
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/whiteboard/p2.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">Click on share.</h1>
      </div>
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/whiteboard/p3.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">Copy the link.</h1>
      </div>
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/whiteboard/p4.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">
          Share the link with your student by clicking on the chat icon to open
          chat. Alternatively send the link using RKTutors chat.
        </h1>
      </div>
    </div>
    <hr className="my-8" />
  </div>
);

const AddPaymentMethods = () => (
  <div id="add-payment-methods" className="flex flex-col gap-4">
    <h1 className="text-2xl font-semibold">How to add payment methods</h1>
    <h2>
      Payment methods can either be added from the settings page or during
      booking a lesson.
    </h2>
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/addPaymentMethods/p1.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">
          Click on your profile avatar to display the dropdown menu. Select
          settings
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/addPaymentMethods/p2.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">
          Click on ADD PAYMENT METHODS from the side nav. Fill in payment method
          details and then click ADD CARD.
        </h1>
      </div>
    </div>
    <hr className="my-8" />
  </div>
);

const TutorSettings = () => (
  <div id="tutor-settings" className="flex flex-col gap-4">
    <h1 className="text-2xl font-semibold">Your settings page</h1>
    <h2>
      You can change a wide range of settings from here including your tutoring
      subjects, lesson prices, availability, payment settings and more.
    </h2>
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/tutorSettings/p1.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">
          Click on your profile avatar to display the dropdown menu. Select
          settings. From the side navbar, you can access a wide range of
          settings.
        </h1>
      </div>
    </div>
    <hr className="my-8" />
  </div>
);

const ContactUs = () => {
  const { user, userLoading } = useContext(AuthContext);

  if (user)
    return (
      <div id="contact-us" className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">How to contact us</h1>
        <h2>
          For any issues you have that are not discussed here,{" "}
          <Link
            href={`/chats/${smallBigString(
              user.uid,
              "m4PhQsgOqYb5eWwNBXr5xxMnjGz1"
            )}?partnerId=m4PhQsgOqYb5eWwNBXr5xxMnjGz1`}
          >
            <span className="cursor-pointer underline">
              send us a message here.
            </span>
          </Link>
        </h2>
        <h2>
          Alternatively, send us an email at{" "}
          <span className="text-blue-500">tutors@rktutors.co.uk</span> or drop
          us a call at <span className="text-blue-500">+44 7419 206020</span>.
          (We are also available to help through WhatsApp)
        </h2>
        <hr className="my-8" />
      </div>
    );
};
const CancelBooking = () => (
  <div id="how-to-cancel-a-lesson" className="flex flex-col gap-4">
    <h1 className="text-2xl font-semibold">How to cancel a lesson</h1>
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <img
          src={"/img/howTo/cancelBooking/p1.PNG"}
          alt=""
          className="rounded-md shadow-md brightness-75"
        />
        <h1 className="">
          Select BOOKINGS from the navbar. Click cancel on a booking you want to
          cancel.
        </h1>
      </div>
    </div>
    <hr className="my-8" />
  </div>
);

const ChangePrices = () => (
  <div id="how-to-change-prices" className="flex flex-col gap-4">
    <h1 className="text-2xl font-semibold">How to change your prices</h1>
    <hr className="my-8" />
  </div>
);

const Refunds = () => (
  <div id="refunds" className="flex flex-col gap-4">
    <h1 className="text-2xl font-semibold">Refunds</h1>
    <h2>
      When you{" "}
      <a href="#how-to-cancel-a-lesson" className="underline">
        cancel a class
      </a>
      , you are automatically refunded.
    </h2>
    <h2>
      For refunds on classes that have already taken place, please{" "}
      <a href="#contact-us" className="underline">
        contact us
      </a>
    </h2>
    <hr className="my-8" />
  </div>
);
