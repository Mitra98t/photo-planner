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
import { useMediaQuery } from "react-responsive";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import addNotification from "react-push-notification";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  const [loggedUser, setLoggedUser] = useState("watingUser");
  const [notified, setNotified] = useState(false);
  const [triggerUpdatePhoto, setTriggerUpdatePhoto] = useState(false);
  const [bounds, setBounds] = useState({});
  const [oldBounds, setOldBounds] = useState([]);
  const [triggerMapLoad, setTriggerMapLoad] = useState(false);  
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [lastChangeLog, setLastChangeLog] = useState(null);
  const [mapLocation, setMapLocation] = useState(
    !localStorage.getItem("mapLocation")
      ? {
          coords: [43.72077871691476, 10.407882154565954],
          zoom: 15,
          bounds: { ne: [], sw: [] },
        }
      : JSON.parse(localStorage.getItem("mapLocation"))
  );
  const [settings, setSettings] = useState(
    localStorage.getItem("profileSettingsCache") === null
      ? null
      : JSON.parse(localStorage.getItem("profileSettingsCache"))
  );

  useEffect(() => {
    setLoggedUser("watingUser");
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedUser(user.uid);
      } else {
        setLoggedUser(null);
      }
    });
  }, []);

  useEffect(() => {
    db.getLastChangelog().then((r) => setLastChangeLog(r));
  }, []);

  useEffect(() => {
    if (loggedUser == null || loggedUser === "watingUser") return;
    db.getSettingsByUID(loggedUser).then((r) => setSettings(r));
  }, [loggedUser]);

  useEffect(() => {
    if (settings == null) return;
    if (!settings.hasOwnProperty("theme")) return;

    localStorage.setItem("profileSettingsCache", JSON.stringify(settings));

    const html = document.querySelector("html");
    if (settings.theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [settings]);

  const sendNewPhotoNotification = () => {
    addNotification({
      title: "New Photos!",
      subtitle: "Check them out!",
      message: "There are new photos in your area!",
      duration: 5000,
      native: true,
    });
  };

  useEffect(() => {
    async function sendLatestNotification() {
      let latestPhotos = await db.getLatesPhotos();
      if (latestPhotos.length <= 0) return;

      let photoInArea = latestPhotos.filter((photo) => {
        return (
          bounds.ne &&
          bounds.sw &&
          bounds.ne.length > 0 &&
          bounds.sw.length > 0 &&
          photo.lat < bounds.ne[0] &&
          photo.lat > bounds.sw[0] &&
          photo.lng < bounds.ne[1] &&
          photo.lng > bounds.sw[1]
        );
      });
      if (photoInArea.length > 0) {
        sendNewPhotoNotification();
      }
      setNotified(true);
    }

    if (!notified && bounds !== {}) sendLatestNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds]);

  return (
    <>
      {loggedUser === "watingUser" ? (
        <div className="w-full h-screen dark:bg-dark-bg bg-light-bg"></div>
      ) : loggedUser == null ? (
        <Login setCurrentUser={setLoggedUser} />
      ) : (
        <div
          className="w-full pb-5 animationWrapper"
          style={{
            height: isPortrait ? "100dvh" : "100vh",
          }}
        >
          {selectedPhoto !== null ? (
            <PictureView
              setTriggerUpdatePhoto={setTriggerUpdatePhoto}
              userUID={loggedUser}
              picture={selectedPhoto}
              close={() => setSelectedPhoto(null)}
            />
          ) : (
            <></>
          )}
          <div className="absolute top-2 right-2 flex flex-col items-center justify-evenly gap-2 z-10 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text p-4 rounded-xl shadow-lg">
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
            searchArea={() => navigate("/home")}
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
              "absolute bottom-0 left-0 w-full z-20 bg-light-bg dark:bg-dark-bg rounded-t-3xl shadow-top overflow-hidden duration-300 ",
              classNames({
                "h-[90dvh]": location.pathname !== "/",
                "h-[20dvh] sm:h-[10dvh]": location.pathname === "/",
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
                      triggerUpdatePhoto={triggerUpdatePhoto}
                      setTriggerUpdatePhoto={setTriggerUpdatePhoto}
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
