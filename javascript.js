

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

    //adds numbered id-s for all the columns
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

    return {boardSizer, setPlayBoardSize, playBoardStyler, addId};
})();
  

//Contains all the controls of the game
(function gameController() {
    const startButton = document.querySelector('#startButton');
    const restartButton = document.querySelector('#restartButton');
    const playersSymbol = document.forms.controlForm.elements.playersSymbol.value;

    //Starts the game if start button is clicked
    (function startGame() {
        startButton.addEventListener('click', ()=>{
        const choosenSize = boardModule.boardSizer.value;

        boardModule.playBoardStyler(choosenSize);
        boardModule.setPlayBoardSize(choosenSize);
        boardModule.addId(choosenSize);
    });})();
    
})();

