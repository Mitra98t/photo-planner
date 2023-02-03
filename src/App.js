import "./App.css";
import { useEffect, useState } from "react";
import MapCmp from "./components/MapCmp";
import NavBarMap from "./components/NavBars/NavBarMap";
import HomePhoto from "./HomePhoto";
import classNames from "classnames";
import { DBManager as db } from "./utils/DBManager";
import Profile from "./Profile";
import PictureView from "./components/PictureView";

function App() {
    const [bounds, setBounds] = useState({});
    const [page, setPage] = useState("map");
    const [user, setUser] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        db.getUserInformation().then((v) => setUser(v));
    }, []);
    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <div className="w-full h-screen pb-5">
            {selectedPhoto !== null ? (
                <PictureView
                    picture={selectedPhoto}
                    close={() => setSelectedPhoto(null)}
                />
            ) : (
                <></>
            )}
            <MapCmp setBounds={setBounds} />
            <div
                className={
                    "absolute bottom-0 left-0 w-full bg-stone-50 rounded-t-3xl shadow-top overflow-hidden " +
                    classNames({
                        "h-[90vh]": page !== "map",
                        "h-[10vh]": page === "map",
                    })
                    // (showHome ? " h-[90vh] " : "  h-[10vh] ")
                }
            >
                {page === "home" ? (
                    <HomePhoto
                        close={() => setPage("map")}
                        bounds={bounds}
                        selectPhoto={setSelectedPhoto}
                    />
                ) : page === "profile" ? (
                    <Profile
                        user={user}
                        close={() => setPage("map")}
                        selectPhoto={setSelectedPhoto}
                    />
                ) : (
                    <NavBarMap
                        user={user}
                        searchArea={() => setPage("home")}
                        profileArea={() => setPage("profile")}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
