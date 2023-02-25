/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const gl = check(canvas);
const vertexShaderText = `precision mediump float; 
  attribute vec2 v_pos; 
  attribute vec3 v_col; 
  varying vec3 fragmentColor;

  void main() {
    fragmentColor = v_col;
    gl_Position = vec4(v_pos, 0, 1);
  }`;

const fragmentShaderText = `precision mediump float;

  varying vec3 fragmentColor;
  void main() {
    gl_FragColor = vec4(fragmentColor, 1.0);
  }`;

/*------------------- INITIALIZE WEBGL -------------------------*/
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
let flagLine=false;
let flagRectangle=false;
let flagSquare=false;
let flagPolygon=false;

canvas.width = Math.round(95 / 100 * vh)
canvas.height = Math.round(95 / 100 * vh)


// Setup Viewport
gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

// Setup Shaders
var vertexShader= createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
var fragmentShader= createShader(gl,gl.FRAGMENT_SHADER, fragmentShaderText);

// Setup Program
var program = createProgram(gl,vertexShader, fragmentShader);

// Binding Data
const vertBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertBuf)

// Attribute location based on shader code
let positionAttLoc = gl.getAttribLocation(program, "v_pos");
let colorAttLoc = gl.getAttribLocation(program, "v_col");

// tell WebGL how to read raw data
gl.vertexAttribPointer(
  positionAttLoc, //Attribute location
  2, // number of elements per attribute
  gl.FLOAT, //type of elements
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
  0 // Offset from the beginning of a single vertex to this attribute
);

gl.vertexAttribPointer(
  colorAttLoc, //Attribute location
  3, // number of elements per attribute
  gl.FLOAT, //type of elements
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
  2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);

gl.enableVertexAttribArray(positionAttLoc);
gl.enableVertexAttribArray(colorAttLoc);

gl.useProgram(program);

const sleep = ms => new Promise(r => setTimeout(r, ms));

// /**
//  * 
//  * @param {State} state 
//  */
// function createSquare(state){
//   let sq = new Square(gl,[new Point(0,0)])
//   state.pushShape(sq)
//   state.draw()
// }

/**
 * 
 * @param {State} state 
 */
function perbesar(state){
  if (state.selectedShape === null){
    return
  }
  const multiplier = parseInt(document.getElementById("multiplier").value)
  const centroid = state.selectedShape.getCentroid();
  const k = 1 + (multiplier/100)
  state.selectedShape.dilate(centroid, k);
  state.draw();
}

/**
 * 
 * @param {State} state 
 */
function perkecil(state){
  if (state.selectedShape === null){
    return
  }
  const multiplier = parseInt(document.getElementById("multiplier").value)
  const centroid = state.selectedShape.getCentroid();
  const k = 1 - (multiplier/100)
  state.selectedShape.dilate(centroid, k);
  state.draw();
}

/**
 * 
 * @param {State} state
 */
function changeShapeColor(state){
  if (state.selectedShape === null){
    return
  }
  const value = document.getElementById("shapeColorPicker").value
  const aRgb = hexColorToRGB(value);
  state.selectedShape.changeShapeColor(aRgb[0],aRgb[1],aRgb[2])
  state.draw()
}

/**
 * 
 * @param {State} state
 */
function changePointColor(state){
  if (state.selectedShape === null || state.selectedPoint === null){
    return
  }
  const value = document.getElementById("pointColorPicker").value
  const aRgb = hexColorToRGB(value);
  state.selectedShape.changePointColor(state.selectedPoint,aRgb[0],aRgb[1],aRgb[2])
  state.draw()
}

/**
 * 
 * @param {String} hex 
 */
function hexColorToRGB(hex){
  var aRgb = [
      parseInt(hex.substring(1,3), 16),
      parseInt(hex.substring(3,5), 16),
      parseInt(hex.substring(5,7), 16)
  ];
  return aRgb;
}

/**
 * 
 * @param {State} state
 */
function translasiAtas(state){
  if (state.selectedShape === null){
    return
  }
  state.selectedShape.translate(0,0.0075)
  state.draw()
}
/**
 * 
 * @param {State} state
 */
function translasiKiri(state){
  if (state.selectedShape === null){
    return
  }
  state.selectedShape.translate(-0.0075,0)
  state.draw()
}
/**
 * 
 * @param {State} state
 */
