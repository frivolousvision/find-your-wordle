import React, { useState } from "react";
import "./letter.css";

const Letter = (props) => {
  const [selected, setSelected] = useState(false);

  const handleLetterClick = (letter) => {
    if (selected) {
      props.includeLetter(letter);
      setSelected(false);
    } else {
      setSelected(true);
      props.excludeLetter(letter);
    }
  };
  return (
    <div
      className={`container ${selected ? "selected" : "not-selected"}`}
      onClick={() => handleLetterClick(props.letter)}
    >
      <p>{props.letter}</p>
    </div>
  );
};

export default Letter;
