

//Contains all the functions related to the #playBoard
const boardModule = (() => {
    const playBoard = document.querySelector('#playBoard');
    const column = document.querySelector('.column');
    const boardSizer = document.querySelector('#boardSizer');

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
    function playBoardStyler(choosenSize) {
        playBoard.setAttribute('style', `grid-template-columns: repeat(${choosenSize}, 1fr); grid-template-rows: repeat(${choosenSize}, 1fr)`);
    }

    //adds numbered id-s for all the columns, used for later referencing
    function addId(choosenSize) {
        var allColumns = playBoard.children;
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
    function addFreeClass() {
        var allColumns = playBoard.children;
        let i = 1;
        let j = 1;
        for (nextColumn of allColumns) { 
            nextColumn.setAttribute('class', "column free");
        }
    }

    //listens to columns click events and changes their texts to #playerSymbol
    function addColumnlisteners(symbol) {
        var allColumns = playBoard.children;

        for (nextColumn of allColumns) { 
            nextColumn.addEventListener('click', (e) => {e.target.innerHTML = symbol});
        }
    }

    return {boardSizer, setPlayBoardSize, playBoardStyler, addId, addFreeClass, addColumnlisteners};
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

        //Game is set up based on the collected inputs
        const playerOne = createPlayer("Marcell", playerSymbol);
        boardModule.playBoardStyler(choosenSize);
        boardModule.setPlayBoardSize(choosenSize);
        boardModule.addId(choosenSize);
        boardModule.addFreeClass();
        boardModule.addColumnlisteners(playerSymbol);
        moveRegister(playerSymbol, choosenSize);

        //Just some helpers
        console.log(playerOne);
        console.log(winningScore);

    }, {once: true});})();

    //registers every move into fieldTracker
    function moveRegister(playerSymbol, choosenSize) {

        //Columns are listened with event delegation
        playBoard.addEventListener('click', (e) => {
            const id = e.target.id;
            const row = id.slice(7, 8);
            const column = id.slice(9, 10);
            const rowId = "row_" + id.slice(7, 8);
            const columnId ="column_" +  id.slice(9, 10);

            //.free is removed, in case of next click the next move
            //in fieldTracker is not registered again
            if(e.target.classList.contains('free')){
                e.target.classList.remove('free');
            } else{
                return;
            }

            //registering moves in rows and columns
            fieldTracker[rowId] = fieldTracker[rowId].replace(column, playerSymbol);
            alert(fieldTracker[rowId]);
            fieldTracker[columnId] = fieldTracker[columnId].replace(row, playerSymbol);
            alert(fieldTracker[columnId]);

            //registering in diagonal between LT-RB
            if(row == column){
                fieldTracker.diagonal_1 = fieldTracker.diagonal_1.replace(row, playerSymbol);
                alert(fieldTracker.diagonal_1);
            }

            //registering in diagonal between LB-RT
            for(let i = 0; i < choosenSize; i++){
                if(row == i + 1 && column == choosenSize - i) {
                    fieldTracker.diagonal_2 = fieldTracker.diagonal_2.replace(column, playerSymbol);
                    alert(fieldTracker.diagonal_2);
                }
            }
            
            //Helper
            console.log(fieldTracker);
        });
        
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
        
            const diagonal_1 = "123456";
            const diagonal_2 = "123456";
        
            return {row_1, row_2, row_3, row_4, row_5, row_6,
                    column_1, column_2, column_3, column_4, column_5, column_6,
                    diagonal_1, diagonal_2};

    })();
    
})();



