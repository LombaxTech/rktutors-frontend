import { useState } from "react";

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

import useCustomAuth from "../../customHooks/useCustomAuth";

import SetupAccount from "./SetupAccount";
import TutorDashboard from "./TutorDashoard";

export default function TutorHome() {
  const { user, userLoading } = useCustomAuth();

  if (user && !user.active) {
    return <SetupAccount />;
  }
  if (user && user.active) return <TutorDashboard />;
}
