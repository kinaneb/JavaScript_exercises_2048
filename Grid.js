import Cell from "./Cell.js";

const CELL_GAP = 1.5;
const BOARD_GAP = 2;
 
export default class Grid {
    #cells;
    constructor(divGrid, GRID_SIZE ) {
        const CELL_SIZE = ((90 - ((GRID_SIZE-1)*CELL_GAP + 2*BOARD_GAP) )/ GRID_SIZE) ;
        divGrid.style.setProperty("--grid-size", GRID_SIZE);
        divGrid.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        divGrid.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
        divGrid.style.setProperty("--board-gap", `${BOARD_GAP}vmin`);
        this.#cells = createCellElements(divGrid, GRID_SIZE);
    }

    get cells() {
        return this.#cells;
    }

    get #emptyCells(){
        return this.#cells.filter(cell => cell.value === 0);
    }

    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.column] = cellGrid[cell.column] || []
            cellGrid[cell.column][cell.row] = cell
            return cellGrid
        }, [])
    }
    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.row] = cellGrid[cell.row] || []
            cellGrid[cell.row][cell.column] = cell
            return cellGrid
        }, [])
    }
    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
        return this.#emptyCells[randomIndex];
    }

    resetCellsMerge() {
        this.#cells.map(cell => cell.alreadyMerged = false);
    }
}

function createCellElements(divGrid, GRID_SIZE) {
    const cells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
            const divCell = document.createElement("div");
            divCell.classList.add("cell");
            divCell.id = row + "" + column; // max row, 9 is column number
            cells.push(new Cell(divCell, row, column));
            divGrid.append(divCell);
        }
    }
    return cells;
}
