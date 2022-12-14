import { useForm } from "react-hook-form";
import { useState, useEffect, useRef, useContext } from "react";

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
import { AuthContext } from "../../context/AuthContext";

import { useRouter } from "next/router";
import {
  formatMsgDate,
  diffHours,
  makeId,
  getLastNChars,
} from "../../helperFunctions";
import axios from "axios";

export default function Chat() {
  const router = useRouter();

  const { user, userLoading } = useContext(AuthContext);
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
    // console.log(message);
    // console.log(partner.id);
    // console.log(user.uid);

    if (!message) return;

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

      // if first message send email

      if (!chattedBefore) {
        let emailRes = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/sg/message-received`,
          {
            toEmail: partner.email,
            userName: user.fullName,
          }
        );

        emailRes = emailRes.data;
        console.log(emailRes);
        console.log("sent email...");
      }

      // todo:or last message is more than 1 hrs ago,
      let lastMessage = messages[messages.length - 1];
      // diff time is in hours
      const diffTime = diffHours(lastMessage.sentAt.toDate(), new Date());

      if (diffTime >= 1) {
        let emailRes = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/sg/message-received`,
          {
            toEmail: partner.email,
            userName: user.fullName,
          }
        );

        emailRes = emailRes.data;
        console.log(emailRes);
        console.log("sent email dT >= 1");
      }

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const createCallMessage = async () => {
    try {
      // note: Create a chat if doesnt exit
      if (!chattedBefore) {
        return console.log("must send a message first...");
      }

      // note: add message
      const m = {
        callLink: `https://meet.jit.si/${makeId(7)}`,
        sentAt: serverTimestamp(),
      };

      await addDoc(collection(db, "chats", chatId, "messages"), m);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const MyMessage = ({ msg }) => (
    <li className="flex justify-start">
      {/* <Tooltip label={msg.sentAt.toString()}> */}
      <Tooltip
        label={msg && msg.sentAt ? formatMsgDate(msg.sentAt.toDate()) : ""}
      >
        <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
          <span className="block">{msg.text}</span>
        </div>
      </Tooltip>
    </li>
  );
  const YourMessage = ({ msg }) => (
    <li className="flex justify-end">
      <Tooltip label={formatMsgDate(msg.sentAt.toDate())}>
        <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
          <span className="block">{msg.text}</span>
        </div>
      </Tooltip>
    </li>
  );

  const UserProfile = () => {
    return (
      <div className="bg-white p-10 rounded-md shadow-md min-w-[200px] flex flex-col gap-4 items-center sm:p-4">
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
            <Link href={`/tutors/${partner.id}`}>
              <button className="btn btn-secondary"> Visit tutor page</button>
            </Link>
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
        {partner && partner.type === "admin" && (
          <>
            <Avatar src={"/img/logos/biggerIcon.png"} size={"xl"} />
            <div className="text-xl font-semibold">{partner.fullName}</div>
            <div className="text-base text-teal-500 font-semibold">
              RKTutors Support Account
            </div>
            <div className="text-base text-teal-500 font-semibold">
              +44 (0) 7419 206020
            </div>
            <div className="text-base text-teal-500 font-semibold">
              tutors@rktutors.co.uk
            </div>
          </>
        )}
      </div>
    );
  };

  const CallLinkMessage = ({ msg }) => (
    <li className="flex justify-end">
      {msg.sentAt && (
        <Tooltip label={formatMsgDate(msg.sentAt.toDate())}>
          <Link href={msg.callLink}>
            <button
              onClick={() => console.log(msg.sentAt.toDate())}
              className="btn btn-success text-white normal-case"
            >
              Join call ({getLastNChars(msg.callLink, 7)})
            </button>
          </Link>
        </Tooltip>
      )}
    </li>
  );

  return (
    <div className="flex-1 flex gap-4 max-h-full overflow-hidden p-4 bg-gray-200 sm:flex-col sm:p-0 sm:gap-1 sm:overflow-y-auto">
      <UserProfile />
      {/* message and input */}
      <div className="flex-1 flex flex-col bg-white rounded-md shadow-md">
        <div className="overflow-y-auto flex-1 p-4 scrollbar-thin  scrollbar-thumb-gray-300 flex flex-col">
          {/* Havent chatted before */}
          {messages.length === 0 && <NeverChatBefore />}

          {/* Messages */}
          {messages && user && partner && (
            <ul className="space-y-2">
              {messages.map((msg, i) => {
                if (msg.callLink) return <CallLinkMessage msg={msg} key={i} />;
                else if (msg.senderId == user.uid)
                  return <MyMessage msg={msg} key={i} />;
                else if (msg.senderId == partner.id)
                  return <YourMessage msg={msg} key={i} />;
              })}
              <div ref={lastMessageRef}></div>
            </ul>
          )}
        </div>
        <div className="w-full sm:fixed sm:bottom-0 sm:left-0">
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
            {user.type === "admin" && (
              <button
                onClick={createCallMessage}
                className="btn btn-success ml-2"
              >
                Create call
              </button>
            )}
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
