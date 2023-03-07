function render() { //function to draw the canvas
    gl.clear(gl.COLOR_BUFFER_BIT); //clear the canvas
    var count = 0; //counter for drawing vertices
    var polyCount = 0; //counter for drawing polygons

    if (animate) { //check if animation is on and update the vertex shader
        theta += 0.1;
        gl.uniform1f(thetaLoc, theta);
    }

    for (var i = 0; i < shapes.length; i += 1) { //loop through the shapes array
        if (shapes[i] == 3) { //drawing conditon for triangles
            gl.drawArrays(gl.TRIANGLES, count, 3);
            count+= 3;
        } else if (shapes[i] == 4) { //drawing condition for rectangles
            gl.drawArrays(gl.TRIANGLE_FAN, count, 4);
            count+= 4;
        } else if (shapes[i] == 2) { //drawing condition for lines
            gl.drawArrays(gl.LINES, count, 2);
            count+= 2;
        } else if (shapes[i] == 1) { //drawing condition for polygon
            gl.drawArrays(gl.TRIANGLE_FAN, count, poly[polyCount]);
            count+= poly[polyCount];
            polyCount++;
        } else if (shapes[i] == 5) { //drawing condition for 4 random point
            gl.drawArrays(gl.TRIANGLE_FAN, count, 4);
            count+= 4;
        } else if (shapes[i] == 6) { //drawing condition for plus shape
            gl.drawArrays(gl.TRIANGLE_FAN, count, 14);
            count+= 14;
        } else if (shapes[i] == 7) { //drawing condition for 4 point star
            gl.drawArrays(gl.TRIANGLE_FAN, count, 10);
            count += 10;
        } else if (shapes[i] == 8) { //drawing condition for hexagon
            gl.drawArrays(gl.TRIANGLE_FAN, count, 10);
            count += 10;
        } else if (shapes[i] == 9) { //drawing condition for 5 point star
            gl.drawArrays(gl.TRIANGLE_FAN, count, 12);
            count += 12;
        } else if (shapes[i] == 10) { //drawing condition for compass
            gl.drawArrays(gl.TRIANGLE_FAN, count, 18);
            count += 18;
        }
    }
    requestAnimationFrame(render); //request the next frame
}