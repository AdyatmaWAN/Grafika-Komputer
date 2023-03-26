"use strict";

var canvas;
var gl;

var primitiveType;
var offset = 0;
var count = 18;
	
var colorUniformLocation;
var translation = [100, 150]; //top-left of rectangle
var angle = 0;
var angleInRadians = 0;
var scale = [1.0,1.0]; //default scale
var matrix;
var matrixLocation;
var translationMatrix;
var rotationMatrix;
var scaleMatrix;
var moveOriginMatrix; //move origin to 'center' of F as center of rotation
var projectionMatrix;

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

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

	setGeometry(gl);	
	
    // Associate out shader variables with our data buffer
	
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	// set the resolution
	var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
	
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	colorUniformLocation = gl.getUniformLocation(program, "u_color");
	
	matrixLocation = gl.getUniformLocation(program, "u_matrix");

	//Update  X according to X slider
	var Xvalue = document.getElementById("Xvalue");
	Xvalue.innerHTML = translation[0];
	document.getElementById("sliderX").onchange = function(event) {
        translation[0] = event.target.value;
		Xvalue.innerHTML = translation[0];
		render();
    };
	
   //Update Y according to Y slider
    var Yvalue = document.getElementById("Yvalue");
    Yvalue.innerHTML = translation[1];
    document.getElementById("sliderY").onchange = function(event) {
        translation[1] = event.target.value;
		Yvalue.innerHTML = translation[1];
		render();
    };
	
	
	//Update rotation angle according to angle slider
	var angleValue = document.getElementById("Avalue");
	angleValue.innerHTML = angle;
	document.getElementById("sliderA").onchange = function(event) {
        var angleInDegrees =  360 - event.target.value;
		angleInRadians = angleInDegrees * Math.PI/180; //convert degree to radian
		angleValue.innerHTML = 360 - angleInDegrees;
		render();
    };


	//Update scaleX according to scaleX slider
	var scaleX = document.getElementById("scaleX");
	scaleX.innerHTML = scale[0];
	document.getElementById("sliderscaleX").onchange = function(event) {
        scale[0] = event.target.value;
		scaleX.innerHTML = scale[0];
		render();
    };
	
	
   //Update scaleY according to scaleY slider
	var scaleY = document.getElementById("scaleY");
	scaleY.innerHTML = scale[1];
	document.getElementById("sliderscaleY").onchange = function(event) {
        scale[1] = event.target.value;
		scaleY.innerHTML = scale[1];
		render();
    };
	
	primitiveType = gl.TRIANGLES;
	render(); //default render
}

function render() 
{
	// Compute the matrices
	projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height);
	translationMatrix = m3.translation(translation[0], translation[1]);
    rotationMatrix = m3.rotation(angleInRadians);
    scaleMatrix = m3.scaling(scale[0], scale[1]);
	moveOriginMatrix = m3.translation(-50, -75);
	
    // Multiply the matrices.
    matrix = m3.multiply(projectionMatrix, translationMatrix);
    matrix = m3.multiply(matrix, rotationMatrix);
	matrix = m3.multiply(matrix, scaleMatrix);
	matrix = m3.multiply(matrix, moveOriginMatrix);

	//set color
	gl.uniform4f(colorUniformLocation, 0, 1.0, 0, 1);
	
    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( primitiveType, offset, count );
	
}


var m3 = {
   identity: function() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
   },
   
   projection: function(width, height) {
    // Note: This matrix flips the Y axis so that 0 is at the top.
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ];
   },

  translation: function(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },

  rotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1,
    ];
  },

  scaling: function(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
};

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,
 
          // top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,
 
          // middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90,
      ]),
      gl.STATIC_DRAW);
}