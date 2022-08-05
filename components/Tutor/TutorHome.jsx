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

const MessagesSection = () => {
  return (
    <div className="bg-white shadow-md p-8 flex gap-4 flex-1 rounded-md h-full">
      <div className="img w-6/12 flex justify-center items-center">
        <img src="img/messages.svg" alt="" className="h-52" />
      </div>
      <div className="content w-6/12 flex flex-col gap-4">
        <h1 className="text-3xl font-semibold uppercase">Messages</h1>
        <hr></hr>
        <h1 className="text-xl font-normal ">No Unread Messages</h1>
        <div className="">
          <button className="btn btn-secondary ">Inbox</button>
        </div>
      </div>
    </div>
  );
};

function SocialProfileWithImage({ user }) {
  if (user)
    return (
      <Box
        maxW={"270px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"xl"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Image
          h={"120px"}
          w={"full"}
          src={
            "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
          }
          objectFit={"cover"}
        />
        <Flex justify={"center"} mt={-12}>
          {user && (
            <Avatar
              size={"xl"}
              src={user.profilePictureUrl ? user.profilePictureUrl : ""}
              alt={"Author"}
              name={user.fullName}
              css={{
                border: "2px solid white",
              }}
            />
          )}
        </Flex>

        <Box
          p={6}
          display={"flex"}
          justifyContent="center"
          flexDirection={"column"}
          gap={4}
        >
          <div className="text-center">
            <span className="text-lg">Welcome back </span> <br />
            <span className="text-2xl font-medium">{user.fullName}</span>
          </div>
          <button className="btn btn-primary">Account Settings</button>
        </Box>
      </Box>
    );
}
