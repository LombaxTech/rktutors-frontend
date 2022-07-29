import React from "react";

export default function HeroSection() {
  return (
    <div
      className="w-2/3 text-center mx-auto mt-64 flex flex-col items-center justify-center
           text-white text-6xl font-semibold
        backdrop-blur-xl p-8 rounded-3xl
         bg-opacity-50
         border-white border-2
        "
      style={{ backgroundColor: "#202428" }}
    >
      <div
        className="text-6xl font-semibold 
             sm:text-2xl
             "
      >
        GRADE-BOOSTING ONLINE <br /> TUTORING FOR YOUR <br /> CHILD
      </div>

      <div className="font-light text-lg my-8">
        We provide qualified and experienced tutors to elevate your child’s{" "}
        <br />
        educational performance.
      </div>
      <button
        className="btn bg-teal-400 outline-none border-none"
        style={{
          backgroundColor: "#5ca9fb",
          backgroundImage:
            "linear-gradient(to right, #5ca9fb 0%, #38b2ac 100%)",
        }}
      >
        Start today
      </button>
    </div>
  );
}
