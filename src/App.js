import "./App.css";
import { useState } from "react";
import MapCmp from "./components/MapCmp";
import NavBarMap from "./components/NavBars/NavBarMap";
import HomePhoto from "./HomePhoto";
import classNames from "classnames";

function App() {
    const [bounds, setBounds] = useState({});
    const [showHome, setShowHome] = useState(false);

    return (
        <div className="w-full h-screen pb-5">
            <MapCmp setBounds={setBounds} />
            <div
                className={
                    "absolute bottom-0 left-0 w-full bg-stone-50 rounded-3xl shadow-top " +
                    classNames({ "h-[90vh]": showHome, "h-[10vh]": !showHome })
                    // (showHome ? " h-[90vh] " : "  h-[10vh] ")
                }
            >
                {showHome ? (
                    <HomePhoto
                        close={() => setShowHome(() => !showHome)}
                        bounds={bounds}
                    />
                ) : (
                    <NavBarMap
                        searchArea={() => setShowHome(() => !showHome)}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
