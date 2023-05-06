
//Handles all the functions related to the #playBoard
(function boardModule() {
    const playBoard = document.querySelector('#playBoard');
    const boardSizer = document.querySelector('#boardSizer');
    const column = document.querySelector('.column');

    //controls #playBoard size changes
    boardSizer.addEventListener('click', ()=>{
        playBoardStyler(setPlayBoardSize());
    })
    
    //sets size of #playBoard
    function setPlayBoardSize() {
        const columnCount = document.querySelector('#playBoard').childElementCount;
        const choosenSize = boardSizer.value;

        if(columnCount < Math.pow(choosenSize, 2)) {
            for (let i = columnCount; i < Math.pow(choosenSize, 2); i++) {
                addColumn();
            }
        } else {
            for (let i = columnCount; i > Math.pow(choosenSize, 2); i--) {
                deleteColumn();
            }
        }
        
        return choosenSize;
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
})();




