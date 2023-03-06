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

var shapes = [];

var tmp = [];

var animate = false;

var mode = 2;

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

        const rect = canvas.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        console.log("x: " + x + " y: " + y)

        var point = vec2(2 * x / canvas.width - 1,
            2 * (canvas.height - y) / canvas.height - 1);

        if (first) {
            first = false;
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
            tmp[0] = point;

        } else {
            //if else sesuai mode
            if (mode == 1) {
                tmp.push(point);
            } else if (mode == 2) {
                tmp.push(point);
                for (var i = 0; i < 2; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < 2; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                index += 2;
                tmp = [];
                shapes.push(2);

            } else if (mode == 3) {
                if (tmp.length == 2) {
                    tmp.push(point);
                    for (var i = 0; i < 3; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                    var tt = colors;
                    for (var i = 0; i < 3; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                    index += 3;
                    tmp = [];
                    shapes.push(3);
                } else {
                    tmp.push(point);
                }

            } else if (mode == 4) {
                if (tmp.length == 3) {
                    tmp.push(point);
                    for (var i = 0; i < 4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                    var tt = colors;
                    for (var i = 0; i < 4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                    index += 4;
                    tmp = [];
                    shapes.push(4)
                } else {
                    tmp.push(point);
                }

            } else if (mode == 0) {

            }
        }


        // square
        // if (first) {
        //     first = false;
        //     gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
        //     t[0] = vec2(2 * x / canvas.width - 1,
        //         2 * (canvas.height - y) / canvas.height - 1);
        // } else {
        //     first = true;
        //     t[2] = vec2(2 * x / canvas.width - 1,
        //         2 * (canvas.height - y) / canvas.height - 1);
        //     t[1] = vec2(t[0][0], t[2][1]);
        //     t[3] = vec2(t[2][0], t[0][1]);
        //     for (var i = 0; i < 4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(t[i]));
        //     index += 4;
        //
        //     gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        //     var tt = colors;
        //     for (var i = 0; i < 4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 4 + i), flatten(tt));
        // }
    });
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    var count = 0;
    for (var i = 0; i < shapes.length; i += 1) {
        if (shapes[i] == 3) {
            gl.drawArrays(gl.TRIANGLES, count, 3);
            count+= 3;
        } else if (shapes[i] == 4) {
            gl.drawArrays(gl.TRIANGLE_FAN, count, 4);
            count+= 4;
        } else if (shapes[i] == 2) {
            gl.drawArrays(gl.LINES, count, 2);
            count+= 2;
        }
    }
    requestAnimationFrame(render);
}

document.getElementById("line").onclick = function () {
    mode = 2;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("triangle").onclick = function () {
    mode = 3;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("square").onclick = function () {
    mode = 4;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("polygon").onclick = function () {
    mode = 1;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("other").onclick = function () {
    mode = 4;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("clear").onclick = function () {
    index = 0;
    first = true;
    gl.clear(gl.COLOR_BUFFER_BIT);
    animate = false;
    tmp = [];
}

document.getElementById("animate").onclick = function () {
    animate = true;
    mode = 99;
    tmp = [];
    first = true;
}

document.getElementById("stop").onclick = function () {
    console.log("stop");
    if (mode == 1) {
        //stuff
    }
}


