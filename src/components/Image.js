import React, { useEffect, useState } from "react";
import { DBManager as db } from "../utils/DBManager";
import ProfilePic from "./ProfilePic";
import Voting from "./Voting";
import { formatStyle } from "../utils/utils";

export default function Image({
  userUID,
  image,
  hideAuthor,
  clickCallback,
  lowQuality = false,
  lazyLoading = false,
}) {
  const [author, setAuthor] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    db.getUserInformationByUID(image.authorUID).then((r) => {
      setAuthor({ UID: image.authorUID, ...r });
    });
  }, [image]);

  return (
    <>
      <div
        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 w-full h-full md:group-hover:opacity-100 md:group-focus:opacity-100 duration-75 p-4 flex flex-col justify-between items-start z-50"
        onClick={() => clickCallback(image)}
      >
        <div className="w-full h-fit flex flex-row-reverse justify-between items-start">
          <Voting userUID={userUID} photoID={image.ID} disable />
          {hideAuthor ? (
            <></>
          ) : (
            <div className="w-3/4 h-12 flex gap-2 items-center justify-start overflow-hidden">
              <ProfilePic heightBased seed={image.authorUID} border="  " />
              <p className="text-xl text-center text-dark-text whitespace-nowrap">
                {author == null ? "..." : author.userName}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start justify-start gap-0.5 text-dark-text font-semibold whitespace-nowrap">
          <p>Date: {image.fileData.creationDate}</p>
          <p>Hour: {image.fileData.creationTime}</p>
          <p>Position: {image.location}</p>
          <p>Weather: {image.weather.weather}</p>
        </div>
      </div>
      <img
        src={
          image.hasOwnProperty("smallURL") && lowQuality
            ? image.smallURL
            : image.URL
        }
        alt="random img"
        className={formatStyle([
          "h-full w-full object-cover align-bottom block hover:hidden",
        ])}
      />
      {/* {image.hasOwnProperty("smallURL") && lowQuality && !isLoaded ? (
        <img
          src={image.smallURL}
          alt="random img"
          className={formatStyle([
            "h-full w-full object-cover align-bottom block hover:hidden",
            isLoaded ? "hidden" : "block",
          ])}
        />
      ) : (
        <> </>
      )}
      <img
        src={image.URL}
        alt="random img"
        className={"h-full w-full object-cover align-bottom block hover:hidden"}
        onLoad={() => setIsLoaded(true)}
        // loading={lazyLoading ? "lazy" : "eager"}
      /> */}
    </>
  );
}
