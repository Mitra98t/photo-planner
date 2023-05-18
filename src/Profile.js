import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import NavBarFilters from "./components/NavBars/NavBarFilters";

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
    <div className="w-full h-full pt-[12vh] pb-4 bg-light-bg dark:bg-dark-bg">
      <div className="w-full h-[10vh] absolute z-50 inset-0 bg-transparent">
        <NavBarFilters
          close={close}
          options={options}
          setOptions={setOptions}
        />
      </div>
      {UID ? (
        <Outlet context={[options]} />
      ) : (
        <p className="text-5xl p-6 text-light-text dark:text-dark-text">
          Missing UserName
        </p>
      )}
    </div>
  );
}
