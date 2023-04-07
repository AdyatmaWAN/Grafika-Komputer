function render() { //function to draw the canvas
    gl.clear(gl.COLOR_BUFFER_BIT); //clear the canvas

    if (animate) { //check if animation is on and update the vertex shader
        theta += 0.1;
        gl.uniform1f(thetaLoc, theta);
    }


    requestAnimationFrame(render); //request the next frame
}