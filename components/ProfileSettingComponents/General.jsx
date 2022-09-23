import { useState, useEffect, useRef } from "react";

import {
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

import { FaFileImage } from "react-icons/fa";
import Dropzone from "react-dropzone";
import AvatarEditor from "react-avatar-editor";

import { db, storage } from "../../firebase/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Link from "next/link";
import { smallBigString } from "../../helperFunctions";

const General = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <Link
          href={`/chats/${smallBigString(
            user.uid,
            process.env.NEXT_PUBLIC_RKTUTOR_TEAM_FIRESTORE_ID
          )}?partnerId=${process.env.NEXT_PUBLIC_RKTUTOR_TEAM_FIRESTORE_ID}`}
        >
          <span className=" text-blue-700 underline cursor-pointer">
            Contact Us
          </span>
        </Link>
        {/* <span className="text-blue-300 underline">Contact us</span> for help */}
      </div>
      <div className="flex flex-col gap-3 w-5/12">
        <div className="flex items-center gap-3">
          <label className="label">
            <span className="label-text">Profile Image: </span>
          </label>
          <Avatar
            src={user.profilePictureUrl}
            name={user.fullName}
            size={"xl"}
          />
        </div>
        <ImageUpload
          onOpen={onOpen}
          isOpen={isOpen}
          onClose={onClose}
          user={user}
        />
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default General;

const ImageUpload = ({ onOpen, isOpen, onClose, user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
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

  const updateProfilePicture = async () => {
    try {
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
      await updateDoc(doc(db, "users", user.uid), { profilePictureUrl });
      console.log("updated profile pic!");
      console.log("here is the image url!");
      console.log(profilePictureUrl);

      setSelectedFile(null);
      setCroppedBlob(null);
      setCroppedPreview(null);
      setScale(1);
    } catch (error) {
      console.log(error);
    }
  };

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
        <div className="flex flex-col gap-3 w-10/12">
          <h1 className="text-2xl font-semibold">New Avatar Preview: </h1>
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

            <button
              className="btn btn-primary w-6/12"
              onClick={updateProfilePicture}
            >
              update profile picture
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

// function ImageEditModal({ isOpen, onOpen, onClose }) {
//   return (

//   );
// }
