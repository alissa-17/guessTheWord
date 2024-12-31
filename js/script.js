const guessedLettersElement = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const letterInput = document.querySelector("#letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

const guessForm = document.querySelector(".guess-form");
const revealGame = document.querySelector(".reveal-game");
const game = document.querySelector(".game");

let word = "magnolia";
let guessedLetters = [];
let remainingGuesses = 8;

const gameButton = function () {
    game.classList.add("hide");
}

gameButton();

revealGame.addEventListener("click", function(){
    game.classList.remove("hide");
    revealGame.classList.add("hide");
})



const getWord = async function () {
    const response = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await response.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    placeholder(word);
}

getWord();


const placeholder = function (word) {
    const placeholderLetters = [];
    for (letter of word) {
        console.log(letter);
        placeholderLetters.push("●");
    }
    wordInProgress.innerText = placeholderLetters.join("");
};

getWord();

guessButton.addEventListener("click", function (e) {
    e.preventDefault();

    message.innerText = "";

    const guess = letterInput.value;
    //  console.log(guess);
    letterInput.value = "";

    const goodGuess = validateInput(guess);
    console.log(goodGuess);

    makeGuess(guess);
});

const validateInput = function (input) {
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
        message.innerText = "Please type in a letter!";
    } else if (input.length > 1) {
        message.innerText = "Only type in one letter please!!";
    } else if (!input.match(acceptedLetter)) {
        message.innerText = "Please type in an alphabetical letter from A to Z.";
    } else {
        return input;
    }
};

const makeGuess = function (guess) {
    guess = guess.toUpperCase();
    if (guessedLetters.includes(guess)) {
        message.innerText = "You already guessed that letter.. Try again!";
    } else {
        guessedLetters.push(guess);
        console.log(guessedLetters);
        showGuessedLetters();
        updateGuessesRemaining(guess);
        updateWordInProgress(guessedLetters);
    }
};

const showGuessedLetters = function () {
    guessedLettersElement.innerHTML = "";
    for (const letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLettersElement.append(li);
    }
};

const updateWordInProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const revealWord = [];
    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            revealWord.push(letter.toUpperCase());
        } else {
            revealWord.push("●");
        }
    }
    wordInProgress.innerText = revealWord.join("");
    successGuess();
};

const updateGuessesRemaining = function (guess) {
    const upperWord = word.toUpperCase();
    if (!upperWord.includes(guess)) {
        message.innerText = `The word doesn't include the letter ${guess}.`;
        remainingGuesses -= 1;
    } else {
        message.innerText = "Good Guess!";
    }

    if (remainingGuesses === 0) {
        message.innerText = `The game is over. The word was ${word}.`
        startOver();
    } else if (remainingGuesses === 1) {
        remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
    } else {
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    }

}

const successGuess = function () {
    if (word.toUpperCase() === wordInProgress.innerText) {
        message.classList.add(".win");
        message.innerHTML = `<p class="highlight">You guessed correctly! Congratulations!</p>`;

        startOver();
    }
};

const startOver = function () {
    guessButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLettersElement.classList.add("hide");
    playAgainButton.classList.remove("hide");
};

playAgainButton.addEventListener("click", function () {
    message.classList.remove("win");
    message.innerText = "";
    guessedLettersElement.innerHTML = "";
    remainingGuesses = 8;
    guessedLetters = [];
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;

    getWord();

    guessButton.classList.remove("hide");
    remainingGuessesElement.classList.remove("hide");
    guessedLettersElement.classList.remove("hide");
    playAgainButton.classList.add("hide");
});