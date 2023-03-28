import "./App.css";
import { useEffect, useState } from "react";
import MapCmp from "./components/MapCmp";
import NavBarMap from "./components/NavBars/NavBarMap";
import HomePhoto from "./HomePhoto";
import classNames from "classnames";
import Profile from "./Profile";
import PictureView from "./components/PictureView";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import ProfileView from "./components/ProfileView";
import AddContent from "./AddContent";
import Login from "./Login";
import { formatStyle } from "./utils/utils";
import ProfileSettings from "./ProfileSettings";
import { DBManager as db } from "./utils/DBManager";
import ChangeLog from "./ChangeLog";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bounds, setBounds] = useState({});
  const [oldBounds, setOldBounds] = useState([]);
  const [triggerMapLoad, setTriggerMapLoad] = useState(false);
  const [mapLocation, setMapLocation] = useState(
    !localStorage.getItem("mapLocation")
      ? {
          coords: [43.72077871691476, 10.407882154565954],
          zoom: 15,
          bounds: { ne: [], sw: [] },
        }
      : JSON.parse(localStorage.getItem("mapLocation"))
  );
  const [loggedUser, setLoggedUser] = useState(
    localStorage.getItem("uid") ? localStorage.getItem("uid") : null
  );
  const [settings, setSettings] = useState(
    localStorage.getItem("profileSettingsCache") === null
      ? null
      : JSON.parse(localStorage.getItem("profileSettingsCache"))
  );
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [lastChangeLog, setLastChangeLog] = useState(null);
  // const [startPos, setStartPos] = useState([43.72073, 10.4076]);

  useEffect(() => {
    db.getLastChangelog().then((r) => setLastChangeLog(r));
  }, []);

  useEffect(() => {
    if (loggedUser == null) return;
    db.getSettingsByUID(loggedUser).then((r) => setSettings(r));
  }, [loggedUser]);

  useEffect(() => {
    if (settings == null) return;
    if (!settings.hasOwnProperty("theme")) return;

    localStorage.setItem("profileSettingsCache", JSON.stringify(settings));

    const html = document.querySelector("html");
    //add or remove class dark in html elem according to theme in localstorage.
    if (settings.theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [settings]);

  return (
    <>
      {loggedUser == null ? (
        <Login setCurrentUser={setLoggedUser} />
      ) : (
        <div className="w-full h-screen pb-5 animationWrapper">
          {selectedPhoto !== null ? (
            <PictureView
              userUID={loggedUser}
              picture={selectedPhoto}
              close={() => setSelectedPhoto(null)}
            />
          ) : (
            <></>
          )}
          <div className="absolute top-2 right-2 flex flex-col items-center justify-evenly gap-2 z-[50] bg-stone-50 dark:bg-dark-800 text-stone-900 dark:text-stone-50 p-4 rounded-xl shadow-lg">
            <span className="font-semibold text-base">It's a Beta be kind</span>
            <button
              href="https://padlet.com/personalmailfm98/feed-back-y89afrpn4r234gut"
              onClick={() =>
                window.open(
                  "https://padlet.com/personalmailfm98/feed-back-y89afrpn4r234gut",
                  "_blank"
                )
              }
              className="italic font-medium text-sm"
            >
              And report bugs {"<"}3
            </button>
            <button
              onClick={() => navigate("/changelog")}
              className="font-semibold text-sm"
            >
              V. {lastChangeLog && lastChangeLog.version}
            </button>
          </div>
          <MapCmp
            setBounds={setBounds}
            bounds={bounds}
            blocked={location.pathname !== "/"}
            setMapLocation={setMapLocation}
            mapLocation={mapLocation}
            userSettings={settings}
            setOldBounds={setOldBounds}
            triggerMapLoad={triggerMapLoad}
            setTriggerMapLoad={setTriggerMapLoad}
          />
          {location.pathname !== "/" ? (
            <div
              className="absolute inset-0 w-full h-[10vh] bg-transparent"
              onClick={() => navigate("/")}
            ></div>
          ) : (
            <></>
          )}
          <div
            className={formatStyle([
              "absolute bottom-0 left-0 w-full bg-stone-50 dark:bg-dark-800 rounded-t-3xl shadow-top overflow-hidden duration-300 ",
              classNames({
                "h-[90vh]": location.pathname !== "/",
                "h-[20vh] sm:h-[10vh]": location.pathname === "/",
              }),
            ])}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
                      <NavBarMap
                        user={loggedUser}
                        searchArea={() => navigate("home")}
                        profileArea={() => navigate(`profile/${loggedUser}`)}
                        setMapLocation={setMapLocation}
                        setTriggerMapLoad={setTriggerMapLoad}
                        notify={
                          oldBounds.length !== 0 &&
                          !oldBounds.some(
                            (b) =>
                              b.ne[0] >= bounds.ne[0] &&
                              b.ne[1] >= bounds.ne[1] &&
                              b.sw[0] <= bounds.sw[0] &&
                              b.sw[1] <= bounds.sw[1]
                          )
                        }
                      />
                    </div>
                  </>
                }
              />
              <Route
                path="home"
                element={
                  <HomePhoto
                    close={() => navigate("/")}
                    bounds={bounds}
                    selectPhoto={setSelectedPhoto}
                    userUID={loggedUser}
                  />
                }
              />
              <Route
                path="profile"
                element={<Profile close={() => navigate("/")} />}
              >
                <Route
                  path=":UID"
                  element={
                    <ProfileView
                      userUID={loggedUser}
                      selectPhoto={setSelectedPhoto}
                    />
                  }
                />
              </Route>
              <Route
                path="addContent"
                element={<AddContent userUID={loggedUser} />}
              />
              <Route
                path="addContent"
                element={<AddContent userUID={loggedUser} />}
              />
              <Route
                path="profileSettings"
                element={
                  <ProfileSettings
                    userUID={loggedUser}
                    settings={settings}
                    setSettings={setSettings}
                  />
                }
              />
              <Route
                path="changeLog"
                element={<ChangeLog userUID={loggedUser} />}
              />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
