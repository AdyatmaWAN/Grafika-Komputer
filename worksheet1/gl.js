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

var xCal = 1;

var yCal = 1;

var poly = [];

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

var theta = 0.0;
var thetaLoc;

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

    thetaLoc = gl.getUniformLocation(program, "uTheta");

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
        shapes = [];

    }

    document.getElementById("animate").onclick = function () {
        if (animate){
            animate = false;
        } else {
            animate = true;
        }
        mode = 99;
        tmp = [];
        first = true;
    }

    document.getElementById("stop").onclick = function () {
        if (mode == 1) {
            //stuff
            if (tmp.length > 2) {
                gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
                for (var i = 0; i < tmp.length; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < tmp.length; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                index += tmp.length;
                poly.push(tmp.length);
                tmp = [];
                shapes.push(1);

                render();
            }
        }
    }

    canvas.addEventListener("mousedown", function (event) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

        const rect = canvas.getBoundingClientRect();
        x = (event.clientX - rect.left) ;
        y = (event.clientY - rect.top) ;
        console.log("x: " + x + " y: " + y)

        var point = vec2(2 * x / canvas.width - 1,
            2 * (canvas.height - y) / canvas.height - 1);

        if (first) {
            if (mode != 99) {
                first = false;
                tmp[0] = point;
            }

        } else {
            //if else sesuai mode
            if (mode == 1) {
                tmp.push(point);

            } else if (mode == 2) {
                first = true;
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
                first = true;
                tmp[2] = point;
                tmp[1] = vec2(tmp[0][0], tmp[2][1]);
                tmp[3] = vec2(tmp[2][0], tmp[0][1]);
                for (var i = 0; i < 4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                index += 4;
                tmp = [];
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < 4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 4 + i), flatten(tt));
                shapes.push(4);
            } else if (mode == 0) {

            }
        }
    });
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    var count = 0;
    var polyCount = 0;

    if (animate) {
        theta += 0.1;
        gl.uniform1f(thetaLoc, theta);

        // var s = Math.sin(theta);
        // var c = Math.cos(theta);
        //
        // xCal = -s*yCal + c*xCal;
        // yCal =  s*xCal + c*yCal;
    }

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
        } else if (shapes[i] == 1) {
            gl.drawArrays(gl.TRIANGLE_FAN, count, poly[polyCount]);
            count+= poly[polyCount];
            polyCount++;
        }
    }
    requestAnimationFrame(render);
}


