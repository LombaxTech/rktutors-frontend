import { useState, useEffect, useRef, useContext } from "react";

import {
  Avatar,
  MenuDivider,
  Tooltip,
  Tag,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Spinner,
} from "@chakra-ui/react";

import { FaStar } from "react-icons/fa";

import {
  addDoc,
  serverTimestamp,
  orderBy,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseClient";

import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";

import {
  smallBigString,
  getMean,
  hasStudentBookedTutor,
} from "../../helperFunctions";
import { useRouter } from "next/router";

import BookingModal from "../../components/BookingModal";
import StarRatings from "react-star-ratings";

export default function TutorPage() {
  const router = useRouter();

  const { user, userLoading } = useContext(AuthContext);
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

  if (tutor && user) {
    const tutorSaved = user.savedTutors?.some((t) => t.id === tutor.id);
    let ratingNumbers = tutor.ratings?.map((r) => r.rating);
    const tutorRating = ratingNumbers.length === 0 ? 0 : getMean(ratingNumbers);

    const { lessonPrices } = tutor;

    const hasPrevBooked = tutor.prevBookedStudents?.some(
      (student) => student.id === user.uid
    );

    return (
      <div className="flex-1 bg-gray-200 p-4 overflow-hidden flex sm:p-0 sm:overflow-auto">
        <div className="flex-1 flex bg-white rounded-md shadow-md sm:flex-col sm:overflow-y-auto">
          <div className="p-8 px-12 min-w-[300px] border-r flex flex-col items-center gap-4 sm:p-2 sm:px-2">
            <Avatar
              src={tutor.profilePictureUrl}
              name={tutor.fullName}
              size={"2xl"}
            />
            <h1 className="text-2xl font-semibold">{tutor.fullName}</h1>
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
            {ratingNumbers.length === 0 ? (
              <div className="flex items-center gap-2 font-bold text-lg text-teal-500"></div>
            ) : (
              <div className="flex items-center gap-2">
                <StarRatings
                  rating={tutorRating}
                  starRatedColor="gold"
                  starDimension={"20px"}
                  starSpacing={"2px"}
                />
                <span className="">
                  ({ratingNumbers.length} Review
                  {ratingNumbers.length === 1 ? "" : "s"})
                </span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <BookingModal tutor={tutor} hasPrevBooked={hasPrevBooked} />
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
              <div className="flex flex-col p-8 border-2 rounded-md w-fit">
                <div className="flex gap-4 items-center">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <div className="">
                    GCSE - £{lessonPrices["GCSE"]} per lesson
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <div className="">
                    A-Level - £{lessonPrices["A-Level"]} per lesson
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold">Subjects Offered</div>
              <div className="flex gap-4 flex-wrap">
                {tutor.profile.teachingSubjects &&
                  tutor.profile.teachingSubjects.map((subject, i) => (
                    <Tag
                      size={"lg"}
                      variant="solid"
                      colorScheme={subject.level === "GCSE" ? "green" : "blue"}
                      key={i}
                    >
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
              <Reviews tutor={tutor} user={user} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Reviews = ({ tutor, user }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        let q = query(
          collection(db, "reviews"),
          where("tutor.id", "==", tutor.id),
          orderBy("createdAt", "desc")
        );

        onSnapshot(q, (reviewsSnapshot) => {
          let reviews = [];
          reviewsSnapshot.forEach((r) =>
            reviews.push({ id: r.id, ...r.data() })
          );
          setReviews(reviews);
        });
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  return (
    <>
      <div className="text-4xl font-bold">Reviews</div>
      <AddReviewModal tutor={tutor} user={user} />
      {reviews.length === 0 && <div>No Reviews Found</div>}
      {reviews.length > 0 && (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <Review key={r.id} review={r} />
          ))}
        </div>
      )}
    </>
  );
};

const Review = ({ review }) => {
  return (
    <div className="p-4 flex flex-col gap-2 rounded-md border shadow-sm">
      <div className="flex justify-between">
        <div className="">{review.student.fullName}</div>
        <div className="flex gap-1 items-center p-2 ">
          <FaStar className="text-yellow-500" />
          <div className="">{review.rating}</div>
        </div>
      </div>
      <div className="">{review.review}</div>
    </div>
  );
};

const AddReviewModal = ({ tutor, user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const addReview = async () => {
    setLoading(true);
    // todo: check rating exists
    // todo: do some checks on review text

    try {
      await addDoc(collection(db, "reviews"), {
        tutor: {
          id: tutor.id,
          fullName: tutor.fullName,
        },
        student: {
          id: user.uid,
          fullName: user.fullName,
        },
        review: reviewText,
        rating,
        createdAt: serverTimestamp(),
      });

      let ratings = tutor.ratings || [];
      let newRatings = [...ratings, { studentId: user.uid, rating }];

      await updateDoc(doc(db, "users", tutor.id), {
        ratings: newRatings,
      });
      setLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      {hasStudentBookedTutor(user.uid, tutor) ? (
        <button className="btn btn-primary" onClick={onOpen}>
          Add Review
        </button>
      ) : (
        <div className=""></div>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="p-8 flex flex-col gap-8">
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here"
                size="md"
                rows={5}
              />
              <div className="flex items-center gap-4">
                <div className="">Give a rating</div>
                <StarRatings
                  rating={rating}
                  starRatedColor="gold"
                  changeRating={(r) => setRating(r)}
                  starDimension={"20px"}
                  starSpacing={"2px"}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={addReview}
                disabled={loading}
              >
                Add Review
                {loading && <Spinner className="ml-4" />}
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
