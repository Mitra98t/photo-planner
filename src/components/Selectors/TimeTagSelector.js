import React from "react";
import DropDownMenu from "../DropDownMenu";
import Hashtag from "../Hashtag";

export default function TimeTagSelector({ options, setOptions, data }) {
    return (
        <div className="w-full flex flex-col items-start justify-evenly gap-2  ">
            <DropDownMenu title={"Default"} alwaysOpen>
                <Hashtag
                    onClick={() => {
                        setOptions(() => {
                            let newOpt = {
                                ...options,
                            };
                            newOpt.time = "";
                            return newOpt;
                        });
                    }}
                    label={"Any"}
                    ghost={"" !== options.time}
                />
            </DropDownMenu>

            <DropDownMenu alwaysOpen title={"Time"}>
                <div className="w-full h-full flex flex-row items-start justify-start flex-wrap gap-1 ">
                    {data &&
                        Object.keys(data).map((tt) => (
                            <Hashtag
                                key={tt}
                                label={tt}
                                onClick={() => {
                                    setOptions(() => {
                                        let newOpt = {
                                            ...options,
                                        };
                                        newOpt.time = tt;
                                        return newOpt;
                                    });
                                }}
                                ghost={tt !== options.time}
                            />
                        ))}
                </div>
            </DropDownMenu>
        </div>
    );
}
