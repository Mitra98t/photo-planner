import React from "react";

export default function NavBarMap({ profileArea, searchArea, user }) {
    return (
        <div className="w-full h-full bg-stone-50 rounded-t-3xl flex flex-row items-center justify-between px-12">
            <div className=""></div>
            <button
                onClick={searchArea}
                className="  rounded-full font-bold text-center text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 px-6 py-4 "
            >
                Search Area
            </button>
            <img
                onClick={profileArea}
                src={`https://api.dicebear.com/5.x/shapes/svg?seed=${
                    user && user.userName
                }`}
                alt="avatar"
                className=" w-auto h-3/5 rounded-full outline outline-3 outline-stone-900 cursor-pointer"
            />
        </div>
    );
}
