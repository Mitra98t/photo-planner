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

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bounds, setBounds] = useState({});
  const [mapLocation, setMapLocation] = useState({
    coords: [43.72077871691476, 10.407882154565954],
    zoom: 15,
  });

  const [loggedUser, setLoggedUser] = useState(
    localStorage.getItem("uid") ? localStorage.getItem("uid") : null
  );
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  // const [startPos, setStartPos] = useState([43.72073, 10.4076]);

  useEffect(() => {
    if (loggedUser == null) return;
    // console.log(loggedUser);
    // db.getUserInformationByUID(loggedUser)
    //   .then((v) => {
    //     setUser(v);
    //   })
    //   .catch((err) => {});
  }, [loggedUser]);

  return (
    <>
      {loggedUser == null ? (
        <Login setCurrentUser={setLoggedUser} />
      ) : (
        <div className="w-full h-screen pb-5">
          {selectedPhoto !== null ? (
            <PictureView
              userUID={loggedUser}
              picture={selectedPhoto}
              close={() => setSelectedPhoto(null)}
            />
          ) : (
            <></>
          )}
          <div className="absolute top-2 right-2 flex flex-col items-center justify-evenly gap-2 z-[500] bg-stone-50 p-4 rounded-xl shadow-lg">
            <span className="font-semibold text-base text-stone-900">
              It's a Beta be kind
            </span>
            <button
              href="https://padlet.com/personalmailfm98/feed-back-y89afrpn4r234gut"
              onClick={() =>
                window.open(
                  "https://padlet.com/personalmailfm98/feed-back-y89afrpn4r234gut",
                  "_blank"
                )
              }
              className="italic font-medium text-sm text-stone-900"
            >
              And report bugs {"<"}3
            </button>
          </div>
          <MapCmp
            setBounds={setBounds}
            blocked={location.pathname !== "/"}
            mapLocation={mapLocation}
          />
          <div
            className={
              "absolute bottom-0 left-0 w-full bg-stone-50 rounded-t-3xl shadow-top overflow-hidden transition-all ease-in-out duration-300 " +
              classNames({
                "h-[90vh]": location.pathname !== "/",
                "h-[10vh]": location.pathname === "/",
              })
            }
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
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
