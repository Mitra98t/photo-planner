import React from "react";
import DropDownMenu from "../DropDownMenu";
import Hashtag from "../Hashtag";

export default function WeatherTagsSelector({ options, setOptions, data }) {
    return (
        <div className="w-[40vw] flex flex-col items-start justify-evenly gap-2">
            <DropDownMenu title={"Default"} alwaysOpen>
                <Hashtag
                    onClick={() => {
                        setOptions(() => {
                            let newOpt = {
                                ...options,
                            };
                            newOpt.weather = "";
                            return newOpt;
                        });
                    }}
                    label={"Any"}
                    ghost={"" !== options.weather}
                />
            </DropDownMenu>
            {data &&
                Object.keys(data).map((category) => (
                    <DropDownMenu title={category} key={category}>
                        <div className="w-full flex flex-row items-start justify-start flex-wrap gap-1">
                            {Object.keys(data[category]).map((code) => {
                                let label = data[category][code];
                                return (
                                    <Hashtag
                                        key={code}
                                        onClick={() => {
                                            setOptions(() => {
                                                let newOpt = {
                                                    ...options,
                                                };
                                                newOpt.weather = label;
                                                return newOpt;
                                            });
                                        }}
                                        label={label}
                                        ghost={label !== options.weather}
                                    />
                                );
                            })}
                        </div>
                    </DropDownMenu>
                ))}
        </div>
    );
}
