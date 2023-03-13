import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import NavBarHome from "./components/NavBars/NavBarHome";
import { DBManager as db } from "./utils/DBManager";

export default function Profile({ close }) {
  const { UID } = useParams();
  const [options, setOptions] = useState({
    weather: "",
    period: {
      from: "",
      to: "",
    },
    time: {
      from: "",
      to: "",
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full pt-[10vh] pb-4">
      <div className="w-full h-[10vh] absolute z-50 inset-0 bg-transparent">
        <NavBarHome close={close} options={options} setOptions={setOptions} />
      </div>
      {UID ? (
        <Outlet context={[options]} />
      ) : (
        <p className="text-5xl p-6 text-stone-900">Missing UserName</p>
      )}
    </div>
  );
}
