import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import TutorRequests from "../../components/Tutor/TutorRequests";
import StudentRequests from "../../components/Student/StudentRequests";

export default function BookingRequests() {
  const { user, userLoading } = useContext(AuthContext);

  if (user && !userLoading) {
    if (user.type === "tutor") return <TutorRequests />;
    else if (user.type === "student") return <StudentRequests />;
  }
}
