import React from "react";
import DropDownMenu from "../DropDownMenu";
import Hashtag from "../Hashtag";

export default function PeriodTagSelector({ options, setOptions, data }) {
    return (
        <div className="w-full flex flex-col items-start justify-evenly gap-2  ">
            <DropDownMenu title={"Default"} alwaysOpen>
                <Hashtag
                    onClick={() => {
                        setOptions(() => {
                            let newOpt = {
                                ...options,
                            };
                            newOpt.period = "";
                            return newOpt;
                        });
                    }}
                    label={"Any"}
                    ghost={"" !== options.period}
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
                                        newOpt.period = tt;
                                        return newOpt;
                                    });
                                }}
                                ghost={tt !== options.period}
                            />
                        ))}
                </div>
            </DropDownMenu>
        </div>
    );
}
