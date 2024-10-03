/*
    Code sample for CSCI 2408 Computer Graphics 
    (c)2022-24 by Araz Yusubov 
    DISCLAIMER: All code examples we will look at are quick hacks intended to present working prototypes.
    Hence they do not follow best practice of programming or software engineering.    
*/
var canvas;
var context;
var fileOpen;
var button;
var fileReader = new FileReader();
var image = new Image();

window.onload = init;

function init() {
    console.log("init... Begin");

    // Get reference to the 2D context of the canvas
    canvas = document.getElementById("gl-canvas");
    context = canvas.getContext("2d");

    if(context){

        //getting file object from DOM
        fileOpen =document.getElementById('file-open');
        //if file change call onChange function to process the new file
        fileOpen.onchange = onChange;
        //loading image file finish
        image.onload = imageOnLoad;
        //getting button object from DOM
        button = document.getElementById('proc-button');
        //on cliking button, process the image displayed on canvas
        button.onclick = processImage;
        //reading file complete
        fileReader.onloadend = onLoadEnd;

    }

    console.log("init... End");
}

function onLoadEnd(){
    //getting image specification in header
    let view = new DataView(fileReader.result, 0 , 2);
    let tgaIDLength = view.getUint8(0);
    let tgaColorMapType = view.getUint8(1);
    view = new DataView(fileReader.result, 12, 6);
    let tgaWidth = view.getUint16(0, true);
    let tgaHeight = view.getUint16(2, true);
    let tgaPixelDepth = view.getUint8(4);
    let tgaDescriptor = view.getUint8(5);
    let tgaApha = tgaDescriptor % 16;

    //resize canvas with tga resolution
    canvas.width = tgaWidth;
    canvas.height = tgaHeight;

    //get image data from context
    const imageData = context.getImageData(0,0,canvas.width, canvas.height);
    //data from imageData object
    const data = imageData.data;

    //getting image data
    view = new DataView(fileReader.result, 18 + tgaIDLength +tgaColorMapType);

    for(let j =0; j<tgaHeight; j++){
        for(let i=0; i<tgaWidth; i++){
            let icanvas = (j * tgaWidth + i) * 4;
            let ifile = (j * tgaWidth +i) * (tgaPixelDepth/8);

            switch(tgaPixelDepth){
                
                case 16: 
                    break;
                case 24:
                    blue = view.getUint8(ifile + 0);
                    green = view.getUint8(ifile + 1);
                    red = view.getUint8(ifile + 2);
                    alpha = 255;
                    break;
                case 32:
                    break;
            }

            data[icanvas + 0] = red;
            data[icanvas + 1] = green;
            data[icanvas + 2] = blue;
            data[icanvas + 3] = alpha;

        }
    }

    context.putImageData(imageData, 0,0);
}

function processImage(){
    //get image data
    const imageData = context.getImageData(0,0 ,canvas.width, canvas.height);
    // extract data from imageData object
    const data = imageData.data;

    for(let i=0; i< data.length; i+=4){
        data[i+0] = 255- data[i+0];
        data[i+1] = 255- data[i+1];
        data[i+2] = 255- data[i+2];
    }

    context.putImageData(imageData, 0 , 0);
}

function imageOnLoad(){
    //resize canvas to image resolution for better processing
    canvas.width = image.width;
    canvas.height = image.height;
    //draw image on canvas
    context.drawImage(image, 0 , 0);
}

function onChange(e){
    //getting all selected files
    const files = fileOpen.files;
    //extracting the file extension of the first file
    const fileExt = files[0].name.split('.').pop().toLowerCase();

    if(fileExt === 'tga'){
        //reading file data in array of buffer
        fileReader.readAsArrayBuffer(files[0]);
    }else{
        //loading image file
        image.src = URL.createObjectURL(files[0]);
    }
}
