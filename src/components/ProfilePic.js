import classNames from "classnames";
import React from "react";

export default function ProfilePic({ seed, heightBased = false, border }) {
    return (
        <img
            src={`https://api.dicebear.com/5.x/lorelei-neutral/svg?seed=${seed}`}
            alt="avatar"
            className={
                " rounded-full " +
                classNames(` ${border} `) +
                classNames({
                    " w-full h-auto ": !heightBased,
                    " h-full w-auto ": heightBased,
                })
            }
        />
    );
}
