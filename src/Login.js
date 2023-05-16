import React from "react";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  inMemoryPersistence,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "./firebase.js";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import SampleWallpaper from "./components/SampleWallpaper.js";

// const provider = new GoogleAuthProvider();

export default function Login({ setCurrentUser }) {
  const navigate = useNavigate();

  const modalSignIn = async () => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(async (r) => {
          // const credentials = GoogleAuthProvider.credentialFromResult(r);
          const user = r.user;
          await setDoc(doc(db, "users", user.uid), {
            username: user.displayName,
            email: user.email,
          });
          setCurrentUser(user.uid);
          navigate("/");
        })
        .catch((err) => {
          // const credential = GoogleAuthProvider.credentialFromError(err);
          console.log(err);
        });
    });
  };
  return (
    <>
      <SampleWallpaper></SampleWallpaper>
      <div className="absolute inset-0 w-full h-screen bg-transparent  flex items-center justify-center">
        <div className="w-fit h-fit p-8 rounded-xl shadow-lg flex flex-col items-start justify-evenly gap-4 bg-dark-bg">
          <p className="text-3xl font-bold text-dark-text">Login</p>
          <button
            onClick={() => modalSignIn()}
            className={
              "whitespace-nowrap p-4 text-xl text-light-text bg-light-bg hover:bg-stone-300 rounded-lg"
            }
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  );
}
