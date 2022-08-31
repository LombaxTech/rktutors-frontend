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
      <h1 className="">
        Find a tutor as shown in the picture and visit their profile
      </h1>

      <img
        src={"/img/howTo/howToBookATutorP1.PNG"}
        alt=""
        className="rounded-md shadow-md"
      />
      <h1 className="">Click Book Lesson</h1>

      <img
        src={"/img/howTo/htbatp2.PNG"}
        alt=""
        className="rounded-md shadow-md"
      />
    </div>
  );
};
