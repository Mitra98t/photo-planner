import React from "react";
import { formatStyle } from "../utils/utils";

export default function Toggle({
  color = "blue-500",
  width = "w-full",
  height = "h-full",
  onClick = () => {},
  toggle = null,
}) {
  const colorStyle = formatStyle(["bg-" + color]);
  const dimensions = formatStyle([width, height]);
  return (
    <button
      onClick={onClick}
      className={formatStyle([
        "w-full h-full rounded-full group relative flex flex-row items-center border-2 border-stone-900",
        toggle === null
          ? "justify-center"
          : toggle
          ? "justify-end"
          : "justify-start",
        toggle ? colorStyle : "bg-stone-500",
        dimensions,
      ])}
    >
      <div
        className={formatStyle([
          "rounded-full h-full w-auto aspect-square scale-105 group-hover:scale-110 duration-100 bg-stone-50 outline outline-2 outline-stone-900",
        ])}
      ></div>
    </button>
  );
}
