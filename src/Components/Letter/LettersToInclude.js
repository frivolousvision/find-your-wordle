import React, { useState, useEffect } from "react";
import "./letter.css";

const LettersToInclude = (props) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (props.haveGreen) {
      setSelected(false);
    }
  }, [props.haveGreen]);

  const handleLetterClick = (letter) => {
    if (selected) {
      setSelected(false);
      props.deselectIncludedLetter(letter);
    } else {
      setSelected(true);
      props.selectIncludedLetter(letter);
    }
  };
  return (
    <div>
      {props.possibleWords.length > 0 ? (
        <div
          className={`container ${
            selected ? "existent-selected" : "existent-not-selected"
          }`}
          onClick={() => handleLetterClick(props.letter)}
        >
          <p>{props.letter}</p>
        </div>
      ) : null}
    </div>
  );
};

export default LettersToInclude;
