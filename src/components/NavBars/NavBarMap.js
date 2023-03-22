import React from "react";
import ProfilePic from "../ProfilePic";
import Autocomplete from "../Autocomplete";
import Button from "../../elements/Button";
import { formatStyle } from "../../utils/utils";
import Icons from "../Icons";
import { ToastContainer } from "react-toastify";

export default function NavBarMap({
  profileArea,
  searchArea,
  user,
  setMapLocation,
  setTriggerMapLoad,
  notify = true,
}) {
  const handleSearchSubmit = async (foundLoc) => {
    // let foundLoc = await db.getLocationInfoByName(locationName);
    setMapLocation({
      coords: [foundLoc.lat, foundLoc.lng],
      zoom: foundLoc.zoom,
      bounds: {
        ne: [foundLoc.boundry[1], foundLoc.boundry[3]],
        sw: [foundLoc.boundry[0], foundLoc.boundry[2]],
      },
    });
  };

  return (
    <div className="w-full h-full dark:bg-dark-800 bg-stone-50 rounded-t-3xl gap-8 flex flex-row items-center justify-between px-12">
      <div className="h-full flex-1 flex flex-row items-center justify-start">
        <Autocomplete
          handleSubmit={handleSearchSubmit}
          topList
          large
          clearOnSubmit
          autofocus
          fixed
          alsoUsers
          label="Search location or @users..."
          searchOnClick
        />
      </div>
      <div className="flex-1 h-[70%] w-full flex flex-row gap-4">
        <div
          className={formatStyle([
            notify ? "basis-3/4" : "basis-full",
            "h-full",
          ])}
        >
          <Button
            onClick={searchArea}
            accentColor="green-300"
            darkAccentColor="cyan-500"
            additional=""
            height="h-full"
            width="w-full"
            textColor="text-stone-900 dark:text-stone-50"
            // paddings="py-3"
          >
            Search Area
          </Button>
        </div>
        <div
          className={formatStyle([
            notify ? "w-auto aspect-square opacity-100" : "w-0 opacity-0",
            "h-full",
          ])}
        >
          <Button
            onClick={() => setTriggerMapLoad(true)}
            accentColor="green-300"
            darkAccentColor="cyan-500"
            height="h-full"
            width={formatStyle([notify ? "w-full" : "w-0"])}
            paddings="p-4"
            additional="group"
          >
            <Icons
              icon="refresh"
              color="stroke-stone-900 dark:stroke-stone-50 group-hover:animate-spin duration-75"
              styling={{ w: "3rem", h: "auto", strokeWidth: "1.5px" }}
            />
          </Button>
          <ToastContainer />
        </div>
        {
          // <>
          //   <div
          //     className={formatStyle([
          //       "absolute top-0 right-0 w-5 h-5 dark:bg-cyan-500 bg-stone-900 rounded-full",
          //     ])}
          //   ></div>
          //   <div
          //     className={formatStyle([
          //       "absolute top-0 right-0 w-5 h-5 dark:bg-cyan-500 bg-stone-900 rounded-full animate-ping",
          //     ])}
          //   ></div>
          // </>
        }
      </div>
      <div className=" h-3/5 flex-1 flex items-center justify-end  gap-12">
        <button
          href="https://padlet.com/personalmailfm98/feed-back-y89afrpn4r234gut"
          onClick={() =>
            window.open(
              "https://padlet.com/personalmailfm98/feed-back-y89afrpn4r234gut",
              "_blank"
            )
          }
          className="font-semibold text-lg text-stone-900 dark:text-stone-50 hover:scale-110 "
        >
          Feedback and Ideas
        </button>
        <button onClick={profileArea} className={"h-full w-fit rounded-full"}>
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
