/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { DBManager as db } from "../utils/DBManager";
import Autocomplete from "./Autocomplete";

export default function PhotoDataViewer({ photo, photos, setPhotos }) {
  const [url, setUrl] = useState(photo.URL);
  const [file, setFile] = useState(photo.file);
  const [exif, setExif] = useState(photo.exif);
  const [camera, setCamera] = useState(photo.camera);
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {}, []);

  return (
    <div className="w-full h-full flex flex-col items-start justify-evenly gap-4 px-4">
      <div className="flex flex-col items-start justify-start gap-1">
        {Object.keys(file).map((fk) => (
          <div className="flex items-start justify-start gap-2">
            <p className="font-semibold">{fk}:</p>
            <p>{file[fk]}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-start justify-start gap-1">
        {Object.keys(exif).map((ek) => (
          <div className="flex items-start justify-start gap-2">
            <p className="font-semibold">{ek}:</p>
            <p>{exif[ek]}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-start justify-start gap-1">
        {Object.keys(camera).map((ck) => (
          <div className="flex items-start justify-start gap-2">
            <p className="font-semibold">{ck}:</p>
            <p>{camera[ck]}</p>
          </div>
        ))}
      </div>

      {/* <div className="flex flex-col items-start justify-start gap-1">
        <div className="flex items-start justify-start gap-2">
          <p className="font-semibold">city:</p>
          <input
            className="bg-stone-50"
            placeholder="city"
            onChange={async (e) => {
              let sugg = await db.getLocationSuggestinosByName(e.target.value);
              setSuggestions(sugg);
            }}
          />
        </div>
        <div className="w-full h-fit max-h-20 bg-stone-50 rounded-md shadow-md">
          {suggestions && suggestions.map((s) => <p>{s.luogo}</p>)}
        </div>
      </div> */}
      <Autocomplete />
    </div>
  );
}
