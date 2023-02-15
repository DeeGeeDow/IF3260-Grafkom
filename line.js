class Line extends Shape {
    /**
     * Sejauh ini hanya menerima 2 titik sebagai ujung-ujung garis
     * @param {RenderingContext} gl 
     * @param {Point[]} points 
     */ 
    constructor(gl, points) {
        super(gl, points, gl.LINES, "Line");
        if(points.length === 2){
            this.points = points;
        }
    }
}