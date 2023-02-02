import React from "react";
import NavBarProfile from "./components/NavBars/NavBarProfile";

export default function Profile({ user, close }) {
    return (
        <div className="w-full h-full pt-[12vh] flex flex-col items-center justify-start gap-4">
            <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
                <NavBarProfile close={close} />
            </div>
        </div>
    );
}
