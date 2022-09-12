import {
  Spinner,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  IconButton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";

import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useRouter } from "next/router";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebaseApp, db } from "../firebase/firebaseClient";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import Link from "next/link";
import axios from "axios";

import { toTitleCase } from "../helperFunctions";

const auth = getAuth(firebaseApp);

export default function TutorSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // console.log({ fullName, email, password });

    try {
      // Create Auth User
      let userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("created user");
      console.log(userCred);

      let accountRes = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/stripe/connected-account`
      );
      accountRes = accountRes.data;
      const connectedAccountId = accountRes.id;

      // create firestore user
      let firestoreUserDetails = {
        type: "tutor",
        fullName: toTitleCase(fullName),
        email,
        createdAt: serverTimestamp(),
        active: false,
        stripeConnectedAccount: {
          id: connectedAccountId,
          setup: false,
          remaining_requirements: [],
        },
        // TODO: Fill in more details
        prevBookedStudents: [],
        ratings: [],
        lessonPrices: {
          GCSE: 10,
          "A-Level": 15,
        },
      };

      await setDoc(doc(db, "users", userCred.user.uid), firestoreUserDetails);

      setSuccessMessage("Succesfully created account");
      console.log("created user");
      setLoading(false);
      router.push("/");
    } catch (error) {
      setLoading(false);
      console.log(error.code);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email has already been used");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Please enter a valid email address");
      } else if (error.code === "auth/internal-error") {
        setErrorMessage("Something went wrong");
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg="gray.50">
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <div className="flex items-center gap-4">
            <IconButton
              vairant="solid"
              bg={"linear-gradient(to right, #5ca9fb 0%, #38b2ac 100%)"}
              color={"white"}
              weight="bold"
              icon={<ArrowBackIcon weight="bold" />}
              onClick={() => router.push("/")}
            />{" "}
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Become a Tutor
            </Heading>
          </div>
        </Stack>
        {errorMessage && (
          <Alert status="error">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert status="success">
            <AlertIcon />
            {successMessage}
          </Alert>
        )}
        <Box rounded={"lg"} bg="white" boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={signup}
                disabled={loading}
              >
                Sign up
                {loading && <Spinner className="ml-2" />}
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already have an account?
                <Link href="/login">
                  <div className="text-teal-500 cursor-pointer">Login</div>
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
