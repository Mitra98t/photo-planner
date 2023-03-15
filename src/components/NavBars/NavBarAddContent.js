import React from "react";
import ProfilePic from "../ProfilePic";
import ThemeSelector from "../ThemeSelector";

export default function NavBarAddContent({ close, profileArea, user }) {
  return (
    <div className="w-full h-full rounded-t-3xl bg-stone-50 dark:bg-dark-800 flex flex-row items-center justify-between px-12 ">
      <button
        onClick={close}
        className="rounded-full font-bold text-center text-xl text-stone-50 bg-stone-900 dark:bg-dark-900 dark:hover:bg-dark-700 hover:bg-stone-700 px-6 py-4 "
      >
        Close
      </button>
      <div className="h-full w-fit flex flex-row items-center justify-end gap-8 ">
        <ThemeSelector />
        <button className="h-3/5 " onClick={profileArea}>
          <ProfilePic
            seed={user ? user : ""}
            heightBased
            border=" border-2 border-stone-900 dark:border-dark-600 "
          />
        </button>
      </div>
    </div>
  );
}
