import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";

import { Avatar, MenuDivider, Tooltip } from "@chakra-ui/react";

import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  getDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseClient";

import Link from "next/link";
import useCustomAuth from "../../customHooks/useCustomAuth";
import { useRouter } from "next/router";

export default function Chat() {
  const router = useRouter();

  const { user, userLoading } = useCustomAuth();
  const [chatId, setChatId] = useState("");
  const [partner, setPartner] = useState(null);
  const [chattedBefore, setChattedBefore] = useState(false);
  const [messages, setMessages] = useState([]);

  const { register, handleSubmit, reset, setFocus } = useForm();

  const lastMessageRef = useRef(null);
  useEffect(() => lastMessageRef.current?.scrollIntoView(), [messages]);

  useEffect(() => {
    async function init() {
      try {
        const { chatId, partnerId } = router.query;
        setChatId(chatId);
        console.log({ chatId, partnerId });

        // todo: Get chat partner
        let partnerDoc = await getDoc(doc(db, "users", partnerId));
        setPartner({ id: partnerDoc.id, ...partnerDoc.data() });

        // todo: get chat messages
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("sentAt"));

        onSnapshot(q, (messagesSnapshot) => {
          if (messagesSnapshot.docs.length == 0) {
            setChattedBefore(false);
          } else {
            setChattedBefore(true);
          }

          let messages = [];

          messagesSnapshot.forEach((messageDoc) => {
            messages.push({ id: messageDoc.id, ...messageDoc.data() });
          });

          setMessages(messages);
        });

        // todo: set read to true
        await updateDoc(doc(db, "chats", chatId), {
          [`read.${user.uid}`]: true,
        });

        console.log("done...");
      } catch (error) {
        console.log(error);
      }
    }

    if (router.isReady && user && !userLoading) init();
  }, [router.isReady, user, userLoading]);

  const sendMessage = async (data) => {
    const { message } = data;
    console.log(message);
    console.log(partner.id);
    console.log(user.uid);
    try {
      // note: Create a chat if doesnt exit
      if (!chattedBefore) {
        const newChat = {
          users: [
            {
              id: user.uid,
              fullName: user.fullName,
              ...(user.profilePictureUrl && {
                profilePictureUrl: user.profilePictureUrl,
              }),
            },
            {
              id: partner.id,
              fullName: partner.fullName,
              ...(partner.profilePictureUrl && {
                profilePictureUrl: partner.profilePictureUrl,
              }),
            },
          ],
          userIds: [user.uid, partner.id],
          read: {
            [user.uid]: true,
            [partner.id]: true,
          },
        };

        await setDoc(doc(db, "chats", chatId), newChat);
        console.log("created new chat");
      }

      // note: add message
      const m = {
        text: message,
        sentAt: serverTimestamp(),
        senderId: user.uid,
      };

      await addDoc(collection(db, "chats", chatId, "messages"), m);
      console.log("added message");

      // note: update chats last message and read status
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: m,
        [`read.${partner.id}`]: false,
      });
      console.log("updated last message and read status");

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const MyMessage = ({ msg }) => (
    <li className="flex justify-start">
      {/* <Tooltip label={msg.sentAt.toString()}> */}
      <Tooltip label={"aa"}>
        <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
          <span className="block">{msg.text}</span>
        </div>
      </Tooltip>
    </li>
  );
  const YourMessage = ({ msg }) => (
    <li className="flex justify-end">
      <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
        <span className="block">{msg.text}</span>
      </div>
    </li>
  );

  const UserProfile = () => {
    return (
      <div className="bg-white p-10 rounded-md shadow-md min-w-[200px] flex flex-col gap-4 items-center ">
        {partner && partner.type === "tutor" && (
          <>
            <Link href={`/tutors/${partner.id}`}>
              <Avatar
                className={"cursor-pointer"}
                src={partner.profilePictureUrl}
                size={"xl"}
                name={partner.fullName}
              />
            </Link>
            <div className="text-xl font-semibold">{partner.fullName}</div>
            <button className="btn btn-secondary">Book Lesson</button>
          </>
        )}
        {partner && partner.type === "student" && (
          <>
            <Avatar
              className={""}
              src={partner.profilePictureUrl}
              size={"xl"}
              name={partner.fullName}
            />
            <div className="text-xl font-semibold">{partner.fullName}</div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex gap-4 max-h-full overflow-hidden p-4 bg-gray-200">
      <UserProfile />
      {/* message and input */}
      <div className="flex-1 flex flex-col bg-white rounded-md shadow-md">
        <div className="overflow-y-auto flex-1 p-4 scrollbar-thin  scrollbar-thumb-gray-300 flex flex-col">
          {/* Havent chatted before */}
          {messages.length === 0 && <NeverChatBefore />}

          {/* Messages */}
          {messages && user && partner && (
            <ul className="space-y-2">
              {messages.map((msg) => {
                if (msg.senderId == user.uid) return <MyMessage msg={msg} />;
                if (msg.senderId == partner.id)
                  return <YourMessage msg={msg} />;
              })}
              <div ref={lastMessageRef}></div>
            </ul>
          )}
        </div>
        <div className="w-full ">
          {/* <MessageInput /> */}
          <form
            className="flex items-center justify-between w-full p-3 border-t border-gray-300"
            onSubmit={handleSubmit(sendMessage)}
          >
            <input
              type="text"
              placeholder="enter message"
              className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
              {...register("message")}
            />

            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const NeverChatBefore = () => (
  <div className="flex-1 flex flex-col items-center justify-center">
    <div className="flex gap-14">
      <img className="h-60" src="/img/speech-bubble.svg" alt="" />
      <div className="flex items-center">
        <h1 className="text-4xl font-semibold">Send a Message!</h1>
      </div>
    </div>
  </div>
);
