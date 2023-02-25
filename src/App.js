import "./App.css";
import { useEffect, useState } from "react";
import MapCmp from "./components/MapCmp";
import NavBarMap from "./components/NavBars/NavBarMap";
import HomePhoto from "./HomePhoto";
import classNames from "classnames";
import { DBManager as db, randomName } from "./utils/DBManager";
import Profile from "./Profile";
import PictureView from "./components/PictureView";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import ProfileView from "./components/ProfileView";
import AddContent from "./AddContent";
import Login from "./Login";
import { auth } from "./firebase.js";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bounds, setBounds] = useState({});
  const [user, setUser] = useState(null);
  const [loggedUser, setLoggedUser] = useState(
    localStorage.getItem("uid") ? localStorage.getItem("uid") : null
  );
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  // const [startPos, setStartPos] = useState([43.72073, 10.4076]);

  useEffect(() => {
    if (loggedUser == null) return;
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
              picture={selectedPhoto}
              close={() => setSelectedPhoto(null)}
            />
          ) : (
            <></>
          )}
          <MapCmp setBounds={setBounds} blocked={location.pathname !== "/"} />
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
                  <div className="w-full h-[10vh] absolute inset-0 bg-transparent">
                    <NavBarMap
                      user={user}
                      searchArea={() => navigate("home")}
                      profileArea={() => navigate(`profile/${loggedUser}`)}
                    />
                  </div>
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
                element={<Profile close={() => navigate("/")} />}
              >
                <Route
                  path=":UID"
                  element={
                    <ProfileView
                      userUid={loggedUser}
                      selectPhoto={setSelectedPhoto}
                    />
                  }
                />
              </Route>
              <Route path="addContent" element={<AddContent />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
