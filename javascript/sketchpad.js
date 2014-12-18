var sketchpadWidth = 16;  // initial sketchpad width

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

// builds the sketchpad
var createSketchpad = function(width) {
    var squareSize = $sketchpad.width() / width;
    var sketchpadArray = [];
    for (x = 0; x < width; x++) {
        for (i = 0; i < width; i++) {
        sketchpadArray += '<div class="square" style="width:' + squareSize + 'px; height:' + squareSize + 'px;"></div>';
        };
    };
    $sketchpad.empty();
    $sketchpad.append(sketchpadArray);
    $square = $(".square");     // cache the .square selector only after all squares have been added to the page
    $instructions.show();
    if ($hiddenInitially.hasClass("hidden-initially")) {
        $hiddenInitially.show().removeClass("hidden-initially");
    }
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
    });
}

// clears the board to default state when the "Clear Board" button is pressed
var clearBoard = function() {
    $(".clear-button").on("click", function(){
        $sketchpad.empty();
        createSketchpad(sketchpadWidth);
    });
}

/*  Called when changing draw modes and turns "off" all events in the sketchpad area.
    .off() is needed so we don't have to ask for a new size everytime the draw mode is changed like I've seen most user implement. 
    Without it the previously selected draw mode will glitch and still be active when switching to other modes */
var reloadBoard = function() {
    $sketchpad.off();
    createSketchpad(sketchpadWidth);
}

// upon first loading the page, wait until the user selects a mode, 
// and only after that do we draw the sketchpad and show certain buttons
var firstDrawMode = function() {
    $(".dropdown-menu li").on("click", function(){
        $(".first-menu").removeClass("first-menu"); 
        $(".dropdown-button").removeClass("btn-danger").addClass("btn-success");
        $(".size-button, .clear-button").show();
        createSketchpad(sketchpadWidth);
    });    
}

// default draw mode
var drawModeDefault = function() {
    $(".default").on("click", function(){
        $(".dropdown-menu > li").show();
        $(this).hide();
        $modeMenuText.text("Draw Mode: Default");
        reloadBoard();
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
        reloadBoard();
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
        reloadBoard();
        $sketchpad.on("mousedown", function(){
            $square.on("mouseenter", function(){
                $(this).css({"background-color": "black", "opacity": $(this).css("opacity") * 0.75});
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