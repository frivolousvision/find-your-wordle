import React, { useState, useRef } from "react";
import LettersToExclude from "./Components/Letter/LettersToExclude";
import LettersToInclude from "./Components/Letter/LettersToInclude";
import OnlyYellowsLettersToInclude from "./Components/Letter/OnlyYellowsLettersToInclude";
import "./App.css";

function App() {
  const [searched, setSearched] = useState(false);
  const [firstLetter, setFirstLetter] = useState("?");
  const [secondLetter, setSecondLetter] = useState("?");
  const [thirdLetter, setThirdLetter] = useState("?");
  const [fourthLetter, setFourthLetter] = useState("?");
  const [fifthLetter, setFifthLetter] = useState("?");
  const [possibleWords, setPossibleWords] = useState([]);
  const [nonexistentLetters, setNonexistentLetters] = useState([]);
  const [existentLetters, setExistentLetters] = useState([]);
  const [onlyYellows, setOnlyYellows] = useState(false);
  const [haveGreen, setHaveGreen] = useState(false);
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
  const [word] = useState(["?", "?", "?", "?", "?"]);
  const myRef = useRef(null);

  const handleScroll = () => {
    myRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    searchWord();
    setTimeout(() => {
      handleScroll();
    }, 500);
  };
  const searchWord = async () => {
    if (searched) {
      setHaveGreen(true);
    }
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
    if (existentLetters.length === 0) {
      const result = await fetch(
        `https://api.datamuse.com/words?sp=${wordToSearch}`
      );
      const jsonResult = await result.json();
      setPossibleWords(jsonResult);
    } else if (existentLetters.length > 0) {
      try {
        if (existentLetters.length === 1) {
          const result = await fetch(
            `https://api.datamuse.com/words?sp=${wordToSearch},*${existentLetters
              .join("")
              .toLowerCase()}*
            `
          );
          const jsonResult = await result.json();
          if (nonexistentLetters.length > 0) {
            const booleanArray = await filterOnSearch(jsonResult);
            setPossibleWords(
              jsonResult.filter((value, index) => booleanArray[index])
            );
          } else {
            setPossibleWords(jsonResult);
          }
        } else {
          let letterString = formatExistentLetterString(existentLetters);
          const result = await fetch(
            `https://api.datamuse.com/words?sp=${wordToSearch}${letterString}
              `
          );
          const jsonResult = await result.json();
          if (nonexistentLetters.length > 0) {
            const booleanArray = await filterOnSearch(jsonResult);
            setPossibleWords(
              jsonResult.filter((value, index) => booleanArray[index])
            );
          } else {
            setPossibleWords(jsonResult);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    setSearched(true);
  };

  const formatExistentLetterString = (arr) => {
    let newArray = [];
    for (let i = 0; i < arr.length; i++) {
      newArray.push(arr[i].concat("*"));
    }
    return ",*" + newArray.join(`,*`).toLowerCase();
  };

  const filterNonexistentLetters = () => {
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
  };

  const filterOnSearch = (arr) => {
    for (let i = 0; i < nonexistentLetters.length; i++) {
      return arr.map(
        (word) =>
          !word.word.toLowerCase().includes(nonexistentLetters[i].toLowerCase())
      );
    }
  };

  const filterExistentLetters = () => {
    for (let i = 0; i < existentLetters.length; i++) {
      setPossibleWords(
        possibleWords.filter((word) =>
          word.word.toLowerCase().includes(existentLetters[i].toLowerCase())
        )
      );
    }
  };

  const selectExcludedLetter = (letter) => {
    nonexistentLetters.push(letter);
    if (possibleWords.length > 0) {
      filterNonexistentLetters();
    }
  };

  const deselectExcludedLetter = (letter) => {
    setNonexistentLetters(nonexistentLetters.filter((x) => x !== letter));
    if (possibleWords.length > 0) {
      searchWord();
    }
  };

  const selectIncludedLetter = (letter) => {
    existentLetters.push(letter);
    searchWord();
    // if (possibleWords.length > 0) {
    //   filterExistentLetters();
    // }
  };

  const deselectIncludedLetter = (letter) => {
    setExistentLetters(existentLetters.filter((x) => x !== letter));
    if (possibleWords.length > 0) {
      searchWord();
    }
  };

  const selectOnlyYellowLetter = (letter) => {
    existentLetters.push(letter);
    // searchWord();
    if (possibleWords.length > 0) {
      filterExistentLetters();
    }
  };

  const deselectOnlyYellowLetter = (letter) => {
    setExistentLetters(existentLetters.filter((x) => x !== letter));
    if (possibleWords.length > 0) {
      searchWord();
    }
  };

  const handleYellowGreenToggle = () => {
    if (!onlyYellows) {
      setOnlyYellows(true);
      setHaveGreen(false);
      setPossibleWords([]);
    } else {
      setOnlyYellows(false);
      setHaveGreen(true);
      setPossibleWords([]);
    }
  };

  return (
    <div className='App'>
      <h1 className={`header ${searched ? "searched" : "not-searched"}`}>
        Find Your Wordle
      </h1>
      {onlyYellows && possibleWords.length === 0 ? (
        <div className='only-yellows-container'>
          <h3>Select your yellow letters:</h3>
          <div className='existent-letter-list'>
            {allLetters.map((letter, index) => (
              <OnlyYellowsLettersToInclude
                letter={letter}
                key={index}
                selectOnlyYellowLetter={selectOnlyYellowLetter}
                deselectOnlyYellowLetter={deselectOnlyYellowLetter}
                possibleWords={possibleWords}
              />
            ))}
          </div>
        </div>
      ) : null}
      {!onlyYellows ? <p>Enter your green letters here:</p> : null}
      <form onSubmit={(e) => handleSubmit(e)}>
        {!onlyYellows ? (
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
        ) : null}
        {/* {possibleWords.length === 0 && !searched ? ( */}
        <button className='search-button'>Search</button>
        {/* ) : null} */}
      </form>
      {/* {searched ? (
        <button className='search-button' onClick={() => refreshPage()}>
          New Search
        </button>
      ) : null} */}
      <div ref={myRef}></div>
      {!onlyYellows && !searched ? (
        <p
          onClick={() => handleYellowGreenToggle()}
          className='toggle-yellow-green-button'
        >
          I only have yellow letters
        </p>
      ) : null}
      {onlyYellows ? (
        <p
          onClick={() => handleYellowGreenToggle()}
          className='toggle-yellow-green-button'
        >
          I have green letters now
        </p>
      ) : null}
      {possibleWords.length > 0 ? (
        <h3>Select letters you know aren't in the word:</h3>
      ) : null}
      <div className='nonexistent-letter-list'>
        {allLetters.map((letter, index) => (
          <LettersToExclude
            letter={letter}
            key={index}
            selectExcludedLetter={selectExcludedLetter}
            deselectExcludedLetter={deselectExcludedLetter}
            possibleWords={possibleWords}
            haveGreen={haveGreen}
            existentLetters={existentLetters}
            nonexistentLetters={nonexistentLetters}
            searched={searched}
            word={word}
          />
        ))}
      </div>
      {possibleWords.length > 0 ? (
        <h3>Select letters you know are in the word:</h3>
      ) : null}
      <div className='existent-letter-list'>
        {allLetters.map((letter, index) => (
          <LettersToInclude
            letter={letter}
            key={index}
            selectIncludedLetter={selectIncludedLetter}
            deselectIncludedLetter={deselectIncludedLetter}
            possibleWords={possibleWords}
            haveGreen={haveGreen}
            existentLetters={existentLetters}
            nonexistentLetters={nonexistentLetters}
            searched={searched}
            word={word}
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
