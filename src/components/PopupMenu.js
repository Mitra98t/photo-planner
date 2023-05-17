import React, { useEffect, useRef } from "react";

export default function PopupMenu({ close, hidden, children }) {
  const main = useRef(null);

  const handleClickOutside = (e) => {
    e.preventDefault();
    if (main.current != null && !main.current.contains(e.target)) close();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return hidden ? (
    <></>
  ) : (
    <div
      ref={main}
      className="absolute top-20 right-0 bg-light-bg dark:bg-dark-bg rounded-3xl z-[60] shadow-area overflow-hidden"
    >
      <div className=" flex flex-col gap-2 w-fit max-h-[40vh] overflow-y-scroll h-fit p-4 text-light-text scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-600 scrollbar-track-transparent scrollbar-thin ">
        {children}
      </div>
    </div>
  );
}
