import React, { useState } from "react";
import { formatStyle } from "../utils/utils";

export default function Button({
  children,
  onClick,
  baseColor = "stone-900",
  darkBaseColor = "dark-900",
  accentColor = "blue-500",
  darkAccentColor = "blue-500",
  text = "text-2xl",
  textColor = "text-stone-50",
  darkTextColor = "",
  font = "font-bold",
  borderWidth = "border-[3px]",
}) {
  const base = formatStyle(["dark:bg-" + darkBaseColor, "bg-" + accentColor]);
  const border = formatStyle([
    borderWidth,
    "dark:border-" + darkAccentColor,
    "border-" + baseColor,
  ]);
  const textStyle = formatStyle([
    text,
    textColor,
    "dark:" + (darkTextColor === "" ? textColor : darkTextColor),
    font,
  ]);
  return (
    <button
      className={formatStyle([
        "w-full h-full rounded-full flex flex-row items-center justify-center relative overflow-hidden group",
        base,
        border,
        textStyle,
      ])}
      onClick={onClick}
    >
      {children}
      <div className="w-full h-full absolute inset-0 bg-stone-50  opacity-0 group-hover:opacity-30"></div>
    </button>
  );
}
