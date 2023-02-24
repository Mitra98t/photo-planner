import React, { useState } from "react";
import Hashtag from "./components/Hashtag";
import Icons from "./components/Icons";
import NavBarMap from "./components/NavBars/NavBarMap";

export default function AddContent() {
    const [photos, setPhotos] = useState({});

    return (
        <div className="w-full h-full relative bg-stone-50 rounded-t-3xl overflow-hidden pt-[10vh] pb-4 ">
            <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
                {/* <NavBarHome close={() => {}} /> */}
                <NavBarMap />
            </div>
            <div className="w-full h-full flex flex-col items-center justify-start gap-10 px-8 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300">
                <form
                    onSubmit={() => console.log("submitted")}
                    className="w-full h-fit flex sticky inset-0 bg-stone-50 p-4"
                >
                    <input
                        type={"file"}
                        accept=".jpg, .png, .heif, .heic"
                        onChange={(e) => {
                            let oldPhotos = { ...photos };
                            oldPhotos[e.target.files[0].name] = {
                                URL: URL.createObjectURL(e.target.files[0]),
                                file: e.target.files[0],
                                visible: true,
                            };
                            setPhotos(oldPhotos);
                        }}
                    ></input>
                </form>
                {Object.keys(photos).map((pk, i) => {
                    return (
                        <div
                            key={pk}
                            className="w-full h-fit grid grid-cols-2 relative pt-[5vh]"
                        >
                            <div className="absolute inset-0 h-[5vh] w-full bg-stone-50 z-[100] flex items-center justify-start">
                                <button
                                    onClick={() => {
                                        let oldPhotos = { ...photos };
                                        oldPhotos[pk].visible =
                                            !oldPhotos[pk].visible;
                                        setPhotos(oldPhotos);
                                    }}
                                    className="w-fit h-full"
                                >
                                    <Icons
                                        icon={
                                            photos[pk].visible
                                                ? "menuOpen"
                                                : "menuClose"
                                        }
                                        styling={{
                                            w: "auto",
                                            h: "100%",
                                            strokeWidth: "2px",
                                        }}
                                    />
                                </button>
                                <p>{photos[pk].file.name}</p>
                            </div>
                            {photos[pk].visible ? (
                                <>
                                    <div className="w-full h-full flex items-center justify-center">
                                        <img
                                            src={photos[pk].URL}
                                            alt={"added" + i}
                                            className={
                                                "h-[40vh] w-auto object-fit"
                                            }
                                        />
                                    </div>
                                    <div className="w-full h-full flex flex-row items-center justify-start flex-wrap gap-8">
                                        <Hashtag
                                            onClick={() => {
                                                let oldPhotos = { ...photos };
                                                oldPhotos[pk]["weather"] =
                                                    "weather good";
                                                setPhotos(oldPhotos);
                                            }}
                                            label={"weather"}
                                        />
                                        <Hashtag
                                            onClick={() => {
                                                let oldPhotos = { ...photos };
                                                oldPhotos[pk]["time"] =
                                                    "time good";
                                                setPhotos(oldPhotos);
                                            }}
                                            label={"time"}
                                        />
                                        <Hashtag
                                            onClick={() => {
                                                let oldPhotos = { ...photos };
                                                oldPhotos[pk]["date"] =
                                                    "date good";
                                                setPhotos(oldPhotos);
                                            }}
                                            label={"date"}
                                        />
                                        {Object.keys(photos[pk]).map((d, i) =>
                                            ![
                                                "file",
                                                "visible",
                                                "URL",
                                            ].includes(d) ? (
                                                <p key={i}>
                                                    {d}: {photos[pk][d]}
                                                </p>
                                            ) : (
                                                <></>
                                            )
                                        )}{" "}
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
