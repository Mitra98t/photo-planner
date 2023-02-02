import React from "react";
import { formatDayIndexToDate, formatMinutesToTime } from "../utils/utils";
import Voting from "./Voting";

export default function Image({ image }) {
    return (
        <>
            <div
                className="absolute inset-0 bg-black bg-opacity-50 opacity-0 w-full h-full group-hover:opacity-100 group-focus:opacity-100 transition-all ease-in-out duration-150 p-4 flex flex-col justify-between items-start "
                onClick={() => console.log(image.id)}
            >
                <div className="w-full h-fit flex justify-between items-start">
                    <div className="w-fit h-fit flex gap-2 items-center justify-start">
                        <img
                            src={`https://api.dicebear.com/5.x/shapes/svg?seed=${image.authorName}`}
                            alt="avatar"
                            className="w-12 h-auto rounded-full border-2 border-stone-50"
                        />
                        <p className="text-xl text-center text-stone-50 whitespace-nowrap">
                            {image.authorName}
                        </p>
                    </div>
                    <Voting
                        votes={image.votes}
                        upVote={() => {}}
                        downVote={() => {}}
                    />
                </div>
                <div className="flex flex-col items-start justify-start gap-0.5 text-stone-50 font-semibold whitespace-nowrap">
                    <p>Date: {formatDayIndexToDate(image.date)}</p>
                    <p>Hour: {formatMinutesToTime(image.hour)}</p>
                    <p>Weather: {image.weather}</p>
                    <p>
                        Position: {image.position[0]}, {image.position[1]}
                    </p>
                </div>
            </div>
            <img
                src={image.img}
                alt="random img"
                className={" max-h-full min-w-full object-cover align-bottom "}
            />
        </>
    );
}
