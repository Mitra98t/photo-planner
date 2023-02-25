/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

export default function PhotoDataViewer({ photo }) {
  const [url, setUrl] = useState(photo.URL);
  const [file, setFile] = useState(photo.file);
  const [exif, setExif] = useState(photo.exif);
  const [camera, setCamera] = useState(photo.camera);

  useEffect(() => {}, []);

  return (
    <div className="w-full h-full flex flex-col items-start justify-evenly gap-4 px-4">
      <div className="flex flex-col items-start justify-start gap-1">
        {Object.keys(file).map((fk) => (
          <span className="flex items-start justify-start gap-2">
            <p className="font-semibold">{fk}:</p>
            <p>{file[fk]}</p>
          </span>
        ))}
      </div>
      <div className="flex flex-col items-start justify-start gap-1">
        {Object.keys(exif).map((ek) => (
          <span className="flex items-start justify-start gap-2">
            <p className="font-semibold">{ek}:</p>
            <p>{exif[ek]}</p>
          </span>
        ))}
      </div>
      <div className="flex flex-col items-start justify-start gap-1">
        {Object.keys(camera).map((ck) => (
          <span className="flex items-start justify-start gap-2">
            <p className="font-semibold">{ck}:</p>
            <p>{camera[ck]}</p>
          </span>
        ))}
      </div>
    </div>
  );
}
