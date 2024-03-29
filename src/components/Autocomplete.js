import classNames from "classnames";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DBManager as db } from "../utils/DBManager";
import ProfilePic from "./ProfilePic";

export default function Autocomplete({
  handleSubmit,
  defaultValue = "",
  topList = false,
  large = false,
  clearOnSubmit = false,
  autofocus = false,
  searchOnClick = false,
  fixed = false,
  alsoUsers = false,
  label = "Search location...",
  setIsEmpty = () => {},
}) {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState(defaultValue);
  const [sent, setSent] = useState(defaultValue !== "");

  const navigate = useNavigate();

  const inputField = useRef(null);

  const onChange = async (e) => {
    if (e.currentTarget.value === "") setIsEmpty(true);
    else setIsEmpty(false);
    setUserInput(e.currentTarget.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (alsoUsers && userInput[0] === "@" && userInput.length > 1) {
        db.getUsersByDisplayName(userInput.substring(1)).then((r) => {
          setFilteredSuggestions(r);
          setShowSuggestions(true);
        });
      } else {
        db.getLocationSuggestinosByName(userInput).then((filtered) => {
          setFilteredSuggestions(filtered);
          setShowSuggestions(true);
        });
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput]);

  const onClick = (e, index) => {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setSent(true);
    setUserInput(
      (alsoUsers && userInput[0] === "@" ? "@" : "") + e.target.innerText
    );

    inputField.current.focus();
    if (searchOnClick)
      if (alsoUsers && userInput[0] === "@") searchUser(index);
      else searchLocation(index);
  };

  const searchUser = async (index = -1) => {
    let displayName = userInput.substring(1);
    if (clearOnSubmit) setUserInput("");
    else
      setUserInput(
        filteredSuggestions[index === -1 ? activeSuggestion : index].username
      );
    let res = !!filteredSuggestions[index === -1 ? activeSuggestion : index]
      ? filteredSuggestions[index === -1 ? activeSuggestion : index]
      : await db.getUsersByDisplayName(displayName)[0];
    navigate(`/profile/${res.ID}`);
  };

  const searchLocation = async (index = -1) => {
    let locationFromInput = userInput;
    if (clearOnSubmit) setUserInput("");
    else
      setUserInput(
        filteredSuggestions[index === -1 ? activeSuggestion : index].luogo
      );
    handleSubmit(
      !!filteredSuggestions[index === -1 ? activeSuggestion : index]
        ? filteredSuggestions[index === -1 ? activeSuggestion : index]
        : await db.getLocationInfoByName(locationFromInput)
    );
  };

  const onKeyDown = async (e) => {
    setSent(false);
    if (e.key === "Enter") {
      setActiveSuggestion(0);
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setSent(true);
      if (alsoUsers && userInput[0] === "@") searchUser();
      else searchLocation();
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
        placeholder={label}
        ref={inputField}
        autoFocus={autofocus}
        className={
          "focus:outline-light-secondary dark:focus:outline-dark-secondary rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text dark:placeholder:text-dark-500 w-full " +
          classNames({
            " text-lg md:text-2xl p-3 ": large,
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
          onClick,
          alsoUsers && userInput[0] === "@"
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
  onClick,
  isUser
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
        " flex rounded-lg  h-fit lg:max-w-[30vw] md:max-w-[50vw] max-w-[80vw] overflow-hidden border-2 border-stone-900 dark:border-stone-50 dark:text-dark-text  "
      }
    >
      {filteredSuggestions.map((suggestion, index) => {
        let className = " bg-light-bg dark:bg-dark-bg ";
        let hover = (
          <div className="absolute inset-0 w-full h-full dark:bg-[#ffffff40] bg-[#00000040]"></div>
        );
        if (isUser)
          return (
            <li
              className={
                "relative first:pt-2 last:pb-2 pl-3 pr-5 py-1 flex flex-row items-center justify-start gap-4  " +
                className +
                classNames({
                  " text-xl ": large,
                  " text-base ": !large,
                })
              }
              key={suggestion.username + index}
              onClick={(e) => onClick(e, index)}
            >
              {activeSuggestion === index ? hover : <></>}
              <div className="h-[3rem] py-1">
                <ProfilePic seed={suggestion.ID} heightBased />
              </div>
              <p>{suggestion.username}</p>
            </li>
          );
        else
          return (
            <li
              className={
                "relative first:pt-2 last:pb-2 pl-3 pr-5 py-1 flex flex-row gap-2 items-end  " +
                className +
                classNames({
                  " text-xl ": large,
                  " text-base ": !large,
                })
              }
              key={suggestion.luogo + index}
              onClick={(e) => onClick(e, index)}
            >
              {activeSuggestion === index ? hover : <></>}
              {suggestion.luogo}
            </li>
          );
      })}
    </ul>
  );
}
