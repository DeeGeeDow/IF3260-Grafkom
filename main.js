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
  const triangle = [
    0.0, 0.0, 0.0, 0.0, 0.0,
    0.0, 1, 0.0, 0.0, 0.0,
    1, 0.0, 0.0, 0.0, 0.0,
  ];

  var positions = [
    0.1, 0.2,
    0.8, 0.2,
    0.1, 0.3,
    0.1, 0.3,
    0.8, 0.2,
    0.8, 0.3,
  ];

  gl.clearColor(1,1,1,1);
  // gl.colorMask(true, false, true ,false);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // console.log(gl.isShader(vertexShader));
  // console.log(gl.isProgram(program));
  // alert(gl.POINTS);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW); //pas mau gambar
  gl.drawArrays(gl.TRIANGLES, 0, 6);

}