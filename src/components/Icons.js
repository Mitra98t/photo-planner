import React from "react";

export default function Icons({
    icon,
    color = " stroke-stone-900 ",
    styling = { w: "5rem", h: "auto", strokeWidth: "2px" },
}) {
    const getIcon = (icon) => {
        switch (icon) {
            case "menu":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    ></path>
                );
            case "plus":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m6-6H6"
                    />
                );
            case "menuClose":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 15.75l7.5-7.5 7.5 7.5"
                    />
                );
            case "menuOpen":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                );
            case "upVote":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                );
            case "downVote":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                );

            case "adjustment":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                );
            case "filter":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                    />
                );
            case "hashtag":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
                    />
                );
            case "next":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                );
            case "previous":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                );

            default:
                return (
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    ></path>
                );
        }
    };
    return (
        <div
            style={{
                width: styling.w,
                height: styling.h,
            }}
            className="flex flex-row items-center justify-center"
        >
            <svg
                style={{
                    strokeWidth: styling.strokeWidth,
                }}
                className={" w-full h-full fill-transparent " + color}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                {getIcon(icon)}
            </svg>
        </div>
    );
}
