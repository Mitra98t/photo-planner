import React from "react";
import { useNavigate } from "react-router-dom";
import Icons from "./Icons";
import Image from "./Image";

export default function PhotoGallery({
  photoToShow,
  hideAuthor = false,
  personalProfile = false,
  photoClick,
  userUID,
}) {
  const navigate = useNavigate();
  return (
    <ul className="w-full h-fit flex justify-start items-start flex-wrap gap-1 md:gap-2 px-1 md:px-4 ">
      {personalProfile ? (
        <li
          key={"addImage--1"}
          className="flex-grow h-[15vh] md:h-[35vh] min-w-[30vw] max-w-full group bg-stone-100 dark:bg-dark-bg border-4 border-dashed border-light-secondary dark:border-dark-secondary flex items-center justify-center rounded-lg md:rounded-2xl dark:hover:border-dark-primary hover:border-light-primary duration-100"
          role={"button"}
          onClick={() => navigate("/addContent")}
        >
          <Icons
            icon={"plus"}
            color=" stroke-light-secondary group-hover:stroke-light-primary dark:stroke-dark-secondary dark:group-hover:stroke-dark-primary duration-75 stroke-[1.5px] md:stroke-[2px] "
          />
        </li>
      ) : (
        <></>
      )}
      {photoToShow &&
        photoToShow
          .sort((a, b) => b.votes - a.votes)
          .map((p, i) => (
            <li
              key={`${p.id}-${i}`}
              className="h-[15vh] max-w-[40vw] md:max-w-full md:h-[35vh] flex-grow overflow-hidden group relative rounded-lg md:rounded-2xl border-2 dark:border-dark-secondary border-light-secondary"
            >
              <Image
                userUID={userUID}
                clickCallback={photoClick}
                image={p}
                hideAuthor={hideAuthor}
                lowQuality
              />
            </li>
          ))}
      <li key={"lastElementGhost--2"} className="flex-grow-[10]"></li>
    </ul>
  );
}
