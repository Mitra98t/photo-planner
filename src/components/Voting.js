import React from "react";
import Icons from "./Icons";

export default function Voting({ votes, upVote, downVote }) {
    return (
        <div className="w-fit h-fit flex flex-col items-center justify-evenly">
            <button onClick={upVote} >
                <Icons
                    icon={"upVote"}
                    styling={{ w: "2rem", h: "auto", strokeWidth: "2.5px" }}
                    color={"stroke-stone-50"}
                />
            </button>
            <p className="text-stone-50 font-semibold text-lg ">{votes}</p>
            <button onClick={downVote} >
                <Icons
                    icon={"downVote"}
                    styling={{ w: "2rem", h: "auto", strokeWidth: "2.5px" }}
                    color={"stroke-stone-50"}
                />
            </button>
        </div>
    );
}
