import { useState, useEffect, useRef } from "react";

import { Avatar, MenuDivider, Tooltip, Tag, HStack } from "@chakra-ui/react";

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
import { smallBigString } from "../../helperFunctions";
import { useRouter } from "next/router";

export default function TutorPage() {
  const router = useRouter();

  const { user, userLoading } = useCustomAuth();
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    async function init() {
      const { tutorId } = router.query;
      try {
        let tutorDoc = await getDoc(doc(db, "users", tutorId));
        console.log(tutorDoc);
        setTutor({ id: tutorDoc.id, ...tutorDoc.data() });
        // console.log("...");
      } catch (error) {
        console.log(error);
      }
    }

    if (router.isReady) init();
  }, [router.isReady]);

  if (tutor && user)
    return (
      <div className="flex-1 bg-gray-200 p-4 overflow-hidden flex">
        <div className="flex-1 flex bg-white rounded-md shadow-md">
          <div className="p-8 px-12 min-w-[300px] border-r flex flex-col items-center gap-4">
            <Avatar
              src={tutor.profilePictureUrl}
              name={tutor.fullName}
              size={"2xl"}
            />
            <h1 className="text-2xl font-semibold">{tutor.fullName}</h1>
            <div class="rating w-8/12 mx-auto">
              <input
                type="radio"
                name="rating-1"
                class="mask mask-star bg-yellow-500"
              />
              <input
                type="radio"
                name="rating-1"
                class="mask mask-star bg-yellow-500"
              />
              <input
                type="radio"
                name="rating-1"
                class="mask mask-star bg-yellow-500"
              />
              <input
                type="radio"
                name="rating-1"
                class="mask mask-star bg-yellow-500"
              />
              <input
                type="radio"
                name="rating-1"
                class="mask mask-star bg-yellow-500"
                checked
              />
              <div className="font-semibold ml-2">(46)</div>
            </div>
            <div className="flex flex-col gap-4">
              <button className="btn btn-secondary">Book Lesson</button>
              <Link
                href={`/chats/${smallBigString(user.uid, tutor.id)}?partnerId=${
                  tutor.id
                }`}
              >
                <button className="btn btn-accent">Send Message</button>
              </Link>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 p-8 flex flex-col">
            <div className="flex flex-col gap-4 w-3/4 mx-auto">
              <div className="text-4xl font-bold">Subjects Offered</div>
              <div className="flex gap-4 flex-wrap">
                {tutor.profile.teachingSubjects &&
                  tutor.profile.teachingSubjects.map((subject) => (
                    <Tag size={"lg"} variant="solid" colorScheme="blue">
                      {`${subject.subject} ${subject.level}`}
                    </Tag>
                  ))}
              </div>
              <hr className="my-6" />
              <div className="text-4xl font-bold">About Me</div>
              <div className="">{tutor.profile.aboutMe}</div>
              <hr className="my-6" />
              <div className="text-4xl font-bold">About My Lessons</div>
              <div className="">{tutor.profile.aboutMyLessons}</div>
              <hr className="my-6" />
              <div className="text-4xl font-bold">Reviews</div>
              <div className="">
                {tutor.reviews ? "Reviews..." : "No Reviews Found"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
