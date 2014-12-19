var sketchpadWidth = 16;  // initial sketchpad width
var newSketchpadWidth;
var newSketchpadHeight
var boardWidth;
var boardHeight;
var numSquares;
var numColumns;

// cache selectors for performance and speed reasons
var $sketchpad = $("#sketchpad");
var $square;
var $instructions = $(".instructions-text");
var $modeMenuText =  $("#mode-menu-text");

//this selector/class is used to keep initially hidden elements on the page from "flashing" on page load/refresh
var $hiddenInitially = $(".hidden-initially");

// will scroll down to the top of the menu div (i.e. anytime createSketchpad() is called)
var scrollToBoard = function(){
    $('html, body').animate({
        scrollTop: $(".menu").offset().top
    }, 400);
}

var resizableSketchpad = function(){
    $( "#resize-div" ).resizable({
        containment: "parent",
        ghost: true
    });
}

// builds the sketchpad
var createSketchpad = function(width) {
    var squareSize = $sketchpad.innerWidth() / width;
    var sketchpadArray = [];
    numSquares = 0;
    for (x = 0; x < width; x++) {
        sketchpadArray += '<span class="column-counter">';
        for (i = 0; i < width; i++) {
            sketchpadArray += '<span class="square" style="width:' + squareSize + 'px; height:' + squareSize + 'px; margin: 0;"></span>';
            numSquares += 1;
        };
        sketchpadArray += '</span>';
    };
    $sketchpad.empty("span");
    $sketchpad.append(sketchpadArray);
    $square = $(".square");     // cache the .square selector only after all squares have been added to the page
    $sketchpad = $sketchpad;
    $instructions.show();

    
    resizableSketchpad();

    numColumns = 0;
    numColumns += $("#sketchpad > .column-counter").length;
    boardHeight = numColumns;
    boardWidth = numSquares / numColumns;
    newSketchpadHeight = squareSize * boardHeight;
    newSketchpadWidth = squareSize * boardWidth;

    //$sketchpad.css({"height": newSketchpadHeight, "width": newSketchpadWidth});

    /*console.log("$sketchpad width after: " + $sketchpad.width());
    console.log("numSquares: " + numSquares);
    console.log(numColumns);
    console.log(sketchpadWidth);
    console.log(boardHeight);
    console.log(boardWidth);*/
    
    scrollToBoard();
}



// generate a random color
var randomColor = function(){
    var hue = "rgb(" + (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 256)) + ")";
    return hue;
}

// disables the board when the cursor leaves the sketchpad
var disableBoardColorChange =  function() {
    $sketchpad.mouseleave(function(){
        $square.off();
        $instructions.show();
        $(".resize-div").resizable();
    });
}

// clears the board to default state when the "Clear Board" button is pressed
var clearBoard = function() {
    $(".clear-button").on("click", function(){
        $sketchpad.empty("span");
        createSketchpad(sketchpadWidth);
    });
}

// upon first loading the page, wait until the user selects a mode, 
// and only after that do we draw the sketchpad and show certain buttons
var firstDrawMode = function() {
    $(".dropdown-menu li").on("click", function(){
        if ($(".dropdown-button").hasClass("btn-danger")) {
            $(".first-menu").removeClass("first-menu"); 
            $(".dropdown-button").removeClass("btn-danger").addClass("btn-success");
            $hiddenInitially.show().removeClass("hidden-initially");
            createSketchpad(sketchpadWidth);
        };
    });    
}
// remove me
// default draw mode
var drawModeDefault = function() {
    $(".default").on("click", function(){
        $(".dropdown-menu > li").show();
        $(this).hide();
        $modeMenuText.text("Draw Mode: Default");
        $sketchpad.on("mousedown", function(){
            $square.on("mouseenter", function(){
                $(this).css("background-color", "black");
                $instructions.hide();
            });
        });
        disableBoardColorChange();
    });
}

//random color draw mode
var drawModeRandom = function() {
    $(".random").on("click", function(){
        $(".dropdown-menu > li").show();
        $(this).hide();
        $modeMenuText.text("Draw Mode: Random Colors");
        $sketchpad.on("mousedown", function(){
            $square.on("mouseenter", function(){
                var color = randomColor(); 
                $(this).css("background-color", color);
                $instructions.hide();
            });
        });
        disableBoardColorChange();
    });
}

// incremental opacity draw mode
var drawModeIncrement = function() {
    $(".increment").on("click", function(){
        $(".dropdown-menu > li").show();
        $(this).hide();
        $modeMenuText.text("Draw Mode: Incremental Opacity");
        $sketchpad.on("mousedown", function(){
            $square.on("mouseenter", function(){
                var count = $(this).data("increment-count");
                var colorIncrement;
                if (!count) count = 1;
                if (count < 10) count++;
                $(this).data("increment-count", count);
                colorIncrement = 256 - Math.floor(25 * count);
                $(this).css({"background-color": "rgb(" + colorIncrement + ", " + colorIncrement + ", " + colorIncrement + ")"});
                $instructions.hide();
            });
        });
        disableBoardColorChange();
    });
}

// get the new size, input by the user by clicking the "Change Board Size" button
var changeSize = function() {
    $(".size-button").on("click", function(){
        // prompt the user for a new size
        var newSize = prompt("Please enter a new size (1-64) for the sketch board.\nLeave blank for default size.");
        // if the prompt is left blank then resize to default size
        if (newSize === null) {
            return;
        }
        // if prompt is left blank the use default size
        else if (newSize === ""){
            sketchpadWidth = 16;
            $sketchpad.empty();
            createSketchpad(sketchpadWidth);
        }
        // make sure the user entered a valid number
        else if (isNaN(newSize) || newSize < 1 || newSize > 64) {
            alert('"' + newSize + '" is not a valid NUMBER, try again.');
        }
        // otherwise, change the size of the sketchpad
        else {
            sketchpadWidth = newSize;
            $sketchpad.empty();
            createSketchpad(sketchpadWidth);
        };
    });
}

var listeners = function() {
    firstDrawMode();
    drawModeDefault();
    drawModeRandom();
    drawModeIncrement();
    changeSize();
    clearBoard();
}

// necessary to make the bootstrap buttons remove the active state class immediately after clicking them
$(".btn").on("mouseup", function(){
    $(this).blur();
});

$(".hidden-initially").hide();    // makes sure these divs and buttons are initially hidden

$(document).ready(function(){    
    listeners();

})