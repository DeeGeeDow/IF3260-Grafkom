function main(){
    let canvas = document.getElementById("canvas");
    let gl = check(canvas);
  
    let vertexShader= createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
    let fragmentShader= createShader(gl,gl.FRAGMENT_SHADER, fragmentShaderText);
  
    let program = createProgram(gl,vertexShader, fragmentShader);
    gl.useProgram(program);
  
    gl.clearColor(0,1,1,1);
    gl.colorMask(true, false, true ,false);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // console.log(gl.isShader(vertexShader));
    // console.log(gl.isProgram(program));
    // alert(gl.POINTS);
    gl.drawArrays(gl.POINTS,0,1);
  
  }