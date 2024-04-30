const letters = document.querySelectorAll("#letter");
const loadingDiv = document.querySelector('.loading-indicator');
const boxRows = document.querySelectorAll('row');
const ANSWER_LENGTH = 5;

const getWord = async () => {
  const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
  const res = await fetch(WORD_URL);
  const resObj = await res.json();
  return resObj.word;
}

const init = async () => {
  let currentGuess = "";
  let currentRow = 0;
  const word = await getWord();
  const wordLetters = word.split("");
  setLoading(false);

  const addLetter = (letter) => {
    if (currentGuess.length < ANSWER_LENGTH) {
      // Add letter to the end
      currentGuess += letter;
    } else {
      // Replace the last letter win a new typed letter
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

    // TODO validate the word

    // TODO do all the marking as "correct" "close" or "incorrect"

    const userLetters = currentGuess.split("");

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      // Mark as correct
      if (userLetters[i] === wordLetters[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (userLetters[i] === wordLetters[i]) {
        // do nothing
      } else if (wordLetters.includes(userLetters[i])) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("incorrect");
      }
    }

    // TODO did they win or lose?

    boxRows[currentRow++];
    currentGuess = "";
  }

  const backspace = () => {
    // Remove the last letter
    currentGuess = currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    // Clear the last typed letter
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].textContent = "";
  }

  const handleKeyPress = (event) => {
    const action = event.key;

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

const setLoading = (isLoading) => {
  loadingDiv.classList.toggle("show", isLoading);
}

init();
