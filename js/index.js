function createGameboard() {
    const cells = [];

    function createCell() {
        // player = 1 or 2
        let marked = false;
        let content = ' ';
        const getContent = () => content;
        const resetContent = () => {
            content = ' ';
            marked = false;
        };

        const mark = (player) => {
            if (!marked) {
                if (player === 1) {
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

        return { getContent, mark, resetContent };
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
        return cells[i].mark(player);
    };

    const getCells = () => cells;

    const getRowsContent = () => {
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

    const getColumnsContent = () => {
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

    const getDiagonalsContent = () => {
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

    const resetCells = () => {
        cells.forEach((cell) => {
            cell.resetContent();
        });
    };

    return {
        showGameboard,
        markCell,
        getCells,
        getRowsContent,
        getColumnsContent,
        getDiagonalsContent,
        resetCells,
    };
}

function createPlayer(name, id) {
    let playerName = name; // 1 or 2
    const playerId = id;
    const getPlayerName = () => playerName;
    const setPlayerName = (newName) => (playerName = newName);
    let wins = 0;

    const getPlayerId = () => playerId;

    const mark = (i) => {
        if (controller.gameboard.markCell(i, playerId)) {
            controller.gameboard.showGameboard();

            console.log(controller.getPlays());
            controller.incrementPlays();
            console.log(controller.getPlays());

            // win scenario
            if (controller.getPlays() >= 3 && controller.checkWin()) {
                document.querySelector(
                    '.winning__message'
                ).textContent = `You won player ${playerName}!`;
                display.toggleRematchBtn();
                wins++;
            } else if (controller.getPlays() === 9) {
                // draw scenario
                document.querySelector(
                    '.winning__message'
                ).textContent = `It's a draw!`;
                display.toggleRematchBtn();
            }
            controller.switchCurrentPlayer();
        } else {
            alert('Cell already marked!');
        }
    };

    return { getPlayerName, setPlayerName, getPlayerId, mark };
}

function createGameController() {
    const player1 = createPlayer('player 1', 1);
    const player2 = createPlayer('player 2', 2);
    let currentPlayer = player1;
    const gameboard = createGameboard();
    let plays = 0;

    const launchGame = (player1Name, player2Name) => {
        console.log(player1Name + player2Name);
        player1.setPlayerName(player1Name);
        player2.setPlayerName(player2Name);
    };

    const getCurrentPlayer = () => currentPlayer;

    const switchCurrentPlayer = () => {
        const turnText = document.querySelector('.player__turn');
        if (currentPlayer === player1) {
            currentPlayer = player2;
            turnText.classList.remove('player__turn--1');
            turnText.classList.add('player__turn--2');
        } else {
            currentPlayer = player1;
            turnText.classList.remove('player__turn--2');
            turnText.classList.add('player__turn--1');
        }

        document.querySelector(
            '.player__turn'
        ).textContent = `Your turn ${currentPlayer.getPlayerName()}`;
    };

    const checkWin = () => {
        const rows = gameboard.getRowsContent();
        if (checkRows(0)) {
            return true;
        }
        const cols = gameboard.getColumnsContent();
        if (checkCols(0)) {
            return true;
        }
        const diagonals = gameboard.getDiagonalsContent();
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

    const rematchGame = () => {
        gameboard.resetCells();
        display.mapGameboardToDisplay();
        console.log(plays);
        plays = 0;
        console.log(plays);
        document.querySelector(
            '.player__turn'
        ).textContent = `Your turn ${currentPlayer.getPlayerName()}`;
    };

    const getPlays = () => plays;
    const incrementPlays = () => plays++;
    return {
        checkWin,
        switchCurrentPlayer,
        getCurrentPlayer,
        rematchGame,
        launchGame,
        gameboard,
        getPlays,
        incrementPlays,
    };
}

const controller = createGameController();

function createDisplay() {
    // Initialization of DOM display
    const cells = controller.gameboard.getCells();
    const rematchBtn = document.querySelector('.rematch__btn');
    const gameboardGrid = document.querySelector('.gameboard__grid');
    const gameContainer = document.querySelector('.game-container');
    let isActive = false;
    const init = () => {
        // Mapping cells to DOM elements

        cells.forEach((cell) => {
            const cellElement = document.createElement('div');
            cellElement.textContent = cell.getContent();
            cellElement.dataset.id = cells.indexOf(cell);
            cellElement.classList.add('display__cell');
            cellElement.addEventListener('click', (e) => {
                const clickedCell = e.target;
                const cellIndex = clickedCell.dataset.id;
                const currentPlayer = controller.getCurrentPlayer();
                clickedCell.classList.toggle(
                    `display__cell--player${currentPlayer.getPlayerId()}`
                );
                currentPlayer.mark(cellIndex);
                clickedCell.textContent = cells[cellIndex].getContent();
            });
            gameboardGrid.appendChild(cellElement);
        });
        // Rematch button

        rematchBtn.addEventListener('click', () => {
            controller.rematchGame();
            toggleRematchBtn();
            document.querySelector('.winning__message').textContent = '';
        });
        document.querySelector('main').appendChild(rematchBtn);

        // Form player name inputs
        const submitNamesBtn = document.querySelector('[data-names]');
        submitNamesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const formData = new FormData(document.querySelector('form'));
            if (
                formData.get('player1') === '' ||
                formData.get('player2') === ''
            ) {
                alert('Empty player names!');
            } else {
                controller.launchGame(
                    formData.get('player1'),
                    formData.get('player2')
                );
                if (!isActive) {
                    gameContainer.classList.toggle('game-container--active');
                    isActive = true;
                }

                document.querySelector(
                    '.player__turn'
                ).textContent = `Your turn ${controller
                    .getCurrentPlayer()
                    .getPlayerName()}`;
            }
        });

        // First turn
        document.querySelector(
            '.player__turn'
        ).textContent = `Your turn player ${controller
            .getCurrentPlayer()
            .getPlayerName()}`;
    };

    const mapGameboardToDisplay = () => {
        cells.forEach((c) => {
            const cellElement = document.querySelector(
                `[data-id="${cells.indexOf(c)}"]`
            );
            cellElement.textContent = c.getContent();
            cellElement.classList.remove(
                'display__cell--player1',
                'display__cell--player2'
            );
        });
    };

    const toggleRematchBtn = () => {
        rematchBtn.classList.toggle('rematch__btn--active');
    };

    return { toggleRematchBtn, mapGameboardToDisplay, init };
}

const display = createDisplay();
display.init();
