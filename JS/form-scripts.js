/**
 * Validates all fields in the form
 */
function validateForm() {
    const buttonAdd = document.getElementById('add-play');
    buttonAdd.disabled = false;

    // Validate the session name
    if (document.getElementById('name').value == '') {
        buttonAdd.disabled = true;
    }

    // Validate that there are player names
    if (document.getElementById('players-names').value == '') {
        buttonAdd.disabled = true;
    }

    // Validate that the entered names are not empty
    const playersNames = document.getElementById('players-names').value.split(',');
    for (let playerName of playersNames) {
        playerName = playerName.trim();
        if (playerName == '') {
            buttonAdd.disabled = true;
        }
    }

    // Validate players range (minium 2 | maximum 6)
    if (playersNames.length < 2 || playersNames.length > 6) {
        buttonAdd.disabled = true;
    }

    // Validate that not all filters are removed
    const filterButtons = document.querySelectorAll('.filter');
    if (filterButtons[0].classList.contains('disabled-button') &&
        filterButtons[1].classList.contains('disabled-button') &&
        filterButtons[2].classList.contains('disabled-button')) {
        buttonAdd.disabled = true;
    }
}

/**
 * Count the amount of valid names, separating with a comma.
 * @param {*} playersNames Names written in the text field.
 * @returns Number of valid names.
 */
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

// Adding listeners to the required fields to validate the form on any change 
const fields = document.querySelectorAll('input, textarea, select, .filter');

for (let field of fields) {
    if (field.classList.contains('filter')) {
        field.addEventListener('click', validateForm);

    } else {
        field.addEventListener('input', validateForm);
    }
}

document.getElementById('players-names').addEventListener('input', function () {
    const playersNames = document.getElementById('players-names').value.split(',');
    countPlayers(playersNames);
});