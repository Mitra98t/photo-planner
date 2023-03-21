import React, { useEffect, useState } from "react";
import ThemeSelector from "./components/ThemeSelector";
import Button from "./elements/Button";
import Toggle from "./elements/Toggle";
import { DBManager as db } from "./utils/DBManager";

export default function ProfileSettings({ userUID, settings, setSettings }) {
  const [currSettings, setCurrSettings] = useState({
    monochromaticMaps: false,
    showEmail: false,
    theme: "light",
  });

  // useEffect(() => {
  //   db.getSettingsByUID(userUID).then((r) => {
  //     console.log(r);
  //     setCurrSettings(r);
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
    setSettings(currSettings);
  };

  return (
    <div className="w-full h-full p-8 flex flex-row items-start justify-start text-stone-900 dark:text-stone-50 bg-stone-50 dark:bg-dark-800 ">
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
                      <ThemeSelector />
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
      </div>
    </div>
  );
}
