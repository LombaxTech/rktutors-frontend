import { useState, useEffect } from "react";

import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  IconButton,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";

import { useRouter } from "next/router";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebaseApp } from "../firebase/firebaseClient";

const auth = getAuth(firebaseApp);

export default function ResetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sendResetEmail = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      console.log(email);
      await sendPasswordResetEmail(auth, email);
      console.log("sent email");
      setSuccessMessage("Email Sent");
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      flexDirection="column"
      bg="gray.50"
    >
      <div className="flex items-center gap-8">
        <IconButton
          vairant="solid"
          bg={"linear-gradient(to right, #5ca9fb 0%, #38b2ac 100%)"}
          color={"white"}
          weight="bold"
          icon={<ArrowBackIcon weight="bold" />}
          onClick={() => router.push("/login")}
        />
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Forgot your password?
        </Heading>
      </div>

      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg="white"
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Text fontSize={{ base: "sm", sm: "md" }} color="gray.800">
          You&apos;ll get an email with a reset link
        </Text>
        <FormControl id="email">
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            // bg={"blue.400"}
            bg={"linear-gradient(to right, #5ca9fb 0%, #38b2ac 100%)"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            onClick={sendResetEmail}
          >
            Request Reset
          </Button>
          {successMessage && (
            <Alert status="success">
              <AlertIcon />
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert status="error">
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
}
