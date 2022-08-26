export default class Cell {
    #row;
    #column;
    #value = 0;
    #divCell;
    #alreadyMerged = false;
    constructor(divCell, row, column) {
        this.#row = row;
        this.#column = column;
        this.#divCell = divCell;
        this.display(); // initializing color
    }

    get row() {
        return this.#row;
    }

    set row(value) {
        this.#row = value;
    }

    get column() {
        return this.#column;
    }

    set column(value) {
        this.#column = value;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
        this.#divCell.innerText = value;
        this.display();
    }


    get alreadyMerged() {
        return this.#alreadyMerged;
    }

    set alreadyMerged(value ) {
        this.#alreadyMerged = value;
    }

    display() {
        if(this.value !== 0){
            const power = Math.log2(this.value);
            const lightness = Math.abs(100 - power * 6);
            const hue = Math.abs( (power * 5) - 42 ); // = 12
            const saturation = Math.abs(100 - Math.floor(Math.sqrt(this.value)));

            this.#divCell.style.setProperty("--hue", `${hue}`);
            this.#divCell.style.setProperty("--saturation", `${saturation }%`);
            this.#divCell.style.setProperty("--lightness", `${lightness}%`);
            this.#divCell.style.setProperty("--text-lightness", `${lightness <= 50 ? 90 : 10 }%`);

        }
        else
        {
            this.#divCell.innerText = null;
            this.#divCell.style.setProperty("--lightness", `${75}%`);
            this.#divCell.style.setProperty("--hue", `${20}`);
            this.#divCell.style.setProperty("--saturation", `${0}%`);
            this.#divCell.style.setProperty("--text-lightness", `${100}%`);

        }
    }

    canAccept(cell) {
        return (
            cell.value === 0 ||
            (this.#alreadyMerged === false && cell.#alreadyMerged === false && this.value === cell.value )
        )
    }

     mergeCell(cell) {
        cell.value = this.value + cell.value;
        this.value = 0;
        cell.alreadyMerged = true;
        this.alreadyMerged = false;
    }

    moveToCell(cell) {
        cell.value = this.value
        this.value = 0;
        cell.alreadyMerged = this.alreadyMerged;
        this.alreadyMerged = false;
    }

}