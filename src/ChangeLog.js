import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icons from "./components/Icons";
import NavBarGeneric from "./components/NavBars/NavBarGeneric";
import { DBManager as db } from "./utils/DBManager";

export default function ChangeLog({ userUID }) {
  const navigate = useNavigate();
  const [changeLogs, setChangeLogs] = useState([]);

  useEffect(() => {
    db.getChangelogComplete().then((r) => {
      setChangeLogs(r);
    });
  }, []);

  return (
    <div className="w-full h-full pt-[10vh] px-8 flex flex-row items-start justify-start text-stone-900 dark:text-stone-50 bg-stone-50 dark:bg-dark-800 ">
      <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
        <NavBarGeneric
          close={() => navigate("/")}
          profileArea={() => navigate(`/profile/${userUID}`)}
          user={userUID}
        />
      </div>
      <div className="flex flex-col items-center justify-start gap-4 w-full h-full overflow-y-scroll pb-8">
        {changeLogs.map((c) => (
          <div
            key={c.ID}
            className="w-full h-fit flex flex-row items-center justify-start"
          >
            <div className="basis-1/4 h-fit p-4 text-xl font-semibold flex flex-row-reverse gap-3 items-center justify-start border-r-2 border-stone-500 dark:border-dark-600 ">
              <p className="h-fit">V. {c.version}</p>
              {c.hasOwnProperty("tags") &&
                c.tags.map((t) => {
                  switch (t.toLowerCase()) {
                    case "wow":
                      return (
                        <Icons
                          styling={{ h: "2rem", w: "auto", strokeWidth: "2px" }}
                          color="stroke-blue-500 dark:stroke-cyan-500"
                          icon="bolt"
                        />
                      );
                    case "milestone":
                      return (
                        <Icons
                          styling={{ h: "2rem", w: "auto", strokeWidth: "2px" }}
                          color="stroke-amber-500 dark:stroke-yellow-500"
                          icon="star"
                        />
                      );

                    default:
                      return <></>;
                  }
                })}
            </div>
            <div className="basis-3/4 h-full p-4 text-lg flex flex-row items-center justify-start">
              {c.log}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
