//A group of event listeners for the buttons on the html page, each button has a different function that corelate with
//the different shapes that can be drawn and the different modes that can be used
document.getElementById("polygon").onclick = function () { //set the conditon for polygon
    mode = 1;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("line").onclick = function () { //set the conditon for line
    mode = 2;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("triangle").onclick = function () { //set the conditon for triangle
    mode = 3;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("square").onclick = function () { //set the conditon for square
    mode = 4;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("random-square").onclick = function () { //set the conditon for random-square
    mode = 5;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("plus").onclick = function () { //set the conditon for plus
    mode = 6;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("4-leaf").onclick = function () { //set the conditon for 4 Pointed Star
    mode = 7;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("hexagon").onclick = function () { //set the conditon for hexagon
    mode = 8;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("5-leaf").onclick = function () { //set the conditon for 5 Pointed Star
    mode = 9;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("compass").onclick = function () { //set the conditon for compass
    mode = 10;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("clear").onclick = function () { //clear the canvas and clear the conditon for drawing
    index = 0;
    first = true;
    gl.clear(gl.COLOR_BUFFER_BIT);
    animate = false;
    tmp = [];
    shapes = [];
}

document.getElementById("animate").onclick = function () { //start and stop animation
    animate = !animate;
    mode = 99;
    tmp = [];
    first = true;
}
