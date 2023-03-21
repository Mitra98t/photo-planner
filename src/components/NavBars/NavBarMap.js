import React from "react";
import ProfilePic from "../ProfilePic";
import Autocomplete from "../Autocomplete";
import ThemeSelector from "../ThemeSelector";
import Button from "../../elements/Button";

export default function NavBarMap({
  profileArea,
  searchArea,
  user,
  setMapLocation,
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
        />
      </div>
      <Button
        onClick={searchArea}
        accentColor="green-300"
        darkAccentColor="cyan-500"
        additional="flex-1"
        height="h-fit"
        textColor="text-stone-900 dark:text-stone-50"
        paddings="py-3"
      >
        Search Area
      </Button>
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
        <ThemeSelector />
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
