const canvas = document.getElementById('jsCanvas');
const ctx = canvas.getContext('2d');
const letColors = document.getElementsByClassName('letColor');
const range = document.getElementById('jsRange');
const mode = document.getElementById('jsMode');
const saveBtn = document.getElementById('jsSave');
const colorPicker = new iro.ColorPicker('#picker');
const colorPickerBlock = document.getElementById('picker');
const constColors = document.getElementsByClassName('constColor');
const colors = document.getElementsByClassName('controls__color');

let colorsList = [];
if (localStorage.getItem("colors")) {
    colorsList = JSON.parse(localStorage.getItem("colors"));
    for (let a of letColors) {
        a.style.backgroundColor = colorsList[a.id];
    }
}

let initialColor = '#2c2c2c';

if (localStorage.getItem('color')) {
    colorPicker.color.hexString = localStorage.getItem('color');
    initialColor = colorPicker.color.hexString;
}

const canvasSize = 700;

canvas.height = canvasSize;
canvas.width = canvasSize;

let dataURL = localStorage.getItem('paint');
let img = new Image();
img.src = dataURL;
img.onload = function () {
    ctx.drawImage(img, 0, 0);
};

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvasSize, canvasSize);
ctx.lineWidth = 2.5;
ctx.strokeStyle = initialColor;
ctx.fillStyle = initialColor;

let painting = false;
let filling = false;

function stopPainting(){
    painting = false;
}

function startPainting(){
    painting = true;
}

function onMouseMove(event){
    let x = event.offsetX;
    let y = event.offsetY;
    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function onMouseDown(event){
    painting = true;
}

function onMouseUp(event){
    stopPainting();
    console.log(1);
    localStorage.setItem('paint', canvas.toDataURL());
    console.log(1);
}

function changeColor() {
    let color = colorPicker.color.hexString;
    localStorage.setItem('color', color);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    replaceColors(color);
    localStorage.setItem('colors', JSON.stringify(colorsList));
}

function rangeChange(event) {
    const rangeValue = event.target.value;
    ctx.lineWidth = rangeValue;
}

function changeMode() {
    if (filling === true) {
        filling = false;
        mode.innerText = 'Заливка';
    } else {
        filling = true;
        mode.innerText = 'Рисование';
    }
}

function handleCanvasClick() {
    if (filling) {
        ctx.fillRect(0, 0, canvasSize, canvasSize);
    }
}

function handleCM(event) {
    event.preventDefault();
}

function handleSaveClick() {
    const image = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = image;
    link.download = 'PaintJS';
    link.click();
}

if (canvas) {
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseup', stopPainting);
    canvas.addEventListener('mouseleave', stopPainting);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('contextmenu', handleCM);
}

// Array.from(colors).forEach(color => color.addEventListener('click', changeColor));
colorPickerBlock.addEventListener('click', changeColor);
Array.from(constColors).forEach(color => color.addEventListener('click', getColor));
Array.from(colors).forEach(color => color.addEventListener('click', getColor));

if (range) {
    range.addEventListener('input', rangeChange);
}

if (mode) {
    mode.addEventListener('click', changeMode);
}

if (saveBtn) {
    saveBtn.addEventListener('click', handleSaveClick);
}

colorPicker.on('color:change', function(color) {
    ctx.strokeStyle = colorPicker.color.hexString;
    ctx.fillStyle = colorPicker.color.hexString;
    localStorage.setItem('color', colorPicker.color.hexString);
});

function replaceColors(color) {
    if (colorsList.length < 7) {
        colorsList.unshift(color);
    } else {
        colorsList.pop();
        colorsList.unshift(color);
    }
    for (let a of letColors) {
        a.style.backgroundColor = colorsList[a.id];
    }
}

function getColor(e) {
    const color = e.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}