let data = localStorage.getItem("data");
let sessions = [] ;
let selectedSesion = 0;

if (data) {
    sessions = JSON.parse(data);
    for (let session of sessions) {
        addSessionHTML(session);
    }

} else {
    document.getElementById('saved-sessions-list').innerHTML = "<p>There isn't any saved session!</p>";
}

// Mostrar capa crear sesion
function showCreateSession() {
    document.querySelector('.menu').classList.add('slide-out-right');
    document.querySelector('.create-session').classList.add('slide-in');
}

// Mostrar capa cargar sesion
function showLoadSession() {
    document.querySelector('.menu').classList.add('slide-out-left');
    document.querySelector('.load-session').classList.add('slide-in');
}

// Volver al menú principal
function goBack() {
    document.querySelector('.menu').classList.remove('slide-out-right', 'slide-out-left');
    document.querySelector('.create-session').classList.remove('slide-in');
    document.querySelector('.load-session').classList.remove('slide-in');
}

// Deshabilitar un boton
function alterButtonStatus(button) {
    button.classList.toggle("disabled-button");
}


// Función para validar que el formulario se haya rellenado correctamente
function validarFormulario() {
    const botonAdd = document.getElementById('add-play');

    // Validar el nombre de la sesión
    if (document.getElementById('name').value == '') {
        botonAdd.classList.add('disabled-button');
        return;
    }

    // Validar que haya nombres de jugadores
    if (document.getElementById('players-names').value == '') {
        botonAdd.classList.add('disabled-button');
        return;
    }

    // Validar que el numero de nombres equivale a la cantidad de nombres escritos
    const playersNames = document.getElementById('players-names').value.split(',');
    const validPlayers = contarJugadores(playersNames);
    const numPlayers = parseInt(document.getElementById('players-num').value);
    if (validPlayers !== numPlayers) {
        botonAdd.classList.add('disabled-button');
        return;
    }

    // Validar que los nombres escritos no sean vacios
    for (let playerName of playersNames) {
        playerName = playerName.trim();
        if (playerName == '') {
            botonAdd.classList.add('disabled-button');
            return;
        }
    }

    // Validar que no esten todos los filtros quitados
    const filterButtons = document.querySelectorAll('.filter');
    if (filterButtons[0].classList.contains('disabled-button') && 
        filterButtons[1].classList.contains('disabled-button') && 
        filterButtons[2].classList.contains('disabled-button') ) {
            botonAdd.classList.add('disabled-button');
            return; 
    }

    botonAdd.classList.remove('disabled-button');
}


// Funcion que cuenta los jugadores con un nombre válido y los devuelve. Además, modifica el nº en el label de player names.
function contarJugadores(playersNames) {
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


function addSession(addButton) {
    if (addButton.classList.contains('disabled-button')) return;

    // Como ya habré validado que los nombres sean correctos, puedo hacer un split sin preocupaciones de nombres vacios
    const players = document.getElementById('players-names').value.split(',');
    const filters = [];
    const extraQuestions = [];

    for (let filter of document.querySelectorAll('.filter')) {
        if (!filter.classList.contains('disabled-button')) filters.push(filter.id);
    }

    for (let extraQuestion of document.querySelectorAll('.extra-question')) {
        if (!extraQuestion.classList.contains('disabled-button')) extraQuestions.push(extraQuestion.id);
    }

    const session = {
        name: document.getElementById('name').value,
        language: document.getElementById('language').value,
        players: players,
        filters: filters,
        extraQuestions: extraQuestions,
        creationDate: new Date().toLocaleDateString('en-GB')
    }

    sessions.push(session);
    localStorage.setItem('data',JSON.stringify(sessions));
    //window.location.href = 'juego.html';
}


// Meter una sesion al HTML
function addSessionHTML(session) {
    
    const div = document.createElement('div');
    div.classList.add('saved-session', 'position-relative');

    // El metodo join() une todos los elementos de un array a un string, usando un separador personalizado
    div.innerHTML = 
        `<h3 class="fw-bold fs-4">${session.name}</h3> 
        <div class="d-flex flex-column text-start">
            <p><strong>Players:</strong> ${session.players.join(', ')}</p>
            <p><strong>Language:</strong> ${session.language}</p>
            <p><strong>Questions:</strong> ${session.extraQuestions.length == 0 ? "NA" : session.extraQuestions.join(', ')}</p>
            <p><strong>Filters:</strong> ${session.filters.join(', ')}</p>
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
            document.getElementById('play').classList.remove('disabled-button');
            selectedSesion = sessions.indexOf(session);
            console.log(selectedSesion);

        } else {
            document.getElementById('play').classList.add('disabled-button');
        }
    };

    // Crear boton de borrar
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger', 'session-btn');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.onclick = function () {
        sessions.splice(sessions.indexOf(session), 1);
        document.getElementById('saved-sessions-list').removeChild(div);
        localStorage.setItem('data', JSON.stringify(sessions));

        if (sessions.length == 0) {
            document.getElementById('saved-sessions-list').innerHTML = "<p>There isn't any saved session!</p>";
            document.getElementById('btn-delete-sessions').style.display = 'none';
        }
    }

    div.appendChild(deleteButton);
    document.getElementById('saved-sessions-list').appendChild(div);
    document.getElementById('btn-delete-sessions').style.display = '';
}


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
    loadSession(sessions[selectedSesion]);
    window.location.href = 'game.html';
}


// Agregar listeners a los campos necesarios del formulario para validarlo
const campos = document.querySelectorAll('input, textarea, select, .filter') ;

for (let campo of campos) {
    if (campo.classList.contains('filter')) {
        campo.addEventListener('click', validarFormulario);
    
    } else {
        campo.addEventListener('input', validarFormulario);
    }    
}

document.getElementById('players-names').addEventListener('input', function() {
    const playersNames = document.getElementById('players-names').value.split(',');
    contarJugadores(playersNames);
});