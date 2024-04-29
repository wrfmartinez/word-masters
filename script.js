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

const storeLetterInputs = (event) => {
  if (userChoice.length >= 5) {
    userChoice = "";
  }

  if (!isLetter(event.key)) {
    event.preventDefault();
  }

  for (let i = 0; i < letterBoxes.length; i++) {
    if (letterBoxes[i].value === "") {
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
    // Checks if the letter value within the same index(position) in the word is the same as the letter in the user's choice
    if (wordLetter === userChoiceLetter) {
      console.log(i, wordLetter);
    }
  }
}

const isSameLetterDiffPosition = async () => {
  const dailyWord = await wordOfTheDay();
  for (let i = 0; i < dailyWord.length; i++) {
    const wordLetter = dailyWord[i];
    const userChoiceLetter = userChoice[i];

    // Checks if the word includes any of the letters within the word in the users choice but is not in the same position as the word
    if (dailyWord.includes(userChoiceLetter) && wordLetter !== userChoiceLetter) {
      console.log(i, userChoiceLetter);
    }
  }
}

for (let i = 0; i < letterBoxes.length; i++) {
  letterBoxes[i].addEventListener("keydown", storeLetterInputs);
}
