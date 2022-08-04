import TypeAnimation from "react-type-animation";

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

import useCustomAuth from "../customHooks/useCustomAuth";

import Link from "next/link";
import { useRouter } from "next/router";

import { signOut, getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase/firebaseClient";

const auth = getAuth(firebaseApp);

const StudentLinks = [
  { title: "Tutors", href: "tutors" },
  { title: "Bookings", href: "bookings" },
  { title: "Messages", href: "chats" },
];

const TutorLinks = [
  { title: "Bookings", href: "bookings" },
  { title: "Requests", href: "booking-requests" },
  { title: "Messages", href: "chats" },
];

const Links = ["Dashboard", "Projects", "Team"];

export default function Navbar() {
  const router = useRouter();
  const { user, userLoading } = useCustomAuth();
  const signout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (user)
    return (
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        zIndex={100}
        // color={{ base: "red.300", lg: "blue.200" }}
        px={12}
        py={3}
        boxShadow="lg"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
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
                    <a className="upperccase font-medium tracking-wide">
                      {link.title}
                    </a>
                  </Link>
                ))}

              {user.type === "tutor" &&
                TutorLinks.map((link) => (
                  <Link key={link} href={link.href}>
                    <a className="upperccase font-medium tracking-wide">
                      {link.title}
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
                    size={"sm"}
                    src={user.profilePictureUrl ? user.profilePictureUrl : ""}
                  />
                </MenuButton>

                <MenuList>
                  {user.type === "tutor" && (
                    <Link href={"profile"}>
                      <MenuItem>My Profile</MenuItem>
                    </Link>
                  )}
                  <Link href={"settings"}>
                    <MenuItem>Settings</MenuItem>
                  </Link>
                  <MenuItem onClick={signout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
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
            </Stack>
          </Box>
        ) : null}
      </Box>
    );
}
