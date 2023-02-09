/**
 * Representasi titik x,y 
 * */ 
class Point {
    /**
     * Constructor, nilai default adalah 0,0 (titik di tengah canvas)
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}