function translasiKanan(state){
  if (state.selectedShape === null){
    return
  }
  state.selectedShape.translate(0.0075,0)
  state.draw()
}
/**
 * 
 * @param {State} state
 */
function translasiBawah(state){
  if (state.selectedShape === null){
    return
  }
  state.selectedShape.translate(0,-0.0075)
  state.draw()
}

/**
 * 
 * @param {State} state 
 * @param {Event} e 
 */
function translasiOnKey(state, e){
  e = e || window.event;
  if (e.keyCode == '38') {
    translasiAtas(state)
  }
  else if (e.keyCode == '40') {
    translasiBawah(state)
  }
  else if (e.keyCode == '37') {
    translasiKiri(state)
  }
  else if (e.keyCode == '39') {
    translasiKanan(state)
  }
}

/**
 * 
 * @param {State} state 
 * @param {String} direction 
 */
function geserTitik(state, direction){
  if (state.selectedShape === null || state.selectedPoint === null){
    return
  }

  const isMostUpper = state.selectedPoint.isMostUpper(state.selectedShape.points)
  const isMostLower = state.selectedPoint.isMostLower(state.selectedShape.points)
  const isMostLeft = state.selectedPoint.isMostLeft(state.selectedShape.points)
  const isMostRight = state.selectedPoint.isMostRight(state.selectedShape.points)
  
  if (state.selectedShape instanceof Square){
    if ((isMostUpper && isMostLeft) || (isMostLower && isMostRight)){
      switch (direction) {
        case "up":
        case "left":
          upLeft(state);
          break;
        case "down":
        case "right":
          downRight(state);
          break;          
        default:
          break;
      }
    } else if ((isMostUpper && isMostRight) || (isMostLower && isMostLeft)){
      switch (direction) {
        case "up":
        case "right":
          upRight(state);
          break;
        case "down":
        case "left":
          downLeft(state);
          break;          
        default:
          break;
      }    
    }
  } else if (state.selectedShape instanceof Rectangle){
    console.log("rectangle")
  } else if (state.selectedShape instanceof Line){
    state.selectedShape.draw();
  } else if (state.selectedShape instanceof Polygon){
    let newPoints = []
    for (let point of state.selectedShape.points){
      if (point.name === state.selectedPoint.name){
        switch (direction) {
          case "up":
            point.add(0,0.0075); 
            break;
          case "right":
            point.add(0.0075,0)
            break;
          case "down":
            point.add(0,-0.0075);
            break;
          case "left":
            point.add(-0.0075,0);
            break;          
          default:
            break;
        }
        state.selectedPoint = point 
      }
      newPoints.push(point)
    }
    state.selectedShape.points = newPoints;
  }
  state.draw()
}

/**
 * 
 * @param {State} state 
 * @param {Event} e 
 */
function geserTitikOnKey(state, e){
  e = e || window.event;
  if (e.keyCode == '38') {
    geserTitik(state, "up")
  }
  else if (e.keyCode == '40') {
    geserTitik(state, "down")
  }
  else if (e.keyCode == '37') {
    geserTitik(state, "left")
  }
  else if (e.keyCode == '39') {
    geserTitik(state, "right")
  }
}

function upLeft(state){
  const selectedPoint = state.selectedPoint
  const selectedShape = state.selectedShape
  let newPoints = []

  for (let point of selectedShape.points){
    if (point.x === selectedPoint.x){
      point.add(-0.0075,0)
    }
    if (point.y === selectedPoint.y){
      point.add(0,0.0075)
    }
    newPoints.push(point)
  }
  selectedPoint.add(-0.0075,0.0075)
  state.selectedShape.points = newPoints
}

function upRight(state){
  const selectedPoint = state.selectedPoint
  const selectedShape = state.selectedShape
  let newPoints = []

  for (let point of selectedShape.points){
    if (point.x === selectedPoint.x){
      point.add(0.0075,0)
    }
    if (point.y === selectedPoint.y){
      point.add(0,0.0075)
    }
    newPoints.push(point)
  }
  selectedPoint.add(0.0075,0.0075)
  state.selectedShape.points = newPoints
}

function downLeft(state){
  const selectedPoint = state.selectedPoint
  const selectedShape = state.selectedShape
  let newPoints = []

  for (let point of selectedShape.points){
    if (point.x === selectedPoint.x){
      point.add(-0.0075,0)
    }
    if (point.y === selectedPoint.y){
      point.add(0,-0.0075)
    }
    newPoints.push(point)
  }
  selectedPoint.add(-0.0075,-0.0075)
  state.selectedShape.points = newPoints
}

