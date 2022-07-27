const Section = ({ number, title, info }) => (
  <div
    className="collapse border-b-gray-200 pb-4 test-work"
    style={{ borderBottomWidth: "1px" }}
  >
    <input type="checkbox" className="peer" />
    <div className="collapse-title flex items-center gap-6 text-xl uppercase prose">
      <div
        className="w-4 h-4 p-4 rounded-full  text-white flex justify-center items-center"
        style={{
          background: "linear-gradient(to right, #5ca9fb 0%, #38b2ac 100%)",
        }}
      >
        {number}
      </div>

      {title}
    </div>
    <div className="collapse-content prose tracking-wider ml-4 font-light">
      <p>{info}</p>
    </div>
  </div>
);

export default function FAQ() {
  return (
    <div id="faq" className="faq-section min-h-screen py-20">
      <div className="section-title">
        <h2 className="text-center text-4xl font-bold uppercase sm:text-2xl">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="flex ">
        <div style={{ padding: "16px" }} className="w-1/2 sm:hidden">
          <img
            src="img/faq.svg"
            style={{ boxShadow: "none" }}
            className="img-responsive"
            alt=""
          />{" "}
        </div>

        <div className="w-1/2 flex items-center sm:w-full sm:flex sm:justify-center ">
          <div className="bg-white w-3/4 shadow-lg ">
            <Section
              number={1}
              title={"How Do You Find The Perfect Tutor?"}
              info={
                "Booking a free meeting with a tutor is a fast and effective way of asking any questions you may have. This can help you decide whether or not they’d be a good match for you child."
              }
            />

            <Section
              number={2}
              title={" How Can My Child Benefit From Online Tutoring?"}
              info={
                "  Online tutoring allows your child to receive undivided attention in any subject of their choice. This is particularly helpful for subjects in which they may be struggling in. Our   one on one tutoring allows for your child to work at their own  pace with complete attention from our tutors which allows for  optimal academic improvement.  "
              }
            />

            <Section
              number={3}
              title={"How does it Work?"}
              info={
                "Search through our selection of tutors. Send a message to anytutors that you’re interested in. Book a lesson. It’s assimple as that!"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
