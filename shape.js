class Shape {
    static id = 1

    /**
     * Constructor
     * @param {RenderingContext} gl 
     * @param {Point[]} points 
     * @param {GLenum} GL_SHAPE 
     * @param {String} name 
     */
    constructor(gl,points, GL_SHAPE, name){
        this.gl = gl;
        this.points = points;
        this.GL_SHAPE = GL_SHAPE;
        this.name = name + " " + Shape.id.toString()
        Shape.id++
    }

    /**
     * Draw
     */
    draw(){
        this.updatePointName();
        const vertices = this.toVertices();
        this.gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW
        );
        this.gl.drawArrays(this.GL_SHAPE, 0, this.points.length)
    }

    /**
     * 
     * @param {Color} color 
     * @param {Point | null} selectedPoint 
     */
    drawPointsMarker(selectedPoint = null){
        let vertices = []
        for (let point of this.points){
            let newPoints = []
            if (selectedPoint !== null && selectedPoint.name === point.name){
                newPoints = [
                    new Point(point.x - 0.015, point.y + 0.015, new Color(255,0,0)),
                    new Point(point.x - 0.015, point.y - 0.015, new Color(255,0,0)),
                    new Point(point.x + 0.015, point.y - 0.015, new Color(255,0,0)),
                    new Point(point.x + 0.015, point.y + 0.015, new Color(255,0,0)),
                ]
            } else {
                newPoints = [
                    new Point(point.x - 0.015, point.y + 0.015),
                    new Point(point.x - 0.015, point.y - 0.015),
                    new Point(point.x + 0.015, point.y - 0.015),
                    new Point(point.x + 0.015, point.y + 0.015),
                ]
            }
            vertices = this.toVertices(newPoints)
            this.gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(vertices),
                gl.STATIC_DRAW
            );
            this.gl.drawArrays(this.GL_SHAPE, 0, this.points.length)
        }
    }

    /**
     * Turn this shape's points into vertices
     * @returns 
     */
    toVertices(points = this.points){
        let vertices = [];
        for (let point of points){
            vertices.push(
                ...point.toVertice()
            )
        }
        return vertices
    }
    
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    translate(x=0.0,y=0.0){
        let newPoints = []
        for (let point of this.points){
            point.add(x,y)
            newPoints.push(point);
        }
        this.points = newPoints;
    }

    updatePointName(){
        let i = 1
        let newPoints = []
        for (let point of this.points){
            newPoints.push(new Point(point.x,point.y,point.color,"Point " + i.toString()))
            i++
        }
        this.points = newPoints;
    }

    /**
     * 
     * @param {Point} center 
     * @param {number} k 
     */
    dilate(center, k){
        let newPoints = []
        for (let point of this.points){
            point.x = center.x + k*(point.x - center.x);
            point.y = center.y + k*(point.y - center.y);
            newPoints.push(point);
        }
        this.points = newPoints;
    }
    
}