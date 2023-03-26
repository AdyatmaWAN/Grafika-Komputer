"use strict";

var canvas;
var gl;

var primitiveType;
var offset = 0;
var count = 12;
	
var colorUniformLocation;
var translation = [200, 200]; //top-left of rectangle
var angle = 0;
var angleInRadians = 0;
var scale = [1.0,1.0]; //default scale
var matrix;
var matrixLocation;
var translationMatrix;
var rotationMatrix;
var scaleMatrix;
var moveOriginMatrix; //move origin to 'center' of the letter as center of rotation
var projectionMatrix;

var movement = 1;
var currentposition = 0;
var scalefactor = 0.005;
var currentscale = 0.005;
var middlewidth = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var letterbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, letterbuffer );

	
    // Associate out shader variables with our data buffer
	
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	colorUniformLocation = gl.getUniformLocation(program, "u_color");
	
	matrixLocation = gl.getUniformLocation(program, "u_matrix");
    middlewidth = Math.floor(gl.canvas.width/2);

	primitiveType = gl.TRIANGLES;
	render(); //default render
}

function render() 
{
	currentposition += movement;
	currentscale += scalefactor;
	
	if (currentposition > middlewidth) {
		currentposition = middlewidth;
		movement = -movement;
		
	}; 
	if (currentposition < 0) {
		currentposition = 0; 
		movement = -movement;
	}; 

	if (currentscale > 2){
		currentscale = 2.0;
		scalefactor = -scalefactor;
	};
	
	if (currentscale < 0.005){
		currentscale = 0.005;
		scalefactor = -scalefactor;
	};
	
	angle += 1.0;
	
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	drawletterG();
	drawletterL();
	
	requestAnimationFrame(render); //refresh
	
}

function drawletterG() {
	count = 30; //number of vertices 
	translation = [middlewidth-130,gl.canvas.height/2-90];
	
	angleInRadians = 360 - (angle * Math.PI/180); //rotating counter clockwise

	setGeometry(gl,1);
	
	matrix = m3.identity();
	
	projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height);
	translationMatrix = m3.translation(translation[0] - currentposition, translation[1]);
    rotationMatrix = m3.rotation(angleInRadians);
    scaleMatrix = m3.scaling(scale[0] + currentscale, scale[1]  + currentscale);
	moveOriginMatrix = m3.translation(-65, -90);
	
    // Multiply the matrices.
    matrix = m3.multiply(projectionMatrix, translationMatrix);
    matrix = m3.multiply(matrix, rotationMatrix);
	matrix = m3.multiply(matrix, scaleMatrix);
	matrix = m3.multiply(matrix, moveOriginMatrix);

	//set color
	gl.uniform4f(colorUniformLocation, 0, 1, 0, 1);
	
    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

	//gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( primitiveType, offset, count );
	
	
}

function drawletterL() {
	count = 12; //number of vertices 
	
	setGeometry(gl,2); 
	
	translation=[middlewidth+100,gl.canvas.height/2-90];
	
	angleInRadians = (angle * Math.PI/180); //rotating counter clockwise
    matrix = m3.identity();
	projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height);
	translationMatrix = m3.translation(translation[0] + currentposition, translation[1]);
    rotationMatrix = m3.rotation(angleInRadians);
    scaleMatrix = m3.scaling(scale[0]  + currentscale, scale[1]  + currentscale);
	moveOriginMatrix = m3.translation(-50, -90);
	
    // Multiply the matrices.
    matrix = m3.multiply(projectionMatrix, translationMatrix);
    matrix = m3.multiply(matrix, rotationMatrix);
	matrix = m3.multiply(matrix, scaleMatrix);
	matrix = m3.multiply(matrix, moveOriginMatrix);

	//set color
	gl.uniform4f(colorUniformLocation, 1.0, 0, 0, 1);
	
    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

	//gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( primitiveType, offset, count );
	
	
}

var m3 = { 						//setup 3x3 transformation matrix object
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


function setGeometry(gl, shape) {
  switch (shape) {
	  case 1:                     // Fill the buffer with the values that define a letter 'G'.
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
		 
				  // top 
				  30, 0,
				  130, 0,
				  30, 30,
				  30, 30,
				  130, 0,
				  130, 30,
		 
				  // middle 
				  60, 90,
				  60, 120,
				  100, 120,
				  100, 120,
				  100, 90,
				  60, 90,
				  
				  //bottom
				  0,150,
				  0,180,
				  100, 180,
				  100, 180,
				  100, 150,
				  0,150,
				 
				 //right column
				  100, 90,
				  100, 180,
				  130, 180,
				  130, 180,
				  130, 90,
				  100, 90
				 
			  ]),
			  gl.STATIC_DRAW);
	  
	  break;
	  case 2: 				// Fill the buffer with the values that define a letter 'L'.
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
			  
			  //bottom
			  0,150,
			  0,180,
			  100, 180,
			  100, 180,
			  100, 150,
			  0,150,			 
			 
		  ]),
		  gl.STATIC_DRAW);
	  
	  break;
	  
  }
}