class Polygon extends Shape {

    /**
     * Constructor
     * @param {RenderingContext} gl 
     * @param {Point[]} points 
     */
    constructor(gl, points){
        super(gl, points, gl.TRIANGLE_FAN,"Polygon");
        if (points.length === 1){
            this.points = points
        }
    }

    /**
     * Menambahkan titik baru
     * @param {Point} point 
     */
    newPoint(point = new Point()){
        this.points.push(point)
        console.log(this.points)
    }
}