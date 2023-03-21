import React from "react";
import { formatStyle } from "../utils/utils";

export default function Button({
  children,
  onClick,
  disabled = false,
  baseColor = "stone-900",
  darkBaseColor = "dark-900",
  accentColor = "blue-500",
  darkAccentColor = "",
  text = "text-2xl",
  textColor = "text-stone-50",
  font = "font-bold",
  hover = "",
  width = "w-full",
  height = "h-full",
  paddings = "px-6 py-4",
  additional = "",
  type = "button",
  whiteSpaceWrap = false,
}) {
  const baseColors = formatStyle([
    "dark:bg-" + darkBaseColor,
    "bg-" + accentColor,
  ]);
  const accentColors = formatStyle([
    "dark:outline-" + (darkAccentColor === "" ? accentColor : darkAccentColor),
    "outline-" + baseColor,
  ]);
  const textStyle = formatStyle([text, textColor, font]);
  const general = formatStyle([
    width,
    height,
    paddings,
    additional,
    whiteSpaceWrap ? "" : "whitespace-nowrap",
  ]);

  const hoverStyle = disabled
    ? ""
    : formatStyle([
        ...(hover.length > 0 ? hover.split(" ").map((c) => "hover:" + c) : ""),
      ]);

  return (
    <button
      className={formatStyle([
        "rounded-full outline outline-[4px] dark:outline-[3px] focus:outline-[6px] dark:focus:outline-[5px] flex flex-row items-center justify-center relative overflow-hidden group",
        baseColors,
        accentColors,
        textStyle,
        hoverStyle,
        general,
        disabled
          ? "cursor-not-allowed"
          : "hover:outline-[6px] dark:hover:outline-[5px]",
      ])}
      onClick={disabled ? () => {} : onClick}
      disabled={disabled}
      type={type}
    >
      {children}
      {/* <div className="w-full h-full absolute inset-0 bg-stone-50  opacity-0 group-hover:opacity-30"></div> */}
    </button>
  );
}
