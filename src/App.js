import { useEffect, useState } from "react";
import MapCmp from "./components/MapCmp";
import NavBarMap from "./components/NavBars/NavBarMap";
import { DBManager as db } from "./utils/DBManager";

function App() {
    const [bounds, setBounds] = useState({});

    return (
        <div className="w-full h-screen pb-24">
            <MapCmp setBounds={setBounds} />
            <div className="absolute bottom-0 left-0 h-24 w-full">
                {" "}
                <NavBarMap />
            </div>
        </div>
    );
}

export default App;
