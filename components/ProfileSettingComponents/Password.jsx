import { useState, useEffect } from "react";

import { Input, Alert, AlertIcon, Spinner } from "@chakra-ui/react";

import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const Password = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      setError({ code: "missing information" });
      setTimeout(() => setError(false), 5000);
      return;
    }

    setLoading(true);

    try {
      const { currentUser } = getAuth();

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword
      );

      const result = await reauthenticateWithCredential(
        currentUser,
        credential
      );

      await updatePassword(currentUser, newPassword);
      console.log("worked!!");
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setLoading(false);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);

      setTimeout(() => setError(false), 5000);
    }
  };

  return (
    <div id="password" className="flex flex-col gap-4 mt-8">
      <h1 className="text-2xl font-semibold">Password</h1>
      <div className="flex items-center w-6/12">
        <label className="label">
          <span className="label-text">Old Password: </span>
        </label>
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center w-6/12">
        <label className="label">
          <span className="label-text">New Password: </span>
        </label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <button
        className="btn btn-secondary w-4/12"
        onClick={changePassword}
        disabled={loading}
      >
        Change Password
        {loading && <Spinner className="ml-4" />}
      </button>
      <div className="w-1/2">
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error.code === "missing information"
              ? "You must fill in all fields"
              : ""}
            {error.code === "auth/wrong-password" ? "Incorrect password" : ""}
          </Alert>
        )}
        {success && (
          <Alert status="success">
            <AlertIcon />
            Successfully changed password
          </Alert>
        )}
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default Password;
