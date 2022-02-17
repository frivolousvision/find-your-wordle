import React, { useState } from "react";
import Letter from "./Components/Letter/Letter";
import "./App.css";

function App() {
  const [firstLetter, setFirstLetter] = useState("?");
  const [secondLetter, setSecondLetter] = useState("?");
  const [thirdLetter, setThirdLetter] = useState("?");
  const [fourthLetter, setFourthLetter] = useState("?");
  const [fifthLetter, setFifthLetter] = useState("?");
  const [possibleWords, setPossibleWords] = useState([]);
  const [nonexistentLetters] = useState([]);
  const [allLetters] = useState([
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
  ]);

  let word = ["?", "?", "?", "?", "?"];

  const handleSubmit = (e) => {
    e.preventDefault();
    searchWord();
  };
  const searchWord = async () => {
    console.log("search word called");
    if (firstLetter.length > 0 && typeof firstLetter === "string") {
      word.splice(0, 1, firstLetter);
    } else {
      word.splice(0, 1, "?");
      setFirstLetter("?");
    }
    if (secondLetter.length > 0 && typeof secondLetter === "string") {
      word.splice(1, 1, secondLetter);
    } else {
      word.splice(1, 1, "?");
      setSecondLetter("?");
    }
    if (thirdLetter.length > 0 && typeof thirdLetter === "string") {
      word.splice(2, 1, thirdLetter);
    } else {
      word.splice(2, 1, "?");
      setThirdLetter("?");
    }
    if (fourthLetter.length > 0 && typeof fourthLetter === "string") {
      word.splice(3, 1, fourthLetter);
    } else {
      word.splice(3, 1, "?");
      setFourthLetter("?");
    }
    if (fifthLetter.length > 0 && typeof fifthLetter === "string") {
      word.splice(4, 1, fifthLetter);
    } else {
      word.splice(4, 1, "?");
      setFifthLetter("?");
    }
    let wordToSearch = word.join("");
    const result = await fetch(
      `https://api.datamuse.com/words?sp=${wordToSearch}`
    );
    const jsonResult = await result.json();
    setPossibleWords(jsonResult);

    filterWords();
  };

  const filterWords = () => {
    for (let i = 0; i < nonexistentLetters.length; i++) {
      setPossibleWords(
        possibleWords.filter(
          (word) =>
            !word.word
              .toLowerCase()
              .includes(nonexistentLetters[i].toLowerCase())
        )
      );
    }
    console.log(nonexistentLetters);
  };

  const excludeLetter = (letter) => {
    nonexistentLetters.push(letter);
    filterWords();
  };
  const includeLetter = (letter) => {
    let index = nonexistentLetters.findIndex((x) => x === letter);
    nonexistentLetters.splice(index, 1);
    console.log(index);
    searchWord();
  };

  return (
    <div className='App'>
      <h1>FIND YOUR WORDLE</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className='input-field'>
          <input
            type='text'
            maxLength={1}
            placeholder='?'
            value={firstLetter.toUpperCase()}
            onFocus={() => setFirstLetter("")}
            onChange={(e) => setFirstLetter(e.target.value)}
            className={`${
              firstLetter !== "?" && firstLetter.length > 0
                ? "input-entered"
                : "input-blank"
            }`}
          ></input>
          <input
            type='text'
            maxLength={1}
            placeholder='?'
            value={secondLetter.toUpperCase()}
            onFocus={() => setSecondLetter("")}
            onChange={(e) => setSecondLetter(e.target.value)}
            className={`${
              secondLetter !== "?" && secondLetter.length > 0
                ? "input-entered"
                : "input-blank"
            }`}
          ></input>
          <input
            type='text'
            maxLength={1}
            placeholder='?'
            value={thirdLetter.toUpperCase()}
            onFocus={() => setThirdLetter("")}
            onChange={(e) => setThirdLetter(e.target.value)}
            className={`${
              thirdLetter !== "?" && thirdLetter.length > 0
                ? "input-entered"
                : "input-blank"
            }`}
          ></input>
          <input
            type='text'
            maxLength={1}
            placeholder='?'
            value={fourthLetter.toUpperCase()}
            onFocus={() => setFourthLetter("")}
            onChange={(e) => setFourthLetter(e.target.value)}
            className={`${
              fourthLetter !== "?" && fourthLetter.length > 0
                ? "input-entered"
                : "input-blank"
            }`}
          ></input>
          <input
            type='text'
            maxLength={1}
            placeholder='?'
            value={fifthLetter.toUpperCase()}
            onFocus={() => setFifthLetter("")}
            onChange={(e) => setFifthLetter(e.target.value)}
            className={`${
              fifthLetter !== "?" && fifthLetter.length > 0
                ? "input-entered"
                : "input-blank"
            }`}
          ></input>
        </div>
        <button className='search-button'>Search</button>
      </form>
      {/* <button onClick={() => filterWords()} className='filter-button'>
        Filter
      </button> */}
      <h2>Select letters to exclude:</h2>
      <div className='letter-list'>
        {allLetters.map((letter, index) => (
          <Letter
            letter={letter}
            key={index}
            excludeLetter={excludeLetter}
            includeLetter={includeLetter}
          />
        ))}
      </div>
      {possibleWords.length > 0 ? <h1>Possible Wordles:</h1> : null}
      <div className='word-list'>
        {possibleWords
          ? possibleWords.map((word, index) => (
              <div key={index} className='each-word'>
                <p>{word.word.toUpperCase()}</p>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default App;
