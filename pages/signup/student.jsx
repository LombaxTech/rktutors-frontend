import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

import { useRouter } from "next/router";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, firebaseApp } from "../../firebase/firebaseClient";

import Link from "next/link";

import { toTitleCase } from "../../helperFunctions";

const auth = getAuth(firebaseApp);

export default function StudentSignup() {
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

    // fix up name

    try {
      // Create Auth User
      let userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("created user");
      console.log(userCred);

      // Create Stripe User
      // let stripeCustomer = await axios.post(
      //   `${process.env.NEXT_PUBLIC_SERVER}/stripe/stripe-customer`,
      //   {
      //     name: toTitleCase(fullName),
      //     email,
      //   }
      // );
      // stripeCustomer = stripeCustomer.data;

      // console.log("stripe customer");
      // console.log(stripeCustomer);

      // create firestore user
      let firestoreUserDetails = {
        type: "student",
        fullName: toTitleCase(fullName),
        email,
        // stripeCustomerId: stripeCustomer.id,
        createdAt: serverTimestamp(),
        prevBookedTutors: [],
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
          <Heading fontSize={"4xl"} textAlign={"center"}>
            <div className="flex items-center gap-4">
              <IconButton
                vairant="solid"
                bg={"linear-gradient(to right, #5ca9fb 0%, #38b2ac 100%)"}
                color={"white"}
                weight="bold"
                icon={<ArrowBackIcon weight="bold" />}
                onClick={() => router.push("/signup")}
              />{" "}
              <div>Student Sign Up</div>
            </div>
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            <Link href="/signup/tutor">
              <div className="text-teal-500 font-bold uppercase underline cursor-pointer">
                Tutors sign up here
              </div>
            </Link>
          </Text>
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
                Already have an account?{" "}
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
