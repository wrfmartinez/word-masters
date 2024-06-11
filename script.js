const ANSWER_LENGTH = 5;
const ROUNDS = 6;

const getWord = async () => {
  const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
  const res = await fetch(WORD_URL);
  const resObj = await res.json();
  return resObj.word;
}

const init = async () => {
  let currentGuess = "";
  let currentRow = 0;
  let isLoading = true;

  const word = await getWord();
  const wordLetters = word.split("");
  let done = false;
  setLoading(false);
  isLoading = false;

  const addLetter = (letter) => {
    if (currentGuess.length < ANSWER_LENGTH) {
      // Add letter to the end
      currentGuess += letter;
    } else {
      // Replace the last letter win a new typed letter
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    // Sets the current row of letters to type in
    $("#letter").eq(ANSWER_LENGTH * currentRow + currentGuess.length - 1).text(letter);
  }

  const submitGuess = async () => {
    if (currentGuess.length !== ANSWER_LENGTH) {
      // do nothing
      return;
    }

    isLoading = true;
    setLoading(true);
    const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word"
    const res = await fetch(VALIDATE_WORD_URL, {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });

    const resObj = await res.json();
    const validWord = resObj.validWord;

    isLoading = false;
    setLoading(false);

    if(!validWord) {
      markInvalidWord();
      return;
    }

    const userLetters = currentGuess.split("");
    const map = makeMap(wordLetters);

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      // Mark as correct
      if (userLetters[i] === wordLetters[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[userLetters[i]]--;
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (userLetters[i] === wordLetters[i]) {
        // do nothing
      } else if (wordLetters.includes(userLetters[i]) && map[userLetters[i] > 0]) {
        // Mark as close
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("incorrect");
      }
    }

    boxRows[currentRow++];

    if (currentGuess === word) {
      gameTitle.textContent = "You Win!"
      gameTitle.classList.add("winner");
      done = true;
      return;
    } else if (currentRow === ROUNDS) {
      gameTitle.textContent = `You lose. The word was ${word}`;
      done = true;
    }

    currentGuess = "";
  }

  const backspace = () => {
    // Remove the last letter
    currentGuess = currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    // Clear the last typed letter
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].textContent = "";
  }

  const markInvalidWord = () => {
    gameTitle.textContent = "Not a valid word";
    setTimeout(() => {
      gameTitle.textContent = "Word Master";
    }, 2000);
  }

  const handleKeyPress = (event) => {
    if (done || isLoading) {
      // do nothing
      return;
    }

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

const makeMap = (array) => {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }

  return obj;
}

init();
