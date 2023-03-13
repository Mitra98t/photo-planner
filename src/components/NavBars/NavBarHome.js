import React, { useEffect, useState } from "react";
import Hashtag from "../Hashtag";
import PopupMenu from "../PopupMenu";
import TimeTagSelector from "../Selectors/TimeTagSelector";
import PeriodTagSelector from "../Selectors/PeriodTagSelector";
import WeatherTagsSelector from "../Selectors/WeatherTagsSelector";
import Icons from "../Icons";
import { DBManager as db } from "../../utils/DBManager";

export default function NavBarHome({ close, options, setOptions }) {
  const [wichMenu, setWichMenu] = useState("");
  const [weatherCodes, setWeatherCodes] = useState(null);

  useEffect(() => {
    db.getWeatherCodes().then((c) => setWeatherCodes(c));
  }, []);

  return (
    <div className="w-full h-full rounded-t-3xl bg-stone-50 flex flex-row items-center justify-between px-12 ">
      <div className="w-fit flex items-center justify-start gap-1 divide-x-2">
        <button
          onClick={() =>
            setOptions({
              weather: "",
              period: {
                from: "",
                to: "",
              },
              time: {
                from: "",
                to: "",
              },
            })
          }
        >
          <Icons
            icon={"filter"}
            styling={{
              w: "2.5rem",
              h: "auto",
              strokeWidth: "2px",
            }}
          />
        </button>
        <div className="flex flex-col items-start justify-evenly gap-1 cursor-pointer p-2 ">
          <p className="text-xl font-bold">Weather</p>
          {/* <Hashtag
            label={options.weather === "" ? "Any" : options.weather}
            text="text-md"
            onClick={() => {}}
          /> */}
          <select
            className="focus:outline-stone-900 rounded-lg bg-stone-50 text-stone-900 w-fit px-2 py-1 "
            value={options.weather === "" ? "any" : options.weather}
            onChange={(e) => {
              let oldOptions = { ...options };
              oldOptions.weather = e.target.value;
              setOptions(oldOptions);
            }}
          >
            <option value={"any"}>Any</option>
            {weatherCodes &&
              Object.keys(weatherCodes).map((section) => (
                <optgroup label={section}>
                  {Object.keys(weatherCodes[section]).map((code) => (
                    <option value={weatherCodes[section][code]}>
                      {weatherCodes[section][code]}
                    </option>
                  ))}
                </optgroup>
              ))}
            <option></option>
          </select>
        </div>
        <div
          className="flex flex-col items-start justify-evenly gap-1 cursor-pointer relative p-2 "
          onClick={() => setWichMenu(() => "time")}
        >
          <p className="text-xl font-bold">Time</p>
          <p>
            From {options.time.from === "" ? "any" : options.time.from} to{" "}
            {options.time.to === "" ? "any" : options.time.to}
          </p>
          <PopupMenu hidden={wichMenu !== "time"} close={() => setWichMenu("")}>
            <div className="w-full h-fit pr-6">
              <div className="w-full h-fit flex flex-row items-center justify-between whitespace-nowrap">
                <p>From:</p>
                <input
                  onChange={(e) => {
                    let oldOpt = { ...options };
                    oldOpt.time.from = e.target.value;
                    setOptions(oldOpt);
                  }}
                  type={"time"}
                  value={options.time.from}
                  className={"bg-stone-50 p-3"}
                />
              </div>
              <div className="w-full h-fit flex flex-row items-center justify-between whitespace-nowrap">
                <p>To:</p>
                <input
                  onChange={(e) => {
                    let oldOpt = { ...options };
                    oldOpt.time.to = e.target.value;
                    setOptions(oldOpt);
                  }}
                  type={"time"}
                  value={options.time.to}
                  className={"bg-stone-50 p-3"}
                />
              </div>
            </div>
          </PopupMenu>
        </div>
        <div
          className="flex flex-col items-start justify-evenly gap-1 cursor-pointer p-2"
          onClick={() => setWichMenu(() => "period")}
        >
          <p className="text-xl font-bold">Period</p>
          <p>
            From {options.period.from === "" ? "any" : options.period.from} to{" "}
            {options.period.to === "" ? "any" : options.period.to}
          </p>
          <PopupMenu
            hidden={wichMenu !== "period"}
            close={() => setWichMenu("")}
          >
            <div className="w-full h-fit ">
              <div className="w-full h-fit flex flex-row items-center justify-between whitespace-nowrap">
                <p>From:</p>
                <input
                  onChange={(e) => {
                    let oldOpt = { ...options };
                    oldOpt.period.from = e.target.value;
                    setOptions(oldOpt);
                  }}
                  type={"date"}
                  value={options.period.from}
                  className={"bg-stone-50 p-3"}
                />
              </div>
              <div className="w-full h-fit flex flex-row items-center justify-between whitespace-nowrap">
                <p>To:</p>
                <input
                  onChange={(e) => {
                    let oldOpt = { ...options };
                    oldOpt.period.to = e.target.value;
                    setOptions(oldOpt);
                  }}
                  type={"date"}
                  value={options.period.to}
                  className={"bg-stone-50 p-3"}
                />
              </div>
            </div>
          </PopupMenu>
        </div>
      </div>
      <button
        onClick={close}
        className="rounded-full font-bold text-center text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 px-6 py-4 "
      >
        Close
      </button>
    </div>
  );
}
