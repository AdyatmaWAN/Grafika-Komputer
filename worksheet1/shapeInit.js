function createFourRandomPoints(point) {
    for (var i = 0; i < 4; i++) {
        var k = generateRandomNumber();
        var l = generateRandomNumber();
        tmp.push(vec2(point[0] + k, point[1] + l));
    }
    return tmp;
}

function createPlusShape(point) {
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

function createHexagon(point) {
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

function createFourPointedStar(point) {
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

function createFivePointedStar(point) {
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

function createCompass(point) {
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