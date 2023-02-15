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

    /**
     * Mengembalikan panjang garis
     * @param {RenderingContext} gl 
     * @param {Point[]} points 
     */
    getLength(){
        let x_sq = Math.pow((this.points[1].x - this.points[0].x),2);
        let y_sq = Math.pow((this.points[1].y - this.points[0].y),2);
        return Math.sqrt(x_sq + y_sq);
    }

    /**
     * Ganti panjang garis
     * @param {RenderingContext} gl 
     * @param {Point[]} points 
     */ 
    setLength(new_l){
        let l = this.getLength();
        let x0 = this.points[0].x;
        let x1 = this.points[1].x;
        let y0 = this.points[0].y;
        let y1 = this.points[1].y;
        this.points[1].x = x0 + (new_l)/l*(x1-x0);
        this.points[1].y = y0 + (new_l)/l*(y1-y0);
    }
}