import React, { useState } from "react";
import Icons from "./Icons";

export default function DropDownMenu({
    title = "",
    children,
    alwaysOpen = false,
    disabled = false,
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full h-fit flex flex-col items-start justify-start gap-2">
            <div
                className="flex items-center justify-start gap-2  w-full "
                onClick={disabled ? () => {} : () => setIsOpen(() => !isOpen)}
            >
                {alwaysOpen ? (
                    <></>
                ) : isOpen ? (
                    <Icons
                        icon="menuOpen"
                        styling={{
                            w: "1.5rem",
                            h: "auto",
                            strokeWidth: "3px",
                        }}
                    />
                ) : (
                    <Icons
                        icon="menuClose"
                        styling={{
                            w: "1.5rem",
                            h: "auto",
                            strokeWidth: "3px",
                        }}
                    />
                )}
                <p className="text-xl font-bold">{title}</p>
            </div>
            {alwaysOpen || isOpen ? children : <></>}
        </div>
    );
}
