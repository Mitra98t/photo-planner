import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import Button from "../elements/Button";
import { DBManager as db } from "../utils/DBManager";
import { filterPhoto } from "../utils/utils";
import Icons from "./Icons";
import PhotoGallery from "./PhotoGallery";
import ProfilePic from "./ProfilePic";

export default function ProfileView({ userUID, selectPhoto }) {
  const navigate = useNavigate();
  const { UID } = useParams();
  const [options] = useOutletContext();
  const [userInfo, setUserInfo] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [photoToShow, setPhotoToShow] = useState(null);
  const [personal, setPersonal] = useState(false);
  const [currUserSettings, setcurrUserSettings] = useState(null);

  useEffect(() => {
    db.getSettingsByUID(UID)
      .then((r) => setcurrUserSettings(r))
      .catch((e) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    db.getUserInformationByUID(UID).then((v) => setUserInfo(v));
    db.getImagesByUID(UID).then((v) => {
      setPhotos(v);
      setPhotoToShow(v);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UID]);

  useEffect(() => {
    if (userUID == null) return;
    if (userUID === UID) {
      setPersonal(true);
    }
  }, [userUID, UID]);

  useEffect(() => {
    if (photos != null) {
      let pht = [...photos];

      pht = pht.filter((p) => filterPhoto(p, options));
      setPhotoToShow(pht);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <div
      className={
        "w-full h-full overflow-y-scroll scrollbar-thin scrollbar-track-transparent text-stone-900 dark:text-stone-50 bg-stone-50 dark:bg-dark-800 scrollbar-thumb-stone-300 dark:scrollbar-thumb-dark-600 flex flex-col items-center justify-start gap-8"
      }
    >
      <div className="w-full h-1/4 flex items-center justify-center gap-8">
        <ProfilePic
          seed={UID}
          heightBased
          border={" border-2 border-stone-900 dark:border-dark-600 "}
        />
        <div className="flex flex-col items-start justify-evenlty gap-4">
          <p className="text-4xl font-semibold ">
            {userInfo ? userInfo.userName : "..."}
          </p>
          {currUserSettings != null && currUserSettings.showEmail ? (
            <p className="text-xl text-stone-700 dark:text-dark-600 ">
              {userInfo ? userInfo.userEmail : "..."}
            </p>
          ) : personal ? (
            <p className="text-xl text-stone-700 dark:text-dark-600 ">
              {userInfo ? "Hidden: " + userInfo.userEmail : "..."}
            </p>
          ) : (
            <></>
          )}
          {personal ? (
            <div className="flex items-center justify-evenly w-full h-fit gap-4 ">
              <Button
                paddings="py-1 px-3"
                width="w-fit"
                height="h-fit"
                text="text-base"
                font="font-normal"
                additional="duration-75"
                onClick={() => navigate("/profileSettings")}
              >
                Profile Settings
              </Button>
              <Button
                paddings="py-1 px-3"
                width="w-fit"
                height="h-fit"
                additional="duration-75  flex flex-row items-center justify-start gap-2"
                text="text-base"
                font="font-normal"
                accentColor="red-600"
                darkAccentColor="red-500"
                onClick={() => {
                  localStorage.removeItem("uid");

                  window.location.reload();
                }}
              >
                <p>Logout</p>
                <Icons
                  icon="out"
                  color="stroke-stone-50"
                  styling={{ w: "1rem", h: "auto", strokeWidth: "1.5px" }}
                />
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="w-full h-fit px-8">
        <PhotoGallery
          hideAuthor
          photoToShow={photoToShow}
          photoClick={selectPhoto}
          personalProfile={personal}
          userUID={userUID}
        />
      </div>
    </div>
  );
}
