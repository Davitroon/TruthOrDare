let data = localStorage.getItem("data");
let sessions = [] ;
let selectedSesion = 0;

// Cargar datos del local storage
if (data) {
    sessions = JSON.parse(data);
    for (let session of sessions) {
        addSessionHTML(session);
    }

} else {
    document.getElementById('saved-sessions-list').innerHTML = "<p>There isn't any saved session!</p>";
    document.getElementById('btn-delete-sessions').style.display = 'none';
}

localStorage.removeItem('currentSesion');

const menu = document.querySelector('.menu');
const createSession = document.querySelector('.create-session');
const loadSession = document.querySelector('.load-session')

// Mostrar capa crear sesion
function showCreateSession() {
    menu.classList.add('slide-out-right');
    createSession.classList.add('slide-in');
}

// Mostrar capa cargar sesion
function showLoadSession() {
    menu.classList.add('slide-out-left');
    loadSession.classList.add('slide-in');
}

// Volver al menú principal
function goBack() {
    menu.classList.remove('slide-out-right', 'slide-out-left');
    createSession.classList.remove('slide-in');
    loadSession.classList.remove('slide-in');
}

// Deshabilitar un boton
function alterButtonStatus(button) {
    button.classList.toggle("disabled-button");
}


// Función para validar que el formulario se haya rellenado correctamente
function validateForm() {
    const buttonAdd = document.getElementById('add-play');

    // Validar el nombre de la sesión
    if (document.getElementById('name').value == '') {
        buttonAdd.disabled = true;
        return;
    }

    // Validar que haya nombres de jugadores
    if (document.getElementById('players-names').value == '') {
        buttonAdd.disabled = true;
        return;
    }

    // Validar que los nombres escritos no sean vacios
    const playersNames = document.getElementById('players-names').value.split(',');
    for (let playerName of playersNames) {
        playerName = playerName.trim();
        if (playerName == '') {
            buttonAdd.disabled = true;
            return;
        }
    }

    // Validar el rango de jugadores (minimo 2 y maximo 6)
    if (playersNames.length < 2 || playersNames.length > 6 ){
        buttonAdd.disabled = true;
        return;
    }

    // Validar que no esten todos los filtros quitados
    const filterButtons = document.querySelectorAll('.filter');
    if (filterButtons[0].classList.contains('disabled-button') && 
        filterButtons[1].classList.contains('disabled-button') && 
        filterButtons[2].classList.contains('disabled-button') ) {
            buttonAdd.disabled = true;
            return; 
    }

    buttonAdd.disabled = false;
}


// Funcion que cuenta los jugadores con un nombre válido y los devuelve. Además, modifica el nº en el label de player names.
function countPlayers(playersNames) {
    let validPlayers = 0;
    for (let i = 0; i < playersNames.length; i++) {
        let playerName = playersNames[i].trim();
        if (playerName !== '') {
            validPlayers++;
        }
    }

    document.getElementById('players-names-txt').innerHTML = `Player names (${validPlayers}) <span class="text-danger"> * </span> `;
    return validPlayers;
}


// Guardar una sesion
function addSession(addButton) {
    if (addButton.classList.contains('disabled-button')) return;

    // Como ya habré validado que los nombres sean correctos, puedo hacer un split sin preocupaciones de nombres vacios
    const players = document.getElementById('players-names').value.split(',');
    const filters = [];
    const extraQuestions = [];


    for (let filter of document.querySelectorAll('.filter')) {
        if (!filter.classList.contains('disabled-button')) {
            filters.push({
                key: filter.dataset.text,
                text: filter.textContent
            });
        }
    }

    for (let extraQuestion of document.querySelectorAll('.extra-question')) {
        if (!extraQuestion.classList.contains('disabled-button')) {
            extraQuestions.push({
                key: extraQuestion.dataset.text,
                text: extraQuestion.textContent
            });
        }
    }

    // Crear un objeto sesion 
    const session = {
        name: document.getElementById('name').value,
        language: {
            key: document.getElementById('language').value,  
            text: document.getElementById('language').selectedOptions[0].text  
        },
        players: players,
        filters: filters,
        extraQuestions: extraQuestions,
        creationDate: new Date().toLocaleDateString('en-GB')
    }

    sessions.push(session);
    localStorage.setItem('data',JSON.stringify(sessions));
    selectedSesion = sessions.indexOf(session);
    startGame();
}


