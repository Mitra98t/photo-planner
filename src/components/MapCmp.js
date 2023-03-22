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
}) {
  // useEffect(() => {
  //   //TODO: Fix automatic position, its a bit off
  //   navigator.geolocation.getCurrentPosition(
  //     // (p) => setCoords([p.coords.latitude, p.coords.longitude])
  //     (p) => setCoords([43.72077871691476, 10.407882154565954])
  //   );
  // }, []);

  const [photosInLocation, setPhotosInLocation] = useState([]);
  useEffect(() => {
    let timeout;
    //TODO: trovare il modo di mostrare le immagini
    if (photosInLocation.length == 0) {
      db.getImgsAtCoords(bounds.ne, bounds.sw).then((v) => {
        let photosToLoad = [];
        let dbPhotos = v.sort(function () {
          return Math.random() - 0.5;
        });
        for (let i = 0; i < dbPhotos.length; i++) {
          let count = 0;
          for (let j = 0; j < photosToLoad.length; j++) {
            if (
              photosToLoad[j].lat == dbPhotos[i].lat &&
              photosToLoad[j].lng == dbPhotos[i].lng
            )
              count++;
          }
          if (count == 0) photosToLoad.push(dbPhotos[i]);
        }
        setPhotosInLocation(photosToLoad);
      });
    } else {
      timeout = setTimeout(() => {
        if (!bounds.hasOwnProperty("ne") || !bounds.hasOwnProperty("sw"))
          return;
        db.getImgsAtCoords(bounds.ne, bounds.sw).then((v) => {
          let photosToLoad = [];
          let dbPhotos = v.sort(function () {
            return Math.random() - 0.5;
          });
          for (let i = 0; i < dbPhotos.length; i++) {
            let count = 0;
            for (let j = 0; j < photosToLoad.length; j++) {
              if (
                photosToLoad[j].lat == dbPhotos[i].lat &&
                photosToLoad[j].lng == dbPhotos[i].lng
              )
                count++;
            }
            if (count == 0) photosToLoad.push(dbPhotos[i]);
          }
          setPhotosInLocation(photosToLoad);
        });
      }, 5000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [bounds]);

  return (
    <div className="w-full h-full notAnimated">
      <Map
        defaultCenter={[43.72077871691476, 10.407882154565954]}
        center={mapLocation.coords}
        zoom={mapLocation.zoom}
        defaultZoom={15}
        // defaultZoom={4}
        maxZoom={19.4}
        minZoom={3}
        onClick={(e) => {}}
        onBoundsChanged={(e) => {
          setBounds(e.bounds);
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
            onClick={() =>
              setMapLocation({
                coords: [image.lat, image.lng],
                zoom: 15,
                bounds: {
                  ne: [0, 0],
                  sw: [0, 0],
                },
              })
            }
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
      {userSettings && userSettings.monochromaticMaps ? (
        <div className="w-full h-screen absolute inset-0 bg-green-600 dark:bg-dark-800 pointer-events-none mix-blend-hue " />
      ) : (
        <div className="w-full h-screen absolute inset-0 dark:bg-dark-700 opacity-70 pointer-events-none mix-blend-difference " />
      )}
    </div>
  );
}
