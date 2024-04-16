function createGameboard() {
    const cells = [];

    function createCell() {
        // player = 1 or 2
        let marked = false;
        let content = ' ';
        const getContent = () => content;

        const mark = (player) => {
            if (!marked) {
                if (player === '1') {
                    content = 'X';
                } else {
                    content = 'O';
                }
                marked = true;
                return marked; // succeeded
            } else {
                return false; // not succeeded
            }
        };

        return { getContent, mark };
    }

    for (let index = 0; index < 9; index++) {
        cells.push(createCell());
    }

    const showGameboard = () => {
        console.log(
            cells[0].getContent() +
                '|' +
                cells[1].getContent() +
                '|' +
                cells[2].getContent() +
                '\n' +
                '------' +
                '\n' +
                cells[3].getContent() +
                '|' +
                cells[4].getContent() +
                '|' +
                cells[5].getContent() +
                '\n' +
                '------' +
                '\n' +
                cells[6].getContent() +
                '|' +
                cells[7].getContent() +
                '|' +
                cells[8].getContent()
        );
    };
    const markCell = (i, player) => {
        if (cells[i].mark(player)) {
            return true;
        } else {
            return false;
        }
    };

    const getRows = () => {
        const rows = [];
        for (let i = 0; i < cells.length; i = i + 3) {
            const row =
                cells[i].getContent() +
                cells[i + 1].getContent() +
                cells[i + 2].getContent();
            rows.push(row);
        }
        return rows;
    };

    const getColumns = () => {
        const cols = [];
        for (let i = 0; i < 3; i++) {
            const col =
                cells[i].getContent() +
                cells[i + 3].getContent() +
                cells[i + 6].getContent();
            cols.push(col);
        }
        return cols;
    };

    const getDiagonals = () => {
        const diagonal1 =
            cells[0].getContent() +
            cells[4].getContent() +
            cells[8].getContent();
        const diagonal2 =
            cells[2].getContent() +
            cells[4].getContent() +
            cells[6].getContent();
        const diagonals = [diagonal1, diagonal2];
        return diagonals;
    };

    return { showGameboard, markCell, getRows, getColumns, getDiagonals };
}

const gameboard = createGameboard();

function createPlayer(id) {
    const playerId = id; // 1 or 2
    let plays = 0;

    const mark = (i, gameboard, game) => {
        if (gameboard.markCell(i, playerId)) {
            gameboard.showGameboard();
            plays++;
            if (plays >= 3 && game.checkWin()) {
                console.log(`You won player ${playerId}!`);
            }
            game.switchCurrentPlayer();
        } else {
            alert('Cell already marked!');
        }
    };

    return { playerId, mark };
}

const player1 = createPlayer('1');
const player2 = createPlayer('2');

function createGameController(gameboard, player1, player2) {
    let currentPlayer = player1;

    const getCurrentPlayer = () => currentPlayer;

    const switchCurrentPlayer = () => {
        currentPlayer === player1
            ? (currentPlayer = player2)
            : (currentPlayer = player1);
    };

    const checkWin = () => {
        const rows = gameboard.getRows();
        if (checkRows(0)) {
            return true;
        }
        const cols = gameboard.getColumns();
        if (checkCols(0)) {
            return true;
        }
        const diagonals = gameboard.getDiagonals();
        if (checkDiagonals(0)) {
            return true;
        } else {
            return false;
        }

        function checkRows(index) {
            const checkedRow = rows[index];
            if (checkedRow === 'XXX' || checkedRow === 'OOO') {
                console.log(`Win at row ${index + 1}`);
                return true;
            } else if (index === rows.length - 1) {
                console.log('Did not found winning row');
                return false;
            } else {
                return checkRows(index + 1);
            }
        }

        function checkCols(index) {
            const checkedCol = cols[index];
            if (checkedCol === 'XXX' || checkedCol === 'OOO') {
                console.log(`Win at col ${index + 1}`);
                return true;
            } else if (index === cols.length - 1) {
                console.log('Did not found winning column');
                return false;
            } else {
                return checkCols(index + 1);
            }
        }

        function checkDiagonals(index) {
            const checkedDiagonal = diagonals[index];
            if (checkedDiagonal === 'XXX' || checkedDiagonal === 'OOO') {
                console.log(`Win at Diagonal ${index + 1}`);
                return true;
            } else if (index === diagonals.length - 1) {
                console.log('Did not found winning diagonal');
                return false;
            } else {
                return checkDiagonals(index + 1);
            }
        }
    };
    return { checkWin, switchCurrentPlayer, getCurrentPlayer };
}

const controller = createGameController(gameboard, player1, player2);

// gameboard.showGameboard();
// player1.mark(0, gameboard, controller);
// player2.mark(1, gameboard, controller);
// player1.mark(2, gameboard, controller);
// player2.mark(4, gameboard, controller);
// player1.mark(3, gameboard, controller);
// player2.mark(7, gameboard, controller);