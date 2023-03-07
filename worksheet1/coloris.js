Coloris({ // Initialize Coloris, Coloris is the color picker used for this project
    theme: 'large',
    themeMode: 'light',
    el: '.coloris',
    format:'hex',
    margin:10,
    onChange: (color) => { // When the color is changed, update the color used for the next shape made
        if (color.length > 8){ //if the color is in RGBA format
            r = parseInt(color.substring(1,3), 16)/255;
            g = parseInt(color.substring(3,5), 16)/255;
            b = parseInt(color.substring(5,7), 16)/255;
            a = parseInt(color.substring(7,9), 16)/255;
        } else { //if the color is in RGB format, convert it to RGBA format
            r = parseInt(color.substring(1,3), 16)/255;
            g = parseInt(color.substring(3,5), 16)/255;
            b = parseInt(color.substring(5,7), 16)/255;
            a = 1;
        }
        colors = vec4(r,g,b,a); //update the color used for the next shape made
    }
});