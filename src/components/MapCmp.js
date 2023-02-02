import React from "react";

import { Map, ZoomControl } from "pigeon-maps";

export default function MapCmp({ setBounds }) {
    return (
        <Map
            defaultCenter={[43.72073, 10.4076]}
            defaultZoom={15}
            maxZoom={19.4}
            onClick={(e) => console.log(e.latLng)}
            onBoundsChanged={(e) => setBounds(e.bounds)}
            zoomSnap={false}
        >
            <ZoomControl />
        </Map>
    );
}
