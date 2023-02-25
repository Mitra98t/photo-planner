import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import NavBarHome from "./components/NavBars/NavBarHome";
import { DBManager as db } from "./utils/DBManager";

export default function Profile({ close }) {
    const { userName } = useParams();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full h-full pt-[10vh] pb-4">
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
            {userName ? (
                <Outlet
                    context={[options, weatherTags, timeTags, periodTags]}
                />
            ) : (
                <p className="text-5xl p-6 text-stone-900">Missing UserName</p>
            )}
        </div>
    );
}
