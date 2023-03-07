import React from "react";
import { useNavigate } from "react-router-dom";
import Icons from "./Icons";
import Image from "./Image";

export default function PhotoGallery({
  photoToShow,
  hideAuthor = false,
  personalProfile = false,
  photoClick,
}) {
  const navigate = useNavigate();
  return (
    <ul className="w-full h-full flex justify-center flex-wrap gap-2 px-4 ">
      {personalProfile ? (
        <li
          key={"addImage"}
          className="flex-grow h-[35vh] min-w-[30vW] max-w-full bg-stone-100 border-4 border-dashed border-stone-500 flex items-center justify-center rounded-2xl hover:bg-stone-300 transition-all ease-in-out duration-200"
          role={"button"}
          onClick={() => navigate("/addContent")}
        >
          <Icons icon={"plus"} color="stroke-stone-500" />
        </li>
      ) : (
        <></>
      )}
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
