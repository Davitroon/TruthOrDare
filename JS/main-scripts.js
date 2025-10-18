window.sessionsData = localStorage.getItem("sessions");
window.sessions = [];
window.selectedSesion = 0;

// - Load sessions data from localStorage -
if (sessionsData) {
	sessions = JSON.parse(sessionsData);
	for (let session of sessions) {
		addSessionHTML(session);
	}
} else {
	document.getElementById("saved-sessions-list").innerHTML =
		"<p>There isn't any saved session!</p>";
	document.getElementById("btn-delete-sessions").style.display = "none";
}

localStorage.removeItem("currentSesion");

const menu = document.querySelector(".menu");
const createSession = document.querySelector(".create-session");
const loadSession = document.querySelector(".load-session");

/**
 * Show create session layer
 */
function showCreateSession() {
	menu.classList.add("slide-out-right");
	createSession.classList.add("slide-in");
}

/**
 * Show load session layer
 */
function showLoadSession() {
	menu.classList.add("slide-out-left");
	loadSession.classList.add("slide-in");
}

/**
 * Hide other menus and go back to main menu
 */
function goBack() {
	menu.classList.remove("slide-out-right", "slide-out-left");
	createSession.classList.remove("slide-in");
	loadSession.classList.remove("slide-in");
}

/**
 * Alternates the status of a button (enabled | disabled)
 * @param {*} button Button to be alternated
 */
function alterButtonStatus(button) {
	button.classList.toggle("disabled-button");
}

/**
 * Insert a session's data as a HTML div
 * @param {*} session Session to be inserted
 */
function addSessionHTML(session) {
	const div = document.createElement("div");
	div.classList.add("saved-session", "position-relative");

	div.innerHTML = `<h3 class="fw-bold fs-4">${session.name}</h3> 
        <div class="d-flex flex-column text-start">
            <p><strong>Players:</strong> ${session.players.join(", ")}</p>
            <p><strong>Language:</strong> ${session.language.text}</p>
            <p><strong>Extra questions:</strong> ${formatTextList(
							session.extraQuestions
						)}</p>
            <p><strong>Filters:</strong> ${formatTextList(session.filters)}</p>
            <p><strong>Creation date:</strong> ${session.creationDate}</p>
        </div>`;
	div.title = `Select ${session.name} session`;

	// Function to select the session in the sessions list
	div.onclick = function () {
		const oldSelected = document.querySelector(".selected-saved-session");

		if (oldSelected && oldSelected != div) {
			oldSelected.classList.remove("selected-saved-session");
		}

		div.classList.toggle("selected-saved-session");
		if (div.classList.contains("selected-saved-session")) {
			document.getElementById("play").disabled = false;
			selectedSesion = sessions.indexOf(session);
		} else {
			document.getElementById("play").disabled = true;
		}
	};

	// Create delete button in the div
	const deleteButton = document.createElement("button");
	deleteButton.classList.add("btn", "btn-danger", "session-btn");
	deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
	deleteButton.title = "Delete this session";
	deleteButton.onclick = function (event) {
		// Prevent selecting the session when clicking on the delete button
		event.stopPropagation();
		sessions.splice(sessions.indexOf(session), 1);
		document.getElementById("saved-sessions-list").removeChild(div);
		localStorage.setItem("sessions", JSON.stringify(sessions));

		if (sessions.length == 0) {
			document.getElementById("saved-sessions-list").innerHTML =
				"<p>There isn't any saved session!</p>";
			document.getElementById("btn-delete-sessions").style.display = "none";
			localStorage.clear();
		}

		document.getElementById("play").disabled = true;
	};

	div.appendChild(deleteButton);
	document.getElementById("saved-sessions-list").appendChild(div);
	document.getElementById("btn-delete-sessions").style.display = "";
}

/**
 * Returns an array as a formated string
 * @param {*} items Array to be formated
 * @returns Formated array as a string
 */
function formatTextList(items) {
	if (items.length == 0) return "NA";
	return items.map(getText).join(", ");
}

/**
 * Returns the text from a string removing unnecesary spaces
 * @param {*} item Original string
 * @returns Text without unnecesary spaces
 */
function getText(item) {
	// trim() borra los espacios innecesarios de un texto
	return item.text.trim();
}

/**
 * Deletes all saved sessions
 */
function deleteAllSessions() {
	if (confirm("Are you sure you want to delete all your sessions?")) {
		sessions = [];
		localStorage.clear();
		document.getElementById("saved-sessions-list").innerHTML =
			"<p>There isn't any saved session!</p>";
		document.getElementById("btn-delete-sessions").style.display = "none";
	}
}

/**
 * Starts the game with the choosen session
 */
function startGame() {
	localStorage.setItem(
		"currentSesion",
		JSON.stringify(sessions[selectedSesion])
	);
	window.location.href = "game.html";
}
