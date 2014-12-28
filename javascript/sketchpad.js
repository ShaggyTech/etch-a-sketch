// global variables
var defaultSketchpadWidth = 24;
var sketchpadWidth = defaultSketchpadWidth;  // initial sketchpad width
var drawModeID = 100;
var totalColumns;
var totalRows;
var numSquares;
var mouseIsDown = false;
var brushmode = 1;
var $thisSquare;
var $square;

// cache selectors for performance and speed reasons
var $sketchpad = $("#sketchpad");
var $instructions = $(".instructions-text");
var $modeMenuText =  $(".mode-menu-text");
var $hiddenInitially = $(".hidden-initially");

// will scroll down to the top of the menu div (i.e. anytime drawSketchpad() is called)
var scrollToBoard = function(){
    $('html, body').animate({
        scrollTop: $("#sketchpad-menu").offset().top
    }, 400);
}

var clearBoard = function() {
    $sketchpad.empty();
    drawSketchpad(sketchpadWidth);
}

// builds the sketchpad
var drawSketchpad = function(width) {
    var squareSize = intRound($sketchpad.width() / width, 6);
    var totalColumns = $sketchpad.width() / squareSize;
    var totalRows = $sketchpad.height() / squareSize;
    var sketchpadArray = [];
    numSquares = 0;
    var columnId = 0;
    var rowID = 0;

    for (var x = 0; x < sketchpadWidth; x++) {
        sketchpadArray += '<span class="columns">';
        columnId++;
        for (var i = 0; i < sketchpadWidth; i++) {
            numSquares += 1;
            rowID++
            sketchpadArray += '<span data-column="' + columnId + '"data-row="' + rowID +
                              '"class="square" style="width:' + squareSize + 'px; height:' + squareSize + 'px;"></span>';
        };
        rowID = 0;
    };
    $sketchpad.empty();
    $sketchpad.append(sketchpadArray);
    $square = $(".square");     // cache the .square selector only after all squares have been added to the page
    squareGridToggle();
    $instructions.show();
}

// when first loading the page, first sketchpad created upon selection of draw mode
var firstDrawMode = function() {
    $(".initial-selection-dropdown li").on("click", function(){
        $(".initial-selection").hide();
        $(".hidden-initially").show();
        drawSketchpad(sketchpadWidth);  // create the initial board
        scrollToBoard();
    }); 
}

// changes the draw mode based on currently selected draw mode option
var drawMode = function(mode, selector){
    $sketchpad.off(".draw");
    $(".dropdown-menu > li").show();
    selector.hide();
    $("#colorpicker-container").addClass("disabled");
    $(".brush-mode").removeClass("disabled");
    switch(mode)
    {        
        case 1: $modeMenuText.text("Default");
                $("#colorpicker-container").removeClass("disabled");
                paintbrush(mode);
                break;
        case 2: $modeMenuText.text("Random Colors");
                paintbrush(mode);
                break;
        case 3: $modeMenuText.text("Darken");
                paintbrush(mode);
                break;
        case 4: $modeMenuText.text("Snake");
                $(".brush-mode").addClass("disabled");
                paintbrush(mode);
                break;
        default: break;
    }
}

