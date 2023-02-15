class State {
    /**
     * 
     * @param {RenderingContext} gl 
     */
    constructor(gl) {
        /**@type {Shape[]} */
        this.shapes = []
        /** @type {Shape} */
        this.current = null

        this.gl = gl;

        this.gl.clearColor(1,1,1,1);
        this.gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * Draw all shape inside state
     */
    drawCanvas(){
        gl.clearColor(1,1,1,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        for (let shape of this.shapes){
            shape.draw()
        }
    }

    /**
     * Put new shape into state
     * @param {Shape} shape 
     */
    pushShape(shape){
        this.shapes.push(shape);
    }

    draw(){
        this.drawCanvas()
        this.updateShapeList()
    }
    
    updateShapeList(){
        const shapeList = document.getElementById("shapeList");
        this._emptyOl(shapeList)
        for (let shape of this.shapes){
            const shapeButton = document.createElement("button")
            shapeButton.innerHTML = shape.name
            
            const newLi = document.createElement("li")
            newLi.appendChild(shapeButton)

            const pointsOl = document.createElement("ol")
            let i = 1
            for (let point of shape.points ){
                let pointButton = document.createElement("button")
                pointButton.innerHTML = "point "+ i.toString();
                let pointLi = document.createElement("li")
                pointLi.appendChild(pointButton)
                pointsOl.appendChild(pointLi)
                i = i + 1;
            }

            newLi.appendChild(pointsOl);

            shapeList.appendChild(newLi)
        }
        // console.log(shapeList)
        
        // let newLI = document.createElement("li");

        // let newText = document.createTextNode("wawaw");
        // newLI.appendChild(newText);
        // shapeList.appendChild(newLI);
    }

    _emptyOl(ol){
        let lis = ol.getElementsByTagName("li")
        while(lis.length > 0) {
            ol.removeChild(lis[0]);
            lis = ol.getElementsByTagName("li")
        }
    }
}