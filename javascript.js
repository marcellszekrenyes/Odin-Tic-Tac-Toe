

//Contains all the functions related to the #playBoard
const boardModule = (() => {
    const playBoard = document.querySelector('#playBoard');
    const column = document.querySelector('.column');
    const boardSizer = document.querySelector('#boardSizer');
    const winningScore = document.querySelector('#winningScore');
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
                nextColumn.setAttribute('style', `font-size: 6.8rem`);
            }
        }else if(choosenSize == 6) {
            for(nextColumn of allColumns){
                nextColumn.setAttribute('style', `font-size: 5.7rem`);
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

    //Resets innerHTML of columns
    function resetPlayBoard(allColumns) {
        for(nextColumn of allColumns) { 
            nextColumn.textContent = "";
        }
    }

    return {boardSizer, allColumns, winningScore, setPlayBoardSize, playBoardStyler, addId, addFreeClass, resetPlayBoard};
})();

//Working logic of the control panel
(function controlPanel() {
    //Gets boardSizer.value when clicked, sets limits for other inputs
    boardSizer.addEventListener('click', () => {

        if(boardSizer.value > 3){
            disable(document.getElementById("Hard"));
            if(document.getElementById("Hard").checked){
                document.getElementById("Easy").checked = true;
            }
        }

        if(boardSizer.value == 3){
            enable(document.getElementById("Hard"))
        }

        if(document.getElementById("winningScore").value >= boardSizer.value){
            document.getElementById("winningScore").value = boardSizer.value;
            console.log(document.getElementById("winningScore").value);
        }

        console.log(boardSizer.value)
    });

    document.getElementById("winningScore").addEventListener('click', () => {
        if(document.getElementById("winningScore").value >= boardSizer.value){
            document.getElementById("winningScore").value = boardSizer.value;
            console.log(document.getElementById("winningScore").value);
        }
    });

    function disable(element){
        if(element.disabled == false){
            element.disabled = true;
        }else {return;}
    }

    function enable(element){
        if(element.disabled == true){
            element.disabled = false;
        }else {return;}
    }

})();

