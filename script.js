
/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 5;
    const totalBoards = 100;
    const bingoBoard = document.getElementById('bingo-board');
    const generateBoardsButton = document.getElementById('generate-boards');
    const checkBingoButton = document.getElementById('check-bingo');
    const resetGameButton = document.getElementById('reset-game');
    const playerNameInput = document.getElementById('player-name');
    const addPlayerButton = document.getElementById('add-player');
    const playersContainer = document.getElementById('players');
    const calledNumbersContainer = document.getElementById('numbers');
    const boardTable = document.getElementById('board-table');
    let boards = [];
    let calledNumbers = [];
    let currentPlayer = null;

    function generateBoards() {
        boards = [];
        for (let i = 0; i < totalBoards; i++) {
            let numbers = Array.from({ length: boardSize * boardSize }, (_, i) => i + 1);
            numbers = shuffle(numbers);
            let board = [];
            for (let j = 0; j < boardSize; j++) {
                board.push(numbers.slice(j * boardSize, (j + 1) * boardSize));
            }
            boards.push(board);
        }
        displayBoardSelection();
    }

    function displayBoardSelection() {
        boardTable.innerHTML = '';
        let tableContent = '<tr>';
        for (let i = 0; i < totalBoards; i++) {
            if (i % 10 === 0 && i !== 0) {
                tableContent += '</tr><tr>';
            }
            tableContent += <td><button onclick="selectBoard(${i})">Board ${i + 1}</button></td>;
        }
        tableContent += '</tr>';
        boardTable.innerHTML = tableContent;
    }

    function selectBoard(index) {
        currentPlayer = index;
        renderBoard(boards[index]);
    }

    function renderBoard(board) {
        bingoBoard.innerHTML = '';
        for (let row of board) {
            for (let num of row) {
                const cell = document.createElement('div');
                cell.classList.add('bingo-cell');
                cell.textContent = num;
                cell.addEventListener('click', () => {
                    cell.classList.toggle('selected');
                });
                bingoBoard.appendChild(cell);
            }
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function checkBingo() {
        const cells = Array.from(document.getElementsByClassName('bingo-cell'));
        const selectedCells = cells.filter(cell => cell.classList.contains('selected'));
        if (selectedCells.length < boardSize) return false;

        const selectedNumbers = selectedCells.map(cell => parseInt(cell.textContent));
        const board = Array.from({ length: boardSize }, (_, row) =>
            selectedNumbers.slice(row * boardSize, (row + 1) * boardSize)
        );

        // Check rows
        for (let row of board) {
            if (row.every(num => selectedNumbers.includes(num))) {
                alert('Bingo!');
                return true;
            }
        }

        // Check columns
        for (let col = 0; col < boardSize; col++) {
            const column = board.map(row => row[col]);
            if (column.every(num => selectedNumbers.includes(num))) {
                alert('Bingo!');
                return true;
            }
        }

        // Check diagonals
        const diagonal1 = board.map((row, idx) => row[idx]);
        const diagonal2 = board.map((row, idx) => row[boardSize - idx - 1]);

        if (diagonal1.every(num => selectedNumbers.includes(num)) ||
            diagonal2.every(num => selectedNumbers.includes(num))) {
            alert('Bingo!');
            return true;
        }

        alert('No Bingo!');
        return false;
    }

generateBoardsButton.addEventListener('click', generateBoards);
    checkBingoButton.addEventListener('click', checkBingo);
    resetGameButton.addEventListener('click', () => {
        bingoBoard.innerHTML = '';
        calledNumbersContainer.innerHTML = '';
        calledNumbers = [];
        currentPlayer = null;
        playersContainer.innerHTML = '';
        playerNameInput.value = '';
    });

    generateBoards();
});

// Expose selectBoard function to the global scope
window.selectBoard = selectBoard;
