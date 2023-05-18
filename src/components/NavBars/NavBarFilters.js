import React, { useEffect, useState } from "react";
import PopupMenu from "../PopupMenu";
import Icons from "../Icons";
import { DBManager as db } from "../../utils/DBManager";
import Button from "../../elements/Button";
import { Default } from "../../utils/utils";

export default function NavBarFilters({ close, options, setOptions }) {
  const [wichMenu, setWichMenu] = useState("");
  const [weatherCodes, setWeatherCodes] = useState(null);

  useEffect(() => {
    db.getWeatherCodes().then((c) => setWeatherCodes(c));
  }, []);

  return (
    <div className="w-full h-full rounded-t-3xl text-light-text dark:text-dark-text bg-light-bg dark:bg-dark-bg flex flex-row-reverse items-center justify-between px-3 md:px-12 ">
      <div className="w-full md:w-fit flex items-center justify-start gap-1 divide-x-2 divide-light-secondary dark:divide-dark-secondary">
        <button
          className="h-[70%]"
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
            color={" stroke-light-accent dark:stroke-dark-accent"}
            styling={{
              w: "auto",
              h: "2rem",
              strokeWidth: "2px",
            }}
          />
        </button>
        <div className="flex flex-col items-start justify-between h-full gap-1 cursor-pointer p-2  ">
          <p className="text-title">Weather</p>
          <select
            className="focus:outline-light-secondary dark:focus:outline-dark-secondary text-paragraph rounded-lg bg-light-bg dark:bg-dark-bg w-fit max-w-[20vw] py-2 "
            value={options.weather === "" ? "any" : options.weather}
            onChange={(e) => {
              let oldOptions = { ...options };
              oldOptions.weather = e.target.value;
              setOptions(oldOptions);
            }}
          >
            <option value={""}>Any</option>
            {weatherCodes &&
              Object.keys(weatherCodes).map((section, i) => (
                <optgroup label={section} key={`section-${i}`}>
                  {Object.keys(weatherCodes[section]).map((code, i) => (
                    <option
                      value={weatherCodes[section][code]}
                      key={`code-${i}`}
                    >
                      {weatherCodes[section][code]}
                    </option>
                  ))}
                </optgroup>
              ))}
            <option></option>
          </select>
        </div>
        <div
          className="flex flex-col items-start justify-between h-full gap-1 cursor-pointer relative p-2 "
          onClick={() => setWichMenu(() => "time")}
        >
          <p className="text-title">Time</p>
          <p className="text-paragraph">
            From {options.time.from === "" ? "any" : options.time.from} to{" "}
            {options.time.to === "" ? "any" : options.time.to}
          </p>
          <PopupMenu hidden={wichMenu !== "time"} close={() => setWichMenu("")}>
            <div className="w-full h-fit pr-6">
              <div className=" w-full h-fit flex flex-row gap-3 items-center justify-between whitespace-nowrap text-light-text dark:text-dark-text">
                <p className="">From:</p>
                <input
                  onChange={(e) => {
                    let oldOpt = { ...options };
                    oldOpt.time.from = e.target.value;
                    setOptions(oldOpt);
                  }}
                  type={"time"}
                  value={options.time.from}
                  className={
                    "focus:outline-light-secondary dark:focus:outline-dark-secondary bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text  p-3"
                  }
                />
              </div>
              <div className=" w-full h-fit flex flex-row gap-3 items-center justify-between whitespace-nowrap text-light-text dark:text-dark-text">
                <p className="">To:</p>
                <input
                  onChange={(e) => {
                    let oldOpt = { ...options };
                    oldOpt.time.to = e.target.value;
                    setOptions(oldOpt);
                  }}
                  type={"time"}
                  value={options.time.to}
                  className={
                    "focus:outline-light-secondary dark:focus:outline-dark-secondary bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text  p-3"
                  }
                />
              </div>
            </div>
          </PopupMenu>
        </div>
        <div
          className="flex flex-col items-start justify-between h-full gap-1 cursor-pointer relative p-2"
          onClick={() => setWichMenu(() => "period")}
        >
          <p className="text-title">Period</p>
          <p className="text-paragraph">
            From {options.period.from === "" ? "any" : options.period.from} to{" "}
            {options.period.to === "" ? "any" : options.period.to}
          </p>
          <PopupMenu
            hidden={wichMenu !== "period"}
            close={() => setWichMenu("")}
          >
            <div className="w-full h-fit ">
              <div className="w-full h-fit flex flex-row gap-3 items-center justify-between whitespace-nowrap text-light-text dark:text-dark-text">
                <p>From:</p>
                <input
                  onChange={(e) => {
                    let oldOpt = { ...options };
                    oldOpt.period.from = e.target.value;
                    setOptions(oldOpt);
                  }}
                  type={"date"}
                  value={options.period.from}
                  className={
                    "focus:outline-light-secondary dark:focus:outline-dark-secondary bg-light-bg dark:bg-dark-bg p-3"
                  }
                />
              </div>
              <div className="w-full h-fit flex flex-row gap-1 items-center justify-between whitespace-nowrap text-light-text dark:text-dark-text">
                <p>To:</p>
                <input
                  onChange={(e) => {
                    let oldOpt = { ...options };
                    oldOpt.period.to = e.target.value;
                    setOptions(oldOpt);
                  }}
                  type={"date"}
                  value={options.period.to}
                  className={
                    "focus:outline-light-secondary dark:focus:outline-dark-secondary bg-light-bg dark:bg-dark-bg p-3"
                  }
                />
              </div>
            </div>
          </PopupMenu>
        </div>
      </div>
      <div className="w-fit h-full flex flex-row items-center justify-end gap-8">
        <Default>
          <Button
            onClick={close}
            height="h-[70%]"
            hover="outline-[6px]"
            buttStyle="secondary"
          >
            Close
          </Button>
        </Default>
      </div>
    </div>
  );
}
