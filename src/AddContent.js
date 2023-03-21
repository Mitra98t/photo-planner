import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Icons from "./components/Icons";

import piexif from "piexifjs";
import PhotoDataViewer from "./components/PhotoDataViewer";
import NavBarGeneric from "./components/NavBars/NavBarGeneric";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { DBManager } from "./utils/DBManager";
import { checkPhoto } from "./utils/utils";
import Button from "./elements/Button";

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function extractExif(exif) {
  const exifToString = (data, isFraction = false, isTime = false) => {
    if (!Array.isArray(data)) return data + "";
    let [numeratore, denominatore] = data;
    console.log([numeratore, denominatore]);
    denominatore = numeratore >= 10 ? denominatore / 10 : denominatore;
    numeratore = numeratore >= 10 ? numeratore / 10 : numeratore;
    console.log([numeratore, denominatore]);
    if (numeratore > denominatore && isTime) return `${numeratore}`;
    if (isFraction) return `${numeratore}/${denominatore}`;
    else return `${numeratore / denominatore}`;
  };

  const dateTimeOriginal = exif["Exif"][piexif.ExifIFD.DateTimeOriginal];
  let res = {
    camera: {
      make: exif["0th"][piexif.ImageIFD.Make],
      model: exif["0th"][piexif.ImageIFD.Model],
    },
    dateTime: {
      date: dateTimeOriginal.split(" ")[0].replaceAll(":", "-"),
      time: dateTimeOriginal.split(" ")[1],
    },
    cameraSettings: {
      ISO: exifToString(exif["Exif"][piexif.ExifIFD.ISOSpeedRatings]),
      aperture: exifToString(exif["Exif"][piexif.ExifIFD.FNumber]),
      focalLength: exifToString(exif["Exif"][piexif.ExifIFD.FocalLength]),
      shutterSpeed: exifToString(
        exif["Exif"][piexif.ExifIFD.ExposureTime],
        true,
        true,
      ),
    },
  };

  return res;
}

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
        <NavBarGeneric
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
              className="file:bg-blue-600 file:dark:bg-dark-900 file:outline-stone-900 file:dark:outline-blue-500 file:p-6 p-3 file:rounded-full file:border-0 file:outline file:outline-[4px] file:hover:outline-[6px] file:dark:outline-[3px] file:dark:hover:outline-[5px] file:mr-6 file:text-stone-50 file:text-xl file:font-bold file:transition-all file:ease-in-out file:duration-100"
              onChange={async (e) => {
                e.preventDefault();
                let oldPhotos = { ...photos };
                let file = e.target.files[0];

                let base64 = await blobToBase64(file);
                let exif = piexif.load(base64);
                let exifReadable = extractExif(exif);
                console.log(exifReadable);

                let fileData = {
                  nameComplete: file.name,
                  name: file.name.split(".")[0],
                  type: file.name.split(".")[1],
                  creationDate: exifReadable.dateTime.date,
                  creationTime: exifReadable.dateTime.time,
                  fileFromSource: await compressImage(e.target.files[0], {
                    quality: 0.5,
                  }),
                };
                let fileExif = {
                  shutterSpeed: exifReadable.cameraSettings.shutterSpeed,
                  aperture: exifReadable.cameraSettings.aperture,
                  focalLength: exifReadable.cameraSettings.focalLength,
                  ISO: exifReadable.cameraSettings.ISO,
                };
                let fileCamera = {
                  make: exifReadable.camera.make,
                  model: exifReadable.camera.model,
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
            width="w-fit"
            height="h-fit"
            accentColor="blue-600"
            darkAccentColor="blue-500"
          >
            Upload
          </Button>
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
