import classNames from "classnames";
import React, { useState, useRef, useEffect } from "react";
import { DBManager as db } from "../utils/DBManager";

export default function Autocomplete({
  handleSubmit,
  defaultValue = "",
  topList = false,
  large = false,
  clearOnSubmit = false,
  autofocus = false,
  searchOnClick = false,
  fixed = false,
}) {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState(defaultValue);
  const [sent, setSent] = useState(defaultValue !== "");

  const inputField = useRef(null);

  const onChange = async (e) => {
    setUserInput(e.currentTarget.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      db.getLocationSuggestinosByName(userInput).then((filtered) => {
        setFilteredSuggestions(filtered);
        setShowSuggestions(true);
      });
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [userInput]);

  const onClick = (e) => {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.currentTarget.innerText);

    inputField.current.focus();
    if (searchOnClick) searchLocation();
  };

  const searchLocation = async () => {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setSent(true);
    let locationFromInput = userInput;
    if (clearOnSubmit) setUserInput("");
    else setUserInput(filteredSuggestions[activeSuggestion].luogo);
    handleSubmit(
      !!filteredSuggestions[activeSuggestion]
        ? filteredSuggestions[activeSuggestion]
        : await db.getLocationInfoByName(locationFromInput)
    );
  };

  const onKeyDown = async (e) => {
    setSent(false);
    if (e.key === "Enter") {
      searchLocation();
    } else if (
      (!topList && e.keyCode === 38) ||
      (topList && e.keyCode === 40)
    ) {
      e.preventDefault();
      if (activeSuggestion <= 0) {
        setActiveSuggestion(0);
      } else setActiveSuggestion(() => activeSuggestion - 1);
    } else if (
      (!topList && e.keyCode === 40) ||
      (topList && e.keyCode === 38)
    ) {
      e.preventDefault();
      if (activeSuggestion >= filteredSuggestions.length) {
        setActiveSuggestion(() => filteredSuggestions.length - 1);
      } else {
        setActiveSuggestion(() => activeSuggestion + 1);
      }
    }
  };

  return (
    <div className="relative h-fit w-full ">
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        onClick={() => setSent(false)}
        value={userInput}
        placeholder={"Search city..."}
        ref={inputField}
        autoFocus={autofocus}
        className={
          "focus:outline-stone-900 dark:focus:outline-stone-50 rounded-lg bg-stone-50 dark:bg-dark-800 text-stone-900 dark:text-stone-50 dark:placeholder:text-dark-500 w-full " +
          classNames({
            " text-2xl p-3 ": large,
            " text-base p-2 ": !large,
          })
        }
      />
      <div
        className={
          "absolute left-0 flex z-[900] " +
          classNames({
            " top-10 flex-col ": !topList,
            " bottom-10 flex-col-reverse ": topList,
          })
        }
      >
        {suggestions(
          topList,
          fixed,
          filteredSuggestions,
          activeSuggestion,
          large,
          showSuggestions,
          sent,
          onClick
        )}
      </div>
    </div>
  );
}
function suggestions(
  topList,
  fixed,
  filteredSuggestions,
  activeSuggestion,
  large,
  showSuggestions,
  sent,
  onClick
) {
  if (!showSuggestions || filteredSuggestions.length === 0 || sent)
    return <></>;
  return (
    <ul
      className={
        classNames({
          " flex-col ": !topList,
          " flex-col-reverse ": topList,
        }) +
        classNames({
          "  ": !fixed,
          " fixed ": fixed,
        }) +
        " flex rounded-lg  h-fit overflow-hidden border-2 border-stone-900 dark:border-stone-50 dark:text-stone-50 max-w-[30vw] "
      }
    >
      {filteredSuggestions.map((suggestion, index) => {
        let className = " bg-stone-50 dark:bg-dark-800 ";
        if (index === activeSuggestion) {
          className = " bg-stone-300 dark:bg-dark-700 ";
        }
        return (
          <li
            className={
              " first:pt-2 last:pb-2 pl-3 pr-5 py-1 flex flex-row gap-2 items-end  " +
              className +
              classNames({
                " text-xl ": large,
                " text-base ": !large,
              })
            }
            key={suggestion.luogo + index}
            onClick={onClick}
          >
            {suggestion.luogo}
          </li>
        );
      })}
    </ul>
  );
}
