import React, { useEffect, useState } from "react";
import { DBManager as db } from "../utils/DBManager";
import ProfilePic from "./ProfilePic";
import Voting from "./Voting";

export default function Image({
  userUID,
  image,
  hideAuthor,
  clickCallback,
  lowQuality = false,
}) {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    db.getUserInformationByUID(image.authorUID).then((r) => {
      setAuthor({ UID: image.authorUID, ...r });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className="absolute inset-0  bg-black bg-opacity-50 opacity-0 w-full h-full group-hover:opacity-100 group-focus:opacity-100 duration-200 p-4 flex flex-col justify-between items-start "
        onClick={() => clickCallback(image)}
      >
        <div className="w-full h-fit flex flex-row-reverse justify-between items-start">
          <Voting userUID={userUID} photoID={image.ID} disable />
          {hideAuthor ? (
            <></>
          ) : (
            <div className="w-3/4 h-12 flex gap-2 items-center justify-start overflow-hidden">
              <ProfilePic heightBased seed={image.authorUID} border="  " />
              <p className="text-xl text-center text-stone-50 whitespace-nowrap">
                {author == null ? "..." : author.userName}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start justify-start gap-0.5 text-stone-50 font-semibold whitespace-nowrap">
          <p>Date: {image.fileData.creationDate}</p>
          <p>Hour: {image.fileData.creationTime}</p>
          <p>Position: {image.location}</p>
          <p>Weather: {image.weather.weather}</p>
        </div>
      </div>

      <img
        src={
          lowQuality && image.hasOwnProperty("smallURL")
            ? image.smallURL
            : image.URL
        }
        alt="random img"
        // className={" max-h-full min-w-full object-cover align-bottom "}
        className={" h-full w-full object-cover align-bottom "}
      />
    </>
  );
}
