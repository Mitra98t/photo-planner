/* eslint-disable no-unused-vars */
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { DBManager as db } from "../utils/DBManager";
import { getWeatherByCode } from "../utils/utils";
import Autocomplete from "./Autocomplete";

export default function PhotoDataViewer({ photo, photos, setPhotos, index }) {
  // const [url, setUrl] = useState(photo.URL);
  // const [file, setFile] = useState(photo.file);
  // const [exif, setExif] = useState(photo.exif);
  // const [camera, setCamera] = useState(photo.camera);
  const [suggestions, setSuggestions] = useState(null);
  const [weatherCodes, setWeatherCodes] = useState(null);

  useEffect(() => {
    db.getWeatherCodes().then((c) => setWeatherCodes(c));
    console.log(photos);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-start justify-evenly gap-4 px-4">
      <div className="flex flex-col items-start justify-start gap-1">
        {inputField(
          photos[index].file.name,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].file.name = v;
            setPhotos(oldPhotos);
          },
          "Title"
        )}
        {inputField(
          photos[index].file.description,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].file.description = v;
            setPhotos(oldPhotos);
          },
          "Description"
        )}
        {inputField(
          photos[index].file.creationDate,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].file.creationDate = v;
            setPhotos(oldPhotos);
          },
          "Creation date",
          false
        )}
        {inputField(
          photos[index].file.creationTime,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].file.creationTime = v;
            setPhotos(oldPhotos);
          },
          "Creation time",
          false
        )}

        {inputField(
          photos[index].camera.make,
          (v) => {},
          "Camera brand",
          false
        )}
        {inputField(
          photos[index].camera.model,
          (v) => {},
          "Camera model",
          false
        )}

        {inputField(
          photos[index].exif.ISO,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].exif.ISO = v;
            setPhotos(oldPhotos);
          },
          "ISO",
          false
        )}
        {inputField(
          photos[index].exif.aperture,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].exif.aperture = v;
            setPhotos(oldPhotos);
          },
          "Aperture",
          false
        )}
        {inputField(
          photos[index].exif.shutterSpeed,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].exif.shutterSpeed = v;
            setPhotos(oldPhotos);
          },
          "Shutter speed",
          false
        )}
        {inputField(
          photos[index].exif.focalLength,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].exif.focalLength = v;
            setPhotos(oldPhotos);
          },
          "Focal length",
          false
        )}
        <div className="flex flex-row items-center justify-start gap-2">
          <span className="font-bold whitespace-nowrap">Location: </span>
          <Autocomplete
            handleSubmit={async (data) => {
              let oldPhotos = { ...photos };
              let weather = await db.getWeatherByTimeAndLoc(
                photos[index].file.creationDate,
                photos[index].file.creationTime,
                { lat: data.lat, lng: data.lng }
              );
              photos[index].location = { ...data };
              photos[index].weather = { ...weather };
              setPhotos(oldPhotos);
            }}
          />
        </div>
        <div className="flex flex-row items-center justify-start gap-2">
          <span className="font-bold whitespace-nowrap">weather: </span>
          <select
            className="focus:outline-stone-900 rounded-lg bg-stone-50 text-stone-900 w-full px-2 py-1 "
            onChange={(e) => {
              let oldPhotos = { ...photos };
              // let test = { ...e.target.value };
              photos[index].weather = {
                code: e.target.value,
                weather: getWeatherByCode(e.target.value, weatherCodes),
              };
              setPhotos(oldPhotos);
            }}
          >
            {weatherCodes &&
              Object.keys(weatherCodes).map((section) => (
                <optgroup label={section}>
                  {Object.keys(weatherCodes[section]).map((code) => (
                    <option
                      value={code}
                      selected={code === photos[index].weather.code}
                    >
                      {weatherCodes[section][code]}
                    </option>
                  ))}
                </optgroup>
              ))}
            <option></option>
          </select>
          {/* <input
            className={
              "focus:outline-stone-900 rounded-lg bg-stone-50 text-stone-900 w-full px-2 py-1 "
            }
            type={"text"}
            value={photos[index].weather.weather}
            onChange={(e) => {}}
            placeholder={"Weather..."}
            readOnly
          /> */}
        </div>
      </div>
    </div>
  );
}
function inputField(value, setValue, label, editable = true) {
  return (
    <div className="flex flex-row items-center justify-start gap-2">
      <span className="font-bold whitespace-nowrap">{label}: </span>
      <input
        className={
          "focus:outline-stone-900 rounded-lg bg-stone-50 text-stone-900 w-full px-2 py-1 "
        }
        type={"text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={label + "..."}
        readOnly={!editable}
      />
    </div>
  );
}
