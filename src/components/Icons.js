import React from "react";
import PropTypes from "prop-types";

export default function Icons({
    icon,
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
        <svg
            style={{
                width: styling.w,
                height: styling.h,
                strokeWidth: styling.strokeWidth,
            }}
            className=" stroke-stone-900"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {getIcon(icon)}
        </svg>
    );
}

Icons.propTypes = {
    icon: PropTypes.string.isRequired,
    styling: PropTypes.shape({
        w: PropTypes.string,
        h: PropTypes.string,
        strokeWidth: PropTypes.string,
    }),
};
