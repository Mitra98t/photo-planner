import React from "react";

export default function NavBarProfile({ close }) {
    return (
        <div className="w-full h-full rounded-3xl bg-stone-50 flex flex-row-reverse items-center justify-between px-12 ">
            <button
                onClick={close}
                className="rounded-full font-bold text-center text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 px-6 py-4 "
            >
                Close
            </button>
        </div>
    );
}
