import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

import {
  Input,
  Select,
  Tag,
  TagLabel,
  TagRightIcon,
  Alert,
  AlertIcon,
  Textarea,
} from "@chakra-ui/react";
import { SmallCloseIcon, DeleteIcon } from "@chakra-ui/icons";

import { db } from "../firebase/firebaseClient";
import { updateDoc, doc } from "firebase/firestore";

import useCustomAuth from "../customHooks/useCustomAuth";

export default function ProfileSettings() {
  const { user, userLoading } = useCustomAuth();

  if (user) {
    const isTutor = user.type === "tutor";

    return (
      <div>
        <Sidebar>
          <div className="flex flex-col p-8 bg-white">
            <General user={user} />
            <Password user={user} />
            {isTutor && <TutoringSubjects user={user} />}
            {isTutor && <ProfileInformation user={user} />}
            <div id="availability" className="">
              Availablity
            </div>
          </div>
        </Sidebar>
      </div>
    );
  }
}

const General = ({ user }) => {
  return (
    <div id="general" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">General</h1>
      <div className="flex items-center w-5/12">
        <label className="label">
          <span className="label-text">Name: </span>
        </label>
        <Input placeholder={user.fullName} isReadOnly />
      </div>
      <div className="flex items-center w-5/12">
        <label className="label">
          <span className="label-text">Email: </span>
        </label>
        <Input placeholder={user.email} isReadOnly />
      </div>
      <div className="font-normal">
        Something wrong with these details?{" "}
        <span className="text-blue-300 underline">Contact us</span> for help
      </div>
      <hr className="my-4" />
    </div>
  );
};

const Password = ({ user }) => {
  return (
    <div id="password" className="flex flex-col gap-4 mt-8">
      <h1 className="text-2xl font-semibold">Password</h1>
      <div className="flex items-center w-6/12">
        <label className="label">
          <span className="label-text">Old Password: </span>
        </label>
        <Input type="password" />
      </div>
      <div className="flex items-center w-6/12">
        <label className="label">
          <span className="label-text">New Password: </span>
        </label>
        <Input type="password" />
      </div>
      <button className="btn btn-secondary w-4/12">Change Password</button>
      <hr className="my-4" />
    </div>
  );
};

const TutoringSubjects = ({ user }) => {
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const removeSubjectFromAccount = async (subject) => {
    console.log(subject);
    try {
      let filteredSubjects = user.profile.teachingSubjects.filter(
        (s) => s !== subject
      );
      console.log(filteredSubjects);
      await updateDoc(doc(db, "users", user.uid), {
        ["profile.teachingSubjects"]: filteredSubjects,
      });
      console.log("removed subject from account...");
    } catch (error) {
      console.log(error);
    }
  };

  const saveSubject = async () => {
    if (!subject || !level) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    try {
      const currentlyTeachingSubjects = user.profile.teachingSubjects || [];

      let allSubjects = [...currentlyTeachingSubjects, { subject, level }];
      const uniqueSubjects = [];
      allSubjects.map((x) =>
        uniqueSubjects.filter(
          (a) => a.subject == x.subject && a.level == x.level
        ).length > 0
          ? null
          : uniqueSubjects.push(x)
      );

      // note: if these lengths are equal, then no new subjects are being added
      const oldSubjectBeingAdded =
        currentlyTeachingSubjects.length === uniqueSubjects.length;

      if (!oldSubjectBeingAdded) {
        await updateDoc(doc(db, "users", user.uid), {
          ["profile.teachingSubjects"]: uniqueSubjects,
        });

        console.log("added subject...");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="tutoring-subjects" className="mt-8">
      <h1 className="text-2xl font-semibold mb-2">Subjects You Teach</h1>
      <div className="flex gap-4 flex-wrap my-6">
        {user.profile.teachingSubjects.map((subject, i) => (
          <div key={i}>
            <Tag
              variant="outline"
              // colorScheme="blue"
            >
              <TagLabel>
                {subject.subject} {subject.level}
              </TagLabel>
              <div
                className="cursor-pointer"
                onClick={() => removeSubjectFromAccount(subject)}
              >
                <TagRightIcon as={DeleteIcon} />
              </div>
            </Tag>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-10">
        <h1 className="text-lg font-semibold  ">Add more subjects</h1>
        <div className="flex flex-col gap-4 w-6/12">
          <Select
            placeholder="Select Subject"
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="Mathematics">Math</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="English">English</option>
          </Select>
          <Select
            placeholder="Select Level"
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="GCSE">GCSE</option>
            <option value="A-Level">A-Level</option>
          </Select>
          <button className="btn btn-primary" onClick={saveSubject}>
            Save Subject
          </button>
          {error && (
            <Alert status="error">
              <AlertIcon />
              You must fill in all fields
            </Alert>
          )}
          {success && (
            <Alert status="success">
              <AlertIcon />
              Successfully Saved
            </Alert>
          )}
        </div>
      </div>
      <hr className="my-4" />
    </div>
  );
};

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
