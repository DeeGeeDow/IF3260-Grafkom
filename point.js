/**
 * Representasi titik x,y 
 * */ 
class Point {
    /**
     * Constructor, nilai default adalah 0,0 (titik di tengah canvas)
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x = 0, y = 0, color = new Color(), name = "Point"){
        this.x = x;
        this.y = y;
        this.name = name
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
     * 
     * @param {number} x 
     * @param {number} y 
     */
    add(x=0,y=0){
        this.x += x;
        this.y += y;
    }

    /**
     * Return [x,y,r,g,b]
     * @returns 
     */
    toVertice(){
        return [this.x,this.y, ...this.color.toDecimalArr()]
    }

    /**
     * Draw square
     */

}