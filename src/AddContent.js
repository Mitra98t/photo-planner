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
    <div className="w-full h-full relative bg-stone-50 rounded-t-3xl overflow-hidden pt-[10vh] pb-4 ">
      <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
        {/* <NavBarHome close={() => {}} /> */}
        <NavBarAddContent
          close={() => navigate("/")}
          profileArea={() => navigate(`/profile/${userUID}`)}
          user={userUID}
        />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-start gap-10 px-8 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300">
        <form
          onSubmit={handleSubmit}
          className="w-full h-fit flex justify-between items-center sticky inset-0 bg-stone-50 z-[100] p-4"
        >
          <input
            type={"file"}
            accept=".jpg, .png, .heif, .heic"
            onChange={async (e) => {
              e.preventDefault();
              let oldPhotos = { ...photos };
              let file = e.target.files[0];
              let exd;
              EXIF.getData(e.target.files[0], async () => {
                exd = EXIF.getAllTags(e.target.files[0]);
                let fileData = {
                  nameComplete: file.name,
                  name: file.name.split(".")[0],
                  type: file.name.split(".")[1],
                  creationDate: exd.DateTime.split(" ")[0].replace(/:/g, "-"),
                  creationTime: exd.DateTime.split(" ")[1],
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
          {Object.keys(photos).every((key) => photos[key].progress === 100) ||
          Object.keys(photos).some((key) => !checkPhoto(photos[key])) ? (
            <button
              type={"submit"}
              disabled
              className={
                "whitespace-nowrap p-4 text-xl text-stone-50 bg-stone-900 rounded-full transition-all ease-in-out duration-150"
              }
            >
              Carica
            </button>
          ) : (
            <button
              type={"submit"}
              className={
                "whitespace-nowrap p-4 text-xl text-stone-50 bg-stone-900 hover:bg-stone-700 rounded-full transition-all ease-in-out duration-150"
              }
            >
              Carica
            </button>
          )}
        </form>
        {Object.keys(photos).map((pk, i) => {
          return (
            <div
              key={pk}
              className="w-full h-fit grid grid-cols-2 relative pt-[5vh]"
            >
              <div className="absolute inset-0 h-[5vh] w-full bg-stone-50 z-[90] flex items-center justify-start">
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
                  <div className="w-full h-full flex items-center justify-center relative">
                    {loadingRender(photos[pk].progress)}
                    <img
                      src={photos[pk].URL}
                      alt={"added" + i}
                      className={
                        "h-[44vh] object-cover border-4 rounded-md border-stone-900"
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

function loadingRender(progress) {
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
            w: "3rem",
            h: "auto",
            strokeWidth: "3px",
          }}
        ></Icons>
      </div>
    );

  return (
    <div
      class="absolute h-8 w-8 animate-spin rounded-full border-4 border-solid border-stone-50 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
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
