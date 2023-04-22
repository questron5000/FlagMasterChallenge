const flagElement = document.getElementById('flag');
const answersContainer = document.getElementById('answers-container');
const timerElement = document.getElementById('timer');
const lockButton = document.getElementById('lock-btn');

let currentQuestion = 0;
let timer;

function startGame() {
    currentQuestion = 0;
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestion < 10) {
        const questionData = generateQuestion();
        flagElement.src = questionData.flag;
        timerElement.textContent = 10;

        answersContainer.innerHTML = '';
        questionData.options.forEach((option, index) => {
            const answerElement = document.createElement('button');
            answerElement.textContent = option;
            answerElement.onclick = () => handleAnswer(index);
            answersContainer.appendChild(answerElement);
        });

        startTimer();
    } else {
        // Show game summary here
    }
}

function handleAnswer(selectedIndex) {
    clearTimeout(timer);

    const correct = selectedIndex === 0;
    const answerElements = answersContainer.getElementsByTagName('button');
    answerElements[selectedIndex].style.backgroundColor = correct ? 'green' : 'red';

    if (correct) {
        setTimeout(displayQuestion, 2000);
    } else {
        setTimeout(displayQuestion, 5000);
    }
    currentQuestion++;
}

function startTimer() {
    let remainingTime = 10;
    timer = setInterval(() => {
        remainingTime--;
        timerElement.textContent = remainingTime;

        if (remainingTime <= 0) {
            clearTimeout(timer);
            handleAnswer(-1); // -1 indicates no answer selected
        }
    }, 1000);
}

function generateQuestion() {
    const correctCountry = countries[Math.floor(Math.random() * countries.length)];
    const correctFlag = correctCountry.flag;

    let options = [correctCountry.name];
    while (options.length < 4) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        if (!options.includes(randomCountry.name)) {
            options.push(randomCountry.name);
        }
    }

    // Shuffle options array
    options = options.sort(() => Math.random() - 0.5);

    return {
        flag: correctFlag,
        options: options,
    };
}

lockButton.addEventListener('click', () => {
    clearTimeout(timer);
    handleAnswer(-1);
});

startGame();

