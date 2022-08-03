import { Alert, AlertIcon } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

const SetupAccount = () => {
  return (
    <div className=" bg-white shadow-lg p-8 prose flex flex-col gap-8">
      <div className="flex">
        <div className="w-6/12">
          <img
            src="img/personal_settings.svg"
            alt=""
            srcset=""
            className="h-[300px] mx-auto"
          />
        </div>
        <div className="w-6/12">
          <div className=" mx-auto">
            <Alert status="warning" className="flex justify-center">
              <AlertIcon />
              Your account is not active yet
            </Alert>
          </div>
          <div className="text-3xl my-8 font-bold text-center">
            Complete the following steps to <br /> activate your account
          </div>
          <div className="flex justify-center">
            <ul class="steps ">
              <li class="step">Set up Google Permissions</li>
              <li class="step ">Set up payments</li>
              <li class="step">Complete</li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-3" />
      <div className="flex justify-center">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between gap-8 items-center text-xl font-semibold uppercase">
            <div className="flex gap-6 items-center">
              <FaCheckCircle style={{ color: "#E5E6E6" }} /> Set up google
              Permissions
            </div>
            <button className="btn btn-primary">Start now</button>
          </div>
          <div className="flex justify-between items-center text-xl font-semibold uppercase">
            <div className="flex gap-6 items-center">
              <FaCheckCircle style={{ color: "#E5E6E6" }} />
              Set up Payments
            </div>
            <button className="btn btn-primary">Start now</button>
          </div>
        </div>
      </div>
      <hr className="my-3" />
    </div>
  );
};

export default function TutorHome() {
  return (
    <div className="flex-1 p-8 bg-gray-200">
      <SetupAccount />
    </div>
  );
}
