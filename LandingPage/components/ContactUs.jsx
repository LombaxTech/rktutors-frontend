import { useState } from "react";
// import emailjs from "emailjs-com";

import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const initialState = {
  name: "",
  email: "",
  message: "",
};

export default function ContactUs(props) {
  const [{ name, email, message }, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const clearState = () => setState({ ...initialState });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("gotta send email");
    // emailjs
    //   .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.target, "YOUR_USER_ID")
    //   .then(
    //     (result) => {
    //       console.log(result.text);
    //       clearState();
    //     },
    //     (error) => {
    //       console.log(error.text);
    //     }
    //   );
  };
  return (
    <div id="contact" className="">
      <div className="flex gap-16  w-11/12 mx-auto">
        <div className="w-8/12 ">
          <div className="section-title">
            <h2 className="prose text-4xl font-bold ">Get In Touch</h2>
            <p>
              Please fill out the form below to send us an email and we will get
              back to you as soon as possible.
            </p>
          </div>
          <form
            name="sentMessage"
            validate
            onSubmit={handleSubmit}
            className=""
          >
            <div className="flex gap-4">
              <div className="form-group w-1/2 mb-4">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  required
                  onChange={handleChange}
                />
                <p className="help-block text-danger"></p>
              </div>
              <div className="form-group w-1/2 mb-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                />
                <p className="help-block text-danger"></p>
              </div>
            </div>
            <div className="form-group">
              <textarea
                name="message"
                id="message"
                className="form-control"
                rows="4"
                placeholder="Message"
                required
                onChange={handleChange}
              ></textarea>
              <p className="help-block text-danger"></p>
            </div>
            <div id="success"></div>
            <button type="submit" className="btn btn-custom btn-lg">
              Send Message
            </button>
          </form>
        </div>

        <div className="w-3/12 contact-info">
          <div className="contact-item">
            <h3>Contact Info</h3>
            <p>
              <span className=" flex items-center justify-start gap-4 ">
                <FaMapMarkerAlt />
                <div>Address</div>
              </span>
              {props.data ? props.data.address : "loading"}
            </p>
          </div>
          <div className="contact-item">
            <p>
              <span className=" flex items-center justify-start gap-4 ">
                <FaPhone /> Phone
              </span>{" "}
              {props.data ? props.data.phone : "loading"}
            </p>
          </div>
          <div className="contact-item">
            <p>
              <span className=" flex items-center justify-start gap-4 ">
                <FaEnvelope /> Email
              </span>{" "}
              {props.data ? props.data.email : "loading"}
            </p>
          </div>
        </div>
      </div>

      {/* social media stuff */}
      {/* <div className="col-md-12">
        <div className="row">
          <div className="social">
            <ul>
              <li>
                <a href={props.data ? props.data.facebook : "/"}>
                  <i className="fa fa-facebook"></i>
                </a>
              </li>
              <li>
                <a href={props.data ? props.data.twitter : "/"}>
                  <i className="fa fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href={props.data ? props.data.youtube : "/"}>
                  <i className="fa fa-youtube"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  );
}
