import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DBManager as db } from "../utils/DBManager";
import { filterPhoto } from "../utils/utils";
import PhotoGallery from "./PhotoGallery";
import ProfilePic from "./ProfilePic";

export default function ProfileView({ user, selectPhoto }) {
    const { userName } = useParams();
    const navigate = useNavigate();
    const [options, weatherTags, timeTags, periodTags] = useOutletContext();
    const [userInfo, setUserInfo] = useState(null);
    const [photos, setPhotos] = useState(null);
    const [photoToShow, setPhotoToShow] = useState(null);
    const [personal, setPersonal] = useState(false);

    useEffect(() => {
        db.getUserInformationByUserName(userName).then((v) => setUserInfo(v));
        db.getImagesByUserName(userName).then((v) => {
            setPhotos(v);
            setPhotoToShow(v);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName]);

    useEffect(() => {
        if (user == null) return;
        if (user.userName === userName) {
            setPersonal(true);
        }
    }, [user, userName]);

    useEffect(() => {
        if (photos != null) {
            let pht = [...photos];

            pht = pht.filter((p) =>
                filterPhoto(p, options, timeTags, periodTags, weatherTags)
            );
            setPhotoToShow(pht);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    return (
        <div
            className={
                "w-full h-full overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300 flex flex-col items-center justify-start gap-8"
            }
        >
            <div className="w-full h-1/4 flex items-center justify-center gap-8">
                <ProfilePic
                    seed={userName}
                    heightBased
                    border={" border-2 border-stone-900 "}
                />
                <div className="flex flex-col items-end justify-evenlty">
                    <p className="text-4xl font-semibold text-stone-900 ">
                        {userInfo && userInfo.userName}
                    </p>
                    <p className="text-xl text-stone-700 ">
                        {userInfo && userInfo.userEmail}
                    </p>
                </div>
            </div>
            <div className="w-full h-fit px-8">
                <PhotoGallery
                    hideAuthor
                    photoToShow={photoToShow}
                    photoClick={selectPhoto}
                />
            </div>
        </div>
    );
}
