import React, { useEffect, useState } from "react";
import Icons from "./Icons";

export default function ThemeSelector() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  useEffect(() => {
    // select html elem
    const html = document.querySelector("html");
    //add or remove class dark in html elem according to theme in localstorage.
    if (localStorage.getItem("theme") === "dark") {
      html.classList.add("dark");
      setTheme("dark");
    } else {
      html.classList.remove("dark");
      setTheme("light");
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    if (localStorage.getItem("theme") === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  };
  return (
    <button onClick={handleThemeSwitch}>
      <Icons
        icon={localStorage.theme === "light" ? "moon" : "sun"}
        color={" stroke-stone-900 dark:stroke-stone-50 "}
        styling={{
          w: "3rem",
          strokeWidth: "1.5px",
        }}
      />
    </button>
  );
}
