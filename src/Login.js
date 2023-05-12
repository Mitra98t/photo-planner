import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import SampleWallpaper from "./components/SampleWallpaper.js";

const provider = new GoogleAuthProvider();

export default function Login({ setCurrentUser }) {
  const navigate = useNavigate();

  const modalSignIn = async () => {
    signInWithPopup(auth, provider)
      .then(async (r) => {
        const credentials = GoogleAuthProvider.credentialFromResult(r);
        const token = credentials.accessToken;
        const user = r.user;
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          email: user.email,
        });
        setCurrentUser(user.uid);
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("token", token);
        navigate("/");
      })
      .catch((err) => {
        // const credential = GoogleAuthProvider.credentialFromError(err);
        console.log(err);
      });
  };
  return (
    <>
      <SampleWallpaper></SampleWallpaper>
      <div className="absolute inset-0 w-full h-screen bg-transparent  flex items-center justify-center">
        <div className="w-fit h-fit p-8 rounded-xl shadow-lg flex flex-col items-start justify-evenly gap-4 bg-stone-800">
          <p className="text-3xl font-bold text-stone-50">Login</p>
          <button
            onClick={() => modalSignIn()}
            className={
              "whitespace-nowrap p-4 text-xl text-stone-900 bg-stone-50 hover:bg-stone-300 rounded-lg"
            }
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  );
}
