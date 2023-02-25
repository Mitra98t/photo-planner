import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export default function Login({ setCurrentUser }) {
  const navigate = useNavigate();

  const modalSignIn = async () => {
    console.log("sign in");
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
        navigate("/");
      })
      .catch((err) => {
        console.log(err.code);
        const credential = GoogleAuthProvider.credentialFromError(err);
      });
  };
  return (
    <div>
      Login
      <button onClick={() => modalSignIn()}>Sign in with google</button>
    </div>
  );
}
