import classNames from "classnames";
import React from "react";
import { formatStyle } from "../utils/utils";

export default function ProfilePic({ seed, heightBased = false, border }) {
  return (
    <img
      src={`https://api.dicebear.com/5.x/thumbs/svg?seed=${seed}`}
      alt="avatar"
      className={formatStyle([
        " rounded-full object-cover ",
        border,
        classNames({
          " w-full h-auto ": !heightBased,
          " h-full w-auto ": heightBased,
        }),
      ])}
    />
  );
}
