import React from "react";
import { formatStyle } from "../utils/utils";

export default function Button({
  children,
  onClick,
  buttStyle = "primary",
  text = "text-xl",
  onDoubleClick = () => {},
  disabled = false,
  width = "w-full",
  height = "h-full",
  paddings = "px-6 py-4",
  additional = "",
  type = "button",
  whiteSpaceWrap = false,
}) {
  const general = formatStyle([
    width,
    height,
    paddings,
    additional,
    whiteSpaceWrap ? "" : "whitespace-nowrap",
  ]);

  return (
    <button
      className={formatStyle([
        "rounded-full ring-[2px] md:ring-[4px] dark:ring-[1.5px] dark:md:ring-[3px] focus:md:ring-[6px] dark:focus:md:ring-[5px] focus:ring-[4px] dark:focus:ring-[3px] hover:md:ring-[6px] dark:hover:md:ring-[5px] hover:ring-[4px] dark:hover:ring-[3px] flex flex-row items-center justify-center relative overflow-hidden group font-bold",
        text,
        buttStyle === "primary"
          ? "text-dark-text dark:text-dark-text dark:ring-dark-primary dark:bg-dark-lighter-bg ring-light-text bg-light-primary "
          : buttStyle === "secondary"
          ? "text-dark-text dark:text-dark-text dark:ring-dark-secondary dark:bg-dark-lighter-bg ring-light-text bg-light-secondary "
          : "text-dark-text dark:text-dark-text dark:ring-dark-accent dark:bg-dark-lighter-bg ring-light-text bg-light-accent ",
        general,
        disabled
          ? "cursor-not-allowed"
          : "hover:outline-[6px] dark:hover:outline-[5px]",
      ])}
      onClick={disabled ? () => {} : onClick}
      onDoubleClick={disabled ? () => {} : onDoubleClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
