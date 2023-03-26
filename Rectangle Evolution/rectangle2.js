"use strict";

var canvas;
var gl;



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

    var vertices = [
        vec2( 10,  20 ),
        vec2( 80,  20 ),
        vec2( 10,  30 ),
        vec2( 10,  30 ),
        vec2( 80,  20 ),
        vec2( 80,  30 ),
        
    ];


    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

	// set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	
    render();
};

function render() {

	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 6;
    
	//render
	gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( primitiveType, offset, count );


}

 