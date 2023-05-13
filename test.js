

let optimals = [];
console.log('hello');
const choosenSize = 6;
const playerSymbol = 'X';
const enemySymbol = "O";

const fieldTracker = (() => {
    const row_1 = "OX3456";
    const row_2 = "1X3456T";
    const row_3 = "XX3456T";
    const row_4 = "XO3456";
    const row_5 = "12X456T";
    const row_6 = "1XX456T";

    // const column_1 = "123456T";
    // const column_2 = "123456T";
    // const column_3 = "123456T";
    // const column_4 = "123456T";
    // const column_5 = "123456T";
    // const column_6 = "123456T";

    // const diagonal_1 = "123456T";
    // const diagonal_2 = "123456T";

    return {row_1, row_2, row_3, row_4, row_5, row_6,
           // column_1, column_2, column_3, column_4, column_5, column_6,
           //diagonal_1, diagonal_2
        };
})();

const trackerCopy = fieldTracker;
console.log(trackerCopy);

for(let i = 1; i <= choosenSize; i++){
    const rowId = "row_" + i;
    //const columnId ="column_" + i;

    // if(!(trackerCopy[`row_${i}`].includes('T'))){
    //     delete trackerCopy[`row_${i}`];
    // }

    if(trackerCopy[`row_${i}`].includes(`${playerSymbol}`)){
        let newString = trackerCopy[`row_${i}`].split(`${playerSymbol}`, `${enemySymbol}`);
        console.log(newString);
    }
    

    // let newString = trackerCopy[`row_${i}`].split('1').length-1;
    //     console.log(newString);
}

console.log(trackerCopy);





