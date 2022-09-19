import React from "react";

import HowToSideBar from "../components/HowToSidebar";

export default function HowTo() {
  return (
    <div>
      <HowToSideBar>
        <div className="flex flex-col p-8 bg-white">
          <HowToBookALesson />
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
    </div>
  );
};
