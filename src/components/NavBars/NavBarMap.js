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
      <div className=" h-3/5 flex-1 flex items-center justify-end  gap-12">
        <a href="https://padlet.com/personalmailfm98/feed-back-y89afrpn4r234gut" onClick={() => parent.location='https://padlet.com/personalmailfm98/feed-back-y89afrpn4r234gut'} className="font-semibold text-lg text-stone-900 hover:scale-110 transition-all ease-in-out duration-150" >Feedback and Ideas</a>
        <button onClick={profileArea} className={"h-full w-fit rounded-full"}>
          <ProfilePic
            seed={user ? user : ""}
            heightBased
            border=" border-2 border-stone-900 "
          />
        </button>
      </div>
    </div>
  );
}
