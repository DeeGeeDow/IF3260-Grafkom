/**
 * Merepresentasikan RGB
 */
class Color {
    /**
     * 
     * @param {number} red 
     * @param {number} green 
     * @param {number} blue 
     */
    constructor(red = 0, green = 0, blue = 0){
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    /**
     * Copy constructor
     * @param {Color} color
     */
    copyColor(color) {
        this.red = color.red;
        this.green = color.green;
        this.blue = color.blue;
    }

    /**
     * Mengembalikan warna untuk dipakai sebagai vertices
     * @returns 
     */
    toDecimalArr(){
        return [this.red/255,this.green/255,this.blue/255]
    }
}