"use strict";

var canvas;
var gl;

var primitiveType;
var offset = 0;
var count = 96;
	

var angleCam = 0;
var angleFOV = 60;
var fRotationRadians = 0;

var matrix;

var translationMatrix;
var rotationMatrix;
var scaleMatrix;
var projectionMatrix;
var cameraMatrix;
var viewMatrix;
var viewProjectionMatrix;

var worldViewProjectionMatrix;
var worldInverseTransposeMatrix;
var worldInverseMatrix;
var worldMatrix;

var FOV_Radians; //field of view
var aspect; //projection aspect ratio
var zNear; //near view volume
var zFar;  //far view volume

var cameraPosition = [100, 150, 200]; //eye/camera coordinates
var UpVector = [0, 1, 0]; //up vector
var fPosition = [0, 35, 0]; //at 


var worldViewProjectionLocation;
var worldInverseTransposeLocation;
var colorLocation;
var lightWorldPositionLocation;
var worldLocation;

window.onload = function init()
{

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	
	gl.enable(gl.CULL_FACE); //enable depth buffer
	gl.enable(gl.DEPTH_TEST);

	//initial default

	fRotationRadians = degToRad(0);
    FOV_Radians = degToRad(60);
    aspect = canvas.width / canvas.height;
    zNear = 1;
    zFar = 2000;
	
	projectionMatrix = m4.perspective(FOV_Radians, aspect, zNear, zFar); //setup perspective viewing volume
	
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
	
	worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
    worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
	colorLocation = gl.getUniformLocation(program, "u_color");
	lightWorldPositionLocation =  gl.getUniformLocation(program, "u_lightWorldPosition");
	worldLocation =  gl.getUniformLocation(program, "u_world");
	
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );

    var positionLocation = gl.getAttribLocation( program, "a_position" );
    gl.vertexAttribPointer( positionLocation, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLocation );


	setGeometry(gl);	
	
	
	var normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
	
    // Associate out shader variables with our data buffer
	
    var normalLocation = gl.getAttribLocation(program, "a_normal");
	gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray( normalLocation );

	setNormals(gl);
	
	//update FOV
	var angleCamValue = document.getElementById("Cameravalue");
	angleCamValue.innerHTML = angleCam;
	document.getElementById("sliderCam").onchange = function(event) {		
	    angleCamValue.innerHTML = event.target.value;
		fRotationRadians = degToRad(event.target.value);
		render();
    };
	
	primitiveType = gl.TRIANGLES;
	render(); //default render
}

function render() 
{
    // Compute the camera's matrix using look at.
    cameraMatrix = m4.lookAt(cameraPosition, fPosition, UpVector);

    // Make a view matrix from the camera matrix
    viewMatrix = m4.inverse(cameraMatrix);
	
	// Compute a view projection matrix
	viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    worldMatrix = m4.yRotation(fRotationRadians);

    // Multiply the matrices.
    worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
    worldInverseMatrix = m4.inverse(worldMatrix);
    worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);

    // Set the matrices
    gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix);
    gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
	gl.uniformMatrix4fv(worldLocation, false, worldMatrix);
	
    // Set the color to use
    gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // green

    // set the light direction.
    gl.uniform3fv(lightWorldPositionLocation, [20, 30, 60]);
	
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.drawArrays( primitiveType, offset, count );

}

function radToDeg(r) {
    return r * 180 / Math.PI;
  }

function degToRad(d) {
    return d * Math.PI / 180;
  }


// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
   var positions =
      new Float32Array([
          // left column front
          0,   0,  0,
          0, 150,  0,
          30,   0,  0,
          0, 150,  0,
          30, 150,  0,
          30,   0,  0,

          // top rung front
          30,   0,  0,
          30,  30,  0,
          100,   0,  0,
          30,  30,  0,
          100,  30,  0,
          100,   0,  0,

          // middle rung front
          30,  60,  0,
          30,  90,  0,
          67,  60,  0,
          30,  90,  0,
          67,  90,  0,
          67,  60,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   60,  30,
          30,   30,  30,
          30,   30,   0,
          30,   60,   0,
          30,   60,  30,

          // top of middle rung
          30,   60,   0,
          67,   60,  30,
          30,   60,  30,
          30,   60,   0,
          67,   60,   0,
          67,   60,  30,

          // right of middle rung
          67,   60,   0,
          67,   90,  30,
          67,   60,  30,
          67,   60,   0,
          67,   90,   0,
          67,   90,  30,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,  150,  30,
          30,   90,  30,
          30,   90,   0,
          30,  150,   0,
          30,  150,  30,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0]);

  // Center the F around the origin and Flip it around. We do this because
  // we're in 3D now with and +Y is up where as before when we started with 2D
  // we had +Y as down.

  // We could do by changing all the values above 
  // We could also do it with a matrix at draw time but you should
  // never do stuff at draw time if you can do it at init time.
  var matrix = m4.xRotation(Math.PI),
  matrix = m4.translate(matrix, -50, -75, -15);

  for (var ii = 0; ii < positions.length; ii += 3) {
    var vector = m4.transformPoint(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
    positions[ii + 0] = vector[0];
    positions[ii + 1] = vector[1];
    positions[ii + 2] = vector[2];
  }
   gl.bufferData(gl.ARRAY_BUFFER,  positions,   gl.STATIC_DRAW);
}

function setNormals(gl) {
  var normals = new Float32Array([
          // left column front
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          // top rung front
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          // middle rung front
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          // left column back
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,

          // top rung back
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,

          // middle rung back
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,

          // top
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

          // top rung right
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // under top rung
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,

          // between top rung and middle
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // top of middle rung
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

          // right of middle rung
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // bottom of middle rung.
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,

          // right of bottom
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // bottom
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,

          // left side
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0]);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}
