// Secret five letter word
// Players have six guesses to figure out the secret word. After six guesses, they lose.
// If the player guesses a letter that is in the right place, it shown as green
// If the player guesses a letter that is in the word but not in the right place, it shown as yellow
// It does account for however many of the letter exist in the word. A letter should not be lit up more than once if it doesn't appear in the word more than once
// If the player guesses the right word, the player wins and the game is over
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const gameBoard = document.querySelector(".game-board");
const letterBoxes = document.querySelectorAll("input");

const wordOfTheDay = async () => {
  const word = await fetch(WORD_URL);
  const processedWord = await word.json();
  return processedWord.word;
}
let userChoice = "";

const isLetter = (letter) => {
  return /^[a-zA-Z]$/.test(letter);
}

const validateUserWord = async () => {
  if (userChoice.length > 5) {
    userChoice = "";
  }

  if (userChoice.length === 5) {
    await checkGuess();
  }
}

const storeLetterInputs = (event) => {
  // Prevents keys other than letters from firing
  if (!isLetter(event.key)) {
    event.preventDefault();
  }
  // Checks if a letter box value is empty, if it is it will add the event.key as the value to that letter box
  for (let i = 0; i < letterBoxes.length; i++) {
    if (letterBoxes[i].value === "" && isLetter(event.key)) {
      letterBoxes[i].value = event.key;
      userChoice += letterBoxes[i].value;
      break;
    }
  }
  console.log(userChoice);
}

const isSameLetterAndPosition = async () => {
  const dailyWord = await wordOfTheDay();
  for (let i = 0; i < dailyWord.length; i++) {
    const wordLetter = dailyWord[i];
    const userChoiceLetter = userChoice[i];
    if (wordLetter === userChoiceLetter) {
      letterBoxes[i].style.backgroundColor = "green";
    }
  }
}

const isSameLetterDiffPosition = async () => {
  const dailyWord = await wordOfTheDay();
  for (let i = 0; i < dailyWord.length; i++) {
    const wordLetter = dailyWord[i];
    const userChoiceLetter = userChoice[i];
    if (userChoice.includes(wordLetter) && wordLetter !== userChoiceLetter) {
      letterBoxes[i].style.backgroundColor = "yellow";
    }
  }
}

const checkGuess = async () => {
  const dailyWord = await wordOfTheDay();
  if (dailyWord === userChoice) {
    console.log("You Win!");
    gameBoard.removeEventListener("keydown", storeLetterInputs);
    letterBoxes.forEach(box => {
      box.setAttribute("disabled", "");
    });
  } else {
    isSameLetterAndPosition();
    isSameLetterDiffPosition();
  }
}

gameBoard.addEventListener("keydown", storeLetterInputs);
document.addEventListener("keydown", validateUserWord);
