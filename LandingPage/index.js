import React from "react";

import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";

export default function index() {
  return (
    <div>
      <Header />
      <AboutUs />
      <HowItWorks />
      <FAQ />
      <ContactUs />
      <Footer />
    </div>
  );
}
