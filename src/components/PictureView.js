import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatDayIndexToDate, formatMinutesToTime } from "../utils/utils";
import ProfilePic from "./ProfilePic";
import Voting from "./Voting";

export default function PictureView({ picture, close }) {
    const main = useRef(null);
    const navigate = useNavigate();

    const handleClickOutside = (e) => {
        e.preventDefault();
        if (main.current != null && !main.current.contains(e.target)) close();
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full h-screen bg-black bg-opacity-50 absolute inset-0 z-[300] flex flex-row items-center justify-center text-stone-900">
            <div
                ref={main}
                className="w-[80vw] h-[80vh] z-[51] bg-stone-50 rounded-3xl flex flex-row items-center justify-evenly overflow-hidden shadow-area"
            >
                <div className=" w-[70%] h-full  whitespace-nowrap p-8 flex items-center justify-center">
                    <div className="w-fit h-full ">
                        <img
                            src={picture.img}
                            alt="random img"
                            style={{
                                filter: "drop-shadow(-5px 5px 10px #00000080)",
                            }}
                            className={"h-full object-contain"}
                        />
                    </div>
                </div>
                <div className="flex-grow h-full whitespace-nowrap py-8 flex flex-col items-start justify-start gap-4">
                    <div className="w-full h-[10%] flex items-center justify-start gap-4">
                        <Voting
                            dark
                            votes={picture.votes}
                            upVote={() => {}}
                            downVote={() => {}}
                        />
                        <div
                            className="flex items-center justify-start gap-2 h-full cursor-pointer"
                            onClick={() => {
                                close();
                                navigate(`/profile/${picture.authorName}`);
                            }}
                        >
                            <ProfilePic
                                seed={picture.authorName}
                                heightBased
                                border={" border-[3px] border-stone-900"}
                            />
                            <p className="text-3xl font-semibold">
                                {picture.authorName}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-0.5 text-xl mx-2 px-2 border-l-2 border-stone-600">
                        <p>Date: {formatDayIndexToDate(picture.date)}</p>
                        <p>Hour: {formatMinutesToTime(picture.hour)}</p>
                        <p>Weather: {picture.weather}</p>
                        <p>
                            Position: {picture.position[0]},{" "}
                            {picture.position[1]}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
