import React from "react";
import ProfilePic from "../ProfilePic";
import Autocomplete from "../Autocomplete";
import Button from "../../elements/Button";
import { Default, Desktop, formatStyle, Mobile } from "../../utils/utils";
import Icons from "../Icons";
import { ToastContainer } from "react-toastify";
import MediaQuery from "react-responsive";

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
    <div className="w-full h-full dark:bg-dark-800 bg-stone-50 rounded-t-3xl flex flex-col sm:flex-row items-center justify-envenly gap-4 sm:gap-8 sm:justify-between px-12 pt-4 md:pt-0">
      <div className="h-full w-full flex-1 flex flex-row items-center justify-start">
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
          className={formatStyle([notify ? "basis-3/4" : "w-full", "h-full"])}
        >
          <Button
            onClick={searchArea}
            accentColor="green-300"
            darkAccentColor="cyan-500"
            additional="aspect-square md:aspect-auto"
            height="h-full"
            width="w-full"
            textColor="text-stone-900 dark:text-stone-50"
            paddings=" md:px-6 md:py-4"
          >
            <Default>
              <p>Search Area</p>
            </Default>
            <Mobile>
              <Icons
                icon="search"
                color="stroke-stone-900 dark:stroke-stone-50"
                styling={{ h: "2rem", w: "auto", strokeWidth: "1.5px" }}
              />
            </Mobile>
          </Button>
        </div>
        <div
          className={formatStyle([
            notify ? "w-auto aspect-square opacity-100 " : "w-0 opacity-0",
            "h-full",
          ])}
        >
          <Button
            onClick={() => setTriggerMapLoad(true)}
            accentColor="green-300"
            darkAccentColor="cyan-500"
            height="h-full"
            width={formatStyle([notify ? "w-full" : "w-0"])}
            paddings=""
            additional="group"
          >
            <Icons
              icon="refresh"
              color="stroke-stone-900 dark:stroke-stone-50"
              styling={{ h: "2rem", w: "auto", strokeWidth: "1.5px" }}
            />
          </Button>
        </div>
        <Mobile>
          <div className=" h-full flex-1 flex items-center justify-end  gap-12">
            <button
              onClick={profileArea}
              className={"h-full w-full aspect-square rounded-full"}
            >
              <ProfilePic
                seed={user ? user : ""}
                heightBased
                border=" border-2 border-stone-900 dark:border-dark-600 "
              />
            </button>
          </div>
        </Mobile>
      </div>
      <Default>
        <div className=" h-[70%] flex-1 flex flex-row items-center justify-end gap-12">
          <button
            onClick={profileArea}
            className={"h-full w-fit aspect-square rounded-full"}
          >
            <ProfilePic
              seed={user ? user : ""}
              heightBased
              border=" border-2 border-stone-900 dark:border-dark-600 "
            />
          </button>
        </div>
      </Default>
    </div>
  );
}
