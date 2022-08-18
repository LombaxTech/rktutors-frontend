import { useState } from "react";
import { db } from "../../firebase/firebaseClient";
import { updateDoc, doc } from "firebase/firestore";
import { AlertIcon, Alert } from "@chakra-ui/react";

const Availablity = ({ user }) => {
  const isUserActive = user.active;

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const toggleAccountActiveState = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...(isUserActive && { active: false }),
        ...(!isUserActive && { active: true }),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.log(error);
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div id="availablity" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Availablity</h1>
      <h1 className="">Account Active Status: </h1>
      {isUserActive && (
        <h1>Your account is currently active and open for student booking</h1>
      )}
      {!isUserActive && (
        <h1>Your account is currently inactive and closed for bookings</h1>
      )}

      <button
        className="btn btn-primary w-3/12"
        onClick={toggleAccountActiveState}
      >
        {isUserActive ? "Set account to inactive" : "Set account as active"}
      </button>
      {error && (
        <Alert status="error">
          <AlertIcon />
          An error has occurred
        </Alert>
      )}
      {success && (
        <Alert status="success">
          <AlertIcon />
          Account active state updated
        </Alert>
      )}
      <hr className="my-4" />
    </div>
  );
};

export default Availablity;
