var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var color = "black";
var initial = {
    X: 0,
    Y: 0
};
var imageLoaded = false;
var shape = 'rectangle'
var clickState = false;
var resizing = false;
var reziseMode = null;
var solid = false;
var elements = []
var elementsDeleted = []
var lastClick = null;

function erase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function circle(initial, radius) {
    ctx.beginPath();
    ctx.arc(initial.X, initial.Y, radius, 0, 2 * Math.PI);
    if (solid) {
        ctx.fillStyle = color;
        ctx.fill();
    }
    ctx.stroke();
}

function rectangle(initial, second) {
    ctx.beginPath();
    ctx.rect(initial.X, initial.Y, second.X, second.Y);
    if (solid) {
        ctx.fillStyle = color;
        ctx.fill();
    }
    ctx.stroke();
}

function line(event) {
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (imageLoaded != false){
        loadFromPNG(imageLoaded.src);
    }
    for (var i = 0; i < elements.length; i++) {
        if (elements[i][0] == "rectangle") {
            first = {
                X: elements[i][1],
                Y: elements[i][2]
            };
            second = {
                X: elements[i][3],
                Y: elements[i][4]
            };
            color = elements[i][5];
            solid = elements[i][6];
            rectangle(first, second);
        } else if (elements[i][0] == "circle") {
            color = elements[i][3];
            solid = elements[i][4];
            circle(elements[i][1], elements[i][2]);
        }

    }
    solid = false;
    color = "black";
}

canvas.addEventListener('mousedown', function (event) {


        if (event.button == 0) {
            initial.X = event.clientX;
            initial.Y = event.clientY;
            clickState = true;
            if (shape == 'line') {
                ctx.beginPath();
                ctx.moveTo(event.clientX, event.clientY);
            }
        }else{
            clickState = false;
        }


});
canvas.addEventListener('mouseup', function (event) {

        clickState = false;
        if (lastClick != "right click" && event.button == 0) {
            if (shape == 'circle') {
                elements.push(["circle", {
                    X: initial.X + (event.clientX - initial.X) / 2,
                    Y: initial.Y + (event.clientY - initial.Y) / 2
                }, Math.sqrt(Math.pow(initial.X - event.clientX, 2)), color, solid]);
            } else if (shape == 'rectangle') {
                elements.push(["rectangle", initial.X, initial.Y, event.clientX - initial.X, event.clientY - initial.Y, color, solid]);
            }
        }else {
            lastClick = null;
        }
});

canvas.addEventListener('mousemove', function (event) {
    if (clickState) {
        if (shape == 'circle') {
            redraw();
            circle({
                X: initial.X + (event.clientX - initial.X) / 2,
                Y: initial.Y + (event.clientY - initial.Y) / 2
            }, Math.sqrt(Math.pow(initial.X - event.clientX, 2)));
        } else if (shape == 'rectangle') {
            redraw();
            rectangle(initial, {X: event.clientX - initial.X, Y: event.clientY - initial.Y});
        } else if (shape == 'line') {
            line(event);
        }
    }
});
// erase current shape on right click
canvas.addEventListener('contextmenu', function (event) {
    if (event.button == 2) {
        console.log("right click");
            lastClick = "right click";
            clickState = false;
            redraw();
    }
});


window.addEventListener('keydown', function (event) {

    if (event.ctrlKey && event.key === 'z') {
        elementsDeleted.push(elements.pop());
        redraw();
    }

    if (event.ctrlKey && event.key === 'y') {
        elements.push(elementsDeleted.pop());
        redraw();
    }
});

// resize the canvas to mouse position on bottom canvas click from window event
window.addEventListener('mousemove', function (event) {
    // if mouse on the screen but not on the canvas
    if (event.clientX > canvas.width || event.clientY > canvas.height) {
        if (event.clientY > canvas.height - 10 && event.clientY < canvas.height + 10 && event.clientX > canvas.width / 2 - 10 && event.clientX < canvas.width / 2 + 10) {
            canvas.style.cursor = "s-resize";
        } else if (event.clientX > canvas.width - 10 && event.clientX < canvas.width + 10 && event.clientY > canvas.height / 2 - 10 && event.clientY < canvas.height / 2 + 10) {
            canvas.style.cursor = "e-resize";
        } else if (event.clientX > canvas.width - 10 && event.clientX < canvas.width + 10 && event.clientY > canvas.height - 10 && event.clientY < canvas.height + 10) {
            canvas.style.cursor = "se-resize";
        } else {
            canvas.style.cursor = "default";
        }
        console.log(reziseMode)
        // to the height of the window
        if (resizing) {
            // if mouse on the middle bottom of the canvas resize the canvas to bottom
            switch (reziseMode) {
                case "bottom":
                    canvas.height = event.clientY;
                    break;
                case "right":
                    canvas.width = event.clientX;
                    break;
                case "both":
                    canvas.height = event.clientY;
                    canvas.width = event.clientX;
                    break;
            }

            redraw();
        }
    }
});

function exportToPNG() {
    // get the data from canvas as 70% JPG (can be also PNG, etc.)
    var dataURL = canvas.toDataURL('image/png', 1.0);
    console.log(dataURL);
}
function loadFromPNG(dataURL) {
    // get the data from canvas as 70% JPG (can be also PNG, etc.)
    imageLoaded = new Image();
    imageLoaded.src=dataURL;
    imageLoaded.onload = function() {
        ctx.drawImage(imageLoaded, 0, 0);
    };

}

window.addEventListener('mouseup', function (event) {
    // if mouse on the screen but not on the canvas
    if (event.clientX > canvas.width || event.clientY > canvas.height) {
    resizing = false;
    reziseMode = null;
    }
});
window.addEventListener('mousedown', function (event) {
    // if mouse on the screen but not on the canvas
    if (event.clientX > canvas.width || event.clientY > canvas.height) {
        resizing = true;
        if (event.clientY > canvas.height - 10 && event.clientY < canvas.height + 10 && event.clientX > canvas.width / 2 - 10 && event.clientX < canvas.width / 2 + 10) {
            reziseMode = "bottom";
        } else if (event.clientX > canvas.width - 10 && event.clientX < canvas.width + 10 && event.clientY > canvas.height / 2 - 10 && event.clientY < canvas.height / 2 + 10) {
            reziseMode = "right";
        } else if (event.clientX > canvas.width - 10 && event.clientX < canvas.width + 10 && event.clientY > canvas.height - 10 && event.clientY < canvas.height + 10) {
            reziseMode = "both";
        }
    }
});
window.addEventListener('click', function (event) {
    resizing = false;
});



