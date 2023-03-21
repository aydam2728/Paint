var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var color = "black";
var initial = {
    X: 0,
    Y: 0
};
var shape = 'circle'
var clickState = false;
var solid = false;
var elements = []
var elementsDeleted = []

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
    console.log(elements)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    initial.X = event.clientX;
    initial.Y = event.clientY;
    clickState = true;
    if (shape == 'line') {
        ctx.beginPath();
        ctx.moveTo(event.clientX, event.clientY);
    }
});
canvas.addEventListener('mouseup', function (event) {
    clickState = false;
    if (shape == 'circle') {
        elements.push(["circle", {
            X: initial.X + (event.clientX - initial.X) / 2,
            Y: initial.Y + (event.clientY - initial.Y) / 2
        }, Math.sqrt(Math.pow(initial.X - event.clientX, 2)), color, solid]);
    } else if (shape == 'rectangle') {
        elements.push(["rectangle", initial.X, initial.Y, event.clientX - initial.X, event.clientY - initial.Y, color, solid]);
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
window.addEventListener('click', function (event) {
    // to the height of the window
    if (event.clientY > canvas.height) {
        canvas.height = event.clientY;
    }
    // to the width of the window
    if (event.clientX > canvas.width) {
        canvas.width = event.clientX;
    }
    var initial = {
        X: 0,
        Y: 0
    };
    redraw();
});




