class Square extends Shape {
    /**
     * Sejauh ini hanya menerima satu titik sebagai titik tengah.
     * Lalu dibuat membesar dari titik tengah tersebut
     * @param {RenderingContext} gl 
     * @param {Point[]} points 
     */
    constructor(gl, points){
        super(gl, points, gl.TRIANGLE_FAN,"Square");
        if (points.length === 1){
            const point = points[0];
            
            let newPoints = [
                new Point(point.x - 0.3, point.y + 0.3, point.color),
                new Point(point.x - 0.3, point.y - 0.3, point.color),
                new Point(point.x + 0.3, point.y - 0.3, point.color),
                new Point(point.x + 0.3, point.y + 0.3, point.color),
            ]
            this.points = newPoints
        }
    }

    
}