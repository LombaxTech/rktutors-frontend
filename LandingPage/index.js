import React from "react";

import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";

import data from "./data/data.json";

export default function index() {
  return (
    <div>
      <Header />
      <AboutUs />
      <HowItWorks data={data.HowItWorks} />
      <FAQ />
      <ContactUs />
      <Footer />
    </div>
  );
}
