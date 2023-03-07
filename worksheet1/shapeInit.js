function createFourRandomPoints(point) {
    //initiate the array for the points using rng
    for (var i = 0; i < 4; i++) {
        var k = generateRandomNumber();
        var l = generateRandomNumber();
        tmp.push(vec2(point[0] + k, point[1] + l));
    }
    return tmp;
}

function createPlusShape(point) { //push the points for the plus shape
    tmp.push(point);
    tmp.push(vec2(point[0] - 0.025, point[1] + 0.075));
    tmp.push(vec2(point[0] + 0.025, point[1] + 0.075));
    tmp.push(vec2(point[0] + 0.025, point[1] + 0.025));
    tmp.push(vec2(point[0] + 0.075, point[1] + 0.025));
    tmp.push(vec2(point[0] + 0.075, point[1] - 0.025));
    tmp.push(vec2(point[0] + 0.025, point[1] - 0.025));
    tmp.push(vec2(point[0] + 0.025, point[1] - 0.075));
    tmp.push(vec2(point[0] - 0.025, point[1] - 0.075));
    tmp.push(vec2(point[0] - 0.025, point[1] - 0.025));
    tmp.push(vec2(point[0] - 0.075, point[1] - 0.025));
    tmp.push(vec2(point[0] - 0.075, point[1] + 0.025));
    tmp.push(vec2(point[0] - 0.025, point[1] + 0.025));
    tmp.push(vec2(point[0] - 0.025, point[1] + 0.075));
    tmp.push(vec2(point[0] + 0.025, point[1] + 0.075));
    return tmp;
}

function createHexagon(point) { //push the points for the hexagon
    tmp.push(point);
    tmp.push(vec2(point[0], point[1] + 0.1));
    tmp.push(vec2(point[0] + 0.07, point[1] + 0.070))
    tmp.push(vec2(point[0] + 0.1, point[1]));
    tmp.push(vec2(point[0] + 0.07, point[1] - 0.07));
    tmp.push(vec2(point[0], point[1] - 0.1));
    tmp.push(vec2(point[0] - 0.07, point[1] - 0.07));
    tmp.push(vec2(point[0] - 0.1, point[1]));
    tmp.push(vec2(point[0] - 0.07, point[1] + 0.07));
    tmp.push(vec2(point[0], point[1] + 0.1));
    return tmp;
}

function createFourPointedStar(point) { //push the points for the four pointed star
    tmp.push(point);
    tmp.push(vec2(point[0], point[1] + 0.1));
    tmp.push(vec2(point[0] + 0.025, point[1] + 0.025));
    tmp.push(vec2(point[0] + 0.1, point[1]));
    tmp.push(vec2(point[0] + 0.025, point[1] - 0.025));
    tmp.push(vec2(point[0], point[1] - 0.1));
    tmp.push(vec2(point[0] - 0.025, point[1] - 0.025));
    tmp.push(vec2(point[0] - 0.1, point[1]));
    tmp.push(vec2(point[0] - 0.025, point[1] + 0.025));
    tmp.push(vec2(point[0], point[1] + 0.1));
    return tmp;
}

function createFivePointedStar(point) { //push the points for the five pointed star
    tmp.push(point);
    tmp.push(vec2(point[0], point[1] + 0.1));
    tmp.push(vec2(point[0] + 0.023, point[1] + 0.028));
    tmp.push(vec2(point[0] + 0.08, point[1] + 0.033));
    tmp.push(vec2(point[0] + 0.033, point[1] - 0.012));
    tmp.push(vec2(point[0] + 0.05, point[1] - 0.08));
    tmp.push(vec2(point[0], point[1] - 0.033));
    tmp.push(vec2(point[0] - 0.05, point[1] - 0.08));
    tmp.push(vec2(point[0] - 0.033, point[1] - 0.012));
    tmp.push(vec2(point[0] - 0.08, point[1] + 0.033));
    tmp.push(vec2(point[0] - 0.023, point[1] + 0.028));
    tmp.push(vec2(point[0], point[1] + 0.1));
    return tmp;
}

function createCompass(point) { // push the points for the compass
    tmp.push(point);
    tmp.push(vec2(point[0], point[1] + 0.1));
    tmp.push(vec2(point[0] + 0.025, point[1] + 0.05));
    tmp.push(vec2(point[0] + 0.05, point[1] + 0.05));
    tmp.push(vec2(point[0] + 0.05, point[1] + 0.025));
    tmp.push(vec2(point[0] + 0.1, point[1]));
    tmp.push(vec2(point[0] + 0.05, point[1] - 0.025));
    tmp.push(vec2(point[0] + 0.05, point[1] - 0.05));
    tmp.push(vec2(point[0] + 0.025, point[1] - 0.05));
    tmp.push(vec2(point[0], point[1] - 0.1));
    tmp.push(vec2(point[0] - 0.025, point[1] - 0.05));
    tmp.push(vec2(point[0] - 0.05, point[1] - 0.05));
    tmp.push(vec2(point[0] - 0.05, point[1] - 0.025));
    tmp.push(vec2(point[0] - 0.1, point[1]));
    tmp.push(vec2(point[0] - 0.05, point[1] + 0.025));
    tmp.push(vec2(point[0] - 0.05, point[1] + 0.05));
    tmp.push(vec2(point[0] - 0.025, point[1] + 0.05));
    tmp.push(vec2(point[0], point[1] + 0.1));
    return tmp;
}