

//Contains all the functions related to the #playBoard
const boardModule = (() => {
    const playBoard = document.querySelector('#playBoard');
    const column = document.querySelector('.column');
    const boardSizer = document.querySelector('#boardSizer');
    const allColumns = playBoard.children;

    //sets size of #playBoard
    function setPlayBoardSize(choosenSize) {
        const columnCount = document.querySelector('#playBoard').childElementCount;
        
        if(columnCount < Math.pow(choosenSize, 2)) {
            for (let i = columnCount; i < Math.pow(choosenSize, 2); i++) {
                addColumn();
            }
        } else {
            for (let i = columnCount; i > Math.pow(choosenSize, 2); i--) {
                deleteColumn();
            }
        }
    }

    //adds column at end of #playBoard
    function addColumn() {
        const newColumn = column.cloneNode(true);
        playBoard.appendChild(newColumn);
    }

    //deletes column from end of #playBoard
    function deleteColumn() {
        playBoard.lastElementChild.remove();
    }

    //adjusts style of #playBoard
    function playBoardStyler(choosenSize, allColumns) {
        playBoard.setAttribute('style', `grid-template-columns: repeat(${choosenSize}, 1fr); grid-template-rows: repeat(${choosenSize}, 1fr)`);

        if(choosenSize == 3) {
            for(nextColumn of allColumns){
                nextColumn.setAttribute('style', `font-size: 10rem`);
            }
        }else if(choosenSize == 4) {
            for(nextColumn of allColumns){
                nextColumn.setAttribute('style', `font-size: 8rem`);
            }
        }else if(choosenSize == 5) {
            for(nextColumn of allColumns){
                nextColumn.setAttribute('style', `font-size: 7rem`);
            }
        }else if(choosenSize == 6) {
            for(nextColumn of allColumns){
                nextColumn.setAttribute('style', `font-size: 6rem`);
            }
        }

    }

    //adds numbered id-s for all the columns, used for later referencing
    function addId(choosenSize, allColumns) {
        let i = 1;
        let j = 1;
        for (nextColumn of allColumns) { 
            nextColumn.setAttribute('id', `column_${i}_${j}`);
            j++;

            if (j > choosenSize) {
                i++;
                j = 1;
            }
        }
    }

    //Adds .free class to every column/field (responsible for tracking if column is free or taken)
    function addFreeClass(allColumns) {
        for (nextColumn of allColumns) { 
            nextColumn.setAttribute('class', "column free");
        }
    }

    return {boardSizer, allColumns, setPlayBoardSize, playBoardStyler, addId, addFreeClass};
})();
  

