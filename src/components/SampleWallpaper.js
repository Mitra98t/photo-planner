import React, { useEffect, useState } from "react";
import { DBManager as db } from "../utils/DBManager";
import { randomColor } from "../utils/utils";

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export default function SampleWallpaper() {
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    db.getImageSample(50).then((res) => {
      console.log(res.length);
      console.log(res);
      let photos = [];
      let cols = 4;
      let photosByCol = Math.floor(res.length / cols);
      for (let i = 0; i < cols; i++) {
        photos.push(res.slice(i * photosByCol, (i + 1) * photosByCol));
      }
      console.log(photos);
      setPhotos(photos);
    });
  }, []);

  return (
    <>
      <div className="w-full h-screen bg-stone-900 absolute inset-0"></div>
      <div className="bg-stone-900 w-full h-screen overflow-hidden blur-[2px] grid grid-flow-col grid-cols-4 gap-2 p-2">
        {photos &&
          photos.map((coll, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-start gap-2"
            >
              {shuffle(coll).map((photo, j) => (
                <img
                  style={{
                    backgroundColor: randomColor(),
                  }}
                  className="rounded-xl"
                  key={`${i}-${j}`}
                  alt={`img${j}col${i}`}
                  src={photo.URL}
                ></img>
              ))}
            </div>
          ))}
      </div>
    </>
  );
}
