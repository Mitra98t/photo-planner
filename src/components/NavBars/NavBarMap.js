import React from "react";

export default function NavBarMap({ searchArea }) {
    return (
        <div className="w-full h-full bg-stone-50 rounded-t-3xl flex flex-row items-center justify-evenly px-12">
            <button
                onClick={searchArea}
                className="rounded-full font-bold text-center text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 px-6 py-4 "
            >
                Search Area
            </button>
        </div>
    );
}
