let data = localStorage.getItem("data");

let sessions = JSON.parse(data);

if (sessions == null ) {
    sessions = [] ;

} else {
    for (let session of sessions) {
        // modificar
    }
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

// Deshabilitar una opción
function alterButtonStatus(button) {
    button.classList.toggle("disabled-button");
}


// Función para validar que el formulario se haya rellenado correctamente
function validarFormulario() {
    const botonAdd = document.getElementById('add-play');

    // Validar el nombre de la sesión
    if (document.getElementById('name').value == '') {
        console.log('Falta nombre');
        botonAdd.classList.add('disabled-button');
        return;
    }

    // Validar que haya nombres de jugadores
    if (document.getElementById('players-names').value == '') {
        console.log('Falta nombres jugadores');
        botonAdd.classList.add('disabled-button');
        return;
    }

    // Validar que el numero de nombres equivale a la cantidad de nombres escritos
    const playersNames = document.getElementById('players-names').value.split(',');
    const validPlayers = contarJugadores(playersNames);
    const numPlayers = parseInt(document.getElementById('players-num').value);
    if (validPlayers !== numPlayers) {
        console.log('Jugadores incorrectos');
        botonAdd.classList.add('disabled-button');
        return;
    }

    // Validar que los nombres escritos no sean vacios
    for (let playerName of playersNames) {
        playerName = playerName.trim();
        if (playerName == '') {
            console.log('nombres vacios');
            botonAdd.classList.add('disabled-button');
            return;
        }
    }

    // Validar que no esten todos los filtros quitados
    const filterButtons = document.querySelectorAll('.filter');
    if (filterButtons[0].classList.contains('disabled-button') && 
        filterButtons[1].classList.contains('disabled-button') && 
        filterButtons[2].classList.contains('disabled-button') ) {
            console.log('nigun filtro elegido');
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
        playersNames: players,
        filters: filters,
        extraQuestions: extraQuestions
    }

    sessions.push(session);
    localStorage.setItem('data',JSON.stringify(sessions));
    //window.location.href = 'juego.html';
}


// Agregar listeners a los campos necesarios del formulario para validarlo
const campos = document.querySelectorAll('input, textarea, select, .filtro') ;

for (let campo of campos) {
    if (campo.classList.contains('filtro')) {
        campo.addEventListener('click', validarFormulario);
    
    } else {
        campo.addEventListener('input', validarFormulario);
    }    
}

document.getElementById('players-names').addEventListener('input', function() {
    const playersNames = document.getElementById('players-names').value.split(',');
    contarJugadores(playersNames);
});