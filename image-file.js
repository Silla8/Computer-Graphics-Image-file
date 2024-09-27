/*
    Code sample for CSCI 2408 Computer Graphics 
    (c)2022-24 by Araz Yusubov 
    DISCLAIMER: All code examples we will look at are quick hacks intended to present working prototypes.
    Hence they do not follow best practice of programming or software engineering.    
*/
var canvas;
var context;

window.onload = init;

function init() {
    console.log("init... Begin");

    // Get reference to the 2D context of the canvas
    canvas = document.getElementById("gl-canvas");
    context = canvas.getContext("2d");

    console.log("init... End");
}