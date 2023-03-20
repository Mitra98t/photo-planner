import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Icons from "./components/Icons";

import EXIF from "exif-js";
import PhotoDataViewer from "./components/PhotoDataViewer";
import NavBarAddContent from "./components/NavBars/NavBarAddContent";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { DBManager } from "./utils/DBManager";
import { checkPhoto } from "./utils/utils";
import Button from "./elements/Button";

export default function AddContent({ userUID }) {
  const [photos, setPhotos] = useState({});
  const navigate = useNavigate();

  const compressImage = async (file, { quality = 1, type = file.type }) => {
    // Get as image data
    const imageBitmap = await createImageBitmap(file);

    // Draw to canvas
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageBitmap, 0, 0);

    // Turn into Blob
    return await new Promise((resolve) =>
      canvas.toBlob(resolve, type, quality)
    );
  };

  useEffect(() => {
    // console.log(photos);
  }, [photos]);

  const upImage = async (file, id, pk) => {
    const name = id;
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        let oldPhotos = { ...photos };
        oldPhotos[pk].progress = progress;
        setPhotos(oldPhotos);
        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
          default:
            break;
        }
      },
      (error) => {},
      async () => {
        // let res = await getDownloadURL(uploadTask.snapshot.ref);
        // return res;
        // getDownloadURL(uploadTask.snapshot.ref).then((durl) => {
        // });
      }
    );
    return uploadTask;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let photosToUpload = { ...photos };
    for (const pk in photosToUpload) {
      if (Object.hasOwnProperty.call(photosToUpload, pk)) {
        const uuid = uuidv4(); // Genera un nuovo UUID v4

        let res = await upImage(
          photosToUpload[pk].file.fileFromSource,
          uuid,
          pk
        );
        let resourceName = uuid;
        let url = await getDownloadURL(res.ref);

        photosToUpload[pk].URL = url;

        DBManager.addPhoto(
          {
            ...photosToUpload[pk],
          },
          resourceName
        );
        // await setDoc(doc(db, "Documents", id) /* Content */);
      }
    }

    // setPage("home");
    // setModifyDoc(null);
  };

  return (
    <div className="w-full h-full relative bg-stone-50 dark:bg-dark-800 text-stone-900 dark:text-stone-50 rounded-t-3xl overflow-hidden pt-[10vh] pb-4 ">
      <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
        {/* <NavBarHome close={() => {}} /> */}
        <NavBarAddContent
          close={() => navigate("/")}
          profileArea={() => navigate(`/profile/${userUID}`)}
          user={userUID}
        />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-start gap-10 px-8 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300 dark:scrollbar-thumb-dark-600">
        <form
          onSubmit={handleSubmit}
          className="w-full h-fit flex justify-between items-center sticky inset-0 bg-stone-50 dark:bg-dark-800 z-[100] p-4"
        >
          <div className="w-fit h-full flex flex-row items-center justify-start gap-6">
            <input
              type={"file"}
              accept=".jpg, .png, .heif, .heic"
              className="file:mr-4 file:px-6 file:py-3 file:bg-stone-900 file:hover:bg-stone-700 file:dark:bg-dark-900 file:dark:hover:bg-dark-700 file:rounded-full file:text-stone-50 file:font-semibold file:border-0 file:cursor-pointer"
              onChange={async (e) => {
                e.preventDefault();
                let oldPhotos = { ...photos };
                let file = e.target.files[0];
                let exd;
                // console.log(file)
                EXIF.getData(e.target.files[0], async () => {
                  exd = EXIF.getAllTags(e.target.files[0]);
                  let fileData = {
                    nameComplete: file.name,
                    name: file.name.split(".")[0],
                    type: file.name.split(".")[1],
                    creationDate: exd.DateTimeOriginal.split(" ")[0].replace(
                      /:/g,
                      "-"
                    ),
                    creationTime: exd.DateTimeOriginal.split(" ")[1],
                    fileFromSource: await compressImage(e.target.files[0], {
                      quality: 0.5,
                    }),
                  };

                  let fileExif = {
                    exifVersion: exd.ExifVersion,
                    shutterSpeed:
                      exd.ExposureTime.numerator === 1
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
                    authorUID: userUID,
                    weather: {},
                    visible: true,
                  };

                  oldPhotos[fileData.nameComplete] = { ...photo };
                  setPhotos(oldPhotos);
                });
              }}
            ></input>
            <p className=" italic font-medium">
              If the button doesn't work, refresh page {"<"}3
            </p>
          </div>
          <Button
            disabled={
              Object.keys(photos).every(
                (key) => photos[key].progress === 100
              ) || Object.keys(photos).some((key) => !checkPhoto(photos[key]))
            }
            type="submit"
            hover="outline-[6px]"
            width="w-fit"
          >
            Load
          </Button>
          {/* {Object.keys(photos).every((key) => photos[key].progress === 100) ||
          Object.keys(photos).some((key) => !checkPhoto(photos[key])) ? (
            <button
              type={"submit"}
              disabled
              className={
                "whitespace-nowrap p-4 text-xl text-stone-50 bg-stone-900 dark:bg-dark-900 rounded-full"
              }
            >
              Carica
            </button>
          ) : (
            <button
              type={"submit"}
              className={
                "whitespace-nowrap p-4 text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 dark:bg-dark-900 dark:hover:bg-dark-700 rounded-full"
              }
            >
              Carica
            </button>
          )} */}
        </form>
        {Object.keys(photos).map((pk, i) => {
          return (
            <div
              key={pk}
              className="w-full h-fit grid grid-cols-2 relative pt-[7vh] "
            >
              <div className="absolute inset-0 h-[5vh] w-full bg-stone-50 dark:bg-dark-800 z-[90] flex items-center justify-between px-4">
                <div className=" w-full h-full flex flex-row items-center justify-start gap-3">
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
                      color={" stroke-stone-900 dark:stroke-stone-50"}
                      styling={{
                        w: "auto",
                        h: "60%",
                        strokeWidth: "2px",
                      }}
                    />
                  </button>
                  {photos[pk].visible ? (
                    <></>
                  ) : (
                    <div className="w-fit h-fit flex items-center justify-center relative">
                      {loadingRender(photos[pk].progress, true)}
                      <img
                        src={photos[pk].URL}
                        alt={"added" + i}
                        className={
                          "h-[6rem] overflow-hidden object-cover border rounded-sm border-stone-900 dark:border-dark-600 dark:border-2"
                        }
                      />
                    </div>
                  )}
                  <span
                    onClick={() => {
                      if (photos[pk].visible) return;
                      let oldPhotos = { ...photos };
                      oldPhotos[pk].visible = !oldPhotos[pk].visible;
                      setPhotos(oldPhotos);
                    }}
                    className="text-2xl font-semibold"
                  >
                    {photos[pk].file.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    let oldPhotos = { ...photos };
                    delete oldPhotos[pk];
                    setPhotos(oldPhotos);
                  }}
                >
                  <Icons
                    icon={"trash"}
                    styling={{ w: "2.5rem", strokeWidth: "1px" }}
                    color="stroke-stone-900 dark:stroke-stone-50 hover:scale-110 duration-100"
                  />
                </button>
              </div>
              {photos[pk].visible ? (
                <>
                  <div className="w-full h-full flex items-center justify-center relative">
                    {loadingRender(photos[pk].progress)}
                    <img
                      src={photos[pk].URL}
                      alt={"added" + i}
                      className={
                        "h-[44vh] overflow-hidden object-cover border-4 rounded-md border-stone-900 dark:border-dark-600"
                      }
                    />
                  </div>
                  <div className="w-full h-full flex flex-row items-center justify-start flex-wrap gap-8">
                    <PhotoDataViewer
                      photo={photos[pk]}
                      setPhotos={setPhotos}
                      photos={photos}
                      index={pk}
                    />
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

function loadingRender(progress, small = false) {
  if (progress == null) {
    return <></>;
  }
  if (progress >= 100)
    return (
      <div className="absolute">
        <Icons
          icon={"check"}
          color={"stroke-green-500"}
          styling={{
            w: small ? "1.5rem" : "3rem",
            h: "auto",
            strokeWidth: "3px",
          }}
        ></Icons>
      </div>
    );

  return (
    <div
      class={
        (small ? " h-5 w-5 border-2 " : " h-8 w-8 border-4 ") +
        " absolute animate-spin rounded-full border-solid border-stone-50 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
      }
      role="status"
    ></div>
  );

  // return (
  //   <div
  //     className={
  //       " w-full h-full bg-transparent absolute inset-0 flex items-center justify-center z-[100]"
  //     }
  //   >
  //     <div class="w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
  //   </div>
  // );
}
