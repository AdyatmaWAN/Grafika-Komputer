Coloris({
    theme: 'large',
    themeMode: 'light',
    el: '.coloris',
    format:'hex',
    margin:10,
    onChange: (color) => {
        console.log(color.length);
        if (color.length > 8){
            r = parseInt(color.substring(1,3), 16)/255;
            g = parseInt(color.substring(3,5), 16)/255;
            b = parseInt(color.substring(5,7), 16)/255;
            a = parseInt(color.substring(7,9), 16)/255;
        } else {
            r = parseInt(color.substring(1,3), 16)/255;
            g = parseInt(color.substring(3,5), 16)/255;
            b = parseInt(color.substring(5,7), 16)/255;
            a = 1;
        }
        colors = vec4(r,g,b,a);
    }
});