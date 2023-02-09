/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @returns {RenderingContext | null}
 */
function check(canvas){
  let gl = ['experimental-webgl','webgl','moz-webgl'];
  let flag;
  for(let i=0; i<gl.length;i++){
    try{
      flag=canvas.getContext(gl[i]);
    }
    catch(e){}
    if(flag){
      break;
    }
  }
  if(!flag){
    alert("Maaf, WebGL tidka tersedia di browser anda. Silahkan update browser Anda.");
  }
  return flag;
}

function createShader(gl,type, source) {
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('error!', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null;
  }
  return shader;
}

function createProgram(gl,vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('error!', gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return null;
  }
  gl.validateProgram(program)
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error('error validating program!', gl.getProgramInfoLog(program))
      //console.log(gl.getProgramInfoLog(program))
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);      
      return null;
  }
  return program;
}

