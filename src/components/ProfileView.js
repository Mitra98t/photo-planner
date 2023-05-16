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
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

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
        "w-full h-full overflow-y-scroll scrollbar-thin scrollbar-track-transparent text-light-text dark:text-dark-text bg-light-bg dark:bg-dark-bg scrollbar-thumb-stone-300 dark:scrollbar-thumb-dark-600 flex flex-col items-center justify-start gap-8"
      }
    >
      <div className="w-full h-[10vh] md:h-[20vh] flex items-center justify-center gap-4 md:gap-8 px-2 md:px-0">
        <ProfilePic
          seed={UID}
          heightBased
          border={
            " border-2 border-light-secondary dark:border-dark-secondary "
          }
        />
        <div className="flex flex-col h-full items-start justify-center gap-0 md:gap-4 py-0 md:py-2">
          <p className="text-titolone">
            {userInfo ? userInfo.userName : "..."}
          </p>
          {currUserSettings != null && currUserSettings.showEmail ? (
            <p className="text-paragraph text-stone-700 dark:text-dark-600 ">
              {userInfo ? userInfo.userEmail : "..."}
            </p>
          ) : personal ? (
            <p className="text-paragraph text-light-text dark:text-dark-text ">
              {userInfo ? "Hidden: " + userInfo.userEmail : "..."}
            </p>
          ) : (
            <></>
          )}
          {personal ? (
            <div className="flex items-center justify-evenly w-fit h-fit gap-4 mt-3">
              <Button
                paddings="py-1 px-3"
                width="w-fit"
                height="h-fit"
                additional="duration-75"
                buttStyle="accent"
                onClick={() => navigate("/profileSettings")}
              >
                <p className="text-paragraph">Profile Settings</p>
              </Button>
              <Button
                paddings="py-1 px-3"
                buttStyle="secondary"
                width="w-fit"
                height="h-fit"
                additional="duration-75 flex flex-row items-center justify-start"
                text="text-base"
                font="font-normal"
                onClick={() => {
                  signOut(auth);
                  // window.location.reload();
                }}
              >
                <p className="text-paragraph">Logout</p>
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
