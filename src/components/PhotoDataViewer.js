/* eslint-disable no-unused-vars */
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { DBManager as db } from "../utils/DBManager";
import { formatStyle, getWeatherByCode } from "../utils/utils";
import Autocomplete from "./Autocomplete";

export default function PhotoDataViewer({ photo, photos, setPhotos, index }) {
  // const [url, setUrl] = useState(photo.URL);
  // const [file, setFile] = useState(photo.file);
  // const [exif, setExif] = useState(photo.exif);
  // const [camera, setCamera] = useState(photo.camera);
  const [suggestions, setSuggestions] = useState(null);
  const [weatherCodes, setWeatherCodes] = useState(null);
  const [locationIsEmpty, setLocationIsEmpty] = useState(false);

  useEffect(() => {
    console.log(photos);
  }, [photos]);

  useEffect(() => {
    db.getWeatherCodes().then((c) => setWeatherCodes(c));
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-start justify-evenly gap-4 px-4">
      <div className="w-full flex flex-col items-start justify-start gap-1">
        {inputField(
          photos[index].file.name,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].file.name = v;
            setPhotos(oldPhotos);
          },
          "Title",
          !photos[index].file.hasOwnProperty("name") ||
            photos[index].file.name === ""
        )}
        {inputField(
          photos[index].file.description,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].file.description = v;
            setPhotos(oldPhotos);
          },
          "Description",
          !photos[index].file.hasOwnProperty("description") ||
            photos[index].file.description === "",
          true,
          true
        )}
        {inputField(
          photos[index].file.creationDate,
          (v) => {
            let oldPhotos = { ...photos };
            oldPhotos[index].file.creationDate = v;
            setPhotos(oldPhotos);
          },
          "Creation date",

          !photos[index].file.hasOwnProperty("creationDate") ||
            photos[index].file.creationDate === "",
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
          !photos[index].file.hasOwnProperty("creationTime") ||
            photos[index].file.creationTime === "",
          false
        )}

        {inputField(
          photos[index].camera.make,
          (v) => {},
          "Camera brand",
          !photos[index].camera.hasOwnProperty("make") ||
            photos[index].camera.make === "",
          false
        )}
        {inputField(
          photos[index].camera.model,
          (v) => {},
          "Camera model",
          !photos[index].camera.hasOwnProperty("model") ||
            photos[index].camera.model === "",
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

          !photos[index].exif.hasOwnProperty("ISO") ||
            photos[index].exif.ISO === "",
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
          !photos[index].exif.hasOwnProperty("aperture") ||
            photos[index].exif.aperture === "",
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
          !photos[index].exif.hasOwnProperty("shutterSpeed") ||
            photos[index].exif.shutterSpeed === "",
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
          !photos[index].exif.hasOwnProperty("focalLength") ||
            photos[index].exif.focalLength === "",
          false
        )}
        <div className="flex flex-row items-center justify-start gap-2 w-full">
          <span className="font-bold whitespace-nowrap">Location: </span>
          <div
            className={formatStyle([
              "w-fit h-fit rounded-lg ",
              locationIsEmpty ||
              !photos[index].hasOwnProperty("location") ||
              photos[index].location.luogo === ""
                ? "outline outline-2 outline-red-500"
                : "",
            ])}
          >
            <Autocomplete
              handleSubmit={async (data) => {
                let oldPhotos = { ...photos };
                photos[index].location = { ...data };
                setPhotos(oldPhotos);
              }}
              defaultValue={
                photos[index].location && photos[index].location.luogo
              }
              searchOnClick
              topList
              setIsEmpty={setLocationIsEmpty}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-2 ">
          <span className="font-bold whitespace-nowrap">weather: </span>
          <select
            className={formatStyle([
              "focus:outline-stone-900 dark:focus:outline-stone-50 rounded-lg bg-stone-50 dark:bg-dark-800 w-full px-2 py-1 ",
              !photos[index].weather.hasOwnProperty("code")||
              photos[index].weather.code === ""
                ? "outline outline-2 outline-red-500"
                : "",
            ])}
            value={photos[index].weather && photos[index].weather.code}
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
                    <option value={code}>{weatherCodes[section][code]}</option>
                  ))}
                </optgroup>
              ))}
            <option></option>
          </select>
        </div>
      </div>
    </div>
  );
}
function inputField(
  value,
  setValue,
  label,
  missing = false,
  editable = true,
  textArea = false
) {
  return (
    <div className="w-fit min-w-[50%] max-w-full flex flex-row items-center justify-start gap-2 text-stone-900 dark:text-stone-50">
      <span className="font-bold whitespace-nowrap">{label}: </span>
      {textArea ? (
        <textarea
          className={formatStyle([
            "focus:outline-stone-900 dark:placeholder:text-dark-500 rounded-lg bg-stone-50 dark:bg-dark-800 w-full whitespace-pre-wrap min-h-[4rem] max-h-[15rem] px-2 py-1 ",
            missing ? "outline outline-2 outline-red-500" : "",
          ])}
          type={"text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={label + "..."}
          readOnly={!editable}
        ></textarea>
      ) : (
        <input
          className={formatStyle([
            "focus:outline-stone-900 dark:placeholder:text-dark-500 rounded-lg bg-stone-50 dark:bg-dark-800 w-full px-2 py-1 ",
            missing ? "outline outline-2 outline-red-500" : "",
          ])}
          type={"text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={label + "..."}
          readOnly={!editable}
        />
      )}
    </div>
  );
}
