var sketchpadWidth = 16;  // default sketchpad width

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
    $(".instructions-text").show();
}

// generate a random color
function randomColor(){
    var hue = "rgb(" + (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 256)) + ")";
    return hue;
}

// disables the board when the cursor leaves the sketchpad
function disableBoardColorChange() {
    $("#sketchpad").mouseleave(function(){
        $(".square").off();
        $(".instructions-text").show();
    });
}

function reloadBoard() {
    // removes all square divs from the sketchpad div
    $("#sketchpad").empty();
    // turns "off" all events in the sketchpad area, necessary to be able to have smooth transitions when performing draw mode changes
    $("#sketchpad").off();  // might be a better way to accomplish this than using .off()??
    // reloads the sketchpad
    createSketchpad(sketchpadWidth);
}

$(document).ready(function(){
    // makes sure these divs and buttons are initially hidden
    $(".instructions-text, .size-button, .clear-button").hide();

    // wait until the user selects a mode, and only after that do we draw the sketchpad and show certain buttons 
    $(".initial-mode").on("click", function(){ 
        $(".dropdown-button").removeClass("btn-danger");
        $(".dropdown-button").addClass("btn-success");
        $(".size-button, .clear-button").show();
        createSketchpad(sketchpadWidth);
        // will scroll down to the top of the menu div after setting a mode
        $('html, body').animate({
            scrollTop: $(".menu").offset().top
        }, 1000);
    });

    // default draw mode
    $(".default").on("click", function(){
        $(".dropdown-menu > li").show();
        $(".default").hide();
        $("#mode-menu-text").text("Draw Mode: Default");
        reloadBoard();
        $("#sketchpad").on("mousedown", function(){
            $(".square").on("mouseenter", function(){
                $(this).css({"background-color": "black", "opacity": "initial"});
                $(".instructions-text").hide();
            });
        });
        disableBoardColorChange();
    });

    //random color draw mode
    $(".random").on("click", function(){
        $(".dropdown-menu > li").show();
        $(".random").hide();
        $("#mode-menu-text").text("Draw Mode: Random Colors");
        reloadBoard();
        $("#sketchpad").on("mousedown", function(){
            $(".square").on("mouseenter", function(){
                var color = randomColor(); 
                $(this).css({"background-color": color, "opacity": "initial"});
                $(".instructions-text").hide();
            });
        });
        disableBoardColorChange();
    });

    // incremental opacity mode
    $(".increment").on("click", function(){
        $(".dropdown-menu > li").show();
        $(".increment").hide();
        $("#mode-menu-text").text("Draw Mode: Incremental Opacity");
        reloadBoard();
        $("#sketchpad").on("mousedown", function(){
            $(".square").on("mouseenter", function(){
                $(this).css({"background-color": "black", "opacity": $(this).css("opacity") * 0.75});
                $(".instructions-text").hide();
            });
        });
        disableBoardColorChange();
    });

    // get the new size, input by the user by clicking the "Change Board Size" button
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
            $("#sketchpad").empty();
            createSketchpad(sketchpadWidth);
        }
        // make sure the user entered a valid number
        else if (isNaN(newSize) || newSize < 1 || newSize > 64) {
            alert('"' + newSize + '" is not a valid NUMBER, try again.');
        }
        // otherwise, change the size of the sketchpad
        else {
            sketchpadWidth = newSize;
            $("#sketchpad").empty();
            createSketchpad(sketchpadWidth);
        };
    });

    // clears the board to default state when the "Clear Board" button is pressed
    $(".clear-button").on("click", function(){
        $("#sketchpad").empty();
        createSketchpad(sketchpadWidth);
    });
    
    // necessary to make the bootstrap buttons remove the active state class immediately after clicking them
    $(".btn").on("mouseup", function(){
        $(this).blur();
    });

})