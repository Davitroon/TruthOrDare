<h1 align="center">🎲 Truth or Dare</h1>

<p align="center">
A fun and simple web game developed as part of my Higher Degree in Web Development.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Structure-E34F26?logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-Styling-1572B6?logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
</p>

---

## 📚 Table of Contents
- [📝 Description](#-description "Learn more about the game's concept and purpose")
- [⚙️ Installation](#️-installation "Instructions to install and run the project locally")
- [🕹️ How to Play](#-how-to-play "Step-by-step guide on how to play the game")
- [🔧 Game Architecture](#-game-architecture "Understand the structure and logic behind the game")
- [🧠 Technologies](#-technologies "See which technologies were used to build the project")
- [🔗 API](#-api "Information about the Truth or Dare API used in this project")

---

## 📝 Description
The main requirement for this project was to use an existing API and base the web around it.  
After finding one related to the well-known **Truth or Dare** game, I decided it would be a great idea to develop a **fun, social game** to play with friends or family — directly from the browser!

---

## ⚙️ Installation
You can easily clone this repository if you’d like to make improvements or explore the code:
```bash
git clone https://github.com/Davitroon/TruthOrDare.git
```
---

<h2 id="-how-to-play">🕹️ How to Play</h2>

![Menus showcase](Resources/read-me/menus-showcase.gif)

### 1️⃣ Create a Session
Before starting, **create a new session**.  
Sessions allow you to **save player names, preferences, and filters** for future games.  
You can also **load previously saved sessions** to continue where you left off.  
> ⚠️ Note: Clearing your browser cache will delete all saved sessions.

---

### 2️⃣ Start the Game
![Game showcases](Resources/read-me/game-showcase.gif)
Once the session is ready, the game randomly selects a **player to start** (highlighted with a yellow background).  
The selected player chooses a **question or challenge** from the available options.  
After making a choice, the question or dare is **displayed**, and the turn passes to the next player.

Questions are categorized by **age or content rating**:  
  - **PG** — Suitable for all ages .
  - **PG13** — Some questions may be awkward .
  - **R** — Adult content, for mature players only.

The **background color of the question** indicates its rating for easy identification.  

---

## 🔧 Game Architecture

### 📂 Proyect Structure
The game is built in the following folders and files:
```bash
.
├── game.html
├── index.html
│
├── CSS/
│   ├── game-styles.css
│   └── main-styles.css
│
├── JS/
│   ├── form-scripts.js
│   ├── game-scripts.js
│   └── main-scripts.js
│
└── Resources/
    └── (images and README files)
```

---

### 🗂️ Data Structure
The game revolves around the **`session`** object, which stores all the information needed for a game session. Each session contains both descriptive data and operational data required for gameplay and API requests.
```JSON
{
  "creationDate": "DD/MM/YYYY",
  "name": "Session Name",
  "language": { "key": "en", "text": "English" },
  "players": ["Jhon", "Michael", "James", "Robert"],
  "filters": [
    { "key": "pg", "text": "Safe" },
    { "key": "pg13", "text": "13" }
  ],
  "extraQuestions": [
    { "key": "wyr", "text": "Would You Rather?" },
    { "key": "nhie", "text": "Never Have I Ever" }
  ]
}
```
**Descriptive data:**  
- `creationDate`, `name`, and `players` help identify and display sessions.

**Operational data:**  
- `language`, `filters`, and `extraQuestions` are used to dynamically fetch questions from the API and configure the game.  
- The **`key` field** is used to send data to the API, while the **`text` field** is used to display it in the HTML interface.

---

## 🧠 Technologies

| Technology | Description |
|-------------|-------------|
| ![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26?logo=html5&logoColor=white) | 🌐 Defines the structure and layout of the web application. |
| ![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?logo=css3&logoColor=white) | 🎨 Handles the styling, layout, and visual presentation. |
| ![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black) | ⚙️ Adds logic, interactivity, and dynamic behavior to the app. |


---

### 🔗 API

As previously mentioned, the website is strongly centered around the **Truth or Dare** API

**Endpoint:** `https://api.truthordarebot.xyz/v1/`  
**Response:** 
```JSON
{
  "translations": {
    "bn": "আপনার DM-তে থাকা ব্যক্তিদের তালিকা দেখান।",
    "de": "Zeigen Sie die Liste der Personen in Ihren DMs an.",
    "es": "Muestra la lista de personas en tus DM.",
    "fr": "Afficher la liste des personnes dans vos DM.",
    "hi": "अपने डीएम में लोगों की सूची दिखाएं।",
    "tl": "Ipakita ang listahan ng mga tao sa iyong mga DM."
  },
  "id": "ku9abgpj8vib",
  "type": "DARE",
  "rating": "PG",
  "question": "Show the list of people in your DMs.",
  "pack": null
}
```

The game fetches questions dynamically from the **Truth or Dare API** based on the current session's settings.

1. **Requesting a question**:
   - Constructs the API URL using the selected question's `key`.
   - If filters are set (`PG`, `PG13`, `R`), a **random filter** is applied by adding `?rating={randomFilter.key}` to the URL.
   
2. **Handling the response** :
   - If the session language is not English and the translation exists, it uses the translated question. If not, it retries **fetching a new question**.
   - Displays the question in the UI prepended with the current player's name.

You can explore more in the [API documentation](https://docs.truthordarebot.xyz/api-docs "See the API documentation")
