import React, { useState } from "react";
import Hashtag from "./components/Hashtag";
import Icons from "./components/Icons";
import NavBarMap from "./components/NavBars/NavBarMap";

import EXIF from "exif-js";
import PhotoDataViewer from "./components/PhotoDataViewer";

export default function AddContent() {
  const [photos, setPhotos] = useState({});

  return (
    <div className="w-full h-full relative bg-stone-50 rounded-t-3xl overflow-hidden pt-[10vh] pb-4 ">
      <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
        {/* <NavBarHome close={() => {}} /> */}
        <NavBarMap />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-start gap-10 px-8 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300">
        <form
          onSubmit={() => console.log("submitted")}
          className="w-full h-fit flex sticky inset-0 bg-stone-50 p-4"
        >
          <input
            type={"file"}
            accept=".jpg, .png, .heif, .heic"
            onChange={(e) => {
              let oldPhotos = { ...photos };
              let file = e.target.files[0];
              let exd;
              EXIF.getData(e.target.files[0], () => {
                exd = EXIF.getAllTags(e.target.files[0]);
                let fileData = {
                  nameComplete: file.name,
                  name: file.name.split(".")[0],
                  type: file.name.split(".")[1],
                  creationDate: exd.DateTime.split(" ")[0].replace(/:/g, "-"),
                  creationTime: exd.DateTime.split(" ")[1],
                };

                let fileExif = {
                  exifVersion: exd.ExifVersion,
                  shutterSpeed:
                    exd.ExposureTime.numerator == 1
                      ? `${exd.ExposureTime.numerator}/${exd.ExposureTime.denominator}`
                      : `${exd.ExposureTime.numerator}"`,
                  aperture: exd.FNumber.numerator / exd.FNumber.denominator,
                  focalLength:
                    exd.FocalLength.numerator / exd.FocalLength.denominator,
                  ISO: exd.ISOSpeedRatings,
                };

                let fileCamera = {
                  make: exd.Make,
                  model: exd.Model,
                };

                let photo = {
                  URL: URL.createObjectURL(e.target.files[0]),
                  file: fileData,
                  exif: fileExif,
                  camera: fileCamera,
                  visible: true,
                };
                console.log(photo);

                oldPhotos[fileData.nameComplete] = { ...photo };
                setPhotos(oldPhotos);
              });
            }}
          ></input>
        </form>
        {Object.keys(photos).map((pk, i) => {
          return (
            <div
              key={pk}
              className="w-full h-fit grid grid-cols-2 relative pt-[5vh]"
            >
              <div className="absolute inset-0 h-[5vh] w-full bg-stone-50 z-[100] flex items-center justify-start">
                <button
                  onClick={() => {
                    let oldPhotos = { ...photos };
                    oldPhotos[pk].visible = !oldPhotos[pk].visible;
                    setPhotos(oldPhotos);
                  }}
                  className="w-fit h-full"
                >
                  <Icons
                    icon={photos[pk].visible ? "menuOpen" : "menuClose"}
                    styling={{
                      w: "auto",
                      h: "100%",
                      strokeWidth: "2px",
                    }}
                  />
                </button>
                <p>{photos[pk].file.name}</p>
              </div>
              {photos[pk].visible ? (
                <>
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={photos[pk].URL}
                      alt={"added" + i}
                      className={
                        "h-[44vh] object-fit border-4 rounded-md border-stone-900"
                      }
                    />
                  </div>
                  <div className="w-full h-full flex flex-row items-center justify-start flex-wrap gap-8">
                    <PhotoDataViewer photo={photos[pk]} />
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
