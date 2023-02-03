import React from "react";
import { formatDayIndexToDate, formatMinutesToTime } from "../utils/utils";
import Image from "./Image";
import ProfilePic from "./ProfilePic";

export default function PictureView({ picture, close }) {
    return (
        <div
            className="w-full h-screen bg-black bg-opacity-50 absolute inset-0 z-[50] flex flex-row items-center justify-center text-stone-900"
            onClick={close}
        >
            <div className="w-[80vw] h-[80vh] z-[51] bg-stone-50 rounded-3xl flex flex-row items-center justify-evenly overflow-hidden shadow-area">
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
                    <div
                        className="flex items-center justify-start gap-2 h-[10%] cursor-pointer"
                        onClick={() =>
                            console.log(
                                "navigate to profile " + picture.authorName
                            )
                        }
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
                    <div className="flex flex-col items-start justify-start gap-0.5 text-xl px-4 border-l-2 border-stone-600">
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
