import React, { useState, useEffect } from "react";
import "./letter.css";

const LettersToInclude = (props) => {
  const [selected, setSelected] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (props.haveGreen) {
      setSelected(false);
    }
    for (let i = 0; i < props.word.length; i++) {
      if (props.word[i].toLowerCase() === props.letter.toLowerCase()) {
        setSelected(true);
      }
    }
    for (let i = 0; i < props.existentLetters.length; i++) {
      if (
        props.existentLetters[i].toLowerCase() === props.letter.toLowerCase()
      ) {
        setSelected(true);
      }
    }
    if (props.nonexistentLetters) {
      for (let i = 0; i < props.nonexistentLetters.length; i++) {
        if (
          props.nonexistentLetters[i].toLowerCase() ===
          props.letter.toLowerCase()
        ) {
          setDisabled(true);
        }
      }
    }
  }, [props.haveGreen, props.searched, props.possibleWords]);

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
          } ${disabled ? "disabled" : null}`}
          onClick={!disabled ? () => handleLetterClick(props.letter) : null}
        >
          <p>{props.letter}</p>
        </div>
      ) : null}
    </div>
  );
};

export default LettersToInclude;
