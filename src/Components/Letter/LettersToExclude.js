import React, { useState, useEffect } from "react";
import "./letter.css";

const LettersToExclude = (props) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (props.haveGreen) {
      setSelected(false);
    }
  }, [props.haveGreen]);

  const handleLetterClick = (letter) => {
    if (selected) {
      setSelected(false);
      props.deselectExcludedLetter(letter);
    } else {
      setSelected(true);
      props.selectExcludedLetter(letter);
    }
  };
  return (
    <div>
      {props.possibleWords.length > 0 ? (
        <div
          className={`container ${
            selected ? "nonexistent-selected" : "nonexistent-not-selected"
          }`}
          onClick={() => handleLetterClick(props.letter)}
        >
          <p>{props.letter}</p>
        </div>
      ) : null}
    </div>
  );
};

export default LettersToExclude;
