import { useState, useEffect } from "react";

import {
  Input,
  Select,
  Tag,
  TagLabel,
  TagRightIcon,
  Alert,
  AlertIcon,
  Textarea,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { SmallCloseIcon, DeleteIcon } from "@chakra-ui/icons";

import { db } from "../../firebase/firebaseClient";
import { updateDoc, doc } from "firebase/firestore";

import useCustomAuth from "../../customHooks/useCustomAuth";

const ProfileInformation = ({ user }) => {
  const [aboutMe, setAboutMe] = useState(user.profile.aboutMe);
  const [aboutMyLessons, setAboutMyLessons] = useState(
    user.profile.aboutMyLessons
  );

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const updateProfileInformation = async () => {
    setSuccess(false);
    setError(false);

    try {
      const isAboutMeSame = aboutMe === user.profile.aboutMe;
      const isAboutMyLessonsSame =
        aboutMyLessons === user.profile.aboutMyLessons;

      if (!isAboutMeSame || !isAboutMyLessonsSame) {
        await updateDoc(doc(db, "users", user.uid), {
          ["profile.aboutMe"]: aboutMe,
          ["profile.aboutMyLessons"]: aboutMyLessons,
        });

        console.log("updated profile info");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div id="profile-information" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Profile Information</h1>
      <div className="flex flex-col gap-8 w-8/12">
        {/* About Me */}
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">About Me</h1>
          <Textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Write a bit about yourself"
            size="sm"
          />
        </div>
        {/* About My Lessons */}
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">About My Lessons</h1>
          <Textarea
            value={aboutMyLessons}
            onChange={(e) => setAboutMyLessons(e.target.value)}
            placeholder="Write a bit about your lessons"
            size="sm"
          />
        </div>
        <div className="">
          <button
            className="btn btn-primary"
            onClick={updateProfileInformation}
          >
            Update Profile Information
          </button>
        </div>
        {error && (
          <Alert status="error">
            <AlertIcon />
            An error has occurred
          </Alert>
        )}
        {success && (
          <Alert status="success">
            <AlertIcon />
            Profile information updated
          </Alert>
        )}
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default ProfileInformation;
