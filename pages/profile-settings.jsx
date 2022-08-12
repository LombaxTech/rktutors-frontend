import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

import {
  Input,
  Select,
  Tag,
  TagLabel,
  TagRightIcon,
  Alert,
  AlertIcon,
  Textarea,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { SmallCloseIcon, DeleteIcon } from "@chakra-ui/icons";

import { db } from "../firebase/firebaseClient";
import { updateDoc, doc } from "firebase/firestore";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import useCustomAuth from "../customHooks/useCustomAuth";
import axios from "axios";

import General from "../components/ProfileSettingComponents/General";
import Password from "../components/ProfileSettingComponents/Password";
import TutoringSubjects from "../components/ProfileSettingComponents/TutoringSubjects";
import ProfileInformation from "../components/ProfileSettingComponents/ProfileInformation";
import Availablity from "../components/ProfileSettingComponents/Availability";

export default function ProfileSettings() {
  const { user, userLoading } = useCustomAuth();

  if (user) {
    const isTutor = user.type === "tutor";

    return (
      <div>
        <Sidebar>
          <div className="flex flex-col p-8 bg-white">
            <General user={user} />
            <Password user={user} />
            {isTutor && <TutoringSubjects user={user} />}
            {isTutor && <ProfileInformation user={user} />}
            {isTutor && <Availablity user={user} />}
            {isTutor && <PaymentSettings user={user} />}
          </div>
        </Sidebar>
      </div>
    );
  }
}

const PaymentSettings = ({ user }) => {
  const goToStripeDashboard = async () => {
    try {
      let loginLinkRes = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/stripe/login-link/${user.stripeConnectedAccount.id}`
      );
      loginLinkRes = loginLinkRes.data;
      const { url } = loginLinkRes;
      window.open(url, "_blank").focus();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="payment-settings" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Payment Settings</h1>
      <h1 className="">
        View your payments and settings through your Stripe dashboard
      </h1>
      <Tooltip label="Stripe is a world famouse online payment processing and commerce solutions for internet businesses of all sizes.">
        <div className="text-blue-500 font-normal cursor-pointer underline">
          What is Stripe?
        </div>
      </Tooltip>
      <button
        className="btn btn-secondary w-3/12"
        onClick={goToStripeDashboard}
      >
        Payment Dashboard
      </button>
    </div>
  );
};
