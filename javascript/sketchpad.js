var sketchpadWidth = 16;  // default sketchpad width
var newSize;
var currentDrawMode = 1;

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

// disables the board when the cursor leaves the sketchpad
function disableBoardColorChange() {
    $("#sketchpad").mouseleave(function(){
        $(".square").off();
        $(".instructions-text").show();
    });
}

// clear the board, revert to default square color
function clearBoard() {
    $("#sketchpad").empty();
    createSketchpad(sketchpadWidth);
}

// selects the color change on the squares based on the currently selected mode
function drawMode(mode) {
    switch(mode) 
    {
        case 1: $(".dropdown-menu > li").show();
                $(".default").hide();
                $("#mode-menu-text").text("Draw Mode: Default");
                clearBoard();
                $("#sketchpad").on("mousedown", function(){
                    $(".square").on("mouseover", function(){
                        $(this).css("background-color", "blue");
                        $(".instructions-text").hide();
                    });
                });
                disableBoardColorChange();
                break;

        case 2: $(".dropdown-menu > li").show();
                $(".random").hide();
                $("#mode-menu-text").text("Draw Mode: Random Colors");
                clearBoard();
                $("#sketchpad").on("mousedown", function(){
                    $(".square").on("mouseover", function(){
                        var color = randomColor();
                        $(this).css("background-color", color);
                        $(".instructions-text").hide();
                    });
                });
                disableBoardColorChange();
                break;

        case 3: $(".dropdown-menu > li").show();
                $(".increment").hide();
                $("#mode-menu-text").text("Draw Mode: Incremental Opacity");
                clearBoard();
                $("#sketchpad").on("mousedown", function(){
                    $(".square").on("mouseover", function(){
                        $(this).css({"background-color": "blue", "opacity": $(this).css("opacity") * 0.75});
                        $(".instructions-text").hide();
                    });
                });
                disableBoardColorChange();
                break;
    };
}

// change the draw mode when a "Draw Mode" menu item is selected
function changeDrawMode() {
    $(".default").on("click", function(){
        currentDrawMode = 1;
        drawMode(currentDrawMode);
    });
    
    $(".random").on("click", function(){
        currentDrawMode = 2;
        drawMode(currentDrawMode);
    });
    
    $(".increment").on("click", function(){
        currentDrawMode = 3;
        drawMode(currentDrawMode);
    });
}
//

// get the new size, input by the user by clicking the "Change Board Size" button
function getNewSize(newSize) {
    newSize = prompt("Please enter a new size (1-64) for the sketch board.\nLeave blank for default size.");
    
    // if the prompt is canceled then exit the function
    if (newSize === null) {
        return;
    }
    // if the prompt is left blank then resize to default size
    else if (newSize === ""){
        sketchpadWidth = 16;
        changeSize(sketchpadWidth);
    }
    // make sure the user entered a valid number
    else if (isNaN(newSize) || newSize < 1 || newSize > 64) {
        alert('"' + newSize + '" is not a valid NUMBER, try again.');
    }
    // otherwise, change the size of the sketchpad based on user input
    else {
        sketchpadWidth = newSize;
        changeSize(sketchpadWidth);
        
    };
    drawMode(currentDrawMode);
}

// change the board size
function changeSize(width) {
    $("#sketchpad").empty();
    createSketchpad(width);
}

// generate a random color
function randomColor(){
    var hue = "rgb(" + (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 256)) + ")";
    return hue;
}

$(document).ready(function(){
    // draws the sketchpad and takes the sketchpadWidth as input
    createSketchpad(sketchpadWidth);

    // changes the color of the squares on mouseover (default function)
    drawMode(currentDrawMode);
    
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
})