import React from "react";
import { formatStyle } from "../utils/utils";

export default function Toggle({
  width = "w-full",
  height = "h-full",
  onClick = () => {},
  toggle = null,
}) {
  const dimensions = formatStyle([width, height]);
  return (
    <button
      onClick={onClick}
      className={formatStyle([
        "w-full h-full rounded-full group relative flex flex-row items-center border-2 border-stone-900 dark:border-stone-50 focus:scale-110 focus:ring-none ",
        toggle === null
          ? "justify-center"
          : toggle
          ? "justify-end"
          : "justify-start",
        toggle ? "bg-light-accent dark:bg-dark-accent" : "bg-light-bg dark:bg-dark-bg",
        dimensions,
      ])}
    >
      <div
        className={formatStyle([
          "rounded-full h-full w-auto aspect-square scale-105 group-hover:scale-110 duration-100 bg-light-bg dark:bg-dark-900 ring-2 ring-stone-900 dark:ring-stone-50",
        ])}
      ></div>
    </button>
  );
}
