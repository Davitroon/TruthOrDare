const questionField = document.getElementById("question-txt");
var apiUrl = 'https://api.truthordarebot.xyz/v1/truth';
var session = null;

// Función para obtener y mostrar la pregunta
function cambiarPregunta() {
    questionField.innerHTML = "Changing question...";
    p1 = fetch(apiUrl);
    p1.then(tratarResp);
}

function tratarResp (resp) {
    p2 = resp.json();
    p2.then(tratarObj);
}

function tratarObj(json) {
    questionField.innerHTML = json.question;
    console.log(json);
}

function loadSession (sessionRecived) {
    session = sessionRecived;
}


/// debo seguir aqui