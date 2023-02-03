import classNames from "classnames";
import React from "react";
import Icons from "./Icons";

export default function Voting({ votes, upVote, downVote, dark = false }) {
    return (
        <div className="w-fit h-fit flex flex-col items-center justify-evenly">
            <button onClick={upVote}>
                <Icons
                    icon={"upVote"}
                    styling={{ w: "2rem", h: "auto", strokeWidth: "2.5px" }}
                    color={classNames({
                        " stroke-stone-50 ": !dark,
                        " stroke-stone-900 ": dark,
                    })}
                />
            </button>
            <p
                className={
                    classNames({
                        " text-stone-50 ": !dark,
                        " text-stone-900 ": dark,
                    }) + " font-semibold text-lg "
                }
            >
                {votes}
            </p>
            <button onClick={downVote}>
                <Icons
                    icon={"downVote"}
                    styling={{ w: "2rem", h: "auto", strokeWidth: "2.5px" }}
                    color={classNames({
                        " stroke-stone-50 ": !dark,
                        " stroke-stone-900 ": dark,
                    })}
                />
            </button>
        </div>
    );
}
