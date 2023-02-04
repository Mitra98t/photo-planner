import React, { useEffect, useState } from "react";

import { Map, ZoomControl } from "pigeon-maps";

export default function MapCmp({ setBounds, blocked }) {
    const [coords, setCoords] = useState([
        43.72077871691476, 10.407882154565954,
    ]);
    useEffect(() => {
        //TODO: Fix automatic position, its a bit off
        navigator.geolocation.getCurrentPosition(
            // (p) => setCoords([p.coords.latitude, p.coords.longitude])
            (p) => setCoords([43.72077871691476, 10.407882154565954])
        );
    }, []);

    return (
        <Map
            // defaultCenter={coords}
            center={coords}
            defaultZoom={15}
            maxZoom={19.4}
            onClick={(e) => console.log(e.latLng)}
            onBoundsChanged={(e) => setBounds(e.bounds)}
            zoomSnap={false}
            mouseEvents={!blocked}
            touchEvents={!blocked}
        >
            <ZoomControl />
        </Map>
    );
}
