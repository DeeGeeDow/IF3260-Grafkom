/**
 * Representasi titik x,y 
 * */ 
class Point {
    /**
     * Constructor, nilai default adalah 0,0 (titik di tengah canvas)
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x = 0, y = 0, color = new Color()){
        this.x = x;
        this.y = y;
        this.color = color;
    }

    /**
     * Copy constructor
     * @param {Point} point
     */
    copyPoint(point) {
        this.x = point.x;
        this.y = point.y;
    }

    /**
     * Return [x,y,r,g,b]
     * @returns 
     */
    toVertice(){
        return [this.x,this.y, ...this.color.toDecimalArr()]
    }

}