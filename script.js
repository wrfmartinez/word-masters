const letters = document.querySelectorAll("#letter");
const loadingDiv = document.querySelector('.loading-indicator');
const boxRows = document.querySelectorAll('row');
const ANSWER_LENGTH = 5;
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

const wordOfTheDay = async () => {
  const word = await fetch(WORD_URL);
  const processedWord = word.json();
  return processedWord;
}

const init = async () => {
  let currentGuess = "";
  let currentRow = 0;

  const addLetter = (letter) => {
    if (currentGuess.length < ANSWER_LENGTH) {
      // Add letter to the end
      currentGuess += letter;
    } else {
      // Replace the last letter
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    // Sets the current row of letters to type in
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].textContent = letter;
  }

  const submitGuess = async () => {
    if (currentGuess.length !== ANSWER_LENGTH) {
      // do nothing
      return;
    }

    boxRows[currentRow++];
    currentGuess = "";
  }

  const handleKeyPress = (event) => {
    const action = event.key;
    console.log(action);

    if (action === "Enter") {
      submitGuess();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action);
    } else {
      // do nothing
    }
  }

  document.addEventListener("keydown", handleKeyPress);
}

const isLetter = (letter) => {
  return /^[a-zA-Z]$/.test(letter);
}

init();
