import { FaComments, FaGraduationCap, FaHandsHelping } from "react-icons/fa";

const data = [
  {
    icon: <FaComments />,
    title: "Quality Tutors From £15/hr",
    text: "At RKTutors, we work hard to find the best tutors that meet your needs at prices you can afford. Our team of tutors are from top universities across the UK and are experts in their fields. So you can be rest assured you are in good hands!.",
  },
  {
    icon: <FaGraduationCap />,
    title: "Studying Made Simple",
    text: "We know that studying can be a challenge. Our team of expert tutors can help with that. They’re experts at breaking down complex subjects into easier concepts that students can understand and use to ace their exams. ",
  },
  {
    icon: <FaHandsHelping />,
    title: "We’re Here To Help",
    text: "Our team are always available to help with whatever issues you may have – whether it be help looking for a tutor or general advice about your child’s studies. Feel free to contact us at any time for any queries.",
  },
];

const Section = ({ icon, title, text }) => (
  <div className="flex flex-col justify-center items-center  gap-8">
    <div className="text-teal-500 text-4xl p-8 rounded-full border border-teal-500 ">
      {icon}
    </div>
    <h3 className="font-semibold text-2xl">{title}</h3>
    <p className="leading-7 text-center">{text}</p>
  </div>
);

export default function AboutUs() {
  return (
    <div
      id="about-us"
      className="flex flex-col items-center pt-16 w-full min-h-screen "
      style={{ backgroundColor: "#F6F6F6" }}
    >
      <h2 className="lp-section-header">ABOUT US</h2>
      <div className="mt-10 flex gap-16 w-10/12  mx-auto sm:flex-col pb-8">
        {data.map((section, i) => (
          <Section
            key={i}
            icon={section.icon}
            title={section.title}
            text={section.text}
          />
        ))}
      </div>
      {/* <div className="row">
        {data
          ? data.map((d, i) => (
              <div key={i} className="">
                <i className={d.icon}></i>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </div>
            ))
          : "Loading..."}
      </div> */}
    </div>
  );
}
