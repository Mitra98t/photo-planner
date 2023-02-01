import React from "react";

export default function Image({ image }) {
    return (
        <>
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 w-full h-full group-hover:opacity-100 transition-all ease-in-out duration-150 p-4 flex flex-col justify-between items-start ">
                <div className="w-full h-fit flex gap-2 items-center">
                    <img
                        src={`https://api.dicebear.com/5.x/lorelei-neutral/svg?seed=${image.authorName}`}
                        alt="avatar"
                        className="w-12 h-auto rounded-full "
                    />
                    <p className="text-3xl text-center text-stone-50">
                        {image.authorName}
                    </p>
                </div>
                <div className="flex flex-col items-start justify-start gap-0.5 text-stone-50 font-semibold whitespace-nowrap">
                    <p>Date: {(image.date + "").substring(0, 15)}</p>
                    <p>Hour: {(image.hour + "").substring(16, 21)}</p>
                    <p>Weather: {image.weather + ""}</p>
                    <p>
                        Position: {(image.position[0] + "").substring(0, 6)},{" "}
                        {(image.position[1] + "").substring(0, 6)}
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
