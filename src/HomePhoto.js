import React, { useEffect, useState } from "react";
import "./test.css";
import NavBarHome from "./components/NavBars/NavBarHome";
import { DBManager as db } from "./utils/DBManager";
import Image from "./components/Image";

export default function HomePhoto({ close, bounds }) {
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

            pht = pht.filter((p) => {
                let weatherCheck =
                    options.weather === "" ||
                    p.weather.toLowerCase() === options.weather.toLowerCase();
                let timeCheck =
                    options.time === "" ||
                    (timeTags[options.time][0] > timeTags[options.time][1] &&
                        (p.hour > timeTags[options.time][0] ||
                            p.hour <= timeTags[options.time][1])) ||
                    (p.hour > timeTags[options.time][0] &&
                        p.hour <= timeTags[options.time][1]);
                let periodCheck =
                    options.period === "" ||
                    (periodTags[options.period][0] >
                        periodTags[options.period][1] &&
                        (p.date > periodTags[options.period][0] ||
                            p.date <= periodTags[options.period][1])) ||
                    (p.date > periodTags[options.period][0] &&
                        p.date <= periodTags[options.period][1]);

                return weatherCheck && timeCheck && periodCheck;
            });
            setPhotoToShow(pht);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    return (
        <div
            className={
                "w-full h-full relative bg-stone-50 rounded-t-3xl overflow-hidden pt-[10vh]"
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
            <ul className="w-full h-full overflow-y-scroll flex justify-center flex-wrap gap-2 px-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300">
                {photoToShow &&
                    photoToShow
                        .sort((a, b) => b.votes - a.votes)
                        .map((p) => (
                            <li
                                key={p.id}
                                className="h-[40vh] flex-grow overflow-hidden group relative rounded-2xl"
                            >
                                <Image image={p} />
                            </li>
                        ))}
                <li className="flex-grow-[10]"></li>
            </ul>
        </div>
    );
}
