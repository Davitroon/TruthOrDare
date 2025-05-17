const questionField = document.getElementById("question-txt");
var apiUrl = 'https://api.truthordarebot.xyz/v1/';



// Función para obtener y mostrar la pregunta
function loadQuestion(questionType) {
    questionField.innerHTML = "Changing question...";
    let p1;

    // Usar filtros
    if (session.filters.length != 3) {
        const randomFilter = session.filters[Math.floor(Math.random() * session.filters.length)].key;
        p1 = fetch(apiUrl + questionType + `?rating=${randomFilter}`);    

    } else {
        p1 = fetch(apiUrl + questionType);
    }

    p1.then(tratarResp).catch(handleError);
}

function tratarResp (resp) {
    resp.json().then(takeObj);
}

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
        questionField.innerHTML = json.question;
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

    console.log(json   );
}

// Manejar errores
function handleError(error) {
    questionField.innerHTML = "<p class='fw-bold text-danger'>You're going to fast!</p>";
    questionField.style.backgroundColor = "white";
}

if (session.extraQuestions.length != 0) {
    for (let extraQuestion of session.extraQuestions) {
        const div = document.createElement('div');
        div.classList.add('col');

        div.innerHTML = `<button class="btn btn-lg btn-primary btn-hover" style="width: 80%;" onclick="loadQuestion('${extraQuestion.key}')"> ${extraQuestion.text} </button>`;

        document.getElementById('extra-questions').appendChild(div);
    }
}

console.log(session);