import React from "react";
import Button from "../../elements/Button";
import ProfilePic from "../ProfilePic";

export default function NavBarGeneric({ close, profileArea, user }) {
  return (
    <div className="w-full h-full rounded-t-3xl bg-stone-50 dark:bg-dark-800 flex flex-row items-center justify-between px-12 ">
      <Button
        onClick={close}
        accentColor="red-600"
        darkAccentColor="red-500"
        height="h-auto"
        width="w-fit"
      >
        Close
      </Button>
      <div className="h-full w-fit flex flex-row items-center justify-end gap-8 ">
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