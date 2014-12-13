var sketchpadWidth = 16;

function createSketchpad(width) {
    var squareSize = $("#sketchpad").width() / width;
    for (x = 0; x < width; x++) {
        for (i = 0; i < width; i++) {
            $("#sketchpad").append("<div class='square'></div>")
        };
        $(".square").css("width", squareSize);
        $(".square").css("height", squareSize);
    };
}

function squareSelect() {
    $(".square").hover(function(){
        $(this).addClass("square-normal");
    });
}

function clearBoard() {
    $(".square").removeClass("square-normal");
}


$(document).ready(function(){
    createSketchpad(sketchpadWidth);
    squareSelect();
    $(".clear-button").on("click", function(){
        clearBoard();
    });
});