import React, { ReactNode, useContext } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";

import Link from "next/link";
import { AuthContext } from "../context/AuthContext";

const TutorLinks = [
  {
    name: "Settings",
    icon: FiHome,
    href: "#tutor-settings",
  },
  {
    name: "Join A Lesson",
    icon: FiHome,
    href: "#join-lesson",
  },
  {
    name: "Share A Whiteboard",
    icon: FiHome,
    href: "#online-whiteboard",
  },

  {
    name: "Cancel A Lesson",
    icon: FiHome,
    href: "#how-to-cancel-a-lesson",
  },
];

const StudentLinks = [
  { name: "Book A Lesson", icon: FiHome, href: "#how-to-book-a-lesson" },
  {
    name: "Join A Lesson",
    icon: FiHome,
    href: "#join-lesson",
  },
  {
    name: "Refunds",
    icon: FiHome,
    href: "#refunds",
  },
  {
    name: "Cancel A Lesson",
    icon: FiHome,
    href: "#how-to-cancel-a-lesson",
  },
  {
    name: "Add payment methods",
    icon: FiHome,
    href: "#add-payment-methods",
  },
];

export default function HowToSideBar({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={"gray.100"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  const { user, userLoading } = useContext(AuthContext);

  if (user) {
    const isTutor = user.type === "tutor";
    const isStudent = user.type === "student";

    return (
      <Box
        bg={"white"}
        borderRight="1px"
        borderRightColor={"gray.200"}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          {/* <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text> */}
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        <div className="flex flex-col items-center gap-6">
          {isTutor &&
            TutorLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                <div className="cursor-pointer uppercase font-semibold hover:underline">
                  {link.name}
                </div>
              </Link>
            ))}
          {isStudent &&
            StudentLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                <div className="cursor-pointer uppercase font-semibold hover:underline">
                  {link.name}
                </div>
              </Link>
            ))}
          <Link href={`#contact-us`}>
            <div className="cursor-pointer uppercase font-semibold hover:underline">
              Contact us
            </div>
          </Link>
        </div>
      </Box>
    );
  }
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={"white"}
      borderBottomWidth="1px"
      borderBottomColor={"gray.200"}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
    </Flex>
  );
};
