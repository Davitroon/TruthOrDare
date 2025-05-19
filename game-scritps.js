const questionField = document.getElementById("question-txt");
var apiUrl = 'https://api.truthordarebot.xyz/v1/';
var selectedQuestion;
var currentPlayer;
var players = [];


// Función para obtener y mostrar la pregunta
function loadQuestion() {
    questionField.innerHTML = "Changing question...";
    let p1;

    // Usar filtros
    if (session.filters.length != 3) {
        const randomFilter = session.filters[Math.floor(Math.random() * session.filters.length)].key;
        p1 = fetch(apiUrl + selectedQuestion.dataset.text + `?rating=${randomFilter}`);    

    } else {
        p1 = fetch(apiUrl + selectedQuestion.dataset.text);
    }

    p1.then(tratarResp).catch(handleError);
}


// Tratar respuesta de la API
function tratarResp (resp) {
    resp.json().then(takeObj);
}


// Tratar objeto de la respuesta
function takeObj(json) { 
    // Cambiar el texto dependiendo del idioma
    if (session.language.key != 'en') {
        // Si no hay traduccion a esa pregunta, vuelve a cargar una pregunta diferente
        console.log(json);
        if (json.translations[session.language.key] == null) {
            loadQuestion(json.type);

        } else {
            questionField.innerHTML = json.translations[session.language.key];
        }      

    } else {
        questionField.innerHTML = players[currentPlayer] + "... " + json.question;
    }

    // Cambiar el color del texto dependiendo del rating
    switch (json.rating) {
        case ('PG') :
            questionField.style.backgroundColor = "#28a745";
            questionField.style.color = "white";
        break;

        case ('PG13') :
            questionField.style.backgroundColor = "yellow";
            questionField.style.color = "black";
        break;

        case ('R') :
            questionField.style.backgroundColor = "red";
            questionField.style.color = "white";
        break;
    }
    nextTurn();
    console.log(json);
}


// Validar que se haya elegido una pregunta y un jugador
function validateOptions () {
    if (selectedQuestion == null) {
        document.getElementById("show-question").disabled = true;
    
    } else {
        document.getElementById("show-question").disabled = false;
    }
}


// Siguiente turno y cambiar jugador actual
function nextTurn() {
    selectedQuestion.classList.remove('selected-question');
    document.getElementById("show-question").disabled = true;
    document.getElementById(`jugador${currentPlayer}`).classList.remove("current-player");
    currentPlayer++;
    if (currentPlayer > session.players.length - 1) currentPlayer = 0;
    document.getElementById(`jugador${currentPlayer}`).classList.add("current-player");
}


// Elegir una pregunta
function selectQuestion (button) {
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


// Manejar errores al consultar la API
function handleError(error) {
    questionField.innerHTML = "<p class='fw-bold text-danger'>You're going to fast!</p>";
    questionField.style.backgroundColor = "white";
}


// Crear botones preguntas extras
if (session.extraQuestions.length != 0) {
    for (let extraQuestion of session.extraQuestions) {
        const div = document.createElement('div');
        div.classList.add('col', 'd-flex', 'justify-content-center');

        div.innerHTML = `<button class="btn btn-lg btn-info btn-hover question-option" data-text="${extraQuestion.key}"  onclick="selectQuestion(this)"> ${extraQuestion.text} </button>`;

        document.getElementById('extra-questions').appendChild(div);
    }
}


// Crear botones jugadores
var contador = 0;
for (let nombre of session.players) {
    const div = document.createElement('div');
    div.classList.add('col', 'text-center');
    div.innerHTML = `<button id=jugador${contador} class="btn btn-lg btn-primary player" onclick="selectPlayer(this)"> ${nombre} </button>`;

    document.getElementById('players').appendChild(div);
    contador ++;
}

// Asignar array de jugadores y empezar por un jugador al azar
players = session.players;
currentPlayer = Math.floor(Math.random() * players.length);
document.getElementById(`jugador${currentPlayer}`).classList.add("current-player");

console.log(session);
console.log(players)
console.log(currentPlayer);