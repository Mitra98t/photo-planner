import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { DBManager as db } from "../utils/DBManager";
import Icons from "./Icons";

export default function Voting({
  userUID,
  photoID,
  dark = false,
  disable = false,
}) {
  const [votesData, setVotesData] = useState(null);

  useEffect(() => {
    db.getVotersByPhotoID(photoID)
      .then((r) => {
        setVotesData(r);
      })
      .catch((e) => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vote = (vote, userUID, photoID) => {
    db.addVote(vote, userUID, photoID).then((r) => setVotesData(r));
  };

  return (
    <div className="w-fit h-fit flex flex-col items-center justify-evenly">
      <button disabled={disable} onClick={() => vote(1, userUID, photoID)}>
        <Icons
          icon={"upVote"}
          styling={{ w: "2rem", h: "auto", strokeWidth: "2.5px" }}
          color={
            votesData != null &&
            votesData.upVoters.length !== 0 &&
            votesData.upVoters.indexOf(userUID) !== -1
              ? " stroke-light-accent dark:stroke-dark-accent "
              : dark
              ? " stroke-light-text dark:stroke-dark-text "
              : " stroke-dark-text "
          }
        />
      </button>
      <p
        className={
          classNames({
            " text-dark-text ": !dark,
            " text-light-text dark:text-dark-text ": dark,
          }) + " font-semibold text-lg "
        }
      >
        {votesData == null
          ? 0
          : votesData.upVoters.length - votesData.downVoters.length}
      </p>
      <button disabled={disable} onClick={() => vote(-1, userUID, photoID)}>
        <Icons
          icon={"downVote"}
          styling={{ w: "2rem", h: "auto", strokeWidth: "2.5px" }}
          color={
            votesData != null &&
            votesData.downVoters.length !== 0 &&
            votesData.downVoters.indexOf(userUID) !== -1
              ? " stroke-light-accent dark:stroke-dark-accent "
              : dark
              ? " stroke-light-text dark:stroke-dark-text "
              : " stroke-dark-text "
          }
        />
      </button>
    </div>
  );
}
