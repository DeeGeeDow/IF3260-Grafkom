/**
 * State menyimpan shape-shape yang dibuat. Kelas ini juga menyimpan shape yang sedang dipilih
 */
class State {
    /**
     * 
     * @param {RenderingContext} gl 
     */
    constructor(gl) {
        /**@type {Shape[]} */
        this.shapes = []
        /** @type {Shape} */
        this.selectedShape = null
        /** @type {Point} */
        this.selectedPoint = null
        this.gl = gl;
        this.gl.clearColor(1,1,1,1);
        this.gl.clear(gl.COLOR_BUFFER_BIT);
        
        document.getElementById("clearButton").addEventListener("click", this.clearSelection.bind(this))
    }

    /**
     * Draw all shape inside state
     */
    drawCanvas(){
        gl.clearColor(1,1,1,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        for (let shape of this.shapes){
            if (this.selectedShape !== null && this.selectedShape.name === shape.name){
                continue
            }
            shape.draw()
        }
        if (this.selectedShape !== null){
            this.selectedShape.draw()
            this.selectedShape.drawPointsMarker(this.selectedPoint)
        }
    }

    /**
     * Put new shape into state
     * @param {Shape} shape 
     */
    pushShape(shape){
        console.log('masukcok')
        this.shapes.push(shape);
    }

    /**
     * Menggambar shapes dan juga menulis ulang list shape
     */
    draw(){
        this.drawCanvas()
        this.updateShapeList()
    }
    
    /**
     * Mengupdate list shape
     */
    updateShapeList(){
        const shapeList = document.getElementById("shapeList");
        this._emptyOl(shapeList)
        for (let i = this.shapes.length - 1; i > -1; i -= 1){
            const shape = this.shapes[i]
            const shapeButton = document.createElement("button")
            shapeButton.innerHTML = shape.name

            shapeButton.addEventListener("click", this.selectShape.bind(this, shape.name),false)

            const newLi = document.createElement("li")
            newLi.appendChild(shapeButton)

            const pointsOl = document.createElement("ol")
            let j = 1
            for (let point of shape.points ){
                const pointButton = document.createElement("button")
                pointButton.innerHTML = point.name
                pointButton.addEventListener("click", this.selectPoint.bind(this, shape.name, point.name), false)

                const pointLi = document.createElement("li")
                pointLi.appendChild(pointButton)
                pointsOl.appendChild(pointLi)
                j = j + 1;
            }

            newLi.appendChild(pointsOl);

            shapeList.appendChild(newLi)
        }
    }

    /**
     * Mengosongkan list shape
     * @param {HTMLElement} ol 
     */
    _emptyOl(ol){
        let lis = ol.getElementsByTagName("li")
        while(lis.length > 0) {
            ol.removeChild(lis[0]);
            lis = ol.getElementsByTagName("li")
        }
    }
    

    /**
     * 
     * @param {String} name 
     * @param {MouseEvent} ev
     */
    selectShape(name, ev){
        this.selectedPoint = null;
        this.clearSelectedPointText();
        this.getSelectedShape(name,ev);
    }

    /**
     * 
     * @param {String} shapeName 
     * @param {String} pointName 
     * @param {MouseEvent} ev 
     */
    selectPoint(shapeName, pointName, ev){
        
        if (this.selectedShape === null || this.selectedShape.name !== shapeName){
            this.getSelectedShape(shapeName,ev)
        }
        console.log(this.selectedShape.points)
        this.getSelectedPoint(pointName, ev)
    }

    /**
     * 
     * @param {String} pointName 
     * @param {MouseEvent} ev
     */
    getSelectedPoint(pointName, ev){
        let selectedPoint = null;
        for (let i = this.selectedShape.points.length - 1; i > -1; i -= 1) {
            if (this.selectedShape.points[i].name === pointName) {
              selectedPoint = this.selectedShape.points[i];
              break;
            }
          }

        this.selectedPoint = selectedPoint;
        this.setSelectedPointText(this.selectedPoint.name)
        this.draw()
    }

    

    /**
     * 
     * @param {String} name 
     * @param {MouseEvent} ev
     */
    getSelectedShape(name, ev){
        let selectedShape = null;
        for (let i = this.shapes.length - 1; i > -1; i -= 1) {
            if (this.shapes[i].name === name) {
              selectedShape = this.shapes[i];
              break;
            }
          }
        this.selectedShape = selectedShape;
        if (selectedShape instanceof Polygon){
            document.getElementById("tambahTitikPolygon").style.display = "";
            document.getElementById("hapusTitikPolygon").style.display = "";
        } else {
            document.getElementById("tambahTitikPolygon").style.display = "none";
            document.getElementById("hapusTitikPolygon").style.display = "none";
        }
        this.setSelectedShapeText(selectedShape.name)
        this.draw();
    }

    /**
     * Menghapus shape
     */
    deleteSelectedShape(){
        if (this.selectedShape === null){
            return
        }
        let newShapes = [];
        for (let shape of this.shapes){
            if (shape.name !== this.selectedShape.name){
                newShapes.push(shape)
            }
        }
        this.shapes = newShapes;
        this.clearSelection();
        this.draw();
    }

    clearSelection(ev){
        this.selectedPoint = null;
        this.selectedShape = null;
        this.clearSelectedShapeText()
        this.clearSelectedPointText()
        this.draw();
    }

    setSelectedShapeText(text = ""){
        document.getElementById("selectedShape").innerHTML = text
    }
    clearSelectedShapeText(){
        document.getElementById("selectedShape").innerHTML = ""
    }

    setSelectedPointText(text = ""){
        document.getElementById("selectedPoint").innerHTML = text
    }
    clearSelectedPointText(){
        document.getElementById("selectedPoint").innerHTML = ""
    }
}