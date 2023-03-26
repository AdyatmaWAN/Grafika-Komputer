"use strict";

var canvas;
var gl;

var numPositions  = 102;

var positions = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];

var thetaLoc;

var c1, c2, c3 = 0;

var count = 0;

var saved = 1;

init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };

    document.getElementById("ToggleButton").onclick = function () {
        if (axis == -1){
            axis = saved;
        } else {
            saved = axis;
            axis = -1;
        }
    }

    render();
}

function colorCube()
{
    quad(4, 5, 6, 7);
    quad(1, 0, 3, 2);
    triangle(2, 14, 3);
    triangle(6, 15, 7);
    triangle(0, 12, 1);
    triangle(4, 13, 5);
    triangle(1, 12, 0);
    triangle(5, 13, 4);
    triangle(1, 2, 8);
    triangle(9, 6, 5);
    triangle(3, 10, 0);
    triangle(7, 11, 4);

    quad(2, 14, 15,6 );
    quad(3, 14, 15, 7);
    quad(1, 12, 13, 5);
    quad(0, 12, 13, 4);
    quad(6, 9, 8, 2);
    quad(5, 9, 8, 1);
    quad(3, 10, 11, 7);
    quad(0, 10, 11, 4);

}

function quad(a, b, c, d)
{
    var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0), //0
        vec4(-0.5,  0.5,  0.5, 1.0), //1
        vec4(0.5,  0.5,  0.5, 1.0), //2
        vec4(0.5, -0.5,  0.5, 1.0), //3
        vec4(-0.5, -0.5, -0.5, 1.0), //4
        vec4(-0.5,  0.5, -0.5, 1.0), //5
        vec4(0.5,  0.5, -0.5, 1.0), //6
        vec4(0.5, -0.5, -0.5, 1.0), //7

        vec4(0, 0.75, 0.5, 1.0), //8
        vec4(0, 0.75, -0.5, 1.0), //9

        vec4(0, -0.75, 0.5, 1.0), //10
        vec4(0, -0.75, -0.5, 1.0), //11

        vec4(-0.75, 0, 0.5, 1.0), //12
        vec4(-0.75, 0, -0.5, 1.0), //13

        vec4(0.75, 0, 0.5, 1.0), //12
        vec4(0.75, 0, -0.5, 1.0), //13

        vec4(-0.75, 0, 0.5, 1.0), //14
        vec4-(0.75, 0, -0.5, 1.0), //15
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex
    var indices = [a, b, c, a, c, d];

    if (count == 0 || count >= 12) {
        c1 = generateRandomNumber();
        c2 = generateRandomNumber();
        c3 = generateRandomNumber();
        c1 = parseFloat(c1.toFixed(2));
        c2 = parseFloat(c2.toFixed(2));
        c3 = parseFloat(c3.toFixed(2));
    }

    for ( var i = 0; i < indices.length; ++i ) {
        positions.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vec4(c1, c2, c3, 1.0));
    }
    count++;
}

function triangle(a, b, c)
{
    var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0), //0
        vec4(-0.5,  0.5,  0.5, 1.0), //1
        vec4(0.5,  0.5,  0.5, 1.0), //2
        vec4(0.5, -0.5,  0.5, 1.0), //3
        vec4(-0.5, -0.5, -0.5, 1.0), //4
        vec4(-0.5,  0.5, -0.5, 1.0), //5
        vec4(0.5,  0.5, -0.5, 1.0), //6
        vec4(0.5, -0.5, -0.5, 1.0), //7

        vec4(0, 0.75, 0.5, 1.0), //8
        vec4(0, 0.75, -0.5, 1.0), //9

        vec4(0, -0.75, 0.5, 1.0), //10
        vec4(0, -0.75, -0.5, 1.0), //11

        vec4(-0.75, 0, 0.5, 1.0), //12
        vec4(-0.75, 0, -0.5, 1.0), //13

        vec4(0.75, 0, 0.5, 1.0), //12
        vec4(0.75, 0, -0.5, 1.0), //13

        vec4(-0.75, 0, 0.5, 1.0), //14
        vec4-(0.75, 0, -0.5, 1.0), //15
    ];

    var indices = [a, b, c];
    if (count == 0 || count >= 12) {
        c1 = generateRandomNumber();
        c2 = generateRandomNumber();
        c3 = generateRandomNumber();
        c1 = parseFloat(c1.toFixed(2));
        c2 = parseFloat(c2.toFixed(2));
        c3 = parseFloat(c3.toFixed(2));
    }

    for ( var i = 0; i < indices.length; ++i ) {
        positions.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vec4(c1, c2, c3, 1.0));
    }
    count++;
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);
}

function generateRandomNumber() {
    var min = 0.0,
        max = 1.0,
        highlightedNumber = Math.random() * (max - min) + min;

    return (highlightedNumber);
};
