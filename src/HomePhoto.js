import React, { useEffect, useState } from "react";
import "./test.css";
import NavBarFilters from "./components/NavBars/NavBarFilters";
import { DBManager as db } from "./utils/DBManager";
import PhotoGallery from "./components/PhotoGallery";
import { filterPhoto } from "./utils/utils";

export default function HomePhoto({ close, bounds, selectPhoto, userUID }) {
  const [photos, setPhotos] = useState(null);
  const [photoToShow, setPhotoToShow] = useState(null);
  const [options, setOptions] = useState({
    weather: "",
    period: "",
    time: {
      from: "",
      to: "",
    },
  });
  useEffect(() => {}, []);

  useEffect(() => {
    db.getImgsAtCoords(bounds.ne, bounds.sw)
      .then((v) => {
        setPhotos(v);
        setPhotoToShow(v);
      })
      .catch((e) => {});
  }, [bounds]);

  useEffect(() => {
    if (photos != null) {
      let pht = [...photos];

      pht = pht.filter((p) => filterPhoto(p, options));
      setPhotoToShow(pht);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <div
      className={
        "w-full h-full relative bg-light-bg dark:bg-dark-bg rounded-t-3xl overflow-hidden pt-[12vh] pb-4 "
      }
    >
      <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
        <NavBarFilters
          close={close}
          options={options}
          setOptions={setOptions}
        />
      </div>
      <div className="w-full h-full overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300 dark:scrollbar-thumb-dark-600 px-8 ">
        {photoToShow && photoToShow.length === 0 ? (
          <p className="text-dark-text0 dark:text-dark-500 font-bold text-2xl ml-10 mt-10">
            No photos here... -_-
          </p>
        ) : (
          <PhotoGallery
            userUID={userUID}
            photoToShow={photoToShow}
            photoClick={selectPhoto}
          />
        )}
      </div>
    </div>
  );
}
