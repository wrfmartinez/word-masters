const ANSWER_LENGTH = 5;
const ROUNDS = 6;

const getWord = async () => {
  const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
  const res = await fetch(WORD_URL);
  const resObj = await res.json();
  // Convert fetched word to uppercase
  return resObj.word.toUpperCase();
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
    // Convert letter to uppercase
    letter = letter.toUpperCase();
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    // Ensure we select the correct element
    $(".letter").eq(ANSWER_LENGTH * currentRow + currentGuess.length - 1).text(letter);
  }

  const submitGuess = async () => {
    if (currentGuess.length !== ANSWER_LENGTH) {
      return;
    }

    isLoading = true;
    setLoading(true);
    const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";
    const res = await fetch(VALIDATE_WORD_URL, {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });

    const resObj = await res.json();
    const validWord = resObj.validWord;

    isLoading = false;
    setLoading(false);

    if (!validWord) {
      markInvalidWord();
      return;
    }

    const userLetters = currentGuess.split("");
    const map = makeMap(wordLetters);

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (userLetters[i] === wordLetters[i]) {
        $(".letter").eq(currentRow * ANSWER_LENGTH + i).addClass("correct");
        map[userLetters[i]]--;
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (userLetters[i] === wordLetters[i]) {
        continue;
      } else if (wordLetters.includes(userLetters[i]) && map[userLetters[i]] > 0) {
        $(".letter").eq(currentRow * ANSWER_LENGTH + i).addClass("close");
        map[userLetters[i]]--;
      } else {
        $(".letter").eq(currentRow * ANSWER_LENGTH + i).addClass("incorrect");
      }
    }

    currentRow++;

    if (currentGuess === word) {
      $(".game-title").text("You Win!").addClass("winner");
      done = true;
      return;
    } else if (currentRow === ROUNDS) {
      $(".game-title").text(`You lose. The word was ${word}`);
      done = true;
    }

    currentGuess = "";
  }

  const backspace = () => {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    $(".letter").eq(ANSWER_LENGTH * currentRow + currentGuess.length).text("");
  }

  const markInvalidWord = () => {
    $(".game-title").text("Not a valid word");
    setTimeout(() => {
      $(".game-title").text("Word Master");
    }, 2000);
  }

  const handleKeyPress = (event) => {
    if (done || isLoading) {
      return;
    }

    const action = event.key;

    if (action === "Enter") {
      submitGuess();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action);
    }
  }

  $(document).on("keydown", handleKeyPress);
}

const isLetter = (letter) => {
  return /^[a-zA-Z]$/.test(letter);
}

const setLoading = (isLoading) => {
  $('.loading-indicator').toggleClass("show", isLoading);
}

const makeMap = (array) => {
  const obj = {};
  array.forEach(letter => {
    obj[letter] = (obj[letter] || 0) + 1;
  });
  return obj;
}

init();
