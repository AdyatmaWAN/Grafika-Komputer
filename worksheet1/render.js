function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    var count = 0;
    var polyCount = 0;

    if (animate) {
        theta += 0.1;
        console.log("theta: " + theta);
        gl.uniform1f(thetaLoc, theta);
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
        } else if (shapes[i] == 5) {
            gl.drawArrays(gl.TRIANGLE_FAN, count, 4);
            count+= 4;
        } else if (shapes[i] == 6) {
            gl.drawArrays(gl.TRIANGLE_FAN, count, 14);
            count+= 14;
        } else if (shapes[i] == 7) {
            gl.drawArrays(gl.TRIANGLE_FAN, count, 10);
            count+= 10;
        } else if (shapes[i] == 7) {
            gl.drawArrays(gl.TRIANGLE_FAN, count, 10);
            count += 10;
        } else if (shapes[i] == 8) {
            gl.drawArrays(gl.TRIANGLE_FAN, count, 10);
            count += 10;
        } else if (shapes[i] == 9) {
            gl.drawArrays(gl.TRIANGLE_FAN, count, 12);
            count += 12;
        } else if (shapes[i] == 10) {
            gl.drawArrays(gl.TRIANGLE_FAN, count, 18);
            count += 18;
        }
    }
    requestAnimationFrame(render);
}