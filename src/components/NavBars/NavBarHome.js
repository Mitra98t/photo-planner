import React, { useState } from "react";
import { weatherCodes } from "../../utils/utils";
import Icons from "../Icons";
import MultiRangeSlider from "../MultiRangeSlider";
import PropTypes from "prop-types";

export default function NavBarHome({ close }) {
    const [filterMenu, setFilterMenu] = useState(false);
    return (
        <div className="w-full h-full rounded-3xl bg-stone-50 flex flex-row items-center justify-between px-12 ">
            {filterMenu ? fiteringMenu() : <></>}
            <button
                className="relative"
                onClick={() => setFilterMenu(() => !filterMenu)}
            >
                <Icons
                    icon="menu"
                    styling={{ w: "3rem", h: "auto", strokeWidth: "2px" }}
                />
            </button>
            <button
                onClick={close}
                className="rounded-full font-bold text-center text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 px-6 py-4 "
            >
                Close
            </button>
        </div>
    );
}

function fiteringMenu() {
    return (
        <div className="absolute top-20 rounded-3xl flex flex-col gap-2  bg-stone-50 shadow-area w-fit h-fit p-4 z-40 text-stone-900">
            <div className="flex flex-col gap-1">
                <p className="font-bold text-xl">Weather Conditions</p>
                <select name="weatherConditions" id="weatherConditionSelect">
                    <option value={null} selected>
                        Select Weather
                    </option>
                    {Object.keys(weatherCodes).map((k) => (
                        <optgroup label={k}>
                            {Object.keys(weatherCodes[k]).map((o) => (
                                <option value={o}>{weatherCodes[k][o]}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <p className="font-bold text-xl">Time of Day</p>
                <MultiRangeSlider
                    min={0}
                    max={60 * 24}
                    onChange={({ min, max }) =>
                        console.log(`min = ${min}, max = ${max}`)
                    }
                />
            </div>
        </div>
    );
}

NavBarHome.propTypes = {
    close: PropTypes.func.isRequired,
};
