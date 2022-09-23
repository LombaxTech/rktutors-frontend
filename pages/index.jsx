import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";

import LandingPage from "../LandingPage";
import LoadingPage from "../components/LoadingPage";

import TutorHome from "../components/Tutor/TutorHome";
import StudentHome from "../components/Student/StudentHome";
import AdminDashboard from "../components/Admin/AdminDashboard";

export default function Home() {
  const router = useRouter();
  const { user, userLoading } = useContext(AuthContext);

  if (userLoading) return <LoadingPage />;

  // Landing page
  if (!userLoading && !user) return <LandingPage />;

  // default app
  if (!userLoading && user) {
    if (user.type === "student") {
      return <StudentHome />;
    } else if (user.type === "tutor") {
      return <TutorHome />;
    } else if (user.type === "admin") {
      return <AdminDashboard />;
    } else {
      return <LoadingPage message={"Your account is being prepared"} />;
    }
  }
}
