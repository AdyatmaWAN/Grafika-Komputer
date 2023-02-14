"use strict";

var gl;

var theta = 0.0;
var thetaLoc;

var speed = 100;
var direction = true;

var colorLoc;
var c1, c2, c3;

init();

function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program );

    var vertices = [
        vec2(-0.25, 0.5),
        vec2(0.25, 0.5),
        vec2(0.25, 0.25),
        vec2(0.5, 0.25),
        vec2(0.5, -0.25),
        vec2(0.25, -0.25),
        vec2(0.25, -0.5),
        vec2(-0.25, -0.5),
        vec2(-0.25, -0.25),
        vec2(-0.5, -0.25),
        vec2(-0.5, 0.25),
        vec2(-0.25, 0.25)
    ];


    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    colorLoc = gl.getUniformLocation(program, "u_color");

    // Initialize event handlers

    document.getElementById("slider").onchange = function(event) {
        speed = 100 - event.target.value;
    };
    document.getElementById("Direction").onclick = function (event) {
        direction = !direction;
    };

    document.getElementById("Controls").onclick = function( event) {
        switch(event.target.index) {
          case 0:
            direction = !direction;
            break;

         case 1:
            speed /= 2.0;
            break;

         case 2:
            speed *= 2.0;
            break;
       }
    };

    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case '1':
            direction = !direction;
            break;

          case '2':
            speed /= 2.0;
            break;

          case '3':
            speed *= 2.0;
            break;
        }
    };


    render();
};

function render()
{
    function generateRandomNumber() {
        var min = 0.0,
            max = 1.0,
            highlightedNumber = Math.random() * (max - min) + min;

        return (highlightedNumber);
    };

    console.log(parseFloat(theta.toFixed(2)));

    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += (direction ? 0.1 : -0.1);
    gl.uniform1f(thetaLoc, theta);

    if (parseFloat(theta.toFixed(2)) >= Math.PI * 2 || parseFloat(theta.toFixed(2)) <= Math.PI * -2) {
        c1 = generateRandomNumber(); c2 = generateRandomNumber(); c3 = generateRandomNumber();
        c1 = parseFloat(c1.toFixed(2));
        c2 = parseFloat(c2.toFixed(2));
        c3 = parseFloat(c3.toFixed(2));
        theta = 0.0
    }
    gl.uniform4f(colorLoc, c1, c2, c3, 1.0);

    gl.drawArrays(gl.TRIANGLES, 0, 12);

    setTimeout(
        function () {requestAnimationFrame(render);},
        speed
    );
}
