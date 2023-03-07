import React, { useState } from "react";
import { DBManager as db } from "../../utils/DBManager";
import ProfilePic from "../ProfilePic";

export default function NavBarMap({
  profileArea,
  searchArea,
  user,
  setMapLocation,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [foundloc, setFoundloc] = useState(null);

  const handleSearchChange = async (e) => {
    let search = e.target.value;
    console.log(search);
    setSearchInput(search);
    if (search === "") return;
    let possibleLocs = await db.getLocationSuggestinosByName(search);
    console.table(possibleLocs);
    setSuggestions(possibleLocs);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    console.log(searchInput);

    let foundLoc = await db.getLocationInfoByName(searchInput);

    console.log(foundLoc);
    setMapLocation({
      coords: [foundLoc.lat, foundLoc.lng],
      zoom: foundLoc.zoom,
    });
    setFoundloc(foundLoc);
    setSearchInput("");
  };

  return (
    <div className="w-full h-full bg-stone-50 rounded-t-3xl flex flex-row items-center justify-between px-12">
      <form
        onSubmit={handleSearchSubmit}
        className="h-full flex flex-row items-center justify-start"
      >
        <input
          type={"text"}
          placeholder={"search city"}
          value={searchInput}
          onChange={handleSearchChange}
          className={"p-3 bg-stone-50 text-2xl"}
        />
      </form>
      <button
        onClick={searchArea}
        className="rounded-full font-bold text-center text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 px-6 py-4 "
      >
        Search Area
      </button>
      <div className=" h-3/5 cursor-pointer " onClick={profileArea}>
        <ProfilePic
          seed={user ? user : ""}
          heightBased
          border=" border-2 border-stone-900 "
        />
      </div>
    </div>
  );
}
