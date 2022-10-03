import React from "react";

import { Heading, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

import { useRouter } from "next/router";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center gap-10 pt-28">
      <Heading fontSize={"4xl"} textAlign={"center"}>
        <div className="flex items-center gap-4">
          <IconButton
            vairant="solid"
            bg={"linear-gradient(to right, #5ca9fb 0%, #38b2ac 100%)"}
            color={"white"}
            weight="bold"
            icon={<ArrowBackIcon weight="bold" />}
            onClick={() => router.push("/")}
          />{" "}
          <div>Sign Up</div>
        </div>
      </Heading>

      <div className="flex gap-8 sm:flex-col">
        <div className="bg-white p-4 flex flex-col gap-8 rounded-md shadow-md">
          <img src="img/student.svg" alt="" className="h-52 w-72" />
          <Link href={`/signup/student`}>
            <button className="btn btn-primary">student</button>
          </Link>
        </div>
        <div className="bg-white p-4 flex flex-col gap-8 rounded-md shadow-md">
          <img src="img/professor.svg" alt="" className="h-52 w-72" />
          <Link href={`/signup/tutor`}>
            <button className="btn btn-secondary">Tutor</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
