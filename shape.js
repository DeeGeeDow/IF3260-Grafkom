class Shape {
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
        this.name = name
    }

    /**
     * Draw
     */
    draw(){
        const vertices = this.toVertices();
        this.gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW
        );
        this.gl.drawArrays(this.GL_SHAPE, 0, this.points.length)
    }

    /**
     * Turn this shape's points into vertices
     * @returns 
     */
    toVertices(){
        let vertices = [];
        for (let point of this.points){
            vertices.push(
                ...point.toVertice()
            )
        }
        return vertices
    }

    
}