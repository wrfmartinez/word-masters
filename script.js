// Secret five letter word
// Players have six guesses to figure out the secret word. After six guesses, they lose.
// If the player guesses a letter that is in the right place, it shown as green
// If the player guesses a letter that is in the word but not in the right place, it shown as yellow
// It does account for however many of the letter exist in the word. A letter should not be lit up more than once if it doesn't appear in the word more than once
// If the player guesses the right word, the player wins and the game is over

const word = "crane";
const userChoice = "brain";

const isSameLetterAndPosition = () => {
  for (let i = 0; i < word.length; i++) {
    const wordLetter = word[i];
    const userChoiceLetter = userChoice[i];
    // Checks if the letter value within the same index(position) in the word is the same as the letter in the user's choice
    if (wordLetter === userChoiceLetter) {
      console.log(i, wordLetter);
    }
  }
}

const isSameLetterDiffPosition = () => {
  for (let i = 0; i < word.length; i++) {
    const wordLetter = word[i];
    const userChoiceLetter = userChoice[i];

    // Checks if the word includes any of the letters within the word in the users choice but is not in the same position as the word
    if (word.includes(userChoiceLetter) && wordLetter !== userChoiceLetter) {
      console.log(i, userChoiceLetter);
    }
  }
}

noSameLetters();
