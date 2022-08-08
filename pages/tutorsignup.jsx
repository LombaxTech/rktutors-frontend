import {
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
  Link,
  IconButton,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";

import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useRouter } from "next/router";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebaseApp, db } from "../firebase/firebaseClient";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import axios from "axios";

const auth = getAuth(firebaseApp);

export default function TutorSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const signup = async () => {
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
        fullName,
        email,
        createdAt: serverTimestamp(),

        active: false,
        googleAccount: {
          setup: false,
        },
        stripeConnectedAccount: {
          id: connectedAccountId,
          setup: false,
          remaining_requirements: [],
        },
        // TODO: Fill in more details
      };

      await setDoc(doc(db, "users", userCred.user.uid), firestoreUserDetails);

      setSuccessMessage("Succesfully created account");
      console.log("created user");
      router.push("/");
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
      bg={useColorModeValue("gray.50", "gray.800")}
    >
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
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
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
              >
                Sign up
              </Button>
              <header class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                <p class="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                  <span>Drag and drop your</span>&nbsp;
                  <span>files anywhere or</span>
                </p>
                <input id="hidden-input" type="file" multiple class="hidden" />
                <button
                  id="button"
                  class="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                >
                  Upload a file
                </button>
              </header>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already have an account? <Link color={"blue.400"}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
