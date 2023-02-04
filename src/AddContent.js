import React from "react";
import NavBarMap from "./components/NavBars/NavBarMap";

export default function AddContent() {
    return (
        <div className="w-full h-full relative bg-stone-50 rounded-t-3xl overflow-hidden pt-[10vh] pb-4 ">
            <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
                {/* <NavBarHome close={() => {}} /> */}
                <NavBarMap />
            </div>
        </div>
    );
}
