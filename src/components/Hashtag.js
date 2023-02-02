import classNames from "classnames";
import React from "react";
import Icons from "./Icons";

export default function Hashtag({
    label,
    ghost = false,
    onClick,
    text = "text-lg",
}) {
    return (
        <div
            onClick={onClick}
            className={
                "  font-bold px-3 rounded-full cursor-pointer select-none whitespace-nowrap bg-stone-300 flex items-center justify-start " +
                text +
                classNames({
                    " text-stone-800 ": !ghost,
                    " text-stone-600 ": ghost,
                }) +
                classNames({
                    " w-20 flex ": label === "",
                    " w-fit ": label !== "",
                })
            }
        >
            <Icons
                icon="hashtag"
                color={classNames({
                    " stroke-stone-800 ": !ghost,
                    " stroke-stone-700 ": ghost,
                })}
                styling={{ w: "1rem", h: "auto", strokeWidth: "3px" }}
            />{" "}
            <p>{label}</p>
        </div>
    );
}
