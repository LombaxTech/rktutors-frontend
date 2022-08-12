import { Input } from "@chakra-ui/react";

const General = ({ user }) => {
  return (
    <div id="general" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">General</h1>
      <div className="flex items-center w-5/12">
        <label className="label">
          <span className="label-text">Name: </span>
        </label>
        <Input placeholder={user.fullName} isReadOnly />
      </div>
      <div className="flex items-center w-5/12">
        <label className="label">
          <span className="label-text">Email: </span>
        </label>
        <Input placeholder={user.email} isReadOnly />
      </div>
      <div className="font-normal">
        Something wrong with these details?{" "}
        <span className="text-blue-300 underline">Contact us</span> for help
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default General;
