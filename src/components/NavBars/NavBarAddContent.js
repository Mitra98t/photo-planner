import React from "react";
import Button from "../../elements/Button";
import ProfilePic from "../ProfilePic";
import ThemeSelector from "../ThemeSelector";

export default function NavBarAddContent({ close, profileArea, user }) {
  return (
    <div className="w-full h-full rounded-t-3xl bg-stone-50 dark:bg-dark-800 flex flex-row items-center justify-between px-12 ">
      <Button
        onClick={close}
        accentColor="red-600"
        darkAccentColor="red-500"
        darkBaseColor="dark-900"
        baseColor="stone-900"
        height="h-auto"
        width="w-fit"
        hover="outline-[6px]"
      >
        Close
      </Button>
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