function downRight(state){
  const selectedPoint = state.selectedPoint
  const selectedShape = state.selectedShape
  let newPoints = []

  for (let point of selectedShape.points){
    if (point.x === selectedPoint.x){
      point.add(0.0075,0)
    }
    if (point.y === selectedPoint.y){
      point.add(0,-0.0075)
    }
    newPoints.push(point)
  }
  selectedPoint.add(0.0075,-0.0075)
  state.selectedShape.points = newPoints
}
function download(content, filename = "WEBGL.json", contentType = "json") {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
function save(state) {
  const data = { state };
  download(JSON.stringify(data));
}
  function createSquare(state){
    document.getElementById("hint").innerHTML = "click and drag"

    canvas.onmousedown=function(e){ 
      e.preventDefault()
      mousedownSquareEvent(state,e)
    }
      canvas.onmousemove=function(e){
        e.preventDefault()
        mousemoveSquareEvent(state,e)
      }
        canvas.onmouseup=function(e){
          e.preventDefault()
          mouseupSquareEvent(e)  
    }
  }
  function mousedownSquareEvent(state,e){
    let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;  
    let sq = new Square(gl,[new Point(x,y)]);
    state.pushShape(sq)
    flagSquare=true;
  }
  function mouseupSquareEvent(){
    flagSquare=false;
  }
  function mousemoveSquareEvent(state,e){
    let new_x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let new_y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
    if(flagSquare){
      for (let i = state.shapes.length-1 ;i>=0;i--){
        console.log(state)
        if(state.shapes[i].name.slice(0,6)==="Square"){
          let dx = new_x - state.shapes[i].points[0].x;
          let dy = new_y - state.shapes[i].points[0].y;
          let side = Math.min(Math.abs(dx), Math.abs(dy));
          if (dx>0){
            dx=side
          }
          else {
            dx=-side
          }
          if(dy>0){
            dy=side 
          }else{
            dy=-side
          }
          console.log('masuk',dx,dy)
          state.shapes[i].points[1].x= state.shapes[i].points[0].x+dx
          state.shapes[i].points[2].x= state.shapes[i].points[0].x+dx
          state.shapes[i].points[2].y= state.shapes[i].points[0].y+dy
          state.shapes[i].points[3].y= state.shapes[i].points[0].y+dy
          state.draw()
          break
        }
        }
      }
    }
    function createLine(state){
    document.getElementById("hint").innerHTML = "click and drag"
      
      canvas.onmousedown=function(e){
        e.preventDefault()        
        mousedownLineEvent(state,e)
  
      }
        canvas.onmousemove=function(e){
          e.preventDefault()
          mousemoveLineEvent(state,e)
        }
          canvas.onmouseup=function(e){
            e.preventDefault()
            mouseupLineEvent(e)  
      }
    }
    function mousedownLineEvent(state,e){
      let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
      let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;  
      let line = new Line(gl,[new Point(0,0),new Point(x,y)]);
      console.log(state);
      state.pushShape(line)
      flagLine=true;
    }
    function mouseupLineEvent(){
      flagLine=false;
    }
    function mousemoveLineEvent(state,e){
      let new_x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
      let new_y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
      if(flagLine){
        for (let i = state.shapes.length-1 ;i>=0;i--){
          if(state.shapes[i].name.slice(0,4)==="Line"){
          state.shapes[i].points[0].x= new_x
          state.shapes[i].points[0].y= new_y
          state.draw()
          console.log('tesssline')
          break
          }
        }
      } 
    }
    function createRectangle(state){
      document.getElementById("hint").innerHTML = "click and drag"

      canvas.onmousedown=function(e){
        e.preventDefault()
        mousedownRectangleEvent(state,e)
      }
        canvas.onmousemove=function(e){
          e.preventDefault()
          mousemoveRectangleEvent(state,e)
        }
          canvas.onmouseup=function(e){
            e.preventDefault()
            mouseupRectangleEvent(e)  
      }
    }
    function mousedownRectangleEvent(state,e){
      let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
      let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;  
  
      let rectangle = new Rectangle(gl,[new Point(x,y),new Point(x,y)]);
      rectangle.draw()
      state.pushShape(rectangle)
      flagRectangle=true;
    }
    function mouseupRectangleEvent(){
      flagRectangle=false;
    }
    function mousemoveRectangleEvent(state,e){
      let new_x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
      let new_y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
      if(flagRectangle){
        for (let i = state.shapes.length-1 ;i>=0;i--){
          if(state.shapes[i].name.slice(0,9)==="Rectangle"){
            state.shapes[i].points[1].x= new_x
            state.shapes[i].points[2].y= new_y
            state.shapes[i].points[2].x= new_x
            state.shapes[i].points[3].y=new_y
            state.draw()
            break  
          }
        }
      } 
    }

function createPolygon(state) {
  document.getElementById("hint").innerHTML = "click two first points"

  canvas.onmousedown=function(e){ 
    e.preventDefault()
    mousedownPolygonEvent(state,e)
  }
  canvas.onmousemove=function(e){
    e.preventDefault()
    mousemovePolygonEvent(state,e)
  }
  canvas.oncontextmenu=function(e){
    e.preventDefault()
    rightClickPolygonEvent(state,e)
  }
}

/**
 * 
 * @param {State} state 
 * @param {EventListener} e 
 */
function mousedownPolygonEvent(state,e){
  let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
  let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
  /** @type {Polygon} */
  let pg;
  if (flagPolygon == false){
    pg = new Polygon(gl, [new Point(x,y), new Point(x,y)])
    flagPolygon = true
    state.pushShape(pg)
    state.draw()
  } else{
    for (let i = state.shapes.length-1 ;i>=0;i--){
      if(state.shapes[i].name.slice(0,7)==="Polygon"){
        state.shapes[i].addPoint(new Point(x,y))
        state.draw()
        break
      }
    }
  }
}

/**
 * 
 * @param {State} state 
 * @param {EventListener} e 
 */
function mousemovePolygonEvent(state,e){
  let new_x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
  let new_y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
  if(flagPolygon){
    console.log("yes")
    for (let i = state.shapes.length-1 ;i>=0;i--){
      if(state.shapes[i].name.slice(0,7)==="Polygon"){
        let s = state.shapes[i].points.length
        state.shapes[i].points[s-1].x = new_x
        state.shapes[i].points[s-1].y = new_y
        state.draw()
        break
      }
    }
  } 
}

/**
 * 
 * @param {State} state 
 * @param {*} e 
 */
function rightClickPolygonEvent(state, e){
  flagPolygon = false 
  for (let i = state.shapes.length-1 ;i>=0;i--){
    if(state.shapes[i].name.slice(0,7)==="Polygon"){
      state.shapes[i].points.pop()
      console.log(state.shapes[i])
      state.draw()
      break
    }
  }
  document.getElementById("hint").innerHTML = ""
  canvas.oncontextmenu = (e) => {};
  canvas.onmousedown = (e) => {};
  canvas.onmousemove = (e) => {};
}

/**
 * 
 * @param {State} state 
 */
function tambahTitikPolygon(state) {
  document.getElementById("hint").innerHTML = "Tambahkan di canvas"

  canvas.onmousedown=function(e){ 
    e.preventDefault()
    mousedownTambahTitikPolygon(state,e)
  }
}

/**
 * 
 * @param {State} state 
 * @param {Event} e 
 */
function mousedownTambahTitikPolygon(state, e){
  let new_x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
  let new_y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
  for (let i = 0; i < state.shapes.length; i++){
    let shape = state.shapes[i]
    if (shape.name === state.selectedShape.name){
      state.shapes[i].addPoint(new Point(new_x,new_y))
    }
  }
  state.draw()
  canvas.onmousedown = (e) => {};
}

/**
 * 
 * @param {State} state 
 * @returns 
 */
function hapusTitikPolygon(state){
  if (state.selectedShape === null || state.selectedPoint === null){
    return
  }
  let newPoints = [];
  for (let i = 0; i < state.shapes.length; i++){
    let shape = state.shapes[i]
    if (shape.name === state.selectedShape.name){
      for (let point of shape.points){
        if (point.name !== state.selectedPoint.name){
            newPoints.push(point)
        }
      }
      state.shapes[i].points = newPoints
      break
    }
  }

  console.log(state)
  state.clearSelection();
  state.draw();
}

function toConvexHull(state) {
  console.log(state.selectedShape)
  if(state.selectedShape instanceof Polygon){
    console.log("mulai convex hull")
    state.selectedShape.toConvexHull()
  }
  console.log("selesai convex hull")
  state.draw()
}

  
function main(){
  let state = new State(gl);
  const createLineButton=document.getElementById("line")
  const createRectangleButton=document.getElementById("rectangle")
  const createSquareButton=document.getElementById("square")
  const createPolygonButton=document.getElementById("polygon")
  createRectangleButton.addEventListener("click",() =>createRectangle(state))
  createLineButton.addEventListener("click",() =>createLine(state))
  createSquareButton.addEventListener("click",() =>createSquare(state))
  createPolygonButton.addEventListener("click",() => createPolygon(state))
  console.log(state);
  // let pg = new Polygon(gl,[new Point(0.8,-0.2, new Color(0,0,255))])
  // pg.newPoint(new Point(-0.8,-0.8, new Color(0,255,0)))
  // pg.newPoint(new Point(-0.2,-0.8,new Color(255,0,0)))
  // pg.newPoint(new Point(0.2,-0.2, new Color(0,255,255)))
  const savebutton = document.getElementById("save")
  savebutton.addEventListener("click", save.bind(null,state))
  const dilatasiPerbesarButton = document.getElementById("dilatasiPlus")
  dilatasiPerbesarButton.addEventListener("click", perbesar.bind(null, state))

  const dilatasiPerkecilButton = document.getElementById("dilatasiMinus")
  dilatasiPerkecilButton.addEventListener("click", perkecil.bind(null, state))

  const shapeColorPicker = document.getElementById("shapeColorPicker")
  shapeColorPicker.addEventListener("change", changeShapeColor.bind(null, state))

  const pointColorPicker = document.getElementById("pointColorPicker")
  pointColorPicker.addEventListener("change", changePointColor.bind(null, state))

  const translasiAtasButton = document.getElementById("translasiUp")
  translasiAtasButton.addEventListener("click",translasiAtas.bind(null, state))
  translasiAtasButton.addEventListener("keydown", translasiOnKey.bind(null, state))

  const translasiKiriButton = document.getElementById("translasiLeft")
  translasiKiriButton.addEventListener("click", translasiKiri.bind(null, state))
  translasiKiriButton.addEventListener("keydown", translasiOnKey.bind(null, state))

  const translasiBawahButton = document.getElementById("translasiDown")
  translasiBawahButton.addEventListener("click", translasiBawah.bind(null, state))
  translasiBawahButton.addEventListener("keydown", translasiOnKey.bind(null, state))

  const translasiKananButton = document.getElementById("translasiRight")
  translasiKananButton.addEventListener("click", translasiKanan.bind(null, state))
  translasiKananButton.addEventListener("keydown", translasiOnKey.bind(null, state))

  const deleteShapeButton = document.getElementById("hapusShape")
  deleteShapeButton.addEventListener("click", state.deleteSelectedShape.bind(state))

  const geserTitikAtasButton = document.getElementById("geserTitikUp")
  geserTitikAtasButton.addEventListener("click", geserTitik.bind(null, state, "up"))
  geserTitikAtasButton.addEventListener("keydown", geserTitikOnKey.bind(null, state))

  const geserTitikKiriButton = document.getElementById("geserTitikLeft")
  geserTitikKiriButton.addEventListener("click", geserTitik.bind(null, state, "left"))
  geserTitikKiriButton.addEventListener("keydown", geserTitikOnKey.bind(null, state))


  const geserTitikKananButton = document.getElementById("geserTitikRight")
  geserTitikKananButton.addEventListener("click", geserTitik.bind(null, state, "right"))
  geserTitikKananButton.addEventListener("keydown", geserTitikOnKey.bind(null, state))


  const geserTitikBawahButton = document.getElementById("geserTitikDown")
  geserTitikBawahButton.addEventListener("click", geserTitik.bind(null, state, "down"))
  geserTitikBawahButton.addEventListener("keydown", geserTitikOnKey.bind(null, state))

  const tambahTitikPolygonButton = document.getElementById("tambahTitikPolygonButton")
  const hapusTitikPolygonButton = document.getElementById("hapusTitikPolygonButton")
  tambahTitikPolygonButton.addEventListener("click", tambahTitikPolygon.bind(null, state))
  hapusTitikPolygonButton.addEventListener("click", hapusTitikPolygon.bind(null, state))

  const convexHullPolygon = document.getElementById("convexHullPolygon")
  convexHullPolygon.addEventListener("click", toConvexHull.bind(null, state))
}


