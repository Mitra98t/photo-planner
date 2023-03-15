import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DBManager as db } from "../utils/DBManager";
import Icons from "./Icons";
import ProfilePic from "./ProfilePic";
import Voting from "./Voting";

export default function PictureView({ picture, close, userUID }) {
  const main = useRef(null);
  const [author, setAuthor] = useState(null);
  const navigate = useNavigate();

  const handleClickOutside = (e) => {
    e.preventDefault();
    if (main.current != null && !main.current.contains(e.target)) close();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    db.getUserInformationByUID(picture.authorUID).then((r) => {
      setAuthor({ UID: picture.authorUID, ...r });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-screen bg-black bg-opacity-50 absolute inset-0 z-[300] flex flex-row items-center justify-center text-stone-900">
      <div
        ref={main}
        className="w-[80vw] h-[80vh] z-[51] bg-stone-50 dark:bg-dark-800 text-stone-900 dark:text-stone-50 rounded-3xl flex flex-row items-center justify-evenly overflow-hidden shadow-area relative"
      >
        {picture.authorUID === userUID ? (
          <button
            className="absolute bottom-4 right-4 hover:scale-105"
            onClick={async () => {
              await db.removeImage(picture.ID);
              close();
              window.location.reload();
            }}
          >
            <Icons
              icon={"trash"}
              styling={{ w: "2rem", h: "auto", strokeWidth: "1.5px" }}
            />
          </button>
        ) : (
          <></>
        )}
        <div className=" w-[70%] h-full whitespace-nowrap p-8 flex items-center justify-center relative group">
          <div className="w-fit h-full ">
            <img
              src={picture.URL}
              alt="random img"
              style={{
                filter: "drop-shadow(-5px 5px 10px #00000080)",
              }}
              className={"h-full object-contain"}
            />
          </div>
        </div>
        <div className="flex-grow h-full whitespace-nowrap py-8 pr-8 flex flex-col items-start justify-start gap-8">
          <div className="w-full h-[10%] flex items-center justify-start gap-4">
            <Voting dark userUID={userUID} photoID={picture.ID} />
            <div
              className="flex items-center justify-start gap-2 h-full cursor-pointer"
              onClick={() => {
                close();
                navigate(`/profile/${picture.authorUID}`);
              }}
            >
              <ProfilePic
                seed={picture.authorUID}
                heightBased
                border={" border-[3px] border-stone-900 dark:border-dark-600"}
              />
              <p className="text-3xl font-semibold">
                {author == null ? "..." : author.userName}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-0.5 text-xl mx-2 px-2 border-l-2 border-stone-600 dark:border-dark-600 hover:scale-105 transition ease-in-out duration-150">
            <p>Date: {picture.fileData.creationDate}</p>
            <p>Hour: {picture.fileData.creationTime}</p>
            <p>Position: {picture.location}</p>
            <p>Weather: {picture.weather.weather}</p>
            {/* <p>
              Coordinates: {picture.lat}, {picture.lng}
            </p> */}
          </div>
          <div className="flex flex-col items-start justify-start gap-0.5 text-xl mx-2 px-2 border-l-2 border-stone-600 dark:border-dark-600 hover:scale-105 transition ease-in-out duration-150">
            <p>Make: {picture.camera.make}</p>
            <p>Model: {picture.camera.model}</p>
            <p>ISO: {picture.cameraSettings.ISO}</p>
            <p>Shutter Speed: {picture.cameraSettings.shutterSpeed} s</p>
            <p>Aperture: f/{picture.cameraSettings.aperture}</p>
            <p>zoom: {picture.cameraSettings.focalLength}mm</p>
          </div>
          <div className=" max-w-[25vw] w-full flex flex-col items-start justify-start gap-0.5 text-xl mx-2 px-2 border-l-2 border-stone-600 dark:border-dark-600 hover:scale-105 transition ease-in-out duration-150">
            <p>Title: {picture.fileData.name}</p>
            <p className="whitespace-pre-wrap">
              Description: {picture.fileData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
