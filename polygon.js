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
    }

    toConvexHull(){
        let orientation = (p,q,r) => {
            let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
            return (val == 0) ? 0 : (val>0) ? 1 : -1;
        }
        
        let hull = []

        if(this.points.length > 3) {
            // leftmost point
            let l=0
            for (let i=1; i<this.points.length; i++){
                if (this.points[i].x < this.points[l].x){
                    l = i
                }
            }
            
            let p=l;
            let q;
            
            do{
                hull.push(this.points[p])
                q = (p+1)%this.points.length
                
                for (let i=0; i<this.points.length; i++){
                    if (orientation(this.points[p], this.points[i], this.points[q]) == -1){
                        q = i;
                    }
                }
                p = q
            } while(p != l);
            for(let ph of hull){
                console.log(`(${ph.x},${ph.y})`)
            }
        }
        this.points = hull
        console.log("hehe : " , this.points.length)
    }
}