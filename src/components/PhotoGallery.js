import React from "react";
import Image from "./Image";

export default function PhotoGallery({
    photoToShow,
    hideAuthor = false,
    photoClick,
}) {
    return (
        <ul className="w-full h-full flex justify-center flex-wrap gap-2 px-4 ">
            {photoToShow &&
                photoToShow
                    .sort((a, b) => b.votes - a.votes)
                    .map((p) => (
                        <li
                            key={p.id}
                            className="h-[35vh] flex-grow overflow-hidden group relative rounded-2xl"
                        >
                            <Image
                                clickCallback={photoClick}
                                image={p}
                                hideAuthor={hideAuthor}
                            />
                        </li>
                    ))}
            <li className="flex-grow-[10]"></li>
        </ul>
    );
}
