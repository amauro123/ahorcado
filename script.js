document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const wordOutput = document.getElementById('word-output');
    const usedLettersDisplay = document.getElementById('used-letters');
    const letterInput = document.getElementById('letter-input');
    const guessButton = document.getElementById('guess-button');
    const messageDisplay = document.getElementById('message');
    const resetButton = document.getElementById('reset-button');
    const hangmanDrawing = document.querySelector('.hangman-drawing');
    const hintButton = document.getElementById('hint-button'); // Nuevo
    const hintOutput = document.getElementById('hint-output');   // Nuevo

    // Partes del ahorcado para mostrar progresivamente
    const hangmanParts = [
        'head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'
    ];

    // 2. Variables del Juego
    // Modificamos las palabras para que cada una tenga una pista asociada
    const wordsWithHints = [
        { word: "REQUERIMIENTOS", hint: "Son la base de cualquier software, ¿qué se necesita construir?" },
        { word: "SOFTWARE", hint: "Conjunto de programas y rutinas que permiten a la computadora realizar determinadas tareas." },
        { word: "DESARROLLO", hint: "Proceso de creación y mejora continua de aplicaciones." },
        { word: "ALGORITMO", hint: "Secuencia de pasos finitos para resolver un problema." },
        { word: "PROGRAMACION", hint: "Acto de escribir código para crear aplicaciones." },
        { word: "FRAMEWORK", hint: "Marco de trabajo que proporciona una estructura para el desarrollo." },
        { word: "VARIABLE", hint: "Espacio de memoria para almacenar datos que pueden cambiar." },
        { word: "FUNCION", hint: "Bloque de código diseñado para realizar una tarea específica." },
        { word: "CLASE", hint: "Plano o molde para crear objetos." },
        { word: "OBJETO", hint: "Instancia de una clase, con propiedades y comportamientos." },
        { word: "HERENCIA", hint: "Mecanismo por el cual una clase puede adquirir propiedades de otra." },
        { word: "POLIMORFISMO", hint: "Capacidad de un objeto para tomar diferentes formas o comportamientos." },
        { word: "BASEDEDATOS", hint: "Colección organizada de información." },
        { word: "SERVIDORES", hint: "Computadoras que proporcionan recursos a otras computadoras en una red." },
        { word: "FRONTEND", hint: "Parte de la aplicación con la que interactúa el usuario." },
        { word: "BACKEND", hint: "Parte de la aplicación que se encarga de la lógica del servidor y la base de datos." },
        { word: "DEBUGGING", hint: "Proceso de encontrar y corregir errores en el código." },
        { word: "COMPILAR", hint: "Traducir código fuente a código máquina." },
        { word: "INTERPRETAR", hint: "Ejecutar código línea por línea sin compilarlo." },
        { word: "VERSIONAMIENTO", hint: "Control de cambios en el código a lo largo del tiempo." }
    ];
    let currentWordData = {}; // Almacena el objeto {word, hint} de la palabra actual
    let selectedWord = '';
    let guessedWord = []; // Array para mostrar la palabra con guiones y letras adivinadas
    let usedLetters = []; // Letras que el usuario ya ha intentado
    let wrongGuesses = 0; // Contador de errores
    const maxWrongGuesses = hangmanParts.length; // Número máximo de partes del ahorcado
    let hintUsed = false; // Bandera para saber si la pista ya fue usada

    // 3. Funciones del Juego

    // Inicializa un nuevo juego
    function initializeGame() {
        // Seleccionamos un objeto completo de palabras con pistas
        currentWordData = wordsWithHints[Math.floor(Math.random() * wordsWithHints.length)];
        selectedWord = currentWordData.word;
        guessedWord = Array(selectedWord.length).fill('_');
        usedLetters = [];
        wrongGuesses = 0;
        hintUsed = false; // Resetear la pista

        // Limpiar dibujo del ahorcado
        hangmanParts.forEach(part => {
            hangmanDrawing.classList.remove(`show-${part}`);
        });

        updateDisplay();
        messageDisplay.textContent = '';
        messageDisplay.className = 'message'; // Resetear clases de mensaje
        letterInput.value = '';
        letterInput.disabled = false;
        guessButton.disabled = false;
        resetButton.classList.add('hidden'); // Ocultar botón de reinicio
        hintButton.disabled = false; // Habilitar botón de pista
        hintOutput.classList.add('hidden'); // Ocultar la pista
        hintOutput.textContent = ''; // Limpiar el texto de la pista
        letterInput.focus(); // Enfocar el input para el usuario
    }

    // Actualiza la visualización de la palabra y las letras usadas
    function updateDisplay() {
        wordOutput.textContent = guessedWord.join(' ');
        usedLettersDisplay.textContent = usedLetters.join(', ');
    }

    // Maneja el intento del usuario
    function handleGuess() {
        const letter = letterInput.value.toUpperCase();
        letterInput.value = ''; // Limpiar input

        if (!letter.match(/[A-Z]/) || letter.length !== 1) {
            messageDisplay.textContent = 'Por favor, ingresa una sola letra válida (A-Z).';
            return;
        }

        if (usedLetters.includes(letter)) {
            messageDisplay.textContent = `Ya intentaste la letra "${letter}".`;
            return;
        }

        usedLetters.push(letter);
        messageDisplay.textContent = ''; // Limpiar mensaje anterior

        if (selectedWord.includes(letter)) {
            // La letra es correcta
            for (let i = 0; i < selectedWord.length; i++) {
                if (selectedWord[i] === letter) {
                    guessedWord[i] = letter;
                }
            }
            messageDisplay.textContent = `¡Correcto! La letra "${letter}" está en la palabra.`;
        } else {
            // La letra es incorrecta
            wrongGuesses++;
            messageDisplay.textContent = `Incorrecto. La letra "${letter}" no está.`;
            drawHangmanPart();
        }

        updateDisplay();
        checkGameStatus();
    }

    // Dibuja la siguiente parte del ahorcado
    function drawHangmanPart() {
        if (wrongGuesses > 0 && wrongGuesses <= maxWrongGuesses) {
            const partToShow = hangmanParts[wrongGuesses - 1];
            hangmanDrawing.classList.add(`show-${partToShow}`);
        }
    }

    // Muestra la pista y la deshabilita
    function showHint() {
        if (!hintUsed) {
            hintOutput.textContent = `Pista: ${currentWordData.hint}`;
            hintOutput.classList.remove('hidden');
            hintUsed = true;
            hintButton.disabled = true; // Deshabilitar el botón de pista después de usarla
            messageDisplay.textContent = 'Has usado una pista.';
        }
    }

    // Verifica si el juego ha terminado (ganado o perdido)
    function checkGameStatus() {
        if (guessedWord.join('') === selectedWord) {
            messageDisplay.textContent = '¡Felicidades! ¡Has adivinado la palabra!';
            messageDisplay.classList.add('win');
            endGame(true);
        } else if (wrongGuesses >= maxWrongGuesses) {
            messageDisplay.textContent = `¡Perdiste! La palabra era "${selectedWord}".`;
            messageDisplay.classList.add('lose');
            endGame(false);
        }
    }

    // Finaliza el juego (deshabilita inputs y muestra botón de reinicio)
    function endGame(won) {
        letterInput.disabled = true;
        guessButton.disabled = true;
        hintButton.disabled = true; // También deshabilitar la pista al finalizar
        resetButton.classList.remove('hidden');
    }

    // 4. Event Listeners
    guessButton.addEventListener('click', handleGuess);

    letterInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });

    hintButton.addEventListener('click', showHint); // Nuevo event listener para el botón de pista

    resetButton.addEventListener('click', initializeGame);

    // 5. Iniciar el juego al cargar la página
    initializeGame();
});