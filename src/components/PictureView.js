import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DBManager as db } from "../utils/DBManager";
import Icons from "./Icons";
import ProfilePic from "./ProfilePic";
import Voting from "./Voting";
import { Desktop, Mobile, Tablet } from "../utils/utils";
import Button from "../elements/Button";

export default function PictureView({
  picture,
  close,
  userUID,
  setTriggerUpdatePhoto,
}) {
  const main = useRef(null);
  const popupRef = useRef(null);
  const [author, setAuthor] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleClickOutside = (e) => {
    e.preventDefault();
    if (
      main.current != null &&
      !main.current.contains(e.target) &&
      popupRef != null &&
      !popupRef.current.contains(e.target)
    ) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    db.getUserInformationByUID(picture.authorUID).then((r) => {
      setAuthor({ UID: picture.authorUID, ...r });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-screen bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-30 absolute inset-0 z-[300] flex flex-row items-center justify-center text-light-text">
      <div ref={popupRef}>
        {deletePopup(
          async () => {
            await db.removeImage(picture.ID);
            close();
            setTriggerUpdatePhoto(true);
          },
          showConfirmation,
          setShowConfirmation
        )}
      </div>
      <div
        ref={main}
        className="relative w-full lg:w-[80vw] h-full lg:h-[80vh] z-[51] bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text lg:rounded-3xl flex flex-col lg:flex-row items-center justify-start lg:justify-evenly overflow-hidden shadow-area"
      >
        <Tablet>
          <>
            <button
              className="fixed top-5 left-2 w-fit h-fit z-[60]"
              onClick={close}
            >
              <Icons
                icon={"previous"}
                styling={{ w: "2rem", h: "auto", strokeWidth: "2px" }}
              />
            </button>
            {picture.authorUID === userUID ? (
              <button
                className="fixed bottom-4 right-4 hover:scale-110 z-[300] duration-100 "
                onClick={() => {
                  setShowConfirmation(true);
                }}
              >
                <Icons
                  icon={"trash"}
                  styling={{ w: "2rem", h: "auto", strokeWidth: "1.5px" }}
                  color={" stroke-stone-900 dark:stroke-stone-50 "}
                />
              </button>
            ) : (
              <></>
            )}
          </>
        </Tablet>
        <Mobile>
          <>
            <button
              className="fixed top-5 left-2 w-fit h-fit z-[60]"
              onClick={close}
            >
              <Icons
                icon={"previous"}
                styling={{ w: "2rem", h: "auto", strokeWidth: "2px" }}
              />
            </button>
            {picture.authorUID === userUID ? (
              <button
                className="fixed bottom-4 right-4 hover:scale-110 z-[300] duration-100 "
                onClick={() => {
                  setShowConfirmation(true);
                }}
              >
                <Icons
                  icon={"trash"}
                  styling={{ w: "2rem", h: "auto", strokeWidth: "1.5px" }}
                  color={" stroke-stone-900 dark:stroke-stone-50 "}
                />
              </button>
            ) : (
              <></>
            )}
          </>
        </Mobile>
        <Desktop>
          {picture.authorUID === userUID ? (
            <button
              className="absolute bottom-4 right-4 hover:scale-110 z-[300] duration-100 "
              onClick={() => {
                setShowConfirmation(true);
              }}
            >
              <Icons
                icon={"trash"}
                styling={{ w: "2rem", h: "auto", strokeWidth: "1.5px" }}
                color={" stroke-stone-900 dark:stroke-stone-50 "}
              />
            </button>
          ) : (
            <></>
          )}
        </Desktop>
        <div className="w-full md:w-[70%] h-full max-h-[60%] md:max-h-[80%] lg:max-h-full whitespace-nowrap px-2 pb-4 pt-16 md:p-8 flex items-center justify-center relative group">
          <img
            // style={this.state.loaded ? {} : { display: "none" }}
            src={picture.URL}
            alt="random img"
            style={{
              filter: "drop-shadow(-5px 5px 10px #00000080)",
              display: isLoaded ? "block" : "none",
            }}
            className={"h-full object-contain"}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
        <div className="flex-grow h-full w-full md:w-[50%] lg:w-[30%] whitespace-nowrap pb-8 px-8 flex flex-col items-start justify-start gap-8 relative overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300 dark:scrollbar-thumb-dark-600 " >
          <div className="w-full h-fit flex items-center justify-start gap-4 sticky top-0 bg-light-bg dark:bg-dark-bg py-4 ">
            <Voting dark userUID={userUID} photoID={picture.ID} />
            <div
              className="flex items-center justify-start gap-2 h-24 cursor-pointer"
              onClick={() => {
                close();
                navigate(`/profile/${picture.authorUID}`);
              }}
            >
              <div className="w-auto h-full aspect-square">
                <ProfilePic
                  seed={picture.authorUID}
                  heightBased
                  border={
                    " border-[3px] border-light-secondary dark:border-dark-secondary"
                  }
                />
              </div>
              <p className="text-xl font-semibold md:text-3xl md:font-bold whitespace-pre-wrap">
                {author == null ? "..." : author.userName}
              </p>
            </div>
          </div>
          <div className="w-full h-full pr-4 flex flex-col items-start justify-start gap-4 md:gap-8">
            <div className="whitespace-pre-wrap md:max-w-[25vw] w-full flex flex-col items-start justify-start gap-0.5 text-xl mx-2 px-2 border-l-2 border-light-secondary dark:border-dark-secondary">
              <p>Date: {picture.fileData.creationDate}</p>
              <p>Hour: {picture.fileData.creationTime}</p>
              <p>Position: {picture.location}</p>
              <p>Weather: {picture.weather.weather}</p>
            </div>
            <div className="whitespace-pre-wrap md:max-w-[25vw] w-full flex flex-col items-start justify-start gap-0.5 text-xl mx-2 px-2 border-l-2 border-light-secondary dark:border-dark-secondary">
              <p>Make: {picture.camera.make}</p>
              <p>Model: {picture.camera.model}</p>
              <p>ISO: {picture.cameraSettings.ISO}</p>
              <p>Shutter Speed: {picture.cameraSettings.shutterSpeed} s</p>
              <p>Aperture: f/{picture.cameraSettings.aperture}</p>
              <p>zoom: {picture.cameraSettings.focalLength}mm</p>
            </div>
            <div className="whitespace-pre-wrap md:max-w-[25vw] w-full flex flex-col items-start justify-start gap-0.5 text-xl mx-2 px-2 border-l-2 border-light-secondary dark:border-dark-secondary">
              <p>Title: {picture.fileData.name}</p>
              <p>Description: {picture.fileData.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function deletePopup(deleteCallBack, show, setShow) {
  if (!show) return <></>;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#00000088] z-[70] flex flex-row items-center justify-center">
      <div className="w-fit h-fit flex flex-col items-center justify-evenly gap-6 whitespace-nowrap bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text p-8 rounded-2xl">
        <p className="text-3xl font-semibold">Delete image?</p>
        <div className="flex flex-row items-center justify-evenly gap-4 w-full">
          <Button
            onClick={deleteCallBack}
            height="h-[70%]"
            hover="ring-[6px]"
            paddings="py-3 px-5"
          >
            Delete
          </Button>
          <Button
            onClick={() => setShow(false)}
            height="h-[70%]"
            hover="ring-[6px]"
            paddings="py-3 px-5"
          >
            Abort
          </Button>
        </div>
      </div>
    </div>
  );
}
