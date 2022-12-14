import { useState, useContext } from "react";

import {
  Alert,
  AlertIcon,
  Spinner,
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

import axios from "axios";
import { useRouter } from "next/router";

import { AuthContext } from "../../context/AuthContext";

import SetupAccount from "./SetupAccount";
import TutorDashboard from "./TutorDashoard";

export default function TutorHome() {
  const { user, userLoading } = useContext(AuthContext);

  const { stripeConnectedAccount, profile } = user;

  const accountSetup = stripeConnectedAccount.setup && profile.setup;

  if (user && !accountSetup) {
    return <SetupAccount />;
  }
  if (user && accountSetup) return <TutorDashboard />;
}
