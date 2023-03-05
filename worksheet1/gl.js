"use strict";

Coloris({
    theme: 'large',
    themeMode: 'light',
    el: '.coloris',
    format:'hex',
    margin:10,
    onChange: (color) => {
        console.log(color.length);
        if (color.length > 8){
            r = parseInt(color.substring(1,3), 16)/255;
            g = parseInt(color.substring(3,5), 16)/255;
            b = parseInt(color.substring(5,7), 16)/255;
            a = parseInt(color.substring(7,9), 16)/255;
        } else {
            r = parseInt(color.substring(1,3), 16)/255;
            g = parseInt(color.substring(3,5), 16)/255;
            b = parseInt(color.substring(5,7), 16)/255;
            a = 1;
        }
        colors = vec4(r,g,b,a);
    }
});

var r,g,b,a;

var x,y;

var canvas;
var gl;

var maxNumTriangles = 200;
var maxNumPositions = 3 * maxNumTriangles;
var index = 0;
var first = true;

var t = [];

var colors = vec4(0.0, 0.0, 0.0, 1.0);

window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    init();
});


function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumPositions, gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumPositions, gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);


    canvas.addEventListener("mousedown", function (event) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        console.log(event.clientX, event.clientY);
        //kalibrasi posisi klik mouse untuk layar 1920:1080 pada window chrome fullscreen
        x = event.clientX-606;
        y = event.clientY-113;
        if (first) {
            first = false;
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
            t[0] = vec2(2 * x / canvas.width - 1,
                2 * (canvas.height - y) / canvas.height - 1);
        } else {
            first = true;
            t[2] = vec2(2 * x / canvas.width - 1,
                2 * (canvas.height - y) / canvas.height - 1);
            t[1] = vec2(t[0][0], t[2][1]);
            t[3] = vec2(t[2][0], t[0][1]);
            for (var i = 0; i < 4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(t[i]));
            index += 4;

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            var tt = colors;
            for (var i = 0; i < 4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 4 + i), flatten(tt));
        }
    });
    render();
}

document.getElementById("clear").onclick = function () {
    index = 0;
    first = true;
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (var i = 0; i < index; i += 4)
        gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
    requestAnimationFrame(render);
}
