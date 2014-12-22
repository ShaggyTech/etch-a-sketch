// global variables
var defaultSketchpadWidth = 24;
var sketchpadWidth = defaultSketchpadWidth;  // initial sketchpad width
var drawModeID = 100;
var totalColumns;
var totalRows;
var numSquares;
var keyIsDown = false;

// cache selectors for performance and speed reasons
var $sketchpad = $("#sketchpad");
var $square;
var $instructions = $(".instructions-text");
var $modeMenuText =  $("#mode-menu-text");
var $hiddenInitially = $(".hidden-initially");

// will scroll down to the top of the menu div (i.e. anytime drawSketchpad() is called)
var scrollToBoard = function(){
    $('html, body').animate({
        scrollTop: $(".menu").offset().top
    }, 400);
}

var clearBoard = function() {
        $sketchpad.empty("span");
        drawSketchpad(sketchpadWidth);
}

// builds the sketchpad
var drawSketchpad = function(width) {
    var squareSize = $sketchpad.width() / width;
    var totalColumns = $sketchpad.width() / squareSize;
    var totalRows = $sketchpad.height() / squareSize;
    var sketchpadArray = [];
    numSquares = 0;
    var columnId = 0;
    var rowID = 0;

    console.log("squareSize: " + squareSize);
    console.log("totalColumns: " + totalColumns);
    console.log("totalRows: " + totalRows);

    for (var x = 0; x < totalColumns; x++) {
        sketchpadArray += '<span class="columns">';
        columnId++;
        for (var i = 0; i < totalRows; i++) {
            numSquares += 1;
            rowID++
            sketchpadArray += '<span data-column="' + columnId + '"data-row="' + rowID +
                              '"class="square" style="width:' + squareSize + 'px; height:' + squareSize + 'px;"></span>';
        };
        rowID = 0;
    };

    $sketchpad.empty("span");
    $sketchpad.append(sketchpadArray);
    $square = $(".square");     // cache the .square selector only after all squares have been added to the page
    $instructions.show();
}

// when first loading the page, first sketchpad created upon selection of draw mode
var firstDrawMode = function() {
    $(".dropdown-menu li").on("click", function(){
        if ($(".dropdown-button").hasClass("btn-danger")) { // if this is the first time we are drawing the board
            $(".first-menu").removeClass("first-menu");  // removes the right border radius from the left menu button
            $(".dropdown-button").removeClass("btn-danger").addClass("btn-success"); // change the color of the left menu button to green
            $hiddenInitially.show().removeClass("hidden-initially"); // show all initially hidden buttons/divs
            drawSketchpad(sketchpadWidth);  // create the initial board
            scrollToBoard();
        };
    }); 
}

// changes the draw mode based on currently selected draw mode option
var drawMode = function(mode){
    
    switch(mode)
    {        
        case 1: $(".dropdown-menu > li").show();
                $(".default").hide();
                $modeMenuText.text("Draw Mode: Default");
                $sketchpad.off(".draw");
                paintbrush(mode);
                break;

        case 2: $(".dropdown-menu > li").show();
                $(".random").hide();
                $modeMenuText.text("Draw Mode: Random Colors");
                $sketchpad.off(".draw");
                paintbrush(mode);
                break;

        case 3: $(".dropdown-menu > li").show();
                $(".incremental").hide();
                $modeMenuText.text("Draw Mode: Darken");
                $sketchpad.off(".draw");
                paintbrush(mode);
                break;

        case 4: $(".dropdown-menu > li").show();
                $(".trail").hide();
                $modeMenuText.text("Draw Mode: Snake");
                $sketchpad.off(".draw");
                paintbrush(mode);
                break;

        default: break;
    }
}

var paintbrush = function(mode){
    $sketchpad.on("mouseenter.draw", ".square", function(){
            var rgb = getRGB($(this).css("background-color"));
            if (mode === 1) {
                if (keyIsDown) {
                    $(this).css("background-color", "black");
                }
            }
            else if (mode === 2) {
                var color = randomColor();
                if (keyIsDown) {
                    $(this).css("background-color", color);
                }
            }
            else if (mode === 3) {
                for(var i = 0; i < rgb.length; i++){
                    rgb[i] = Math.max(0, rgb[i] - 10);
                }
                var newColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                if (keyIsDown) {
                    $(this).css("background-color", newColor);
                }
            }
            else if (mode === 4) {
                squareColor = $(this).css("background-color");
                $(this).css("background-color", rgb);
                $(this).stop(true, true).fadeTo(1000, 0.0, function() {
                    $(this).css({"background-color": rgb, "opacity": "1"});
                });
                $instructions.hide();
            }
            else {
                return;
            }
    });
}

// get the new size, input by the user by clicking the "Change Board Size" button
var changeSize = function() {
    $(".size-button").on("click", function(){
        // prompt the user for a new size
        var newSize = prompt("Please enter desired squares per row for the sketch board.\nMin: 1 | Max: 64\nLeave blank for default size.");
        // if the prompt is left blank then resize to default size
        if (newSize === null) {
            return;
        }
        // if prompt is left blank the use default size
        else if (newSize === ""){
            sketchpadWidth = defaultSketchpadWidth;
            $sketchpad.empty();
            drawSketchpad(sketchpadWidth);
        }
        // make sure the user entered a valid number
        else if (isNaN(newSize) || newSize < 1 || newSize > 64) {
            alert('"' + newSize + '" is not a valid NUMBER, try again.');
        }
        // otherwise, change the size of the sketchpad
        else {
            sketchpadWidth = newSize;
            $sketchpad.empty();
            drawSketchpad(sketchpadWidth);
        };
    });
}

var menuListeners = function(){
    $(".default").on("click", function() {
        drawModeID = 1; 
        drawMode(drawModeID);
    });
    $(".random").on("click", function() {
        drawModeID = 2;
        drawMode(drawModeID);
    });
    $(".increment").on("click", function() {
        drawModeID = 3;
        drawMode(drawModeID);
    });
    $(".trail").on("click", function() {
        drawModeID = 4;
        drawMode(drawModeID);
    });
    $(".clear-button").on("click", function(){
        clearBoard();
    });
}

var globalListeners = function(){
    // necessary to make the bootstrap buttons remove the active state class immediately after clicking them
    $(".btn").on("mouseup", function(){
        $(this).blur();
    });

    // makes sure these divs and buttons are initially hidden
    $(".hidden-initially").hide();

    // tells us whether the shift key is being held down
    $sketchpad.on("click", function(){
        $(this).on("mousedown", function(event){
            if (event.which == 1) {
                keyIsDown = true;
                $(this).css('cursor','url(./img/paintbrush.png),auto');
            }
        }).on("mouseup", function(){
            keyIsDown = false;
            $(this).css('cursor','pointer');
        });    

    });   
}

var listeners = function() {
    globalListeners();
    menuListeners();
    changeSize();
    firstDrawMode();
}

$(document).ready(function(){    
    listeners();
})