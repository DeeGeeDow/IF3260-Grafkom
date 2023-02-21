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

/**
 * 
 * @param {State} state 
 */
function createSquare(state){
  let sq = new Square(gl,[new Point(0,0)])
  state.pushShape(sq)
  state.draw()
}

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
function main(){
  let state = new State(gl);
  const createLineButton=document.getElementById("line")
  const createRectangleButton=document.getElementById("rectangle")

  function createLine(){
    canvas.addEventListener('mousedown',(e)=>{
      mousedownLineEvent(e)

    })
      canvas.addEventListener('mousemove',(e)=>{
        mousemoveLineEvent(e)
      })
        canvas.addEventListener('mouseup',(e)=>{

          mouseupLineEvent(e)  
    })
  }
  function mousedownLineEvent(e){
    console.log('lalaa')
    let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;  
    let line = new Line(gl,[new Point(x,y)]);
    line.newPoint(new Point(x,y))
    state.pushShape(line)
    flagLine=true;
  }
  function mouseupLineEvent(e){
    flagLine=false;
  }
  function mousemoveLineEvent(e){
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
  function createRectangle(){
    canvas.addEventListener('mousedown',(e)=>{
      mousedownRectangleEvent(e)
    })
      canvas.addEventListener('mousemove',(e)=>{
        mousemoveRectangleEvent(e)
      })
        canvas.addEventListener('mouseup',(e)=>{
          mouseupRectangleEvent(e)  
    })
  }
  function mousedownRectangleEvent(e){
    let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;  

    let rt = new Rectangle(gl,[new Point(x,y)]);
    rt.newPoint(new Point(x,y))
    rt.newPoint(new Point(x,y))
    rt.newPoint(new Point(x,y))
    state.pushShape(rt)
    flagRectangle=true;
  }
  function mouseupRectangleEvent(e){
    flagRectangle=false;
  }
  function mousemoveRectangleEvent(e){
    let new_x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let new_y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
    if(flagRectangle){
      for (let i = state.shapes.length-1 ;i>=0;i--){
        if(state.shapes[i].name.slice(0,9)=="Rectangle"){
          state.shapes[i].points[1].x= new_x
          state.shapes[i].points[2].y= new_y
          state.shapes[i].points[2].x= new_x
          state.shapes[i].points[3].y=new_y
          state.draw()
          console.log('tesss')
          break  
        }
      }
    } 

  }
  createLineButton.addEventListener("click",createLine())
  // createRectangleButton.addEventListener("click",createRectangle())
  let pg = new Polygon(gl,[new Point(0.8,-0.2, new Color(0,0,255))])
  pg.newPoint(new Point(-0.8,-0.8, new Color(0,255,0)))
  pg.newPoint(new Point(-0.2,-0.8,new Color(255,0,0)))
  pg.newPoint(new Point(0.2,-0.2, new Color(0,255,255)))


  const createSquareButton = document.getElementById("square")
  createSquareButton.addEventListener("click",createSquare.bind(null,state))

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

  
}


