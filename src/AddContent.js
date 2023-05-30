import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Icons from "./components/Icons";

import piexif from "piexifjs";
import { FileUploader } from "react-drag-drop-files";
import PhotoDataViewer from "./components/PhotoDataViewer";
import NavBarGeneric from "./components/NavBars/NavBarGeneric";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { DBManager } from "./utils/DBManager";
import { checkPhoto, Default, Mobile } from "./utils/utils";
import Button from "./elements/Button";
import Resizer from "react-image-file-resizer";

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const resizeFile = (file, maxDimension, compressionPercent) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxDimension,
      maxDimension,
      "JPEG",
      compressionPercent,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
};

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function extractExif(exif) {
  const exifToString = (
    data,
    isFraction = false,
    isTime = false,
    round = false
  ) => {
    if (!Array.isArray(data)) return data + "";
    let [numeratore, denominatore] = data;
    denominatore = numeratore >= 10 ? denominatore / 10 : denominatore;
    numeratore = numeratore >= 10 ? numeratore / 10 : numeratore;
    if (numeratore > denominatore && isTime) return `${numeratore}`;
    if (isFraction) return `${numeratore}/${denominatore}`;
    else
      return `${
        round
          ? Math.round(numeratore / denominatore)
          : numeratore / denominatore
      }`;
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
      focalLength: exifToString(
        exif["Exif"][piexif.ExifIFD.FocalLength],
        false,
        false,
        true
      ),
      shutterSpeed: exifToString(
        exif["Exif"][piexif.ExifIFD.ExposureTime],
        true,
        true
      ),
    },
  };

  return res;
}

const fileTypes = ["JPG", "PNG", "JPEG"];

export default function AddContent({ userUID }) {
  const [photos, setPhotos] = useState({});
  const navigate = useNavigate();

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
        if (photosToUpload[pk].hasOwnProperty("progress")) continue;

        let hiResFile = dataURLtoFile(
          photosToUpload[pk].file.fileFromSource,
          photosToUpload[pk].file.name
        );
        let lowResFile = dataURLtoFile(
          photosToUpload[pk].file.smallFileFromSource,
          "small_" + photosToUpload[pk].file.name
        );
        let res = await upImage(hiResFile, uuid, pk);
        let resSmall = await upImage(lowResFile, uuid + "_small", pk);
        let resourceName = uuid;
        let url = await getDownloadURL(res.ref);
        let smallUrl = await getDownloadURL(resSmall.ref);

        photosToUpload[pk].URL = url;
        photosToUpload[pk].smallURL = smallUrl;

        DBManager.addPhoto(
          {
            ...photosToUpload[pk],
          },
          resourceName
        );
      }
    }
  };

  const addFileLocal = async (fileIn) => {
    let oldPhotos = { ...photos };
    let file = fileIn;

    let base64 = await blobToBase64(file);
    let exif = piexif.load(base64);
    let exifReadable = extractExif(exif);

    let fileData = {
      nameComplete: file.name,
      name: file.name.split(".")[0],
      type: file.name.split(".")[1],
      creationDate: exifReadable.dateTime.date,
      creationTime: exifReadable.dateTime.time,
      fileFromSource: await resizeFile(fileIn, 2000, 60),
      smallFileFromSource: await resizeFile(fileIn, 500, 40),
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
      URL: URL.createObjectURL(fileIn),
      file: fileData,
      exif: fileExif,
      camera: fileCamera,
      authorUID: userUID,
      weather: {},
      visible: true,
    };
    oldPhotos[fileData.nameComplete] = { ...photo };
    setPhotos(oldPhotos);
  };

  return (
    <div className="w-full h-full relative bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text rounded-t-3xl overflow-hidden pt-[10vh] ">
      <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
        <NavBarGeneric
          close={() => navigate("/")}
          profileArea={() => navigate(`/profile/${userUID}`)}
          user={userUID}
        />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-start gap-10 md:px-8 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300 dark:scrollbar-thumb-dark-600 pb-8">
        <form
          onSubmit={handleSubmit}
          className="w-full h-fit flex justify-between items-center sticky inset-0 bg-light-bg dark:bg-dark-bg z-[100] p-4"
        >
          <FileUploader
            name="file"
            types={fileTypes}
            handleChange={addFileLocal}
          >
            <div className=" flex flex-row items-center justify-evenly gap-4 w-fit h-fit px-4 py-3 rounded-full focus:outline-4 outline-dashed outline-2 hover:outline-4 outline-light-primary dark:outline-dark-primary">
              <p className="text-light-text dark:text-dark-text">
                Drag photo or click to upload...
              </p>
              <Icons
                icon="image"
                color="stroke-light-text dark:stroke-dark-text"
                styling={{ w: "auto", h: "2rem", strokeWidth: "1.5px" }}
              />
            </div>
          </FileUploader>

          <Default>
            <Button
              disabled={
                Object.keys(photos).every(
                  (key) => photos[key].progress === 100
                ) || Object.keys(photos).some((key) => !checkPhoto(photos[key]))
              }
              type="submit"
              width="w-fit"
              height="h-fit"
            >
              Upload
            </Button>
          </Default>
        </form>
        {Object.keys(photos).map((pk, i) => {
          return (
            <div
              key={pk}
              className="w-full h-fit grid grid-cols-1 md:grid-cols-2 relative pt-[7vh] "
            >
              <div className="absolute inset-0 h-[5vh] w-full bg-light-bg dark:bg-dark-bg z-[90] flex items-center justify-between px-4">
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
                          "h-[6rem] overflow-hidden object-cover border rounded-sm dark:border-dark-secondary border-light-secondary dark:border-2"
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
                  <div className="w-full h-full px-4 md:px-0 flex items-center justify-center relative">
                    {loadingRender(photos[pk].progress)}
                    <img
                      src={photos[pk].URL}
                      alt={"added" + i}
                      className={
                        "h-fit md:h-[44vh] object-scale-down overflow-hidden md:object-cover  border-4 rounded-md dark:border-dark-secondary border-light-secondary"
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
        <Mobile>
          <Button
            disabled={
              Object.keys(photos).every(
                (key) => photos[key].progress === 100
              ) || Object.keys(photos).some((key) => !checkPhoto(photos[key]))
            }
            type="submit"
            width="w-fit"
            height="h-fit"
          >
            Upload
          </Button>
        </Mobile>
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
      className={
        (small ? " h-5 w-5 border-2 " : " h-8 w-8 border-4 ") +
        " absolute animate-spin rounded-full border-solid border-stone-50 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
      }
      role="status"
    ></div>
  );
}
