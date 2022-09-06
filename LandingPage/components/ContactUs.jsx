import { useState } from "react";
import axios from "axios";
import { Alert, AlertIcon } from "@chakra-ui/react";

import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactUs(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(false);
    setSuccess(false);
    try {
      console.log(name, email, message);
      let res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/sg/lp-contact-us`,
        {
          name,
          email,
          message,
        }
      );
      res = res.data;
      console.log(res);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.log(error);

      setError(true);
      setTimeout(() => setError(false), 4000);
    }
  };
  return (
    <div id="contact" className="">
      <div className="flex gap-16  w-11/12 mx-auto sm:flex-col sm:items-center sm:gap-0">
        <div className="w-8/12 sm:w-11/12">
          <div className="section-title">
            <h2 className="prose text-4xl font-bold ">Get In Touch</h2>
            <p>
              Please fill out the form below to send us an email and we will get
              back to you as soon as possible. Alternatively drop us or a call
              or send us a message on WhatsApp!
            </p>
          </div>
          {success && (
            <Alert status="success">
              <AlertIcon />
              <div className="text-black">Your email has been sent</div>
            </Alert>
          )}
          {error && (
            <Alert status="error">
              <AlertIcon />
              <div className="text-black">An error has occurred</div>
            </Alert>
          )}
          <form
            name="sentMessage"
            validate
            onSubmit={handleSubmit}
            className=""
          >
            <div className="flex gap-4 sm:flex-col">
              <div className="form-group w-1/2 mb-4 sm:w-full sm:mb-0">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="help-block text-danger"></p>
              </div>
              <div className="form-group w-1/2 mb-4 sm:w-full sm:mb-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <p className="help-block text-danger"></p>
            </div>
            <div id="success"></div>
            <button type="submit" className="btn btn-custom btn-lg">
              Send Message
            </button>
          </form>
        </div>

        <div className="w-3/12 contact-info sm:w-11/12">
          <div className="contact-item">
            <h3>Contact Info</h3>
          </div>
          <div className="contact-item">
            <p>
              <span className=" flex items-center justify-start gap-4 ">
                <FaPhone /> Phone
              </span>{" "}
              +44 (0) 7419 206020
            </p>
          </div>
          <div className="contact-item">
            <p>
              <span className=" flex items-center justify-start gap-4 ">
                <FaEnvelope /> Email
              </span>{" "}
              tutors@rktutors.co.uk
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
