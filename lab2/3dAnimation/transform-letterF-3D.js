"use strict";

var canvas;
var gl;

var primitiveType;
var offset = 0;
var count = 228;
	

var translation = [300, 150, 0]; //top-left-depth of F
var rotation = [0, 0, 0];
var scale = [1.0,1.0, 1.0]; //default scale

var colorUniformLocation;
var angle = 0;
var angleInRadians = 0;
var matrix;
var matrixLocation;
var translationMatrix;
var rotationMatrix;
var scaleMatrix;
var moveOriginMatrix;
var projectionMatrix;

var movement = 1;
var currentposition = 0;
var scalefactor = 0.005;
var currentscale = 0.005;
var middlewidth = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	
	gl.enable(gl.CULL_FACE); //enable depth buffer
	gl.enable(gl.DEPTH_TEST);
	
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );

    var positionLocation = gl.getAttribLocation( program, "a_position" );
    gl.vertexAttribPointer( positionLocation, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLocation );

    var colorUniformLocation = gl.getUniformLocation(program, "v_color");
	
    // Associate out shader variables with our data buffer
	
    var colorLocation = gl.getAttribLocation(program, "a_color");
	gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
    gl.enableVertexAttribArray( colorLocation );
	
	matrixLocation = gl.getUniformLocation(program, "u_matrix");
    middlewidth = Math.floor(gl.canvas.width/2);

	//Update rotation angle according to angle slider
	
	rotation = [degToRad(40), degToRad(25), degToRad(325)];
	
	primitiveType = gl.TRIANGLES;
	render(); //default render
}

function render() 
{
	// Compute the matrices
    currentposition += movement;
    currentscale += scalefactor;

    if (currentposition > middlewidth) {
        currentposition = middlewidth;
        movement = -movement;

    }
    if (currentposition < 0) {
        currentposition = 0;
        movement = -movement;
    }

    if (currentscale > 2){
        currentscale = 2.0;
        scalefactor = -scalefactor;
    }

    if (currentscale < 0.005){
        currentscale = 0.005;
        scalefactor = -scalefactor;
    }

    angle += 1.0;

    gl.clear( gl.COLOR_BUFFER_BIT );

    drawU();
    drawI();
    console.log(currentposition, currentscale, movement, scalefactor);
    requestAnimationFrame(render); //refresh
	
}

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }


