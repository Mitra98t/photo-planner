import classNames from "classnames";
import React, { useState, useRef } from "react";
import { DBManager as db } from "../utils/DBManager";

export default function Autocomplete({
  handleSubmit,
  topList = false,
  large = false,
  clearOnSubmit = false,
  autofocus=false
}) {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");

  const inputField = useRef(null);

  const onChange = async (e) => {
    const inputValue = e.currentTarget.value;
    setUserInput(inputValue);

    let filtered = await db.getLocationSuggestinosByName(inputValue);

    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const onClick = (e) => {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.currentTarget.innerText);

    inputField.current.focus();
  };

  const onKeyDown = async (e) => {
    // e.preventDefault();
    if (e.key === "Enter") {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      let locationFromInput = userInput;
      if (clearOnSubmit) setUserInput("");
      else setUserInput(filteredSuggestions[activeSuggestion].luogo);
      handleSubmit(
        !!filteredSuggestions[activeSuggestion]
          ? filteredSuggestions[activeSuggestion]
          : await db.getLocationInfoByName (locationFromInput)
      );
    } else if (
      (!topList && e.keyCode === 38) ||
      (topList && e.keyCode === 40)
    ) {
      if (activeSuggestion <= 0) {
        setActiveSuggestion(0);
      } else setActiveSuggestion(() => activeSuggestion - 1);
    } else if (
      (!topList && e.keyCode === 40) ||
      (topList && e.keyCode === 38)
    ) {
      if (activeSuggestion >= filteredSuggestions.length) {
        setActiveSuggestion(() => filteredSuggestions.length - 1);
      } else {
        setActiveSuggestion(() => activeSuggestion + 1);
      }
    }
  };

  let suggestionsListComponent = <></>;
  if (showSuggestions && userInput) {
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <ul
          className={
            classNames({
              " flex-col ": !topList,
              " flex-col-reverse ": topList,
            }) +
            " fixed flex rounded-lg overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300 max-h-40 border-2 border-stone-900"
          }
        >
          {filteredSuggestions.map((suggestion, index) => {
            let className = " bg-stone-50 ";
            if (index === activeSuggestion) {
              className = " bg-stone-300 ";
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
    } else {
      suggestionsListComponent = (
        <div
          className={
            "fixed rounded-lg overflow-hidden " +
            classNames({
              " text-xl px-3 py-1 ": large,
              " text-base px-2 py-1": !large,
            })
          }
        >
          <em className=" p-4 ">No suggestions available.</em>
        </div>
      );
    }
  }

  return (
    <div className="relative h-fit w-full ">
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
        placeholder={"Search city..."}
        ref={inputField}
        autoFocus={autofocus}
        className={
          "focus:outline-stone-900 rounded-lg bg-stone-50 text-stone-900 w-full " +
          classNames({
            " text-2xl p-3 ": large,
            " text-base p-2 ": !large,
          }) 
        }
      />
      <div
        className={
          "absolute left-0 flex " +
          classNames({
            " top-10 flex-col ": !topList,
            " bottom-10 flex-col-reverse ": topList,
          })
        }
      >
        {suggestionsListComponent}
      </div>
    </div>
  );
}
