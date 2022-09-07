import Grid from "./Grid.js";

const gameBoard = document.getElementById("game-board");
const score = document.getElementById("score");
const touchDevice = ('ontouchstart' in document.documentElement);
score.innerText = "0";
const grid = new Grid(gameBoard, 4);
let first = null;
let last = null;
generateCell(grid);
generateCell(grid);

setupInput();


function setupInput() {
    if (!touchDevice) {
        window.addEventListener("keydown", handleKey, {once: true})
    } else {
        gameBoard.addEventListener("pointerdown", firstTouch, {once: true});
    }

}

function lastTouch(e) {
    last = e;
    hundleTouch(e)
}

function firstTouch(e) {
    first = e;
    gameBoard.addEventListener("pointerup", lastTouch, {once: true});
}

function hundleTouch(e) {
    hundleDirection(touchDirection(e));
}

function touchDirection(e) {

    const gapX = Math.round(last.pageX - first.pageX);
    const gapY = Math.round(last.pageY - first.pageY);

    const vertical = Math.abs(gapY) > Math.abs(gapX);
    if (vertical) {
        if (gapY < 0) {
            return "ArrowUp";
        }
        return "ArrowDown";
    }
    if (gapX > 0) {
        return "ArrowRight";
    }
    return "ArrowLeft";

}

function handleKey(e) {
    hundleDirection(e.key);
}

function hundleDirection(direct) {
    switch (direct) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInput();
                return;
            }
            moveUp();
            break;
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput();
                return;
            }
            moveDown();
            break;
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput();
                return;
            }
            moveLeft();
            break;
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput();
                return;
            }
            moveRight();
            break;
        default:
            setupInput();
            return;
    }
    generateCell(grid);
    grid.resetCellsMerge();
    scoreUpdate();

    if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
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
        for (let i = 1; i < group.length; i++) {
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

function canMoveUp() {
    return canMove(grid.cellsByColumn);
}

function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()));
}

function canMoveLeft() {
    return canMove(grid.cellsByRow);
}

function canMoveRight() {
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
    let max = grid.cells.reduce((max, cell) => {
        return Math.max(max, cell.value)
    }, 0);
    if (parseInt(document.getElementById("score").innerText) < max) {
        document.getElementById("score").innerText = max;
    }
}