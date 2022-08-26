import Grid from "./Grid.js";

const gameBoard = document.getElementById("game-board");
const score = document.getElementById("score");

score.innerText = 0;
const grid = new Grid(gameBoard, 4);

generateCell(grid);
generateCell(grid);

setupInput();
//consolgit add README.mde.log(grid.cellsByColumn);


function setupInput() {
    window.addEventListener("keydown", handleInput, {once: true})
}

function handleInput(e) {
    switch (e.key) {
        case "ArrowUp":
            if(!canMoveUp()){
                setupInput();
                return;
            }
            moveUp();
            break;
        case "ArrowDown":
            if(!canMoveDown()){
                setupInput();
                return;
            }
            moveDown();
            break;
        case "ArrowLeft":
            if(!canMoveLeft()){
                setupInput();
                return;
            }
            moveLeft();
            break;
        case "ArrowRight":
            if(!canMoveRight()){
                setupInput();
                return;
            }
            moveRight();
            break;
        default:
            setupInput();
            return;
    }
    const newCell = generateCell(grid);
    grid.resetCellsMerge();
    scoreUpdate();

    if(!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
        alert("You lose");
        return;
    }
    setupInput();

}

function moveUp() {
    return slideTiles(grid.cellsByColumn);
}
function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
}
function moveLeft() {
    return slideTiles(grid.cellsByRow);
}
function moveRight() {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
}

function slideTiles(cells) {
        cells.flatMap(group => {
            for (let i = 1; i  < group.length; i++){
                const cell = group[i]
                if (cell.value === 0) continue;
                let lastValidCell = null;
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j];
                    if (!cell.canAccept(moveToCell)) break;
                    lastValidCell = moveToCell;
                }
                if (lastValidCell != null) {
                    if (lastValidCell.value !== 0) {
                        cell.mergeCell(lastValidCell);
                    } else {
                        cell.moveToCell(lastValidCell);
                    }
                }
            }
        })
}

function generateCell(grid) {
    return grid.randomEmptyCell().value = Math.random() > 0.5 ? 4 : 2;
}

function  canMoveUp() {
    return canMove(grid.cellsByColumn);
}
function  canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()));
}
function  canMoveLeft() {
    return canMove(grid.cellsByRow);
}
function  canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()));
}

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false;
            if (cell.value === 0) return false;
            const moveToCell = group[index - 1]
                return cell.canAccept(moveToCell);
        })
    })
}

function scoreUpdate() {
    let max = grid.cells.reduce((max, cell) => {return Math.max(max, cell.value)}, 0);
    if(parseInt(document.getElementById("score").innerText) < max){
        document.getElementById("score").innerText = max;
    }
}