import React, { useEffect, useState } from "react";

import { Map, Marker, ZoomControl } from "pigeon-maps";
import { DBManager as db } from "../utils/DBManager";

export default function MapCmp({
  setBounds,
  bounds,
  blocked,
  setMapLocation,
  mapLocation,
  userSettings,
  triggerMapLoad,
  setTriggerMapLoad,
  setOldBounds,
}) {
  // eslint-disable-next-line no-unused-vars
  const [isSafari, setIsSafari] = useState(
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  );
  const [photosInLocation, setPhotosInLocation] = useState([]);
  useEffect(() => {
    if (photosInLocation.length > 0 && !triggerMapLoad) return;
    setTriggerMapLoad(false);
    db.getImgsAtCoords(bounds.ne, bounds.sw).then((v) => {
      let photosToLoad = [...photosInLocation];
      let dbPhotos = v.sort(function () {
        return Math.random() - 0.5;
      });
      for (let i = 0; i < dbPhotos.length; i++) {
        let count = 0;
        for (let j = 0; j < photosToLoad.length; j++) {
          if (
            photosToLoad[j].lat === dbPhotos[i].lat &&
            photosToLoad[j].lng === dbPhotos[i].lng
          )
            count++;
        }
        if (count === 0) photosToLoad.push(dbPhotos[i]);
      }
      setPhotosInLocation(photosToLoad);
      setOldBounds((b) => [...b, bounds]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds, triggerMapLoad]);

  return (
    <div className="w-full h-full notAnimated">
      <Map
        defaultCenter={mapLocation.coords}
        center={mapLocation.coords}
        zoom={mapLocation.zoom}
        defaultZoom={mapLocation.zoom}
        // defaultZoom={4}
        maxZoom={19.4}
        minZoom={3}
        onClick={(e) => {}}
        onBoundsChanged={(e) => {
          setBounds(e.bounds);
          localStorage.setItem(
            "mapLocation",
            JSON.stringify({
              coords: e.center,
              zoom: e.zoom,
              bounds: e.bounds,
            })
          );
        }}
        zoomSnap={false}
        mouseEvents={!blocked}
        touchEvents={!blocked}
      >
        <ZoomControl />
        {photosInLocation.map((image) => (
          <Marker
            width={50}
            anchor={[+image.lat, +image.lng]}
            color={"#88aacc"}
            onClick={() => {
              setMapLocation({
                coords: [image.lat, image.lng],
                zoom: 15,
                bounds: {
                  ne: [0, 0],
                  sw: [0, 0],
                },
              });
              localStorage.setItem(
                "mapLocation",
                JSON.stringify({
                  coords: [image.lat, image.lng],
                  zoom: 15,
                  bounds: {
                    ne: [0, 0],
                    sw: [0, 0],
                  },
                })
              );
            }}
          />
          // <Marker
          //   width={50}
          //   anchor={[+image.lat, +image.lng]}
          //   hover={true}
          //   onClick={() => {
          //     console.log("Ciao");
          //     setMapLocation({
          //       coords: [image.lat, image.lng],
          //       zoom: 15,
          //       bounds: {
          //         ne: [0, 0],
          //         sw: [0, 0],
          //       },
          //     });
          //   }}
          // >
          //   <div
          //     onClick={() => {
          //       console.log("Ciao");
          //       setMapLocation({
          //         coords: [image.lat, image.lng],
          //         zoom: 15,
          //         bounds: {
          //           ne: [0, 0],
          //           sw: [0, 0],
          //         },
          //       });
          //     }}
          //     className="w-12 h-12 bg-red-500 shadow-md rotate-45 rounded-t-full rounded-l-full p-1 group"
          //   >
          //     <div className="w-full h-full rounded-full bg-amber-400 overflow-hidden -rotate-45">
          //       {/* <img
          //         src={image.URL}
          //         alt="img"
          //         // className={" max-h-full min-w-full object-cover align-bottom "}
          //         className={
          //           " h-full w-full object-cover align-top opacity-100 group-hover:opacity-100 hover:opacity-100  "
          //         }
          //       /> */}
          //     </div>
          //   </div>
          // </Marker>
        ))}
      </Map>
      {userSettings && userSettings.monochromaticMaps && !isSafari ? (
        <div className="w-full h-screen absolute inset-0 bg-green-600 dark:bg-dark-800 pointer-events-none mix-blend-hue " />
      ) : (
        <div className="w-full h-screen absolute inset-0 dark:bg-dark-700 opacity-70 pointer-events-none mix-blend-difference " />
      )}
    </div>
  );
}
