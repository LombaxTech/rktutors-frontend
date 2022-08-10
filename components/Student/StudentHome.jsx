import React from "react";
import { Box, Avatar, Image, Flex, useColorModeValue } from "@chakra-ui/react";

import Link from "next/link";

import useCustomAuth from "../../customHooks/useCustomAuth";

export default function StudentHome() {
  return (
    <div className="bg-gray-200 flex-1 p-8">
      <div className="flex gap-8">
        <SocialProfileWithImage />
        <div className="bg-white shadow-md p-8 flex gap-4 flex-1 rounded-md">
          <div className="img w-6/12 flex justify-center items-center">
            <img src="img/no-data.svg" alt="" className="h-40" />
          </div>
          <div className="content w-6/12 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold uppercase">Bookings</h1>
            <hr></hr>
            <h1 className="text-xl font-normal ">0 Bookings Today</h1>
            <h1 className="text-xl font-normal ">5 Bookings Upcoming</h1>
            <div className="flex flex-col gap-4 w-5/12 mt-4">
              <button className="btn btn-primary">View All Bookings</button>
              <button className="btn btn-primary">Booking Settings</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-8 mt-8">
        <div className="bg-white shadow-md p-8 min-w-[270px] max-w-[270px] rounded-md">
          <h1 className="text-3xl font-semibold uppercase text-center">
            Quick Links
          </h1>
          <hr></hr>
        </div>
        <MessagesSection />
      </div>
    </div>
  );
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

function SocialProfileWithImage() {
  const { user } = useCustomAuth();

  if (user)
    return (
      <Box
        maxW={"270px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"md"}
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
          <Link href={"/tutors"}>
            <button className="btn btn-success text-white font-bold">
              Find a Tutor
            </button>
          </Link>
        </Box>
      </Box>
    );
}
