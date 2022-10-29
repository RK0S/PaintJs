const canvas = document.getElementById('jsCanvas');
const ctx = canvas.getContext('2d');
const colors = document.getElementsByClassName('jsColor');
const range = document.getElementById('jsRange');
const mode = document.getElementById('jsMode');
const saveBtn = document.getElementById('jsSave');

const initialColor = '#2c2c2c';
const canvasSize = 700;

canvas.height = canvasSize;
canvas.width = canvasSize;

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
}

function changeColor(event) {
    let color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
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

Array.from(colors).forEach(color => color.addEventListener('click', changeColor));

if (range) {
    range.addEventListener('input', rangeChange);
}

if (mode) {
    mode.addEventListener('click', changeMode);
}

if (saveBtn) {
    saveBtn.addEventListener('click', handleSaveClick);
}