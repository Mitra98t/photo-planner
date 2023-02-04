import React, { useEffect, useState } from "react";
import NavBarHome from "./components/NavBars/NavBarHome";
import PhotoGallery from "./components/PhotoGallery";
import ProfilePic from "./components/ProfilePic";
import { DBManager as db } from "./utils/DBManager";
import { filterPhoto } from "./utils/utils";

export default function Profile({ user, close, selectPhoto }) {
    const [photos, setPhotos] = useState(null);
    const [photoToShow, setPhotoToShow] = useState(null);
    const [options, setOptions] = useState({
        weather: "",
        period: "",
        time: "",
    });
    const [periodTags, setPeriodTags] = useState(null);
    const [weatherTags, setWeatherTags] = useState(null);
    const [timeTags, setTimeTags] = useState(null);

    useEffect(() => {
        db.getTimes().then((v) => setTimeTags(v));
        db.getWeatherCodes().then((v) => setWeatherTags(v));
        db.getPeriod().then((v) => setPeriodTags(v));

        db.getImagesByUid(user.userId).then((v) => {
            setPhotos(v);
            setPhotoToShow(v);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        <div className="w-full h-full pt-[10vh] flex flex-col items-center justify-start gap-4 overflow-y-scroll pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300">
            <div className="w-full h-[10vh] absolute z-50 inset-0 bg-transparent">
                <NavBarHome
                    close={close}
                    options={options}
                    setOptions={setOptions}
                    weatherTags={weatherTags}
                    timeTags={timeTags}
                    periodTags={periodTags}
                />
            </div>
            <div className="w-full h-1/3 flex items-center justify-center gap-8">
                <ProfilePic
                    seed={user ? user.username : ""}
                    heightBased
                    border={" border-2 border-stone-900 "}
                />
                <div className="flex flex-col items-end justify-evenlty">
                    <p className="text-4xl font-semibold text-stone-900 ">
                        {user && user.userName}
                    </p>
                    <p className="text-xl text-stone-700 ">
                        {user && user.userEmail}
                    </p>
                </div>
            </div>
            <div className="w-full h-fit px-8">
                <PhotoGallery
                    personal
                    photoToShow={photoToShow}
                    photoClick={selectPhoto}
                />
            </div>
        </div>
    );
}
