import React from "react";

import { Map, ZoomControl } from "pigeon-maps";

export default function MapCmp({ setBounds, blocked, mapLocation }) {
  // useEffect(() => {
  //   //TODO: Fix automatic position, its a bit off
  //   navigator.geolocation.getCurrentPosition(
  //     // (p) => setCoords([p.coords.latitude, p.coords.longitude])
  //     (p) => setCoords([43.72077871691476, 10.407882154565954])
  //   );
  // }, []);

  return (
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
    </Map>
  );
}
