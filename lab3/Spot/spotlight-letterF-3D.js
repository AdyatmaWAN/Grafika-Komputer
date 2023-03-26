"use strict";

var canvas;
var gl;

var primitiveType;
var offset = 0;
var count = 126;
	

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
var shininessLocation;
var viewWorldPositionLocation;
var lightColorLocation;
var specularColorLocation;
var lightDirectionLocation;
var innerLimitLocation;
var outerLimitLocation;


var lightRotationX = 0;
var lightRotationY = 0;
var lightDirection = [0, 0, 1];
var lightPosition;
var innerLimit = 10;
var outerLimit = 20;
var shininess = 150;

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
	
	innerLimit = degToRad(10);
	outerLimit = degToRad(20);
	
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
	shininessLocation = gl.getUniformLocation(program, "u_shininess");
	viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");
	worldLocation = gl.getUniformLocation(program, "u_world");
	lightColorLocation =  gl.getUniformLocation(program, "u_lightColor");
	specularColorLocation = gl.getUniformLocation(program, "u_specularColor");
    lightDirectionLocation = gl.getUniformLocation(program, "u_lightDirection");
    innerLimitLocation = gl.getUniformLocation(program, "u_innerLimit");
    outerLimitLocation = gl.getUniformLocation(program, "u_outerLimit");

	
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

	var rotateXValue = document.getElementById("XRotationvalue");
	rotateXValue.innerHTML = lightRotationX;
	document.getElementById("sliderXRotation").onchange = function(event) {		
	    rotateXValue.innerHTML = event.target.value;
		lightRotationX = event.target.value;
		render();
    };

	var rotateYValue = document.getElementById("YRotationvalue");
	rotateYValue.innerHTML = lightRotationY;
	document.getElementById("sliderYRotation").onchange = function(event) {		
	    rotateYValue.innerHTML = event.target.value;
		lightRotationY = event.target.value;
		render();
    };

	var innerValue = document.getElementById("Innervalue");
	innerValue.innerHTML = radToDeg(innerLimit);
	document.getElementById("sliderInner").onchange = function(event) {		
	    innerValue.innerHTML = event.target.value;
		innerLimit = radToDeg(event.target.value);
		render();
    };
	
	var outerValue = document.getElementById("Outervalue");
	outerValue.innerHTML = radToDeg(outerLimit);
	document.getElementById("sliderOuter").onchange = function(event) {		
	    outerValue.innerHTML = event.target.value;
		outerLimit = radToDeg(event.target.value);
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
    gl.uniform4fv(colorLocation, [0, 0, 1, 1]); // biru

    // set the light position.
	lightPosition = [40, 60, 120];
    gl.uniform3fv(lightWorldPositionLocation, lightPosition);
	
    // set the camera/view position
    gl.uniform3fv(viewWorldPositionLocation, cameraPosition);

    // set the shininess
    gl.uniform1f(shininessLocation, shininess);

    // set the spotlight uniforms

    // since we don't have a plane like most spotlight examples
    // let's point the spotlight at the F
    {
        var lmat = m4.lookAt(lightPosition, fPosition, UpVector);
        lmat = m4.multiply(m4.xRotation(lightRotationX), lmat);
        lmat = m4.multiply(m4.yRotation(lightRotationY), lmat);
        // get the zAxis from the matrix
        // negate it because lookAt looks down the -Z axis
        lightDirection = [-lmat[8], -lmat[9],-lmat[10]];
    }

    gl.uniform3fv(lightDirectionLocation, lightDirection);
    gl.uniform1f(innerLimitLocation, Math.cos(innerLimit));
    gl.uniform1f(outerLimitLocation, Math.cos(outerLimit));

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform4fv(colorLocation, [0, 0, 1, 1]); // red
    gl.drawArrays( primitiveType, offset, 90 );
    gl.uniform4fv(colorLocation, [1, 0, 0, 1]); // red
    gl.drawArrays( primitiveType, offset, 126 );

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
          0,   0,   0,
          0,  150,  0,
          30,  0,   0,
          0,  150,  0,
          30, 150,  0,
          30,  0,   0,

          //rung front
          30,   120,  0,
          30,   150,  0,
          100,  120,  0,
          30,   150,  0,
          100,  150,  0,
          100,  120,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // rung back
           30,   120,  30,
          100,   120,  30,
           30,  150,  30,
           30,  150,  30,
          100,   120,  30,
          100,  150,  30,

          // top
          0,    0,   0,
          30,   0,   0,
          30,   0,  30,
          0,    0,   0,
          30,   0,  30,
          0,    0,  30,

          // rung right
          100,  120,   0,
          100,  150,   0,
          100,  150,  30,
          100,  120,   0,
          100,  150,  30,
          100,  120,  30,

          // under top rung
          30,   120,   0,
          100,  120,  30,
          30,   120,  30,
          30,   120,   0,
          100,  120,   0,
          100,  120,  30,

          // between top and rung
          30,   0,   0,
          30,   120,  30,
          30,   0,  30,
          30,   0,   0,
          30,   120,   0,
          30,   120,  30,

          // bottom
          0,   150,   0,
          0,   150,  30,
          130,  150,  30,
          0,   150,   0,
          130,  150,  30,
          130,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0,

          //top right
          100,    0,   0,
          130,   0,   0,
          130,   0,  30,
          100,    0,   0,
          130,   0,  30,
          100,    0,  30,

          //right side
          130,  0,   0,
          130,  150,   0,
          130,  150,  30,
          130,  0,   0,
          130,  150,  30,
          130,  0,  30,

          // right column front
          100,   0,   0,
          100,  150,  0,
          130,  0,   0,
          100,  150,  0,
          130, 150,  0,
          130,  0,   0,

          // left column back
          100,   0,  30,
          130,   0,  30,
          100, 150,  30,
          100, 150,  30,
          130,   0,  30,
          130, 150,  30,

          // between top and rung
          100,   0,   0,
          100,   0,  30,
          100, 150,  30,
          100,   0,   0,
          100, 150,  30,
          100, 150,   0,

          //top right
          150,    0,   0,
          180,   0,   0,
          180,   0,  30,
          150,    0,   0,
          180,   0,  30,
          150,    0,  30,

          //right side
          180,  0,   0,
          180,  150,   0,
          180,  150,  30,
          180,  0,   0,
          180,  150,  30,
          180,  0,  30,

          // right column front
          150,   0,   0,
          150,  150,  0,
          180,  0,   0,
          150,  150,  0,
          180, 150,  0,
          180,  0,   0,

          // left column back
          150,   0,  30,
          180,   0,  30,
          150, 150,  30,
          150, 150,  30,
          180,   0,  30,
          180, 150,  30,

          // between top and rung
          150,   0,   0,
          150,   0,  30,
          150, 150,  30,
          150,   0,   0,
          150, 150,  30,
          150, 150,   0,

          //bottom
          150,  150,   0,
          180,  150,   0,
          180,  150,  30,
          150,  150,   0,
          180,  150,  30,
          150,  150,  30,
      ]);

  // Center the F around the origin and Flip it around. We do this because
  // we're in 3D now with and +Y is up where as before when we started with 2D
  // we had +Y as down.

  // We could do by changing all the values above 
  // We could also do it with a matrix at draw time but you should
  // never do stuff at draw time if you can do it at init time.
  var matrix = m4.xRotation(Math.PI),
  matrix = m4.translate(matrix, -100, -75, -15);

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

          // top
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

          // right
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // under
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

          // between top rung and middle
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
          -1, 0, 0,

          // top right
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

            // right side
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

      // right column front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

        // right column back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // between top and rung
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

      // top right
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // right side
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // right column front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // right column back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      // between top and rung
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

  ]);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}
