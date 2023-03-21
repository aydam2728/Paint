var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var color= "black";
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

function circle(initial,radius) {
    ctx.beginPath();
    ctx.arc(initial.X, initial.Y, radius, 0, 2 * Math.PI);
    if (solid){
        ctx.fillStyle = color;
        ctx.fill();
    }
    ctx.stroke();
}

function rectangle(initial,second) {
    ctx.beginPath();
    ctx.rect(initial.X, initial.Y, second.X, second.Y);
    if (solid){
        ctx.fillStyle = color;
        ctx.fill();
    }
    ctx.stroke();
}

function line(event) {
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(200, 100);
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
        }
        else if (elements[i][0] == "circle") {
            color = elements[i][3];
            solid = elements[i][4];
            circle(elements[i][1],elements[i][2]);
        }

    }
    solid = false;
    color = "black";
}

canvas.addEventListener('mousedown', function (event) {
    initial.X = event.clientX;
    initial.Y = event.clientY;
    clickState = true;
});
canvas.addEventListener('mouseup', function (event) {
    clickState = false;
    if(shape == 'circle'){
        elements.push(["circle", {
            X: initial.X + (event.clientX-initial.X)/2,
            Y: initial.Y + (event.clientY-initial.Y)/2
        }, Math.sqrt(Math.pow(initial.X-event.clientX,2)), color,solid]);
    }else{
    elements.push(["rectangle", initial.X, initial.Y, event.clientX-initial.X, event.clientY-initial.Y, color,solid]);
    }
});

canvas.addEventListener('mousemove', function (event) {
    if (clickState){
        redraw();
        if(shape == 'circle'){
            circle({
                X: initial.X + (event.clientX-initial.X)/2,
                Y: initial.Y + (event.clientY-initial.Y)/2
            }, Math.sqrt(Math.pow(initial.X-event.clientX,2)));
        }else {
            rectangle(initial, {X: event.clientX-initial.X, Y: event.clientY-initial.Y});
        }
    }
});

window.addEventListener('keydown', function (event) {

    if (event.ctrlKey && event.key === 'z'){
        elementsDeleted.push(elements.pop());
        redraw();
    }
    if (event.ctrlKey && event.key === 'y'){
        elements.push(elementsDeleted.pop());
        redraw();
    }
});


