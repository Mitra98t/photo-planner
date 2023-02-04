import React, { useState } from "react";
import Hashtag from "../Hashtag";
import PopupMenu from "../PopupMenu";
import TimeTagSelector from "../Selectors/TimeTagSelector";
import PeriodTagSelector from "../Selectors/PeriodTagSelector";
import WeatherTagsSelector from "../Selectors/WeatherTagsSelector";
import Icons from "../Icons";

export default function NavBarHome({
    close,
    options,
    setOptions,
    weatherTags,
    timeTags,
    periodTags,
}) {
    const [wichMenu, setWichMenu] = useState("");
    return (
        <div className="w-full h-full rounded-t-3xl bg-stone-50 flex flex-row items-center justify-between px-12 ">
            <div className="w-fit flex items-center justify-start gap-3">
                <button onClick={() => setWichMenu("")}>
                    <Icons
                        icon={"filter"}
                        styling={{
                            w: "2.5rem",
                            h: "auto",
                            strokeWidth: "2px",
                        }}
                    />
                </button>
                <div
                    className="flex flex-col items-start justify-evenly gap-1 cursor-pointer "
                    onClick={() =>
                        setWichMenu(() =>
                            wichMenu !== "weather" ? "weather" : ""
                        )
                    }
                >
                    <p className="text-xl font-bold">Weather</p>
                    <Hashtag
                        label={options.weather === "" ? "Any" : options.weather}
                        text="text-md"
                        onClick={() => {}}
                    />
                </div>
                <div
                    className="flex flex-col items-start justify-evenly gap-1 cursor-pointer"
                    onClick={() =>
                        setWichMenu(() => (wichMenu !== "time" ? "time" : ""))
                    }
                >
                    <p className="text-xl font-bold">Time</p>
                    <Hashtag
                        label={options.time === "" ? "Any" : options.time}
                        text="text-md"
                        onClick={() => {}}
                    />
                </div>
                <div
                    className="flex flex-col items-start justify-evenly gap-1 cursor-pointer"
                    onClick={() =>
                        setWichMenu(() =>
                            wichMenu !== "period" ? "period" : ""
                        )
                    }
                >
                    {" "}
                    <p className="text-xl font-bold">Period </p>
                    <Hashtag
                        label={options.period === "" ? "Any" : options.period}
                        text="text-md"
                        onClick={() => {}}
                    />
                </div>
            </div>
            <PopupMenu hidden={wichMenu === ""} close={() => setWichMenu("")}>
                {wichMenu === "weather" ? (
                    <WeatherTagsSelector
                        options={options}
                        setOptions={setOptions}
                        data={weatherTags}
                    />
                ) : wichMenu === "time" ? (
                    <TimeTagSelector
                        options={options}
                        setOptions={setOptions}
                        data={timeTags}
                    />
                ) : wichMenu === "period" ? (
                    <PeriodTagSelector
                        options={options}
                        setOptions={setOptions}
                        data={periodTags}
                    />
                ) : (
                    <></>
                )}
            </PopupMenu>
            <button
                onClick={close}
                className="rounded-full font-bold text-center text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 px-6 py-4 "
            >
                Close
            </button>
        </div>
    );
}
