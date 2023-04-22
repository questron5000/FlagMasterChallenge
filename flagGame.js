
const flagGame = document.getElementById('flag-game');
const flag = document.getElementById('flag');
const optionsContainer = document.getElementById('options-container');
const timer = document.getElementById('timer');
const lockInButton = document.getElementById('lock-in');

let currentQuestion = null;
let selectedOption = null;
let countdown = null;

function startGame() {
    generateQuestion();
    startCountdown();
}

function generateQuestion() {
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
    let timeRemaining = 10;
    timer.textContent = timeRemaining;
    countdown = setInterval(() => {
        timeRemaining--;
        timer.textContent = timeRemaining;

        if (timeRemaining <= 0) {
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

lockInButton.addEventListener('click', lockInAnswer);
startGame();
