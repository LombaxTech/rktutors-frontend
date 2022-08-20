import { useState, useEffect, useRef, useContext } from "react";

import {
  Textarea,
  TagLabel,
  TagRightIcon,
  Tag,
  Select,
  Alert,
  AlertIcon,
  Input,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { SmallCloseIcon, DeleteIcon } from "@chakra-ui/icons";

import { AuthContext } from "../context/AuthContext";

import { updateDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";

import { FaFileImage } from "react-icons/fa";
import Dropzone from "react-dropzone";
import AvatarEditor from "react-avatar-editor";

export default function ProfileSetup() {
  const router = useRouter();
  const { user, userLoading } = useContext(AuthContext);

  const [aboutMe, setAboutMe] = useState("");
  const [aboutMyLessons, setAboutMyLessons] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);

  const addSubjectAndLevel = async () => {
    const subjectExist = subjects.some(
      (s) => s.subject === subject && s.level === level
    );

    if (!subjectExist) {
      setSubjects([...subjects, { subject, level }]);
    }
  };

  const removeSubject = (subject) => {
    let filteredSubjects = subjects.filter((s) => s !== subject);
    setSubjects(filteredSubjects);
  };

  const finish = async () => {
    setError(false);
    setSuccess(false);
    try {
      //   todo: get unique subjects (since this should be first time tutor is doing this, shouldnt actually need to make unique)
      const currentlyTeachingSubjects = user.profile.teachingSubjects || [];
      let allSubjects = [...currentlyTeachingSubjects, ...subjects];
      const uniqueSubjects = [];
      allSubjects.map((x) =>
        uniqueSubjects.filter(
          (a) => a.subject == x.subject && a.level == x.level
        ).length > 0
          ? null
          : uniqueSubjects.push(x)
      );

      if (uniqueSubjects.length === 0 || !aboutMe || !aboutMyLessons)
        return setError(true);

      // note: uniqueSubjects now contains unique subjects new and those already saved in the users account
      const stripeAndGoogleActive =
        user.googleAccount.setup && user.stripeConnectedAccount.setup;

      // todo: upload profile pic
      const imageRef = ref(
        storage,
        `profilePicture/${user.uid}/${selectedFile.name}`
      );
      if (croppedBlob) {
        await uploadBytes(imageRef, croppedBlob);
        console.log("Uploaded a blob or file!");
      } else {
        await uploadBytes(imageRef, selectedFile);
        console.log("Uploaded a blob or file!");
      }

      const profilePictureUrl = await getDownloadURL(
        ref(storage, `profilePicture/${user.uid}/${selectedFile.name}`)
      );

      const updateDetails = {
        ...(stripeAndGoogleActive && { active: true }),
        profile: {
          setup: true,
          teachingSubjects: uniqueSubjects,
          aboutMe,
          aboutMyLessons,
        },
        ...(profilePictureUrl && { profilePictureUrl }),
        // [`profile.setup`]: false,
        // [`profile.secret.age`]: 19,
      };

      await updateDoc(doc(db, "users", user.uid), updateDetails);
      console.log("updated user...");
      setSuccess(true);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.type === "tutor")
    return (
      <div className="bg-gray-200 flex-1 p-8 flex">
        <div className="bg-white rounded-md shadow-md p-8 flex-1 flex flex-col">
          <div className="flex gap-4 justify-between">
            {/* Title and fields */}
            <div className="w-6/12 flex flex-col gap-6">
              <h1 className="text-4xl font-bold">Profile Setup</h1>
              <hr className="" />
              {/* Add Subjects */}
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold ml-4">
                  Choose Subjects to Teach
                </h1>
                {/* llllll */}
                <div className="flex gap-4">
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
                  <button
                    className="btn btn-primary"
                    onClick={addSubjectAndLevel}
                  >
                    Add
                  </button>
                </div>
                <div className="flex gap-4 flex-wrap my-6">
                  {subjects.map((subject, i) => (
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
                          onClick={() => removeSubject(subject)}
                        >
                          <TagRightIcon as={DeleteIcon} />
                        </div>
                      </Tag>
                    </div>
                  ))}
                </div>

                {/* llllll */}
              </div>
              {/* About Me */}
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold ml-4">About Me</h1>
                <Textarea
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  placeholder="Write a bit about yourself"
                  size="sm"
                />
              </div>
              {/* About My Lessons */}
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold ml-4">About My Lessons</h1>
                <Textarea
                  value={aboutMyLessons}
                  onChange={(e) => setAboutMyLessons(e.target.value)}
                  placeholder="Write a bit about your lessons"
                  size="sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold ml-4">
                  Upload Profile Picture
                </h1>
                <ImageUpload
                  onOpen={onOpen}
                  isOpen={isOpen}
                  onClose={onClose}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  croppedBlob={croppedBlob}
                  setCroppedBlob={setCroppedBlob}
                />
              </div>
              <div className="">
                <button className="btn btn-primary" onClick={finish}>
                  Save and Finish
                </button>
              </div>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  You must fill in all fields
                </Alert>
              )}
              {success && (
                <Alert status="success">
                  <AlertIcon />
                  Profile updated! You will be redirected shortly
                </Alert>
              )}
            </div>

            {/* Image */}
            <div className="w-5/12">
              <img src="img/profile.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    );
}

const ImageUpload = ({
  onOpen,
  isOpen,
  onClose,
  croppedBlob,
  setCroppedBlob,
  selectedFile,
  setSelectedFile,
}) => {
  const [croppedPreview, setCroppedPreview] = useState(null);
  const EditorRef = useRef(null);
  const [scale, setScale] = useState(1);

  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles[0]);
    setSelectedFile(acceptedFiles[0]);
    onOpen();
  };

  const finishCropping = () => {
    if (EditorRef.current) {
      EditorRef.current.getImage().toBlob((blob) => {
        setCroppedBlob(blob);

        const url = URL.createObjectURL(blob);
        setCroppedPreview(url);
      });
    }
    onClose();
  };

  // const updateProfilePicture = async () => {
  //   try {
  //     const imageRef = ref(
  //       storage,
  //       `profilePicture/${user.uid}/${selectedFile.name}`
  //     );
  //     if (croppedBlob) {
  //       await uploadBytes(imageRef, croppedBlob);
  //       console.log("Uploaded a blob or file!");
  //     } else {
  //       await uploadBytes(imageRef, selectedFile);
  //       console.log("Uploaded a blob or file!");
  //     }

  //     const profilePictureUrl = await getDownloadURL(
  //       ref(storage, `profilePicture/${user.uid}/${selectedFile.name}`)
  //     );
  //     await updateDoc(doc(db, "users", user.uid), { profilePictureUrl });
  //     console.log("updated profile pic!");
  //     console.log("here is the image url!");
  //     console.log(profilePictureUrl);

  //     setSelectedFile(null);
  //     setCroppedBlob(null);
  //     setCroppedPreview(null);
  //     setScale(1);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="flex flex-col gap-4">
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />

              <header className="border-dashed border-2 border-gray-400 p-4 flex flex-col justify-center items-center cursor-pointer my-4">
                <FaFileImage className="text-4xl" />
                <p className="font-semibold text-gray-900 text-center">
                  Drop an image or click to upload a new image
                </p>
              </header>
            </div>
          </section>
        )}
      </Dropzone>
      {selectedFile && (
        <div className="flex flex-col gap-3 ml-4">
          <h1 className="text-2xl font-semibold">Preview: </h1>
          <Avatar
            src={
              croppedPreview
                ? croppedPreview
                : URL.createObjectURL(selectedFile)
            }
            size="xl"
          />
          <div className="flex gap-3">
            <button
              className="btn btn-outline w-6/12"
              onClick={() => {
                onOpen();
              }}
            >
              Crop Image
            </button>
          </div>
        </div>
      )}
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Crop Image</ModalHeader>
            <ModalCloseButton />
            <ModalBody className="flex flex-col">
              <div className="flex-1 flex flex-col gap-4">
                <AvatarEditor
                  ref={EditorRef}
                  className="mx-auto"
                  image={selectedFile}
                  width={180}
                  height={180}
                  border={50}
                  borderRadius={999}
                  color={[0, 0, 0, 0.3]} // RGBA
                  scale={scale}
                  rotate={0}
                />
                <p className="font-semibold">Drag to reposition</p>
                <Slider
                  aria-label="slider-ex-1"
                  onChange={(v) => console.log(setScale(v))}
                  value={scale}
                  min={0.5}
                  max={2}
                  step={0.1}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <button className="btn btn-primary" onClick={finishCropping}>
                  Finish
                </button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
