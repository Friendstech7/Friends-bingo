/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 5;
    const bingoBoard = document.getElementById('bingo-board');
    const generateBoardButton = document.getElementById('generate-board');
    const checkBingoButton = document.getElementById('check-bingo');

    function generateBoard() {
        bingoBoard.innerHTML = '';
        let numbers = Array.from({ length: boardSize * boardSize }, (_, i) => i + 1);
        numbers = shuffle(numbers);

        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('bingo-cell');
            cell.textContent = numbers[i];
            cell.addEventListener('click', () => {
                cell.classList.toggle('selected');
            });
            bingoBoard.appendChild(cell);
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

    generateBoardButton.addEventListener('click', generateBoard);
    checkBingoButton.addEventListener('click', checkBingo);

    generateBoard();
});
