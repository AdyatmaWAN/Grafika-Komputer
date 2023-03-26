"use strict";

var canvas;
var gl;
var colorUniformLocation;


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

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

	// set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	colorUniformLocation = gl.getUniformLocation(program, "u_color");
	
	render();
};

function render() {

	gl.clear( gl.COLOR_BUFFER_BIT );
	  // draw 50 random rectangles in random colors
    for (var ii = 0; ii < 50; ++ii) {
    // Setup a random rectangle
    // This will write to positionBuffer because
    // its the last thing we bound on the ARRAY_BUFFER
    // bind point
		setRectangle(
			gl, randomInt(500), randomInt(500), randomInt(300), randomInt(300));

		// Set a random color.
		gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

		
		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 6;
		
		//render
		//gl.clear( gl.COLOR_BUFFER_BIT );
		gl.drawArrays( primitiveType, offset, count );
	};
}
// Returns a random integer from 0 to range - 1.
function randomInt(range) {
	return Math.floor(Math.random() * range);
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
 
