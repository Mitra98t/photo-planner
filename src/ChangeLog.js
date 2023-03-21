import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarGeneric from "./components/NavBars/NavBarGeneric";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
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
      <div className="flex flex-col items-center justify-start gap-4 w-full h-full">
        {changeLogs.map((c) => (
          <div
            key={c.ID}
            className="w-full h-fit flex flex-row items-start justify-start  divide-x-2 divide-stone-500 dark:divide-dark-600"
          >
            <div className="basis-1/4 h-fit text-right p-4 text-xl font-semibold">
              V. {c.version}
            </div>
            <div className="basis-3/4 h-fit p-4 text-lg">{c.log}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
