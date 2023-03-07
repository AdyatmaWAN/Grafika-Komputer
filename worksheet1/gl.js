"use strict";

window.addEventListener("load", (event) => { //when the page is loaded, initiate webgl
    init();
});


function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumPositions, gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition"); //Attribute for positioning
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumPositions, gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor"); //Attribute for coloring
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    canvas.addEventListener("mousedown", function (event) { //when the mouse is clicked, save the position of the click and draw
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

        //calibrate the click event position to the canvas
        const rect = canvas.getBoundingClientRect();
        x = (event.clientX - rect.left);
        y = (event.clientY - rect.top);

        xCal = 2 * x / canvas.width - 1;
        yCal = 2 * (canvas.height - y) / canvas.height - 1;

        clickX = xCal * Math.cos(theta) + yCal * Math.sin(theta);
        clickY = -xCal * Math.sin(theta) + yCal * Math.cos(theta);

        var point = vec2(clickX, clickY); //save the position of the click after calibration

        if (first) { //detect if it is the first click
            if (mode == 5) { //if mode is 5, draw a based of 4 random point
                tmp = createFourRandomPoints(point);
                for (var i = 0; i < 4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                index += 4;
                tmp = [];
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < 4; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index - 4 + i), flatten(tt));
                shapes.push(4);
            } else if (mode == 6) { //if mode is 6, draw a plus shape
                tmp = createPlusShape(point);
                for (var i = 0; i < 14; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                tmp = [];
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < 14; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                index += 14;
                shapes.push(6);
            } else if (mode == 7) { //if mode is 7, draw a four pointed star
                tmp = createFourPointedStar(point);
                for (var i = 0; i < 10; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                tmp = [];
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < 10; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                index += 10;
                shapes.push(7);
            } else if (mode == 8) { //if mode is 8, draw a hexagon
                tmp = createHexagon(point);
                for (var i = 0; i < 10; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                tmp = [];
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < 10; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                index += 10;
                shapes.push(8);
            } else if (mode == 9) { //if mode is 9, draw a five pointed star
                tmp = createFivePointedStar(point);
                for (var i = 0; i < 12; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                tmp = [];
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < 12; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                index += 12;
                shapes.push(9);
            } else if (mode == 10) { //if mode is 10, draw a compass
                tmp = createCompass(point);
                for (var i = 0; i < 18; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                tmp = [];
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < 18; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                index += 18;
                shapes.push(10);
            } else if (mode != 99) {
                //if mode is not 99 or all the previous mode, save the point to tmp
                //if mode is 99, then don't do anything
                first = false;
                tmp[0] = point;
            }

        } else { //after the first click
            if (mode == 1) { //if mode is 1, save the point to tmp and draw only when stop is clicked
                tmp.push(point);
            } else if (mode == 2) { //if mode is 2, draw a line
                first = true;
                tmp.push(point);
                for (var i = 0; i < 2; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < 2; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                index += 2;
                tmp = [];
                shapes.push(2);

            } else if (mode == 3) { //if mode is 3, save on second click and draw a triangle on third click
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

            } else if (mode == 4) { //if mode is 4, draw a rectangle based on the first and second click
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
            }
        }
    });

    document.getElementById("stop").onclick = function () { //trigger to start drawing polygon
        if (mode == 1) {
            if (tmp.length > 2) {
                //if the polygon has more or equals to 3 points, draw the polygon
                gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
                for (var i = 0; i < tmp.length; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + i), flatten(tmp[i]));
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                var tt = colors;
                for (var i = 0; i < tmp.length; i++) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + i), flatten(tt));
                index += tmp.length;
                poly.push(tmp.length);
                tmp = [];
                shapes.push(1);
            }
        }
    };

    render();
}


