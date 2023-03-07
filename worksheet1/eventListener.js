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

document.getElementById("random-square").onclick = function () {
    mode = 5;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("plus").onclick = function () {
    mode = 6;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("4-leaf").onclick = function () {
    mode = 7;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("hexagon").onclick = function () {
    mode = 8;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("5-leaf").onclick = function () {
    mode = 9;
    animate = false;
    tmp = [];
    first = true;
}

document.getElementById("compass").onclick = function () {
    mode = 10;
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