//Contains all the controls of the game
(function gameController() {
    const startButton = document.querySelector('#startButton');
    const restartButton = document.querySelector('#restartButton');
    

    //Creates new players
    const createPlayer = (name, symbol) => {
        this.name = name;
        this.symbol = symbol;
        return {symbol, name};
    };
    
    //Starts the game if #startButton is clicked
    (function startGame() {

        //On click user input is collected
        startButton.addEventListener('click', () => {
        const choosenSize = boardModule.boardSizer.value;
        const winningScore = document.querySelector('#winningScore').value;
        const playerSymbol = document.forms.controlForm.elements.playerSymbol.value;
        const allColumns = boardModule.allColumns;

        //sets the symbol for player two
        const playerTwoSymbol =  (() => {
            if(playerSymbol == "X") {
                return "O";
            } else {
                return "X";
            }
        })();

        if(choosenSize >= winningScore){
            //Game is set up based on the collected inputs
            const playerOne = createPlayer("Marcell", playerSymbol);
            const playerTwo = createPlayer("Bot", playerTwoSymbol);
            boardModule.playBoardStyler(choosenSize, allColumns);
            boardModule.setPlayBoardSize(choosenSize);
            boardModule.addId(choosenSize, allColumns);
            boardModule.addFreeClass(allColumns);
            startTracking(choosenSize);
            gameLogic(playerSymbol, playerTwoSymbol, choosenSize, winningScore);

            // //Just some helpers
            // console.log(playerOne);
            // console.log(winningScore);
        } else {
            alert('The score required for winning can not be higher than the board size! Set it again!');
            startGame();
        }
        

    }, {once: true});})();


    async function gameLogic(playerSymbol, playerTwoSymbol, choosenSize, winningScore, ) {
        while(true) {
            let isLastRound = false;
            await nextRound(playerSymbol, playerTwoSymbol, choosenSize, winningScore).then((res) => {
                isLastRound = res;
                console.log('isLastRound:' + isLastRound)
                console.log('11');
            });
            if(isLastRound == true) {
                break;
            }
        }
        gameOver();
    }

    //Registers every move into fieldTracker
    async function nextRound(playerSymbol, playerTwoSymbol, choosenSize, winningScore) {
        console.log('1');
        return new Promise((resolve) => {
            playBoard.addEventListener("click", (e) => {
                console.log('2');
                const clickedColumn = e.target;
                if(clickedColumn.classList.contains('free')) {
                    const playerOneWon = nextMove(clickedColumn, playerSymbol, choosenSize, winningScore);
                    console.log('3');
                    if(playerOneWon == true) {
                        console.log('4');
                        resolve(true);
                        console.log('5');
                        return;
                    }
                    if(checkForDraw(choosenSize) == true){
                        console.log('6');
                        resolve(true)
                        return;
                    }
                    setTimeout(() => {
                        console.log('7');             
                        const playerTwoWon = nextMove(botMove(), playerTwoSymbol, choosenSize, winningScore);
                        if(playerTwoWon == true) {
                            console.log('8');
                        resolve(true);
                        } else {
                            console.log('9');
                            resolve(checkForDraw(choosenSize))}}, 1500);
                } else {
                    console.log('10');
                    resolve(false)}
            }, {once:true});}
        );
    }

    //Handles every move
    function nextMove(clickedColumn, playerSymbol, choosenSize, winningScore) {
        const id = clickedColumn.id;
        const row = id.slice(7, 8);
        const column = id.slice(9, 10);
        const rowId = "row_" + id.slice(7, 8);
        const columnId ="column_" +  id.slice(9, 10);
        //Displays move on the board
        clickedColumn.innerHTML = playerSymbol;

        //If one of fieldTracker's strings contain this substring, the player has won
        let winnerString = playerSymbol.repeat(winningScore);

        //.free is removed, in case of next click the next move
        //in fieldTracker is not registered again
        clickedColumn.classList.remove('free');

        //registering moves in rows and columns
        fieldTracker[rowId] = fieldTracker[rowId].replace(column, playerSymbol);
        // alert(fieldTracker[rowId]);
        fieldTracker[columnId] = fieldTracker[columnId].replace(row, playerSymbol);
        // alert(fieldTracker[columnId]);

        //registering in diagonal between LT-RB
        if(row == column){
            fieldTracker.diagonal_1 = fieldTracker.diagonal_1.replace(row, playerSymbol);
            // alert(fieldTracker.diagonal_1);
        }

        //registering in diagonal between LB-RT
        for(let i = 0; i < choosenSize; i++){
            if(row == i + 1 && column == choosenSize - i) {
                fieldTracker.diagonal_2 = fieldTracker.diagonal_2.replace(column, playerSymbol);
                // alert(fieldTracker.diagonal_2);
            }
        }
        
        stopTracking(rowId, columnId, choosenSize);
        // //Helper
        console.log(fieldTracker);          
        const gameIsOver = checkProgress(winnerString, rowId, columnId);
        console.log('2.5');
        console.log(playerSymbol);
        console.log('gameIsOver:' + gameIsOver);
        return gameIsOver;
    }

    //Makes a random move
    function botMove() {
        const allColumns = playBoard.children;
        
        while (true) {
            const randomElement = allColumns[Math.floor(Math.random() * allColumns.length)];
            if(randomElement.classList.contains('free')) {
                return randomElement;    
            }
        }
    }

    //Returns true if current move won the game
    function checkProgress(winnerString, row, column) {
        if(fieldTracker[row].includes(winnerString) || fieldTracker[column].includes(winnerString) ||
            fieldTracker.diagonal_1.includes(winnerString) ||fieldTracker.diagonal_2 .includes(winnerString)){
            return true;
        } else {
            return false;
        }
    }

    //Ends the game
    function gameOver() {
        console.log('this is the end');
    }

    function checkForDraw(choosenSize) {
        // const allColumns = playBoard.children;
        // let isDraw = true;
        // for(nextColumn of allColumns) {
        //     if(nextColumn.classList.contains('free')){
        //         isDraw = false;
        //     }
        // }
        // return isDraw;

        let isDraw = true;

        if(fieldTracker.diagonal_1.includes('T') || fieldTracker.diagonal_2.includes('T')){
            isDraw = false;
        }
        
        for(let i = 1; i <= choosenSize; i++){
            if(fieldTracker[`row_${i}`].includes('T') || fieldTracker[`column_${i}`].includes('T')){
                isDraw = false;
            }
        }

        return isDraw;
    }

    function startTracking(choosenSize) {
        for(let i = 1; i <= choosenSize; i++){
            const row = `row_${i}`;
            const column = `column_${i}`;
            fieldTracker[row] = fieldTracker[row] + 'T';
            fieldTracker[column] = fieldTracker[column] + 'T';
        }
        console.log(fieldTracker);
    }

    function stopTracking(rowId, columnId) {
        if(fieldTracker[rowId].includes('X') && fieldTracker[rowId].includes('O')){
            fieldTracker[rowId] = fieldTracker[rowId].replace('T', '');
        }
        if(fieldTracker[columnId].includes('X') && fieldTracker[columnId].includes('O')){
            fieldTracker[columnId] = fieldTracker[columnId].replace('T', '');
        }
        if(fieldTracker.diagonal_1.includes('X') && fieldTracker.diagonal_1.includes('O')){
            fieldTracker.diagonal_1 = fieldTracker.diagonal_1.replace('T', '');
        }
        if(fieldTracker.diagonal_2.includes('X') && fieldTracker.diagonal_2.includes('O')){
            fieldTracker.diagonal_2 = fieldTracker.diagonal_2.replace('T', '');
        }
    }


    //This object (factory) contains all the previous moves
    const fieldTracker = (() => {
            const row_1 = "123456";
            const row_2 = "123456";
            const row_3 = "123456";
            const row_4 = "123456";
            const row_5 = "123456";
            const row_6 = "123456";
        
            const column_1 = "123456";
            const column_2 = "123456";
            const column_3 = "123456";
            const column_4 = "123456";
            const column_5 = "123456";
            const column_6 = "123456";
        
            const diagonal_1 = "123456T";
            const diagonal_2 = "123456T";

            return {row_1, row_2, row_3, row_4, row_5, row_6,
                    column_1, column_2, column_3, column_4, column_5, column_6,
                    diagonal_1, diagonal_2};
    })();
    
})();



