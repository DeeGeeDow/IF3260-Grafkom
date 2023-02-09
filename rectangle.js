class Rectangle extends Shape {
    /**
     * Sejauh ini hanya menerima 2 titik sebagai ujung-ujung diagonal
     * @param {RenderingContext} gl 
     * @param {Point[]} points 
     */
    constructor(gl, points){
        super(gl, points, gl.TRIANGLE_FAN,"Rectangle");
        if (points.length === 2){
            const point1 = points[0];
            const point2 = points[1];
            let newPoints = [
                new Point(point1.x, point1.y,point1.color),
                new Point(point1.x, point2.y,point2.color),
                new Point(point2.x, point2.y,point2.color),
                new Point(point2.x, point1.y,point1.color),
            ]
            this.points = newPoints
        }
    }
}