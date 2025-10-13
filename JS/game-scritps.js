const questionField = document.getElementById("question-txt");
const showQuestionBtn = document.getElementById("show-question");
const apiUrl = 'https://api.truthordarebot.xyz/v1/';
var selectedQuestion;
var currentPlayer;
var players = [];


// Request the API a question
function loadQuestion() {
    showQuestionBtn.disabled = true;
    questionField.textContent = "Changing question...";

    let url = apiUrl + selectedQuestion.dataset.text;

    // Use filters
    if (session.filters.length > 0 && session.filters.length < 3) {
        const randomFilter = session.filters[Math.floor(Math.random() * session.filters.length)];
        if (randomFilter && randomFilter.key) {
            url += `?rating=${randomFilter.key}`;
        }
    }

    fetch(url).then(takeResp).catch(handleError);
}


// Take promise from the API
function takeResp(resp) {
    resp.json().then(takeObj);
}


// Take data from the promise
function takeObj(json) {
    if (session.language.key != 'en') {
        // If there's no custom language...
        if (json.translations[session.language.key] == null) {
            loadQuestion();

        } else {
            questionField.innerHTML = players[currentPlayer] + "... " + json.translations[session.language.key];
            nextTurn();
        }

    } else {
        questionField.innerHTML = players[currentPlayer] + "... " + json.question;
        nextTurn();
    }

    // Change color based on rating
    switch (json.rating) {
        case ('PG'):
            questionField.style.backgroundColor = "#28a745";
            questionField.style.color = "white";
            break;

        case ('PG13'):
            questionField.style.backgroundColor = "yellow";
            questionField.style.color = "black";
            break;

        case ('R'):
            questionField.style.backgroundColor = "red";
            questionField.style.color = "white";
            break;
    }
    console.log(json);
}


// Validate that there's a question chosen
function validateOptions() {
    if (!selectedQuestion) {
        showQuestionBtn.disabled = true;

    } else {
        showQuestionBtn.disabled = false;
    }
}


// Pass turn
function nextTurn() {

    if (selectedQuestion) {
        selectedQuestion.classList.remove('selected-question');
        selectedQuestion = null;
    }

    document.getElementById(`jugador${currentPlayer}`).classList.remove("current-player");
    currentPlayer++;
    if (currentPlayer > session.players.length - 1) currentPlayer = 0;
    document.getElementById(`jugador${currentPlayer}`).classList.add("current-player");
}


// Choose an anwser
function selectQuestion(button) {
    if (selectedQuestion == button) {
        button.classList.remove('selected-question');
        selectedQuestion = null;

    } else {
        if (selectedQuestion != null) {
            selectedQuestion.classList.remove('selected-question');
        }
        button.classList.add('selected-question');
        selectedQuestion = button;
    }

    validateOptions();
}


// Handle error from the API call
function handleError() {
    questionField.innerHTML = "<p class='fw-bold text-danger'>You're going to fast!</p>";
    questionField.style.backgroundColor = "white";
}


// Add extra questions buttons dynamically
if (session.extraQuestions.length != 0) {
    for (let extraQuestion of session.extraQuestions) {
        const div = document.createElement('div');
        div.classList.add('col', 'd-flex', 'justify-content-center');

        div.innerHTML = `<button type="button" class="btn btn-lg btn-info btn-hover question-option" data-text="${extraQuestion.key}"  onclick="selectQuestion(this)" title="Choose ${extraQuestion.text}"> ${extraQuestion.text} </button>`;

        document.getElementById('extra-questions').appendChild(div);
    }
}


// Add player names dynamically
let contador = 0;
for (let nombre of session.players) {
    const div = document.createElement('div');
    div.classList.add('col', 'text-center');
    div.innerHTML = `<div id=jugador${contador} class="btn btn-lg btn-primary player"> ${nombre} </div>`;

    document.getElementById('players').appendChild(div);
    contador++;
}

// Start game
players = session.players;
currentPlayer = Math.floor(Math.random() * players.length);
document.getElementById(`jugador${currentPlayer}`).classList.add("current-player");
questionField.textContent = players[currentPlayer] + "...";

console.log(session);