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


function main(){  
  //sample data
  // let triangle = [
  //   0.0, 0.0, 0.0, 0.0, 0.0,
  //   0.0, 1, 0.0, 0.0, 0.0,
  //   1, 0.0, 0.0, 0.0, 0.0,
  // ];

//   var positions = [
//     -0.7 ,-0.1 ,1,0,0,
//     -0.3 ,0.6  ,0,0,0,
//     -0.3 ,-0.3 ,0,0,0,
//     0.2  ,0.6  ,0,0,0,
//     0.3  ,-0.3 ,0,0,0,
//     0.7  ,0.6  ,0,0,0, 
//  ]

  
//   let c1 = new Color(255,0,0)
//   let p1 = new Point()
//   let p2 = new Point(0,1)
//   let p3 = new Point(1,0,c1)
//   console.log(p1.toVertice())
//   console.log(p2.toVertice())
//   console.log(p3.toVertice())
//   const triangle = [
//     ...p1.toVertice(),
//     ...p2.toVertice(),
//     ...p3.toVertice()
//   ]
//   let points = [p1,p2,p3];
//   let vertices = [];
//   for (let point of points){
//       vertices.push(
//           ...point.toVertice()
//       )
//   }
//   console.log(vertices);


  gl.clearColor(1,1,1,1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  let sq = new Square(gl,[new Point(-0.5,-0.5, new Color(0,0,255))])
  sq.draw()
  let rt = new Rectangle(gl, [new Point(0.0,0.0,new Color(255,0,0)), new Point(0.5,0.7,new Color(0,255,0))])
  rt.draw()

}