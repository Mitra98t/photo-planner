import "./App.css";
import { useEffect, useState } from "react";
import MapCmp from "./components/MapCmp";
import NavBarMap from "./components/NavBars/NavBarMap";
import HomePhoto from "./HomePhoto";
import classNames from "classnames";
import { DBManager as db } from "./utils/DBManager";
import Profile from "./Profile";
import PictureView from "./components/PictureView";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [bounds, setBounds] = useState({});
    const [page, setPage] = useState("map");
    const [user, setUser] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    // const [startPos, setStartPos] = useState([43.72073, 10.4076]);

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
            <MapCmp setBounds={setBounds} blocked={location.pathname !== "/"} />
            <div
                className={
                    "absolute bottom-0 left-0 w-full bg-stone-50 rounded-t-3xl shadow-top overflow-hidden " +
                    classNames({
                        "h-[90vh]": location.pathname !== "/",
                        "h-[10vh]": location.pathname === "/",
                    })
                    // (showHome ? " h-[90vh] " : "  h-[10vh] ")
                }
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            <NavBarMap
                                user={user}
                                searchArea={() => navigate("home")}
                                profileArea={() => navigate("profile")}
                            />
                        }
                    />
                    <Route
                        path="home"
                        element={
                            <HomePhoto
                                close={() => navigate("/")}
                                bounds={bounds}
                                selectPhoto={setSelectedPhoto}
                            />
                        }
                    />
                    <Route
                        path="profile"
                        element={
                            <Profile
                                user={user}
                                close={() => navigate("/")}
                                selectPhoto={setSelectedPhoto}
                            />
                        }
                    />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
                {/* {page === "home" ? (
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
                )} */}
            </div>
        </div>
    );
}

export default App;
