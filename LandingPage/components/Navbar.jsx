import TypeAnimation from "react-type-animation";

import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

import { useRouter } from "next/router";

import Link from "next/link";
const Links = [
  {
    title: "About us",
    href: "#about-us",
  },
  {
    title: "How It Works",
    href: "#how-it-works",
  },
  {
    title: "FAQ",
    href: "#faq",
  },
  {
    title: "Contact Us",
    href: "#contact",
  },
];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const router = useRouter();

  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollLimit, setScrollLimit] = useState(true);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
    if (position < 150) {
      setScrollLimit(true);
    } else {
      setScrollLimit(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      zIndex={100}
      bg={
        scrollLimit
          ? useColorModeValue("rgba(0,0,0, 0.2)", "transparent")
          : useColorModeValue("white", "white")
      }
      color={
        scrollLimit
          ? useColorModeValue("white", "white")
          : useColorModeValue("black", "black")
      }
      // color={{ base: "red.300", lg: "blue.200" }}
      px={12}
      py={3}
      position="fixed"
      top={0}
      width={"100%"}
      boxShadow="lg"
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"lg"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          style={{ backgroundColor: "transparent" }}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <Box>
          <div
            className={`text-3xl font-semibold  ${
              scrollLimit ? "text-white" : "text-teal-300"
            }`}
          >
            <TypeAnimation
              cursor={true}
              sequence={["RKTUTORS", 1000, "RKTUTORS"]}
              wrapper="a"
              href="#"
              className="navbar-brand page-scroll"
            />
          </div>
        </Box>
        <HStack as={"nav"} spacing={8} display={{ base: "none", md: "flex" }}>
          {Links.map((link) => (
            <Link key={link.title} href={link.href}>
              {link.title}
            </Link>
          ))}
          <button
            className="btn btn-outline  text-teal-400 "
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
          <button
            className="btn bg-teal-400 outline-none border-none"
            style={{
              backgroundColor: "#5ca9fb",
              backgroundImage:
                "linear-gradient(to right, #5ca9fb 0%, #38b2ac 100%)",
            }}
            onClick={() => router.push("/login")}
          >
            login
          </button>
        </HStack>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {Links.map((link) => (
              <Link href={link.href} key={link.title}>
                {link.title}
              </Link>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
