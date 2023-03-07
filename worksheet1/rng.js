function generateRandomNumber() { // Function to generate a random number
    var min = 0.00,
        max = 0.1,
        highlightedNumber = Math.random() * (max - min) + min;

    return (highlightedNumber);
};