var m4 = {

  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  identity: function() {
    return [
       1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },

  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  rotate: function(m, angleInRadians, axis) {
      return m4.multiply(m, m4.xRotation(angleInRadians, axis));
  },

  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

};

function drawI(){
    count = 36; //number of vertices
    translation = [middlewidth-130,gl.canvas.height/2-90];

    angleInRadians = 360 - (angle * Math.PI/180); //rotating counter clockwise

    setGeometry(gl,2);

    matrix = m4.identity();

    projectionMatrix = m4.projection(gl.canvas.width, gl.canvas.height);
    translationMatrix = m4.translation(translation[0] - currentposition, translation[1]);
    rotationMatrix = m4.xRotation(angleInRadians);
    scaleMatrix = m4.scaling(scale[0] + currentscale, scale[1]  + currentscale);
    moveOriginMatrix = m4.translation(-65, -90);

    // Multiply the matrices.
    matrix = m4.multiply(projectionMatrix, translationMatrix);
    matrix = m4.multiply(matrix, rotationMatrix);
    matrix = m4.multiply(matrix, scaleMatrix);
    matrix = m4.multiply(matrix, moveOriginMatrix);

    //set color
    gl.uniform4f(colorUniformLocation, 0, 0, 1, 1);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    //gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( primitiveType, offset, count );
}

function drawU(){
    count = 228; //number of vertices
    translation = [middlewidth-130,gl.canvas.height/2-90];

    angleInRadians = 360 - (angle * Math.PI/180); //rotating counter clockwise

    setGeometry(gl,1);

    matrix = m4.identity();

    projectionMatrix = m4.projection(gl.canvas.width, gl.canvas.height);
    translationMatrix = m4.translation(translation[0] - currentposition, translation[1]);
    rotationMatrix = m4.xRotation(angleInRadians);
    scaleMatrix = m4.scaling(scale[0] + currentscale, scale[1]  + currentscale);
    moveOriginMatrix = m4.translation(-65, -90);

    // Multiply the matrices.
    matrix = m4.multiply(projectionMatrix, translationMatrix);
    matrix = m4.multiply(matrix, rotationMatrix);
    matrix = m4.multiply(matrix, scaleMatrix);
    matrix = m4.multiply(matrix, moveOriginMatrix);

    //set color
    gl.uniform4f(colorUniformLocation, 0, 0, 1, 1);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    //gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( primitiveType, offset, count );
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl, shape) {
    if (shape == 1) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                // left column front
                // left column front
                0+70,   0,  0,
                0+70, 150,  0,
                30+70,   0,  0,
                0+70, 150,  0,
                30+70, 150,  0,
                30+70,   0,  0,

                // top rung front
                30+70,   0,  0,
                30+70,  30,  0,
                70+70,   0,  0,
                30+70,  30,  0,
                70+70,  30,  0,
                70+70,   0,  0,

                // bottom rung front
                30+70, 120,  0,
                30+70, 150,  0,
                70+70, 120,  0,
                30+70, 150,  0,
                70+70, 150,  0,
                70+70, 120,  0,

                // lengkungan 1 atas front
                70+70,  0, 0,
                70+70, 30, 0,
                105+70, 15, 0,
                70+70, 30, 0,
                82+70, 37, 0,
                105+70, 15, 0,

                // lengkungan 2 atas front
                105+70, 15, 0,
                82+70, 37, 0,
                120+70, 45, 0,
                82+70, 37, 0,
                90+70, 45, 0,
                120+70, 45, 0,

                // right column front
                120+70, 45, 0,
                90+70, 45, 0,
                120+70, 105, 0,
                90+70, 45, 0,
                90+70, 105, 0,
                120+70, 105, 0,

                // lengkungan 1 bawah front
                105+70, 135, 0,
                82+70, 113, 0,
                70+70, 120, 0,
                105+70, 135, 0,
                70+70, 120, 0,
                70+70, 150, 0,

                // lengkungan 2 bawah front
                120+70, 105, 0,
                90+70, 105, 0,
                82+70, 113, 0,
                120+70, 105, 0,
                82+70, 113, 0,
                105+70, 135, 0,

                // left column back
                0+70,   0,  30,
                30+70,   0,  30,
                0+70, 150,  30,
                0+70, 150,  30,
                30+70,   0,  30,
                30+70, 150,  30,

                // top rung back
                30+70,   0,  30,
                70+70,   0,  30,
                30+70,  30,  30,
                30+70,  30,  30,
                70+70,   0,  30,
                70+70,  30,  30,

                // bottom rung back
                30+70, 120,  30,
                70+70, 120,  30,
                30+70, 150,  30,
                30+70, 150,  30,
                70+70, 120,  30,
                70+70, 150,  30,

                // lengkungan 1 atas back
                70+70,  0, 30,
                105+70, 15, 30,
                70+70, 30, 30,
                70+70, 30, 30,
                105+70, 15, 30,
                82+70, 37, 30,

                // lengkungan 2 atas back
                105+70, 15, 30,
                120+70, 45, 30,
                82+70, 37, 30,
                82+70, 37, 30,
                120+70, 45, 30,
                90+70, 45, 30,

                // right column back
                120+70,  45, 30,
                120+70, 105, 30,
                90+70,  45, 30,
                90+70,  45, 30,
                120+70, 105, 30,
                90+70, 105, 30,

                // lengkungan 1 bawah back
                105+70, 135, 30,
                70+70, 120, 30,
                82+70, 113, 30,
                105+70, 135, 30,
                70+70, 150, 30,
                70+70, 120, 30,

                // lengkungan 2 bawah back
                120+70, 105, 30,
                82+70, 113, 30,
                90+70, 105, 30,
                120+70, 105, 30,
                105+70, 135, 30,
                82+70, 113, 30,

                // top cover
                0+70, 0,  0,
                70+70, 0,  0,
                70+70, 0, 30,
                0+70, 0,  0,
                70+70, 0, 30,
                0+70, 0, 30,

                // top below cover
                30+70, 30,  0,
                30+70, 30, 30,
                70+70, 30, 30,
                30+70, 30,  0,
                70+70, 30, 30,
                70+70, 30,  0,

                // left column outer cover
                0+70,   0,  0,
                0+70,   0, 30,
                0+70, 150,  0,
                0+70,   0, 30,
                0+70, 150, 30,
                0+70, 150,  0,

                // left column inner cover
                30+70,  30,  0,
                30+70, 120, 30,
                30+70,  30, 30,
                30+70,  30,  0,
                30+70, 120,  0,
                30+70, 120, 30,

                // bottom cover
                0+70, 150,  0,
                0+70, 150, 30,
                70+70, 150,  0,
                0+70, 150, 30,
                70+70, 150, 30,
                70+70, 150,  0,

                // bottom above cover
                30+70, 120,  0,
                70+70, 120,  0,
                70+70, 120, 30,
                30+70, 120,  0,
                70+70, 120, 30,
                30+70, 120, 30,

                // right column outer cover
                120+70, 105,  0,
                120+70, 105, 30,
                120+70,  45, 30,
                120+70, 105,  0,
                120+70,  45, 30,
                120+70,  45,  0,

                // right column inner cover
                90+70,  45,  0,
                90+70,  45, 30,
                90+70, 105, 30,
                90+70,  45,  0,
                90+70, 105, 30,
                90+70, 105,  0,

                // lengkungan 1 atas cover
                70+70,  0, 0,
                105+70, 15, 0,
                105+70, 15, 30,
                70+70,  0, 0,
                105+70, 15, 30,
                70+70,  0, 30,

                // lengkungan 1 atas inner cover
                70+70, 30, 0,
                70+70, 30, 30,
                82+70, 37, 30,
                70+70, 30, 0,
                82+70, 37, 30,
                82+70, 37, 0,

                // lengkungan 2 atas cover
                105+70, 15, 0,
                120+70, 45, 0,
                120+70, 45, 30,
                105+70, 15, 0,
                120+70, 45, 30,
                105+70, 15, 30,

                // lengkungan 2 atas inner cover
                82+70, 37, 0,
                82+70, 37, 30,
                90+70, 45, 30,
                82+70, 37, 0,
                90+70, 45, 30,
                90+70, 45, 0,

                // lengkungan 1 bawah cover
                70+70, 150, 0,
                70+70, 150, 30,
                105+70, 135, 30,
                70+70, 150, 0,
                105+70, 135, 30,
                105+70, 135, 0,

                // lengkungan 1 bawah inner cover
                70+70, 120, 0,
                82+70, 113, 0,
                82+70, 113, 30,
                70+70, 120, 0,
                82+70, 113, 30,
                70+70, 120, 30,

                // lengkungan 2 bawah cover
                105+70, 135, 0,
                105+70, 135, 30,
                120+70, 105, 30,
                105+70, 135, 0,
                120+70, 105, 30,
                120+70, 105, 0,

                // lengkungan 2 bawah inner cover
                82+70, 113, 0,
                90+70, 105, 0,
                90+70, 105, 30,
                82+70, 113, 0,
                90+70, 105, 30,
                82+70, 113, 30,]),
            gl.STATIC_DRAW);
    } else if (shape == 2) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                // left column front
                0,   0,  0,
                0, 150,  0,
                30,  0,  0,
                0, 150,  0,
                30,150,  0,
                30,  0,  0,

                // back
                0,   0,  30,
                30,   0,  30,
                0, 150,  30,
                0, 150,  30,
                30,   0,  30,
                30, 150,  30,

                // left
                0,   0,  0,
                0,   0, 30,
                0, 150,  0,
                0,   0, 30,
                0, 150, 30,
                0, 150,  0,

                // right
                30,   0,  0,
                30, 150, 30,
                30,   0, 30,
                30,   0,  0,
                30, 150,  0,
                30, 150, 30,

                // top
                0, 0,  0,
                30, 0,  0,
                30, 0, 30,
                0, 0,  0,
                30, 0, 30,
                0, 0, 30,

                // bottom
                0, 150,  0,
                0, 150, 30,
                30, 150,  0,
                0, 150, 30,
                30, 150, 30,
                30, 150,  0,]),
            gl.STATIC_DRAW);
    }
}