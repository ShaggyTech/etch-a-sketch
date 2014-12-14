// default sketchpadWidth
var sketchpadWidth = 16;
var newSize;
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

// changes the color of the squares when the cursor touches them
function squareChange() {
    // keeps the squares from changing unless focus is on the sketchpad
    // also hides the instructions once the sketchpad is active
    $("#sketchpad").mousedown(function(){
        $(".square").hover(function(){
            $(this).addClass("square-normal");
            $(".instructions-text").hide();
        });
    });
    $("#sketchpad").mouseleave(function(){
        $(".square").off();
        $(".instructions-text").show();
    });
}

// clear the board, revert to default colors
function clearBoard() {
    $(".square").removeClass("square-normal");
}

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
    // TODO!
    squareChange();
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
    squareChange()
    
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