// called by drawmode()
var paintbrush = function(mode){
    $sketchpad.on("mouseover.draw", ".square", function(){
        $thisSquare = $(this);
        var rgb = getRGB($(this).css("background-color"));
        // these modes DO NOT require the mouse button to be down or clicked
        if (mode === 4) {                                       // snake mode
            squareColor = $(this).css("background-color");
            $(this).css("background-color", rgb);
            $(this).stop(true, true).fadeTo(1000, 0.0, function() {
                $(this).css({"background-color": rgb, "opacity": "1"});
            });
            $instructions.hide();
        }
        // these modes DO require the mouse button to be down or clicked
        else {
            // paint mode, HOLD mouse down to draw across multiple squares
            if (brushmode === 1) {
                if (mouseIsDown) {
                    $(this).css('cursor','url(./img/paintbrush.png),auto');
                    $instructions.hide();
                    drawModeSwitch(mode);
                }
                else {
                    $(this).css('cursor','pointer');
                    $instructions.show().text("HOLD left mouse button to draw!");
                }
            }
            // precision mode, CLICK mouse to draw on a single square at a time
            else if (brushmode === 2) {
                $thisSquare.off(".draw");
                $instructions.show().text("CLICK left mouse button to draw!");
                $(this).css('cursor','crosshair');
                $thisSquare.on("click.draw", function(){
                    drawModeSwitch(mode);
                });
            }
        }
    });
    // separate function shared by both brushmodes
    var drawModeSwitch = function(mode){
        if (mode === 1) {                               // default mode
            var color = $("#colorpicker").spectrum("get").toHexString();
            $thisSquare.css("background-color", color);
        }
        else if (mode === 2) {                          // random color mode
            var color = randomColor();
            $thisSquare.css("background-color", color);
        }
        else if (mode === 3) {                          // darken mode
            var rgb = getRGB($thisSquare.css("background-color"));
            for(var i = 0; i < rgb.length; i++) {
                rgb[i] = Math.max(0, rgb[i] - 10);
            }
            var newColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
            $thisSquare.css("background-color", newColor);
        }
    }
}

// get the new size, input by the user by clicking the "Change Board Size" button
var changeSize = function() {
    $(".size-button").on("click", function(){
        // prompt the user for a new size
        var newSize = prompt("Please enter desired squares per row for the sketch board.\nMin: 1 | Max: 64\nLeave blank for default size.");
        // if "cancel" is clicked in the prompt then don't do anything
        if (newSize === null) {
            return;
        }
        // if prompt is left blank then use default size
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

// creates a color picker via the spectrum.js plugin
var colorPicker = function(){
    $("#colorpicker").spectrum({
        color: "#000",
        showInput: true,
        className: "spectrum-replacer",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        maxPaletteSize: 10,
        preferredFormat: "hex",
        palette: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
            "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
            "rgb(0, 255, 255)"]
        ]
    });
}

// tells us whether the left mouse is being held down
var isMouseDown = function(){
    $sketchpad.on("mouseover", ".square", function(){
        $(this).on("mousedown", function(event){
            if (event.which == 1) {
                mouseIsDown = true;
            }
        }).on("mouseup", function(){
            mouseIsDown = false;
        });    
    });
}

var squareGridToggle = function(){
    if ($("#grid-checkbox").is(":checked")) {
        $(".square").removeClass("square-nogrid");
    }
    else {
        $(".square").addClass("square-nogrid")
    };
}

// toggle "paint" and "precise" brush modes
var brushModeToggle = function(){
    paintbrush(drawModeID);
    if (brushmode === 1) {
        $(".brush-mode").text("Brush Mode: Precise");
        brushmode = 2;
    }
    else if (brushmode === 2) {
        $(".brush-mode").text("Brush Mode: Paint");
        brushmode = 1;
    }
}

var buttonListeners = function(){
    $(".default").on("click", function() {
        drawModeID = 1; 
        drawMode(drawModeID, $(this));
    });
    $(".random").on("click", function() {
        drawModeID = 2;
        drawMode(drawModeID, $(this));
    });
    $(".increment").on("click", function() {
        drawModeID = 3;
        drawMode(drawModeID, $(this));
    });
    $(".trail").on("click", function() {
        drawModeID = 4;
        drawMode(drawModeID, $(this));
    });
    $(".clear-button").on("click", function(){
        clearBoard();
    });
    $("#grid-checkbox").on("click", function(){
        squareGridToggle();
    });
    $(".brush-mode").on("click", function(){
        brushModeToggle();
    });
}

var globalListeners = function(){
    // necessary to make the bootstrap buttons remove the active state class immediately after clicking them
    $(".btn").on("mouseup", function(){
        $(this).blur();
    });

    // makes sure these divs and buttons are initially hidden
    $(".hidden-initially").hide();
}

var listeners = function() {
    globalListeners();
    buttonListeners();
    changeSize();
    firstDrawMode();
    colorPicker();
    isMouseDown();
}

$(document).ready(function(){    
    listeners();
})