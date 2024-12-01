import React, { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const UserInfo = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center p-5">
      <div className="flex gap-5 items-center">
        <img
          src={currentUser?.avatar || "./avatar.png"}
          alt=""
          className="h-[50px] w-[50px] rounded-full object-cover"
        />
        <h2 className="text-xl">{currentUser?.username}</h2>
      </div>
      <div className="flex gap-5">
        <img className="h-5 w-5 cursor-pointer" src="./more.png" alt="" />
        <img className="h-5 w-5 cursor-pointer" src="./video.png" alt="" />
        <img className="h-5 w-5 cursor-pointer" src="./edit.png" alt="" />
      </div>
    </div>
  );
};

export default UserInfo;
