import { useEffect } from "react";

import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Badge,
  useColorModeValue,
  Tag,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import Link from "next/link";
import { smallBigString } from "../../helperFunctions";

import { db } from "../../firebase/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";
import useCustomAuth from "../../customHooks/useCustomAuth";

export default function Saved() {
  const { user, userLoading } = useCustomAuth();

  if (user && !userLoading) {
    const savedTutors = user.savedTutors || [];

    return (
      <div className="bg-gray-200 flex-1 p-4 flex flex-col ">
        <div className="bg-white rounded-md shadow-md flex-1 p-4">
          <h1 className="text-5xl font-bold text-center">Saved Tutors</h1>
          <hr className="my-12" />

          <div className="flex gap-8 flex-wrap justify-center">
            {savedTutors &&
              savedTutors.map((tutor, i) => (
                <TutorProfile tutor={tutor} user={user} key={i} />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

function TutorProfile({ tutor, user }) {
  const tutorSaved = user.savedTutors?.some((t) => t.id === tutor.id);

  const saveTutor = async () => {
    try {
      const currentSavedTutors = user.savedTutors || [];
      const newSavedTutors = [...currentSavedTutors, tutor];

      await updateDoc(doc(db, "users", user.uid), {
        savedTutors: newSavedTutors,
      });

      console.log("added tutors to saved");
      // todo: create success alert
    } catch (error) {
      console.log(error);
    }
  };

  const removeTutor = async () => {
    try {
      const currentSavedTutors = user.savedTutors || [];
      const newSavedTutors = currentSavedTutors.filter(
        (t) => t.id !== tutor.id
      );
      console.log(newSavedTutors);

      await updateDoc(doc(db, "users", user.uid), {
        savedTutors: newSavedTutors,
      });

      console.log("removed tutors from saved list");
      // todo: create success alert
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      maxW={"320px"}
      w={"full"}
      bg="white"
      boxShadow={"xl"}
      rounded={"md"}
      p={6}
      textAlign={"center"}
      display={"flex"}
      flexDirection="column"
    >
      <div className="flex-1">
        <Avatar
          size={"xl"}
          src={tutor.profilePictureUrl}
          alt={"Avatar Alt"}
          mb={4}
        />
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {tutor.fullName}
        </Heading>

        {!tutorSaved && (
          <div
            className="text-blue-500 underline cursor-pointer"
            onClick={saveTutor}
          >
            Add to saved tutors
          </div>
        )}
        {tutorSaved && (
          <div
            className="text-blue-500 underline cursor-pointer"
            onClick={removeTutor}
          >
            Remove from saved tutors
          </div>
        )}

        <Stack align={"center"} justify={"center"} direction={"row"} my={4}>
          {tutor.profile.teachingSubjects &&
            tutor.profile.teachingSubjects.map((subject, i) => (
              <Tag
                size={"md"}
                variant="solid"
                colorScheme="blue"
                key={i}
                className="p-2"
              >
                {`${subject.subject} ${subject.level}`}
              </Tag>
            ))}
        </Stack>
        <Text textAlign={"center"} bg={"white"} px={3}>
          {tutor.profile.aboutMe}
        </Text>
      </div>

      <Stack mt={8} direction={"row"} spacing={4}>
        {user && (
          <Link
            href={`/chats/${smallBigString(user.uid, tutor.id)}/?partnerId=${
              tutor.id
            }`}
          >
            <Button
              flex={1}
              fontSize={"sm"}
              rounded={"md"}
              _focus={{
                bg: "gray.200",
              }}
            >
              Message
            </Button>
          </Link>
        )}

        <Link href={`/tutors/${tutor.id}`}>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"md"}
            bg={"blue.400"}
            color={"white"}
            // boxShadow={
            //   "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
            // }
            _hover={{
              bg: "blue.500",
            }}
            _focus={{
              bg: "blue.500",
            }}
          >
            Visit Profile
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}
