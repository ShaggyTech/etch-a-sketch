var sketchpadWidth = 16;  // default sketchpad width
var newSize;
var currentDrawMode = "defaultSquares";

// builds the sketchpad
function createSketchpad(width) {
    var squareSize = $("#sketchpad").width() / width;
    var sketchpad = [];
    for (x = 0; x < width; x++) {
        for (i = 0; i < width; i++) {
        sketchpad += "<div class='square'></div>";
        };
    };
    $("#sketchpad").append(sketchpad);
    $(".square").css("width", squareSize);
    $(".square").css("height", squareSize);
}

// disables the board when the mouse leaves the sketchpad
function disableBoardColorChange() {
    $("#sketchpad").mouseleave(function(){
        $(".square").off();
        $(".instructions-text").show();
    });
}

function squareDefault() {
    $("#sketchpad").mousedown(function(){
        $(".square").hover(function(){
            $(this).css("background-color", "blue");
            $(".instructions-text").hide();
        });
    });
    disableBoardColorChange();
}

function squareRandomColors() {
    $("#sketchpad").mousedown(function(){
        $(".square").hover(function(){
            var color = randomColor(); 
            $(this).css("background-color", color);
            $(".instructions-text").hide();
        });
    });
    disableBoardColorChange();
}

// generate a random color
function randomColor(){
    var hue = "rgb(" + (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 256)) + ")";
    return hue;
}

// clear the board, revert to default colors
function clearBoard() {
    $(".square").css("background-color", "#DEDEDE");
}

//
function drawMode() {
    if (currentDrawMode === "defaultSquares") {
        clearBoard();
        squareDefault();
    }
    else if (currentDrawMode === "randomSquares") {
        clearBoard();
        squareRandomColors();
    };
}

function changeDrawMode() {
    $(".default").on("click", function(){
        currentDrawMode = "defaultSquares";
        drawMode();
    });
    
    $(".random").on("click", function(){
        currentDrawMode = "randomSquares";
        drawMode();
    });
}
//

// get the new size, input by the user by clicking the "Change Board Size" button
function getNewSize(newSize) {
    newSize = prompt("Please enter a new size (1-64) for the sketch board.\nLeave blank for default size.");
    // if the prompt is left blank then resize to default size
    if (newSize === null) {
        return;
    }
    else if (newSize === ""){
        changeSize(sketchpadWidth);
    }
    // make sure the user entered a valid number
    else if (isNaN(newSize) || newSize < 1 || newSize > 64) {
        alert('"' + newSize + '" is not a valid NUMBER, try again.');
    }
    // otherwise, change the size of the sketchpad
    else {
        changeSize(newSize);
    };
    drawMode();
}

// change the board size
function changeSize(width) {
    $("#sketchpad").empty();
    createSketchpad(width);
}

function listeners() {
    // draws the sketchpad and takes the sketchpadWidth as input
    createSketchpad(sketchpadWidth);
    
    // changes the color of the squares on mouseover (default function)
    drawMode();
    
    // listens for clicks on the draw mode drop-down menu
    changeDrawMode();
    
    // clears the board to default state when the "Clear Board" button is pressed
    $(".clear-button").on("click", function(){
        clearBoard();
    });
    
    // allows the user to resize the board by clicking the "Change Board Size" button
    $(".size-button").on("click", function() {
        getNewSize();
    });
    
    // necessary to make the bootstrap buttons remove the active state class immediately after clicking them
    $(".btn").on("mouseup", function(){
        $(this).blur();
    });
}

$(document).ready(function(){
    listeners();
})