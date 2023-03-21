import React, { useEffect, useState } from "react";
import Button from "./elements/Button";
import Toggle from "./elements/Toggle";
import { DBManager as db } from "./utils/DBManager";

export default function ProfileSettings({ userUID }) {
  const [settings, setSettings] = useState({
    monochromaticMaps: false,
    showEmail: false,
  });

  useEffect(() => {
    db.getSettingsByUID(userUID).then((r) => {
      console.log(r);
      setSettings(r);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.addSettingsToUID(userUID, settings);
  };

  return (
    <div className="w-full h-full p-8 flex flex-row items-start justify-start text-stone-900 ">
      <div className="flex-1 flex flex-col items-start justify-start gap-4">
        {Object.keys(settings).map((s) => (
          <div
            className="flex flex-row items-center justify-start gap-2"
            key={s}
          >
            <span className="text-xl font-semibold ">{s}: </span>
            <Toggle
              width="w-10"
              height="h-6"
              toggle={settings[s]}
              onClick={() => {
                let oldSettings = { ...settings };
                oldSettings[s] = !oldSettings[s];
                setSettings(oldSettings);
              }}
            />
          </div>
        ))}
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