//Contains all the controls of the game
(function gameController() {
    const startButton = document.querySelector('#startButton');
    const restartButton = document.querySelector('#restartButton');

    //Starts the game if #startButton is clicked,user input gets collected
    startButton.addEventListener('click', () => {
        startGame();
    }, {once:true})    

    //Creates new players
    const createPlayer = (name, symbol) => {
        this.name = name;
        this.symbol = symbol;
        return {symbol, name};
    };
    
    //Starts the game
    function startGame() {
        const choosenSize = boardModule.boardSizer.value; 
        const playerSymbol = document.forms.controlForm.elements.playerSymbol.value;
        const gameMode = document.forms.controlForm.elements.gameMode.value;
        const allColumns = boardModule.allColumns;
        const winningScore = boardModule.winningScore.value;

        document.getElementById('controlPanel').style.pointerEvents = 'none';
        document.getElementById('buttonField').style.pointerEvents = 'auto';

        //restarts match with current settings
        restartButton.addEventListener('click', () => {
            resetFieldTracker();
            boardModule.resetPlayBoard(allColumns);              
            startGame();
        })

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
            const playerOne = createPlayer("Player One", playerSymbol);
            const playerTwo = createPlayer("Player Two", playerTwoSymbol);
            boardModule.playBoardStyler(choosenSize, allColumns);
            boardModule.setPlayBoardSize(choosenSize);
            boardModule.addId(choosenSize, allColumns);
            boardModule.addFreeClass(allColumns);
            startTracking(choosenSize);
            gameLogic(playerSymbol, playerTwoSymbol, choosenSize, winningScore, gameMode, allColumns);
        } else {
            alert('The score required for winning can not be higher than the board size! Set it again!');
            setTimeout(() => {startGame()}, 5000);
        }

    }

    //Calls nextRound until there is a winner or draw, then calls gameOver()
    async function gameLogic(playerSymbol, playerTwoSymbol, choosenSize, winningScore, gameMode, allColumns) {
        let roundCount = 1;
        while(true) {
            let isLastRound = false;
            await nextRound(playerSymbol, playerTwoSymbol, choosenSize, winningScore, gameMode, allColumns, roundCount).then((res) => {
                isLastRound = res;
            });
            if(isLastRound == true) {
                break;
            }
            roundCount++;
        }
        gameOver(allColumns);
    }

    //Handles the logic of the rounds, based on gameMode etc., returns a boolean which signals if a next round is needed
    async function nextRound(playerSymbol, playerTwoSymbol, choosenSize, winningScore, gameMode, allColumns, roundCount) {
        return new Promise((resolve) => {
            playBoard.addEventListener("click", (e) => {
                const clickedColumn = e.target;
                if(clickedColumn.classList.contains('free')) {
                    const playerOneWon = nextMove(clickedColumn, playerSymbol, choosenSize, winningScore);

                    if(playerOneWon == true) {
                        announcer('won');
                        resolve(true);
                        return;
                    }

                    if(checkForDraw(choosenSize) == true){
                        announcer('draw');
                        resolve(true)
                        return;
                    }

                    if(gameMode == "PvP"){
                        playBoard.addEventListener("click", (e) => {
                            const secondClick = e.target;
                            if(secondClick.classList.contains('free')) {
                                const playerTwoWon = nextMove(secondClick, playerTwoSymbol, choosenSize, winningScore);

                                if(playerTwoWon == true) {
                                    announcer('won');
                                    resolve(true);
                                    return;
                                }

                                if(checkForDraw(choosenSize) == true){
                                    announcer('draw');
                                    resolve(true)
                                    return;
                                }

                                resolve(false);
                                return;
                            }else {
                                resolve(false);
                                return;
                            }
                        }, {once:true});
                    }

                    if(gameMode == "Easy" || gameMode == "Hard"){
                        setTimeout(() => {         
                        const playerTwoWon = nextMove(botMove(gameMode, allColumns, playerSymbol, playerTwoSymbol, roundCount, choosenSize), playerTwoSymbol, choosenSize, winningScore);
                        if(playerTwoWon == true) {
                            announcer('lost');
                            resolve(true);
                        } else {
                            if(checkForDraw(choosenSize) == true){
                                announcer('draw');
                            }
                            resolve(checkForDraw(choosenSize))}}, 1000);
                        }
                } else {
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
        console.log(winnerString);

        //.free is removed, in case of next click the next move
        //in fieldTracker is not registered again
        clickedColumn.classList.remove('free');

        //registering moves in rows and columns
        fieldTracker[rowId] = fieldTracker[rowId].replace(column, playerSymbol);
        fieldTracker[columnId] = fieldTracker[columnId].replace(row, playerSymbol);


        //registering in diagonal between LT-RB
        if(row == column){
            fieldTracker.diagonal_1 = fieldTracker.diagonal_1.replace(row, playerSymbol);
        }

        //registering in diagonal between LB-RT
        for(let i = 0; i < choosenSize; i++){
            if(row == i + 1 && column == choosenSize - i) {
                fieldTracker.diagonal_2 = fieldTracker.diagonal_2.replace(column, playerSymbol);
            }
        }
        
        stopTracking(rowId, columnId, choosenSize);
        console.log(fieldTracker);  
        const gameIsOver = checkForWinner(winnerString, rowId, columnId);
        console.log(gameIsOver);
        return gameIsOver;
    }

    //Makes a random move or a calculated move, based on gameMode
    function botMove(gameMode, allColumns, playerSymbol, playerTwoSymbol, roundCount, choosenSize) {
        switch(gameMode){
            case 'Easy':
                while (true) {
                const randomElement = allColumns[Math.floor(Math.random() * allColumns.length)];
                if(randomElement.classList.contains('free')) {
                    return randomElement;    
                }}

            case 'Hard':
                let firstRounder = [];
                let firstGrade = [];
                let extraGrade = [];
                let secondGrade = [];
                let thirdGrade = [];
                if(roundCount >= 1){

                    //WINNER
                    for (nextColumn of allColumns) {
                        if(nextColumn.classList.contains('free')) {
                            const id = nextColumn.id;
                            const rowId = "row_" + id.slice(7, 8);
                            const columnId ="column_" +  id.slice(9, 10);

                            if(countString(fieldTracker[rowId], playerTwoSymbol) > 1 || countString(fieldTracker[columnId], playerTwoSymbol) > 1 ||
                              countString(fieldTracker.diagonal_1, playerTwoSymbol) > 1 || countString(fieldTracker.diagonal_2, playerTwoSymbol) > 1){
                                if(countString(fieldTracker.diagonal_1, playerTwoSymbol) > 1) {
                                    for(let i = 1; i <= choosenSize; i++) {
                                        if(document.querySelector(`#column_${i}_${i}`).classList.contains('free')){
                                            fieldTracker.diagonal_1.replace(`${i}`, playerTwoSymbol);
                                            return document.querySelector(`#column_${i}_${i}`);
                                        }
                                    }
                                }

                                if(countString(fieldTracker.diagonal_2, playerTwoSymbol) > 1) {
                                    let j = choosenSize;
                                    for (let i = 1; i <= choosenSize; i++) {
                                        if(document.querySelector(`#column_${i}_${j}`).classList.contains('free')){
                                            fieldTracker.diagonal_2.replace(`${j}`, playerTwoSymbol);
                                            return document.querySelector(`#column_${i}_${j}`);
                                        }
                                        j--;
                                    }
                                }
                                
                                if(countString(fieldTracker[rowId], playerTwoSymbol) > 1 || countString(fieldTracker[columnId], playerTwoSymbol) > 1) {
                                    return nextColumn;
                                }
                            }
                        }
                    }

                    //SAVER
                    for (nextColumn of allColumns) {
                        if(nextColumn.classList.contains('free')) {
                            const id = nextColumn.id;
                            const rowId = "row_" + id.slice(7, 8);
                            const columnId ="column_" +  id.slice(9, 10);

                            if(countString(fieldTracker[rowId], playerSymbol) > 1 || countString(fieldTracker[columnId], playerSymbol) > 1  ||
                              countString(fieldTracker.diagonal_1, playerSymbol) > 1 || countString(fieldTracker.diagonal_2, playerSymbol) > 1){
                                console.log(`column = ${columnId}, row = ${rowId}`);
                                if(countString(fieldTracker.diagonal_1, playerSymbol) > 1) {
                                    for(let i = 1; i <= choosenSize; i++) {
                                        if(document.querySelector(`#column_${i}_${i}`).classList.contains('free')){
                                            fieldTracker.diagonal_1.replace(`${i}`, playerSymbol);
                                            return document.querySelector(`#column_${i}_${i}`);
                                        }
                                    }
                                }

                                if(countString(fieldTracker.diagonal_2, playerSymbol) > 1) {
                                    let j = choosenSize;
                                    for (let i = 1; i <= choosenSize; i++) {
                                        if(document.querySelector(`#column_${i}_${j}`).classList.contains('free')){
                                            fieldTracker.diagonal_2.replace(`${j}`, playerSymbol);
                                            return document.querySelector(`#column_${i}_${j}`);
                                        }
                                        j--;
                                    }
                                }

                                if(countString(fieldTracker[rowId], playerSymbol) > 1 || countString(fieldTracker[columnId], playerSymbol) > 1) {
                                     return nextColumn;
                                }
                            }
                        }
                    }
                }

                
                for (nextColumn of allColumns) {
                    if(nextColumn.classList.contains('free')) {
                        const id = nextColumn.id;
                        const rowId = "row_" + id.slice(7, 8);
                        const columnId ="column_" +  id.slice(9, 10);

                        //ONLY IN FIRST ROUND
                        if(roundCount == 1){
                            if(!(fieldTracker[rowId].includes(`${playerSymbol}`)) && !(fieldTracker[columnId].includes(`${playerSymbol}`))) {
                                firstRounder.push(nextColumn);                                   
                            }                    
                        }

                        //FIRSTGRADE
                        if((fieldTracker[rowId].includes(playerTwoSymbol) && fieldTracker[columnId].includes(playerTwoSymbol)) && 
                          (!fieldTracker[rowId].includes(playerSymbol) && !fieldTracker[columnId].includes(playerSymbol))) {
                            firstGrade.push(nextColumn);
                        }

                        //FIRSTGRADE DIAGONAL
                        if((fieldTracker.diagonal_1.includes(playerTwoSymbol) && fieldTracker.column_2.includes(playerTwoSymbol)) && 
                          (!fieldTracker.diagonal_1.includes(playerSymbol) && !fieldTracker.diagonal_1.includes(playerSymbol))) {
                            firstGrade.push(nextColumn);
                        }

                        //EXTRAGRADE
                        if((fieldTracker[rowId].includes(playerTwoSymbol) || fieldTracker[columnId].includes(playerTwoSymbol)) &&
                          ((!fieldTracker[rowId].includes(playerSymbol) && !fieldTracker[columnId].includes(playerSymbol)))){
                            extraGrade.push(nextColumn);
                          }

                        //SECONDGRADE
                        if((fieldTracker[rowId].includes(playerTwoSymbol) && fieldTracker[columnId].includes(playerTwoSymbol)) && 
                          (!fieldTracker[rowId].includes(playerSymbol) || !fieldTracker[columnId].includes(playerSymbol))){
                            secondGrade.push(nextColumn);
                        }

                        //SECONDGRADE DIAGONAL
                        if((fieldTracker.diagonal_1.includes(playerTwoSymbol) && fieldTracker.diagonal_2.includes(playerTwoSymbol)) && 
                          (!fieldTracker.diagonal_1.includes(playerSymbol) || !fieldTracker.diagonal_2.includes(playerSymbol))){
                            secondGrade.push(nextColumn);
                        }

                        //THIRDGRADE INCL. DIAGONAL
                        if(fieldTracker[rowId].includes(playerTwoSymbol) || fieldTracker[columnId].includes(playerTwoSymbol) || 
                          countString(fieldTracker.diagonal_1, playerSymbol || countString(fieldTracker.diagonal_2, playerSymbol))){
                            thirdGrade.push(nextColumn);
                        }

                    }

                }
                
                if (firstRounder.length > 0){
                    return firstRounder[Math.floor(Math.random() * firstRounder.length)];
                }else if(firstGrade.length > 0){
                    return firstGrade[Math.floor(Math.random() * firstGrade.length)];
                }else if(extraGrade.length > 0){
                    return extraGrade[Math.floor(Math.random() * extraGrade.length)];
                }else if(secondGrade.length > 0){
                    return secondGrade[Math.floor(Math.random() * secondGrade.length)];
                }else if(thirdGrade.length > 0){
                    return thirdGrade[Math.floor(Math.random() * thirdGrade.length)];
                }else{
                    while (true) {
                    const randomElement = allColumns[Math.floor(Math.random() * allColumns.length)];
                    if(randomElement.classList.contains('free')) {
                        return randomElement;
                    }}
                }
        }

    }

    //Counts how many times a letter occurs in a string
    function countString(string, letter) {
        let count = 0;
    
        // looping through the items
        for (let i = 0; i < string.length; i++) {
            // check if the character is at that position
            if (string.charAt(i) == letter) {
                count += 1;
            }
        }
        return count;
    }

    //Returns true if current move won the game
    function checkForWinner(winnerString, row, column) {
        if(fieldTracker[row].includes(winnerString) || fieldTracker[column].includes(winnerString) ||
            fieldTracker.diagonal_1.includes(winnerString) || fieldTracker.diagonal_2.includes(winnerString)){
            return true;
        } else {
            return false;
        }
    }

    //Ends the game
    function gameOver(allColumns) {
        console.log('this is the end');
        document.getElementById('controlPanel').style.pointerEvents = 'auto';

        //restarts match with current settings
        startButton.addEventListener('click', () => {
            resetFieldTracker();
            boardModule.resetPlayBoard(allColumns);              
            startGame();
        }, {once: true})
    }

    ///Checks for draw and returns a boolean
    function checkForDraw(choosenSize) {
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

    //Adds a T (means 'Tracked') to the end of fieldTracker variables
    function startTracking(choosenSize) {
        for(let i = 1; i <= choosenSize; i++){
            const row = `row_${i}`;
            const column = `column_${i}`;
            fieldTracker[row] = fieldTracker[row] + 'T';
            fieldTracker[column] = fieldTracker[column] + 'T';
        }
        console.log(fieldTracker);
    }

    //If a column/row contains two different symbols, tracking stops, the T is removed
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

    //resets fieldTracker
    function resetFieldTracker() {
        for(let i = 1; i <= boardModule.boardSizer.max; i++){
            const row = `row_${i}`;
            const column = `column_${i}`;
            fieldTracker[row] = '123456';
            fieldTracker[column] = '123456';
        }
        fieldTracker.diagonal_1 = '123456T';
        fieldTracker.diagonal_2 = '123456T';
    }

    //Announces the result
    function announcer(string) {
        if(string == 'won'){
            document.getElementById('announcer').textContent = 'You won!'; 
            document.getElementById('announcer').style.display = 'initial';
            document.getElementById('playBoard').style.opacity = 0.5;
            document.getElementById('controlPanel').style.opacity = 0.5;
            document.getElementById('header').style.opacity = 0.5;
        }

        if(string == 'lost'){
            document.getElementById('announcer').textContent = 'You lost!'; 
            document.getElementById('announcer').style.display = 'initial';
            document.getElementById('playBoard').style.opacity = 0.5;
            document.getElementById('controlPanel').style.opacity = 0.5;
            document.getElementById('header').style.opacity = 0.5;    
        }
        
        if(string == 'draw'){
            document.getElementById('announcer').textContent = 'It\'s a draw!';
            document.getElementById('announcer').style.display = 'initial';
            document.getElementById('playBoard').style.opacity = 0.5;
            document.getElementById('controlPanel').style.opacity = 0.5;
            document.getElementById('header').style.opacity = 0.5;       
        }

        setTimeout(() => {
            document.querySelector('html').addEventListener('click', () => {
                removeAnouncement();
            }, {once: true})
        }, 100);
        
    }

    //Removes the announcement banner, resets opacity
    function removeAnouncement() {
            document.getElementById('announcer').style.display = 'none';
            document.getElementById('playBoard').style.opacity = 1;
            document.getElementById('controlPanel').style.opacity = 1;
            document.getElementById('header').style.opacity = 1;
    }

    //This object (factory) represents the board's actual state,
    //in Hard mode decisions are made based on this + wins/draws
    //are determined after reading it out
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




