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
  { name: "General", icon: FiHome, href: "#general" },
  { name: "Password", icon: FiTrendingUp, href: "#password" },
  { name: "Tutoring Subjects", icon: FiCompass, href: "#tutoring-subjects" },
  {
    name: "Profile Information",
    icon: FiCompass,
    href: "#profile-information",
  },
  { name: "Availability", icon: FiCompass, href: "#availablity" },
  { name: "Payment Settings", icon: FiCompass, href: "#payment-settings" },
  { name: "Lesson Prices", icon: FiCompass, href: "#lesson-price-settings" },
];

const StudentLinks = [
  { name: "General", icon: FiHome, href: "#general" },
  { name: "Password", icon: FiTrendingUp, href: "#password" },
  { name: "Payment Methods", icon: FiCompass, href: "#payment-methods" },
];

export default function SideBar({ children }) {
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
        className="overflow-y-auto scrollbar-thin scrollbar-track-black"
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
        </div>
      </Box>
    );
  }
};

// const NavItem = ({ icon, children, ...rest }) => {
//   return (
//     <Link
//       href="#"
//       style={{ textDecoration: "none" }}
//       _focus={{ boxShadow: "none" }}
//     >
//       <Flex
//         align="center"
//         p="4"
//         mx="4"
//         borderRadius="lg"
//         role="group"
//         cursor="pointer"
//         _hover={{
//           bg: "cyan.400",
//           color: "white",
//         }}
//         {...rest}
//       >
//         {icon && (
//           <Icon
//             mr="4"
//             fontSize="16"
//             _groupHover={{
//               color: "white",
//             }}
//             as={icon}
//           />
//         )}
//         {children}
//       </Flex>
//     </Link>
//   );
// };

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
