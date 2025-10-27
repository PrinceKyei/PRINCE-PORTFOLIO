const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const instructions = document.getElementById("instructions");
const quizPage = document.getElementById("quiz-page");
const quizContainer = document.getElementById("quiz");
const result = document.getElementById("result");
const progress = document.getElementById("progress");
const quizTitle = document.getElementById("quiz-title");

// Create and insert the Previous button properly
const prevBtn = document.createElement("button");
prevBtn.id = "prev-btn";
prevBtn.textContent = "Previous";
prevBtn.style.display = "none";
nextBtn.insertAdjacentElement("afterend", prevBtn);

// Quiz data
const quizData = [
    {
        question: "1. Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        answer: "JavaScript"
    },
    {
        question: "2. What does CSS stand for?",
        options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Cars SUVs Sailboats"],
        answer: "Cascading Style Sheets"
    },
    {
        question: "3. Which JavaScript method is used to select an element by its ID?",
        options: ["querySelector()", "getElementById()", "getElementsByClassName()", "getElement()"],
        answer: "getElementById()"
    }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = {};

// Decode HTML entities (like &lt;)
function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// === Load saved quiz state on page load ===
window.addEventListener("load", () => {
    const savedState = JSON.parse(localStorage.getItem("quizState"));
    if (savedState) {
        currentQuestion = savedState.currentQuestion;
        score = savedState.score;
        userAnswers = savedState.userAnswers || {};

        if (savedState.stage === "quiz") {
            instructions.style.display = "none";
            quizPage.style.display = "flex";
            quizTitle.style.display = "none";
            showQuestion();
        } else if (savedState.stage === "end") {
            instructions.style.display = "none";
            quizPage.style.display = "flex";
            endQuiz();
        }
    }
});

function saveState(stage) {
    const state = {
        currentQuestion,
        score,
        userAnswers,
        stage,
    };
    localStorage.setItem("quizState", JSON.stringify(state));
}

// === Start the quiz ===
startBtn.addEventListener("click", () => {
    instructions.style.display = "none";
    quizPage.style.display = "flex";
    quizTitle.style.display = "none";
    showQuestion();
    saveState("quiz");
});

// === Show question ===
function showQuestion() {
    const current = quizData[currentQuestion];
    quizContainer.innerHTML = `
    <h2 id="question">${current.question}</h2>
    <div class="options">
      ${current.options
            .map(
                (option) => `
        <label>
          <input type="radio" name="answer" value="${option}" ${userAnswers[currentQuestion] === option ? "checked" : ""
                    }> ${option}
        </label>`
            )
            .join("")}
    </div>
  `;
    progress.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    result.textContent = "";

    prevBtn.style.display = currentQuestion > 0 ? "inline-block" : "none";
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? "Finish" : "Next";
}

// === Next button logic ===
nextBtn.addEventListener("click", () => {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
        alert("Please select an answer before proceeding!");
        return;
    }

    const selectedValue = decodeHTML(selected.value);
    userAnswers[currentQuestion] = selectedValue;

    updateScore();
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        showQuestion();
        saveState("quiz");
    } else {
        endQuiz();
    }
});

// === Previous button logic ===
prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (selected) userAnswers[currentQuestion] = decodeHTML(selected.value);
        updateScore();
        currentQuestion--;
        showQuestion();
        saveState("quiz");
    }
});

// === Update score dynamically ===
function updateScore() {
    score = 0;
    quizData.forEach((q, i) => {
        if (userAnswers[i] && decodeHTML(userAnswers[i]) === decodeHTML(q.answer)) {
            score++;
        }
    });
}

// === End quiz ===
function endQuiz() {
    quizContainer.innerHTML = "";
    progress.textContent = "";
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    quizPage.classList.add("end-screen");

    // Title centered at the top
    quizTitle.style.display = "block";
    quizTitle.textContent = "End of Quiz";

    // Insert the score above the restart button
    result.innerHTML = `<p>Your final score is <span class="highlight">${score}</span> out of <span class="highlight">${quizData.length}</span></p>`;

    // Move the result element before restart button in DOM
    quizPage.insertBefore(result, restartBtn);

    restartBtn.style.display = "inline-block";
    saveState("end");
}

// === Restart ===
restartBtn.addEventListener("click", () => {
    quizPage.classList.remove("end-screen");
    currentQuestion = 0;
    score = 0;
    userAnswers = {};

    quizTitle.textContent = "Frontend Quiz";
    quizTitle.style.display = "block";
    restartBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
    prevBtn.style.display = "none";
    result.textContent = "";

    quizPage.style.display = "none";
    instructions.style.display = "flex";

    localStorage.removeItem("quizState");
});