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
     * @returns {number}
     */
    getLength(){
        let x_sq = Math.pow((this.points[1].x - this.points[0].x),2);
        let y_sq = Math.pow((this.points[1].y - this.points[0].y),2);
        return Math.sqrt(x_sq + y_sq);
    }

    /**
     * Ganti panjang garis
     * @param {number} new_l
     */ 
    setLength(new_l){
        this.dilate(this.points[0], new_l/this.getLength());
    }
}