import React, { useEffect, useState } from "react";
import Button from "./elements/Button";
import Toggle from "./elements/Toggle";
import { DBManager as db } from "./utils/DBManager";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Icons from "./components/Icons";
import { useNavigate } from "react-router-dom";
import NavBarGeneric from "./components/NavBars/NavBarGeneric";

export default function ProfileSettings({ userUID, settings, setSettings }) {
  const navigate = useNavigate();
  const [currSettings, setCurrSettings] = useState({
    monochromaticMaps: false,
    showEmail: false,
    theme: "light",
  });

  useEffect(() => {
    if (settings == null) return;
    let newSett = { ...currSettings };
    for (const key in newSett) {
      if (settings.hasOwnProperty(key)) {
        newSett[key] = settings[key];
      }
    }
    setCurrSettings(newSett);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.addSettingsToUID(userUID, currSettings);
    localStorage.setItem("profileSettingsCache", JSON.stringify(currSettings));
    toast("Settings saved!");
    setSettings(currSettings);
  };

  const handleThemeSwitch = () => {
    let oldCurrSettings = { ...currSettings };
    oldCurrSettings.theme =
      oldCurrSettings.theme === "light" ? "dark" : "light";
    setCurrSettings(oldCurrSettings);
  };

  return (
    <div className="w-full h-full pt-[10vh] px-8 flex flex-row items-start justify-start text-stone-900 dark:text-stone-50 bg-stone-50 dark:bg-dark-800 ">
      <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
        <NavBarGeneric
          close={() => navigate("/")}
          profileArea={() => navigate(`/profile/${userUID}`)}
          user={userUID}
        />
      </div>
      <div className="flex-1 flex flex-col items-start justify-start gap-4">
        {currSettings &&
          Object.keys(currSettings)
            .sort((a, b) => a - b)
            .map((s) => {
              switch (s) {
                case "theme":
                  return (
                    <div
                      className="flex flex-row items-center justify-start gap-2"
                      key={s}
                    >
                      <span className="text-xl font-semibold ">{s}: </span>
                      <button
                        onClick={handleThemeSwitch}
                        className="focus:scale-110 hover:scale-110 focus:outline-none"
                      >
                        <Icons
                          icon={
                            currSettings && currSettings.theme === "light"
                              ? "sun"
                              : "moon"
                          }
                          color={" stroke-stone-900 dark:stroke-stone-50 "}
                          styling={{
                            w: "3rem",
                            strokeWidth: "1.5px",
                          }}
                        />
                      </button>
                    </div>
                  );

                default:
                  return (
                    <div
                      className="flex flex-row items-center justify-start gap-2"
                      key={s}
                    >
                      <span className="text-xl font-semibold ">{s}: </span>
                      <Toggle
                        width="w-10"
                        height="h-6"
                        toggle={currSettings[s]}
                        onClick={() => {
                          let oldSettings = { ...currSettings };
                          oldSettings[s] = !oldSettings[s];
                          setCurrSettings(oldSettings);
                        }}
                      />
                    </div>
                  );
              }
            })}
        <Button
          type="submit"
          paddings="px-4 py-2"
          width="w-fit"
          height="h-fit"
          text="text-xl"
          onClick={handleSubmit}
        >
          Save
        </Button>
        <p className="text-paragraph italic">
          Monochromatic Maps doesn't work on Safari
        </p>
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar={false}
          limit={1}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={currSettings.theme}
        />
      </div>
    </div>
  );
}
