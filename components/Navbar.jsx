import TypeAnimation from "react-type-animation";

import { useContext } from "react";
import { ChatsContext } from "../context/ChatsContext";
import { BookingRequestsContext } from "../context/BookingRequestsContext";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

import { AuthContext } from "../context/AuthContext";

import Link from "next/link";
import { useRouter } from "next/router";

import { signOut, getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase/firebaseClient";

const auth = getAuth(firebaseApp);

const StudentLinks = [
  { title: "Home", href: "/" },
  { title: "Tutors", href: "/tutors" },
  { title: "Bookings", href: "/bookings" },
  { title: "Messages", href: "/chats" },
];

const TutorLinks = [
  { title: "Home", href: "/" },
  { title: "Bookings", href: "/bookings" },
  { title: "Requests", href: "/bookings/requests" },
  { title: "Messages", href: "/chats" },
];

const AdminLinks = [
  { title: "Users", href: "/admin/users" },
  { title: "Messages", href: "/chats" },
  { title: "Bookings", href: "/admin/bookings" },
];

const Links = ["Dashboard", "Projects", "Team"];

export default function Navbar() {
  const router = useRouter();
  const { user, userLoading } = useContext(AuthContext);
  const { chats } = useContext(ChatsContext);
  const { pendingRequests } = useContext(BookingRequestsContext);

  const signout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (user) {
    let chatsUnread;
    if (chats) {
      chats.forEach((chat) => {
        if (!chat.read[user.uid]) chatsUnread = true;
      });
    }

    const isTutor = user.type === "tutor";
    const isActive = user.active;

    return (
      <Box
        bg={"gray.900"}
        zIndex={100}
        color={"white"}
        // color={{ base: "red.300", lg: "blue.200" }}
        px={12}
        py={3}
        boxShadow="lg"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Link href="/">
                <div
                  className={`text-3xl font-semibold text-teal-300 cursor-pointer"`}
                >
                  <TypeAnimation
                    cursor={true}
                    sequence={["RKTUTORS", 1000, "RKTUTORS"]}
                    wrapper="a"
                    href="#"
                    className="navbar-brand page-scroll cursor-pointer"
                  />
                </div>
              </Link>
            </Box>
          </HStack>
          <Flex alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={14}
              display={{ base: "none", md: "flex" }}
            >
              {user.type === "student" &&
                StudentLinks.map((link) => (
                  <Link key={link} href={link.href}>
                    <a className="uppercase font-medium tracking-wide flex items-center gap-1">
                      <div className="">{link.title}</div>
                      {link.title === "Messages" && chatsUnread && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </a>
                  </Link>
                ))}

              {isTutor &&
                isActive &&
                TutorLinks.map((link) => (
                  <Link key={link} href={link.href}>
                    <a className="uppercase font-medium tracking-wide flex items-center gap-1">
                      <div className="">{link.title}</div>
                      {link.title === "Messages" && chatsUnread && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      {link.title === "Requests" &&
                        pendingRequests.length > 0 && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                    </a>
                  </Link>
                ))}

              {user.type === "admin" &&
                AdminLinks.map((link) => (
                  <Link key={link} href={link.href}>
                    <a className="uppercase font-medium tracking-wide flex items-center gap-1">
                      <div className="">{link.title}</div>
                      {link.title === "Messages" && chatsUnread && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </a>
                  </Link>
                ))}

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"md"}
                    src={user.profilePictureUrl ? user.profilePictureUrl : ""}
                    name={user.fullName}
                  />
                </MenuButton>

                <MenuList color={"gray.800"}>
                  {isTutor && isActive && (
                    <Link href={"/profile-settings"}>
                      <MenuItem>Settings</MenuItem>
                    </Link>
                  )}
                  {user.type === "student" && (
                    <>
                      <Link href={"/profile-settings"}>
                        <MenuItem>Settings</MenuItem>
                      </Link>
                      <Link href={"/tutors/saved"}>
                        <MenuItem>Saved Tutors</MenuItem>
                      </Link>
                      <Link href={"/payments"}>
                        <MenuItem>Payments</MenuItem>
                      </Link>
                    </>
                  )}
                  <Link href={"/howto"}>
                    <MenuItem>Tutorial</MenuItem>
                  </Link>
                  <MenuItem onClick={signout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            style={{ backgroundColor: "transparent" }}
          />
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {user.type === "student" &&
                StudentLinks.map((link) => (
                  <Link key={link} href={link.href}>
                    {link.title}
                  </Link>
                ))}

              {user.type === "tutor" &&
                TutorLinks.map((link) => (
                  <Link key={link} href={link.href}>
                    {link.title}
                  </Link>
                ))}

              {user.type === "admin" &&
                AdminLinks.map((link) => (
                  <Link key={link} href={link.href}>
                    {link.title}
                  </Link>
                ))}

              <div onClick={signout}>Log out</div>
            </Stack>
          </Box>
        ) : null}
      </Box>
    );
  }
}
