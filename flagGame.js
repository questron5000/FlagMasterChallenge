﻿const flagGame = document.getElementById('flag-game');
const flag = document.getElementById('flag');
const optionsContainer = document.getElementById('options-container');
const timerElement = document.getElementById('timer');
const lockInButton = document.getElementById('lock-in');
const scoreElement = document.getElementById('score');

let currentQuestion = null;
let selectedOption = null;
let countdown = null;
let timer = 10;
let questionCount = 0;
let correctCount = 0;
const maxQuestions = 10;

function startGame() {
    generateQuestion();
    startCountdown();
}

function generateQuestion() {
    if (questionCount >= maxQuestions) {
        endGame();
        return;
    }

    currentQuestion = getRandomFlagQuestion();
    flag.src = currentQuestion.flag;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option.name;
        optionElement.addEventListener('click', () => selectOption(option, optionElement));
        optionsContainer.appendChild(optionElement);
    });

    questionCount++;
}

function selectOption(option, optionElement) {
    if (selectedOption) {
        selectedOption.classList.remove('selected');
    }

    selectedOption = optionElement;
    optionElement.classList.add('selected');
}

function lockInAnswer() {
    if (!selectedOption) return;

    const isCorrect = currentQuestion.correctAnswer.name === selectedOption.textContent;
    showAnswerFeedback(isCorrect);
    setTimeout(() => {
        generateQuestion();
        startCountdown();
    }, 2000);
}

function showAnswerFeedback(isCorrect) {
    stopCountdown();

    const correctOption = Array.from(optionsContainer.children).find(
        optionElement => optionElement.textContent === currentQuestion.correctAnswer.name
    );

    correctOption.classList.add('correct');

    if (isCorrect) {
        flagGame.classList.add('correct');
        correctCount++;
        updateScore();
    } else {
        flagGame.classList.add('wrong');
        selectedOption.classList.add('wrong');
    }

    setTimeout(() => {
        flagGame.classList.remove('correct', 'wrong');
        correctOption.classList.remove('correct');
        selectedOption.classList.remove('wrong', 'selected');
        selectedOption = null;
    }, 2000);
}

function getRandomCountry() {
    const randomIndex = Math.floor(Math.random() * window.countries.length);
    return countries[randomIndex];
}

function getRandomFlagQuestion() {
    const correctAnswer = getRandomCountry();
    const options = generateOptions(correctAnswer);
    return {
        flag: correctAnswer.flag,
        correctAnswer,
        options,
    };
}

function generateOptions(correctAnswer) {
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
        options.add(getRandomCountry());
    }

    return shuffleArray(Array.from(options));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function endGame() {
    // Stop the countdown timer
    stopCountdown();

    // Display end game summary or message here
    flagGame.innerHTML = '<h2>Game Over!</h2><p>Thanks for playing!</p>';

    // Optionally, you can add a button to restart the game
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Play Again';
    restartButton.addEventListener('click', () => {
        // Reset the question count and start the game again
        questionCount = 0;
        correctCount = 0;
        updateScore();
        startGame();
    });
    flagGame.appendChild(restartButton);
}

function updateScore() {
    scoreElement.textContent = 'Score: ' + correctCount;
}

// Add an event listener to the "Lock it in" button
lockInButton.addEventListener('click', lockInAnswer);

// Start the game when the countries.js script has been loaded
window.addEventListener('load', () => {
    startGame();
});
