const flagGame = document.getElementById('flag-game');
const flag = document.getElementById('flag');
const optionsContainer = document.getElementById('options-container');
const timerElement = document.getElementById('timer');
const lockInButton = document.getElementById('lock-in');

let currentQuestion = null;
let selectedOption = null;
let countdown = null;
let timer = 10;
let questionCount = 0;
let correctCount = 0; // Keep track of the number of correct answers
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
    if (isCorrect) {
        correctCount++; // Increment the correct answer count if the answer is correct
    }
    showAnswerFeedback(isCorrect);
    updateScore(); // Update the score display
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

function startCountdown() {
    timer = 10;
    timerElement.textContent = timer;
    countdown = setInterval(() => {
        timer--;
        timerElement.textContent = timer;

        if (timer <= 0) {
            stopCountdown();
            showAnswerFeedback(false);
            setTimeout(() => {
                generateQuestion();
                startCountdown();
            }, 2000);
        }
    }, 1000);
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

function getRandomCountry() {
    return countries[Math.floor(Math.random() * countries.length)];
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

let countdown = null; // Declare the countdown variable at the top of the script

function startCountdown() {
    const timerElement = document.getElementById('timer');
    let timer = 10;
    timerElement.textContent = timer;
    countdown = setInterval(() => {
        timer--;
        timerElement.textContent = timer;

        if (timer <= 0) {
            stopCountdown();
            showAnswerFeedback(false);
            setTimeout(() => {
                generateQuestion();
                startCountdown();
            }, 2000);
        }
    }, 1000);
}

function stopCountdown() {
    clearInterval(countdown);
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
        startGame();
    });
    flagGame.appendChild(restartButton);
}

// Add an event listener to the "Lock it in" button
lockInButton.addEventListener('click', lockInAnswer);

// Start the game when the page loads
startGame();