// Meter una sesion al HTML
function addSessionHTML(session) {
    
    const div = document.createElement('div');
    div.classList.add('saved-session', 'position-relative');

    div.innerHTML = 
        `<h3 class="fw-bold fs-4">${session.name}</h3> 
        <div class="d-flex flex-column text-start">
            <p><strong>Players:</strong> ${session.players.join(', ')}</p>
            <p><strong>Language:</strong> ${session.language.text}</p>
            <p><strong>Questions:</strong> ${formatTextList(session.extraQuestions)}</p>
            <p><strong>Filters:</strong> ${formatTextList(session.filters)}</p>
            <p><strong>Creation date:</strong> ${session.creationDate}</p>
        </div>`;

    div.onclick = function () {
        const oldSelected = document.querySelector('.selected-saved-session');

        // Si ya habia un elemento elegido y no es el mismo
        if (oldSelected && oldSelected != div) {
            oldSelected.classList.remove('selected-saved-session');
        }

        // Alternar activado y no activado
        div.classList.toggle('selected-saved-session');
        if (div.classList.contains('selected-saved-session')) {
            document.getElementById('play').disabled = false;
            selectedSesion = sessions.indexOf(session);

        } else {
            document.getElementById('play').disabled = true;
        }
    };

    // Crear boton de borrar
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger', 'session-btn');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.onclick = function (event) {
        // Stop propagation hace que si hay un evento en una capa superior, no se realize (en este caso elegir la session)
        event.stopPropagation();
        sessions.splice(sessions.indexOf(session), 1);
        document.getElementById('saved-sessions-list').removeChild(div);
        localStorage.setItem('data', JSON.stringify(sessions));

        if (sessions.length == 0) {
            document.getElementById('saved-sessions-list').innerHTML = "<p>There isn't any saved session!</p>";
            document.getElementById('btn-delete-sessions').style.display = 'none';
            localStorage.clear();
        }

        document.getElementById('play').disabled = true;
    }

    div.appendChild(deleteButton);
    document.getElementById('saved-sessions-list').appendChild(div);
    document.getElementById('btn-delete-sessions').style.display = '';
}

// Devolver un array de objetos como un string
function formatTextList(items) {
    if (items.length == 0) return 'NA';
    // map() devuelve varios arrays en uno solo y join() junta los elementos en un string
    return items.map(getText).join(', ');
}


// Obtener el texto de un elemento
function getText(item) {
    // trim() borra los espacios innecesarios de un texto
    return item.text.trim();
}


// Borrar todas las sesiones guardadas
function deleteAllSessions() {
    if (confirm("Are you sure you want to delete all your sessions?")) {
        sessions = [];
        localStorage.clear();
        document.getElementById('saved-sessions-list').innerHTML = "<p>There isn't any saved session!</p>";
        document.getElementById('btn-delete-sessions').style.display = 'none';
    } 
}


// Cargar el juego mandando la sesion elegida
function startGame() {
    localStorage.setItem('currentSesion', JSON.stringify(sessions[selectedSesion]));
    window.location.href = 'game.html';
}


// Agregar listeners a los campos necesarios del formulario para validarlo
const campos = document.querySelectorAll('input, textarea, select, .filter') ;

for (let campo of campos) {
    if (campo.classList.contains('filter')) {
        campo.addEventListener('click', validateForm);
    
    } else {
        campo.addEventListener('input', validateForm);
    }    
}

document.getElementById('players-names').addEventListener('input', function() {
    const playersNames = document.getElementById('players-names').value.split(',');
    countPlayers(playersNames);
});


console.log(sessions);