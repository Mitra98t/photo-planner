import React, { Fragment, useState } from "react";
import { DBManager as db } from "../utils/DBManager";

export default function Autocomplete() {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");

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
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestion].luogo);
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(() => activeSuggestion - 1);
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestion(() => activeSuggestion + 1);
    }
  };

  let suggestionsListComponent = <></>;
  if (showSuggestions && userInput) {
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <ul className="absolute left-0 top-8">
          {filteredSuggestions.map((suggestion, index) => {
            let className = "bg-stone-50";

            // Flag the active suggestion with a class
            if (index === activeSuggestion) {
              className = "bg-stone-300";
            }
            return (
              <li
                className={className}
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
        <div className="">
          <em>No suggestions available.</em>
        </div>
      );
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
      />
      {suggestionsListComponent}
    </div>
  );
}
