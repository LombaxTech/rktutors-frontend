import { useContext } from "react";
import { ChatsContext } from "../../context/ChatsContext";
import { BookingsContext } from "../../context/BookingsContext";
import { BookingRequestsContext } from "../../context/BookingRequestsContext";
import { Box, Avatar, Image, Flex, useColorModeValue } from "@chakra-ui/react";

import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";
import { smallBigString } from "../../helperFunctions";

const quickLinks = [
  { title: "Saved Tutors", href: "/tutors/saved" },
  { title: "Profile Settings ", href: "/profile-settings" },
];

export default function StudentHome() {
  const { user, userLoading } = useContext(AuthContext);

  return (
    <div className="bg-gray-200 flex-1 p-8 flex flex-col">
      <div className="flex gap-8 sm:flex-col sm:gap-8 sm:justify-center sm:items-center">
        <SocialProfileWithImage />
        <BookingsSection />
      </div>
      <div className="flex gap-8 mt-8 sm:flex-col sm:gap-8 sm:justify-center sm:items-center">
        <div className="bg-white shadow-md p-8 min-w-[270px] max-w-[270px] rounded-md">
          <h1 className="text-3xl font-semibold uppercase text-center">
            Quick Links
          </h1>
          <hr></hr>
          <div className="mt-4">
            {quickLinks.map((link, i) => (
              <Link href={link.href} key={i}>
                <div className="flex flex-col gap-2 text-blue-700 w-3/4 mx-auto mt-1 cursor-pointer">
                  {link.title}
                </div>
              </Link>
            ))}
            <Link
              href={`/chats/${smallBigString(
                user.uid,
                "m4PhQsgOqYb5eWwNBXr5xxMnjGz1"
              )}?partnerId=m4PhQsgOqYb5eWwNBXr5xxMnjGz1`}
            >
              <div className="flex flex-col gap-2 text-blue-700 w-3/4 mx-auto mt-1 cursor-pointer">
                Contact Us
              </div>
            </Link>
          </div>
        </div>
        <MessagesSection />
      </div>
    </div>
  );
}

const BookingsSection = ({}) => {
  const { allBookings, todaysBookings, futureBookings } =
    useContext(BookingsContext);

  const { pendingRequests } = useContext(BookingRequestsContext);

  console.log("bookings...");
  console.log(allBookings);

  if (allBookings && todaysBookings && futureBookings && pendingRequests)
    return (
      <div className="bg-white shadow-md p-8 flex gap-4 flex-1 rounded-md sm:flex-col sm:gap-2">
        <div className="img w-6/12 flex justify-center items-center sm:w-full">
          <img src="img/no-data.svg" alt="" className="h-40" />
        </div>
        <div className="content w-6/12 flex flex-col gap-4 sm:w-full sm:justify-center sm:items-center">
          <h1 className="text-3xl font-semibold uppercase sm:text-2xl">
            Bookings
          </h1>
          <hr></hr>
          <h1 className="text-xl font-normal ">
            You have{" "}
            <span className="text-teal-500 font-bold text-xl">
              {" "}
              {todaysBookings.length} Lesson
              {todaysBookings.length == 1 ? "" : "s"}{" "}
            </span>{" "}
            Today
          </h1>
          <h1 className="text-xl font-normal ">
            <span className="text-teal-500 font-bold text-xl">
              {futureBookings.length} Lesson
              {futureBookings.length == 1 ? "" : "s"}{" "}
            </span>{" "}
            Bookings Upcoming
          </h1>
          <h1 className="text-xl font-normal ">
            <span className="text-pink-500 font-bold text-xl">
              {pendingRequests.length} Pending Lesson Request
              {pendingRequests.length == 1 ? "" : "s"}{" "}
            </span>{" "}
          </h1>
          <div className="flex gap-4 w-5/12 mt-4 sm:flex-col sm:w-10/12">
            <Link href={`/bookings`}>
              <button className="btn btn-primary">View All Bookings</button>
            </Link>
            <Link href={`/bookings/requests`}>
              <button className="btn btn-secondary">
                View Lesson Requests
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
};

const MessagesSection = () => {
  const { chats } = useContext(ChatsContext);
  const { user, userLoading } = useContext(AuthContext);

  if (user && chats) {
    const unreadChats = chats.filter((chat) => !chat.read[user.uid]);
    const unreadChatsExist = unreadChats.length > 0;
    const unreadChatsLength = unreadChats.length;

    console.log(unreadChats);

    return (
      <div className="bg-white shadow-md p-8 flex gap-4 flex-1 rounded-md h-full sm:flex-col ">
        <div className="img w-6/12 flex justify-center items-center sm:w-full">
          {unreadChatsExist && (
            <img src="img/mail-arrived.svg" alt="" className="h-52" />
          )}
          {!unreadChatsExist && (
            <img src="img/messages.svg" alt="" className="h-52" />
          )}
        </div>
        <div className="content w-6/12 flex flex-col gap-4 sm:w-full sm:justify-center sm:items-center">
          <h1 className="text-3xl font-semibold uppercase">Messages</h1>
          <hr></hr>
          {!unreadChatsExist && (
            <h1 className="text-xl font-normal ">You're all caught up!</h1>
          )}
          {unreadChatsExist && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <h1 className="text-xl font-normal ">
                You have {unreadChatsLength} unread chat
                {unreadChatsLength === 1 ? "" : "s"}
              </h1>
            </div>
          )}
          <div className="">
            <Link href={`/chats`}>
              <button className="btn btn-secondary ">Inbox</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

function SocialProfileWithImage() {
  const { user } = useContext(AuthContext);

  if (user)
    return (
      <Box
        maxW={"270px"}
        w={"full"}
        bg={"white"}
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
