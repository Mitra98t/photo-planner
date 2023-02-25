import React from "react";
import ProfilePic from "../ProfilePic";

export default function NavBarMap({ profileArea, searchArea, user }) {
  return (
    <div className="w-full h-full bg-stone-50 rounded-t-3xl flex flex-row items-center justify-between px-12">
      <div className=""></div>
      <button
        onClick={searchArea}
        className="  rounded-full font-bold text-center text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 px-6 py-4 "
      >
        Search Area
      </button>
      <div className="h-3/5 cursor-pointer " onClick={profileArea}>
        <ProfilePic
          seed={user ? user : ""}
          heightBased
          border=" border-2 border-stone-900 "
        />
      </div>
    </div>
  );
}
