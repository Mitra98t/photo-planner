import React from "react";

export default function PopupMenu({ hidden, children }) {
    return hidden ? (
        <></>
    ) : (
        <div className="absolute top-20 bg-stone-50 rounded-3xl z-40 shadow-area overflow-hidden">
            <div className=" flex flex-col gap-2 w-fit max-h-[40vh] overflow-y-scroll h-fit p-4 text-stone-900 scrollbar-thumb-stone-300 scrollbar-track-transparent scrollbar-thin ">
                {children}
            </div>
        </div>
    );
}
