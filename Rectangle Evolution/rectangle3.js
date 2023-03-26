"use strict";

var canvas;
var gl;
var colorUniformLocation;
var translation = [0, 0]; //top-left of rectangle
var rectwidth = 100;      // rectangle width
var rectheight = 30;	  // rectangle height
var translationLocation;  

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

	setRectangle(gl, translation[0], translation[1], rectwidth, rectheight);	
	
    // Associate out shader variables with our data buffer
	
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	// set the translation
	var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
	translationLocation = gl.getUniformLocation(program, "u_translation");
	
	// set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	colorUniformLocation = gl.getUniformLocation(program, "u_color");
	
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

	render(); //default render
}

function render() 
{
	gl.uniform4f(colorUniformLocation, 1.0, 0, 0, 1);
	gl.uniform2fv(translationLocation, translation);
		
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 6;
		

	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( primitiveType, offset, count );
	
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}
 
