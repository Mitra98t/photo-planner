import React from "react";
import ProfilePic from "../ProfilePic";
import Autocomplete from "../Autocomplete";

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
    });
  };

  return (
    <div className="w-full h-full bg-stone-50 rounded-t-3xl gap-8 flex flex-row items-center justify-between px-12">
      <div className="h-full flex-1 flex flex-row items-center justify-start">
        <Autocomplete
          handleSubmit={handleSearchSubmit}
          topList
          large
          clearOnSubmit
          autofocus
        />
      </div>
      <button
        onClick={searchArea}
        className="rounded-full flex-1 font-bold text-center text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 px-6 py-4 "
      >
        Search Area
      </button>
      <div
        className=" h-3/5 cursor-pointer flex-1 flex items-center justify-end "
        onClick={profileArea}
      >
        <ProfilePic
          seed={user ? user : ""}
          heightBased
          border=" border-2 border-stone-900 "
        />
      </div>
    </div>
  );
}
