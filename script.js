const letters = document.querySelectorAll("#letter");
const loadingDiv = document.querySelector('.loading-indicator');
const ANSWER_LENGTH = 5;

const init = async () => {
  let currentGuess = "";

  const addLetter = (letter) => {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[currentGuess.length - 1].textContent = letter;
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
