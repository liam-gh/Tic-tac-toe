// Ensure all paths are correct based on your structure
const millieSound = new Audio('audio/millie.mp3');
const botSound = new Audio('audio/bot.mp3');
const backgroundMusic = new Audio('audio/AtLast.mp3');
const resetSound = new Audio('audio/resetgame.mp3');

// Adjust volume levels for each sound
millieSound.volume = 0.75;
botSound.volume = 0.75;
backgroundMusic.volume = 0.125;

backgroundMusic.loop = true;
backgroundMusic.load();
backgroundMusic.play();

const board = document.getElementById('board');
const resetButton = document.getElementById('resetButton');
const gameMessage = document.getElementById('gameMessage');

let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = '🌹';
let gameActive = true;

function createFallingHearts() {
    const emojiTypes = ['❤️', '💘', '💝', '💋', '🌹', '🌻'];
    const emoji = emojiTypes[Math.floor(Math.random() * emojiTypes.length)];
    const emojiElement = document.createElement('div');
    emojiElement.textContent = emoji;

    const randomSize = Math.random() * 15 + 15; 
    emojiElement.style.fontSize = `${randomSize}px`;

    const randomX = Math.random() * window.innerWidth;

    emojiElement.style.position = 'absolute';
    emojiElement.style.left = `${randomX}px`;
    emojiElement.style.top = `-50px`;

    document.body.appendChild(emojiElement);

    const randomSpeed = Math.random() * 4 + 2; 

    emojiElement.animate([
        { transform: 'translateY(0)' }, 
        { transform: `translateY(${window.innerHeight + 50}px)` }
    ], {
        duration: randomSpeed * 1000,
        easing: 'linear',
        iterations: 1
    });

    setTimeout(() => {
        emojiElement.remove();
    }, randomSpeed * 1000);
}

setInterval(createFallingHearts, 500);

function renderBoard() {
    board.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell;
        cellElement.onclick = () => handleCellClick(index);
        if (cell !== '') cellElement.classList.add('taken');
        board.appendChild(cellElement);
    });
}

function handleCellClick(index) {
    if (gameBoard[index] !== '' || !gameActive || currentPlayer === '🌻') return;

    gameBoard[index] = currentPlayer;
    renderBoard();
    checkWinner();
    if (gameActive) {
        playSoundForPlayer();
        togglePlayer();
    }
}

function playSoundForPlayer() {
    if (currentPlayer === '🌹') {
        millieSound.play();
    } else {
        botSound.play();
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            gameMessage.textContent = currentPlayer === '🌹' ? 'Will you be my valentine? 🌹' : 'Try again, Mildred 🌻';
            return;
        }
    }

    if (!gameBoard.includes('')) {
        gameActive = false;
        gameMessage.textContent = 'Go again 💌';
    }
}

function togglePlayer() {
    currentPlayer = currentPlayer === '🌹' ? '🌻' : '🌹';

    if (currentPlayer === '🌻' && gameActive) {
        gameMessage.textContent = 'It\'s the opponent\'s turn... 🌻';
        aiMove();
    } else if (currentPlayer === '🌹' && gameActive) {
        gameMessage.textContent = 'It\'s your turn! 🌹';
    }
}

function aiMove() {
    const availableCells = gameBoard.reduce((acc, val, idx) => {
        if (val === '') acc.push(idx);
        return acc;
    }, []);

    if (availableCells.length === 0 || !gameActive) return;

    setTimeout(() => {
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameBoard[randomIndex] = '🌻';
        renderBoard();
        checkWinner();
        if (gameActive) {
            playSoundForPlayer();
            togglePlayer();
        }
    }, 1200);
}

resetButton.addEventListener('click', () => {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = '🌹';  
    gameMessage.textContent = '';
    renderBoard();
    resetSound.play(); 
});

renderBoard();
