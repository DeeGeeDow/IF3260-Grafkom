class Rectangle extends Shape {
    /**
     * Sejauh ini hanya menerima 2 titik sebagai ujung-ujung diagonal
     * @param {RenderingContext} gl 
     * @param {Point[]} points 
     */
    constructor(gl, points){
        super(gl, points, gl.TRIANGLE_FAN,"Rectangle");
        if (points.length === 1){
            const point = points[0];
            console.log('true p')
            let newPoints = [
                new Point(point.x, point.y,point.color),
                new Point(point.x, point.y,point.color),
                new Point(point.x, point.y,point.color),
                new Point(point.x, point.y,point.color),
            ]
            this.points = newPoints
        }
    }
        /**
     * Menambahkan titik baru
     * @param {Point} point 
     */
        newPoint(point = new Point()){
            this.points.push(point)
        }
    
}