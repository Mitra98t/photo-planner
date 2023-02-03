import React, { useEffect, useState } from "react";
import "./test.css";
import NavBarHome from "./components/NavBars/NavBarHome";
import { DBManager as db } from "./utils/DBManager";
import PhotoGallery from "./components/PhotoGallery";
import { filterPhoto } from "./utils/utils";

export default function HomePhoto({ close, bounds, selectPhoto }) {
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
    }, []);

    useEffect(() => {
        db.getImgsAtCoords(bounds.ne, bounds.sw).then((v) => {
            setPhotos(v);
            setPhotoToShow(v);
        });
    }, [bounds]);

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
                "w-full h-full relative bg-stone-50 rounded-t-3xl overflow-hidden pt-[10vh] pb-4 "
            }
        >
            <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
                <NavBarHome
                    close={close}
                    options={options}
                    setOptions={setOptions}
                    weatherTags={weatherTags}
                    timeTags={timeTags}
                    periodTags={periodTags}
                />
            </div>
            <div className="w-full h-full overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300 px-8 ">
                <PhotoGallery photoToShow={photoToShow} photoClick={selectPhoto} />
            </div>
        </div>
    );
}
