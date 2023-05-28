import React from "react";
import ProfilePic from "../ProfilePic";
import Autocomplete from "../Autocomplete";
import Button from "../../elements/Button";
import { Default, formatStyle, Mobile } from "../../utils/utils";
import Icons from "../Icons";

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
    localStorage.setItem(
      "mapLocation",
      JSON.stringify({
        coords: [foundLoc.lat, foundLoc.lng],
        zoom: foundLoc.zoom,
        bounds: {
          ne: [foundLoc.boundry[1], foundLoc.boundry[3]],
          sw: [foundLoc.boundry[0], foundLoc.boundry[2]],
        },
      })
    );
  };

  return (
    <div className="w-full h-full dark:bg-dark-bg bg-light-bg rounded-t-3xl flex flex-col sm:flex-row items-center justify-envenly gap-4 sm:gap-8 sm:justify-between px-12 pt-4 md:pt-0">
      <div className="h-full w-full flex-1 flex flex-row items-center justify-start">
        <Autocomplete
          handleSubmit={handleSearchSubmit}
          topList
          large
          clearOnSubmit
          fixed
          alsoUsers
          label="Search location or @users..."
          searchOnClick
        />
      </div>
      <div className="flex-1 h-[70%] w-full flex flex-row gap-4">
        <div
          className={formatStyle([notify ? "basis-2/4 sm:basis-3/4" : "basis-3/4 sm:basis-full", "h-full"])}
        >
          <Button
            onClick={searchArea}
            additional="aspect-square md:aspect-auto"
            height="h-full"
            width="w-full"
            textColor="text-light-text dark:text-dark-text"
            paddings=" md:px-6 md:py-4"
          >
            <Default>
              <p>Search Area</p>
            </Default>
            <Mobile>
              <Icons
                icon="search"
                color="stroke-dark-text dark:stroke-dark-text"
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
            height="h-full"
            width={formatStyle([notify ? "w-full" : "w-0"])}
            paddings=""
            additional="group"
          >
            <Icons
              icon="refresh"
              color="stroke-dark-text dark:stroke-dark-text"
              styling={{ h: "2rem", w: "auto", strokeWidth: "1.5px" }}
            />
          </Button>
        </div>
        <Mobile>
          <div className=" h-full flex-1 flex items-center justify-end  gap-12">
            <button
              onClick={profileArea}
              className={"h-full aspect-square rounded-full"}
            >
              <ProfilePic
                seed={user ? user : ""}
                heightBased
                border=" border-2 border-light-secondary dark:border-dark-secondary "
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
              border=" border-2 border-light-secondary dark:border-dark-secondary "
            />
          </button>
        </div>
      </Default>
    </div>
  );
}
