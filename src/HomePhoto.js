import React, { useEffect, useState } from "react";
import "./test.css";
import NavBarHome from "./components/NavBars/NavBarHome";
import { DBManager as db } from "./utils/DBManager";
import Image from "./components/Image";

export default function HomePhoto({ close, bounds }) {
    const [photos, setPhotos] = useState(null);

    useEffect(() => {
        db.getImgsAtCoords(bounds.ne, bounds.sw).then((v) => setPhotos(v));
    }, [bounds]);

    // https://api.openweathermap.org/data/2.5/weather?lat=43.7&lon=10.3&lang=en&appid=c9395a8704049591bd87605063374a71
    return (
        <div
            className={
                "w-full h-full relative bg-stone-50 rounded-t-3xl overflow-hidden pt-[10vh]"
            }
        >
            <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
                <NavBarHome close={close} />
            </div>
            <ul className="w-full h-full overflow-y-scroll flex justify-center flex-wrap gap-2 px-4">
                {photos &&
                    photos.map((p) => (
                        <li
                            key={p.id}
                            className="h-[40vh] flex-grow rounded-lg overflow-hidden group relative"
                        >
                            <Image image={p} />
                        </li>
                    ))}
                <li className="flex-grow-[10]"></li>
            </ul>
        </div>
    );
}
