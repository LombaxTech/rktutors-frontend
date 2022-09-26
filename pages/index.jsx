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
      // return <LoadingPage message={"Your account is being prepared"} />;
      return <SignupLoading />;
    }
  }
}

const SignupLoading = () => (
  <div className="flex flex-col justify-center items-center mt-48 gap-32">
    <div className="flex items-center">
      <div className="flex flex-col">
        <span className="font-bold text-3xl">Preparing Your Account...</span>
        <span className="font-medium text-xl">
          Do not click away or refresh the page
        </span>
      </div>
      <Spinner className="ml-2" size={"xl"} />
    </div>
    <span className="font-normal text-sm text-blue-500 flex flex-col justify-center items-center">
      <div>Need help?</div>
      Contact us at tutors@rktutors.co.uk or +44 7419 206020
    </span>
  </div>
);
