const canvas = document.getElementById('jsCanvas');
const ctx = canvas.getContext('2d');
const lastColors = document.getElementsByClassName('last-color');
const range = document.getElementById('jsRange');
const colorPicker = new iro.ColorPicker('#picker', {width: 200,});
const colorPickerBlock = document.getElementById('picker');
const colors = document.getElementsByClassName('color');
let currentColor = document.getElementById('current-color');
const findColorBtn = document.querySelector('.find-color__btn');
const findColorInput = document.querySelector('.find-color__input');
const drawingBtn = document.getElementById('drawing');
const rullerBtn = document.getElementById('ruller');
const fillBg = document.getElementById('fill-bg');
const getPixelBtn = document.getElementById('get-pixel');
const backBtn = document.getElementById('backCanvas');
const saveBtn = document.getElementById('save');
const arrInputs = document.getElementsByName('color__post');
const arrLi = document.getElementsByName('color__get');
const arrGetInputs = document.getElementsByName('color__get__input');

canvas.height = 750;
canvas.width = 800;

let canvases = [];
let currentCanvas;

if (localStorage.getItem('currentCanvas') !== null) {
    currentCanvas = localStorage.getItem('currentCanvas');
    let img = new Image();
    img.src = currentCanvas;
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
    };
    canvases.push(currentCanvas);
} else {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 800, 750);
    ctx.fillStyle = currentColor.style.backgroundColor;
    currentCanvas = canvas.toDataURL();
    setCanvas();
    canvases.push(currentCanvas);
}

ctx.fillStyle = currentColor.style.backgroundColor;
ctx.lineWidth = 5;
ctx.strokeStyle = currentColor.style.backgroundColor;

let painting = false;

function stopPainting() {
    painting = false;
    fillArr();
    checkArrows();
    setCanvas();
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
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

function onMouseDown() {
    painting = true;
}

if (canvas) {
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', stopPainting);
    canvas.addEventListener('mouseleave', stopPainting);
}

//Colors

function getColor(e) {
    const color = e.target.style.backgroundColor;
    if (color !== '') {
        ChangeCurrentColor(color);
    }
}

Array.from(colors).forEach((color) =>
    color.addEventListener('click', getColor)
);

colorPicker.on('color:change', function () {
    let color = colorPicker.color.hexString;
    ChangeCurrentColor(color);
});

//Last colors

let arrLastColors = [];

function changeColor() {
    let color = colorPicker.color.hexString;
    if (color !== arrLastColors[0]) {
        replaceColors(color);
    }
}

function replaceColors(color) {
    if (color !== arrLastColors[0]) {
        if (arrLastColors.length < 4) {
            arrLastColors.unshift(color);
        } else {
            arrLastColors.pop();
            arrLastColors.unshift(color);
        }
        for (let a of lastColors) {
            a.style.backgroundColor = arrLastColors[a.id.replace(/[^0-9]/g, '')];
        }
    }
}

colorPickerBlock.addEventListener('click', changeColor);

//Change currnet color

function ChangeCurrentColor(color) {
    currentColor.style.backgroundColor = color;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

//Find color

function findColor() {
    if (findColorInput.value.match(/#[a-f0-9]{6}\b|#[a-f0-9]{3}\b/gi)) {
        colorPicker.color.hexString = findColorInput.value;
        changeColor();
    } else {
        alert('Неверный цвет');
        findColorInput.value = '';
    }
}

findColorBtn.addEventListener('click', findColor);

//Range color

function rangeChange(event) {
    const rangeValue = event.target.value;
    ctx.lineWidth = rangeValue;
}

range.addEventListener('input', rangeChange);

//Tools

rullerBtn.addEventListener('click', function () {
    let color = '#ffffff';
    ChangeCurrentColor(color);
});

drawingBtn.addEventListener('click', function () {
    let color = arrLastColors[0];
    ChangeCurrentColor(color);
});

//Fill background

fillBg.addEventListener('click', function () {
    ctx.fillRect(0, 0, 800, 750);
    fillArr();
    checkArrows();
    setCanvas();
});

//Pipette

function pick(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let data = ctx.getImageData(x, y, 1, 1).data;
    let rgb = [ data[0], data[1], data[2]];

    canvas.removeEventListener('click', pick);

    let hex = rgbToHex(rgb[0], rgb[1], rgb[2]);

    ChangeCurrentColor(hex);
    replaceColors(hex);
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

getPixelBtn.addEventListener('click', getPixel);

function getPixel() {
    canvas.addEventListener('click', pick);  
}

//Actions

function setCanvas() {
    currentCanvas = canvas.toDataURL();
    localStorage.setItem('currentCanvas', currentCanvas);
}


function fillArr() {
    let currentCanvas = canvas.toDataURL();
    if (canvases[0] !== currentCanvas && canvases[1] !== currentCanvas) {
        if (canvases.length > 1) {
            canvases.shift();
            canvases.push(currentCanvas);
        } else {
            canvases.push(currentCanvas);
        }
    }
}

checkArrows();

function checkArrows () {
    if (canvases.length == 2) {
        backBtn.addEventListener('click', forArrows);
        backBtn.style.color = 'rgba(0, 0, 0, 0.7)';
    }  
}

function forArrows() {
    let img = new Image();
    img.src = canvases[0];
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
    };
    canvases.reverse();

    if (backBtn.innerHTML == 'Отменить действие') {
        backBtn.innerText = 'Вернуть действие';
    } else {
        backBtn.innerText= 'Отменить действие';
    }
}  

//Savebtn

saveBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = currentCanvas;
    link.download = 'PaintJS';
    link.click();
});

//Choosed colors

let arrChoosedColors;

if (localStorage.getItem('choosedColors') !== null) {
    arrChoosedColors = JSON.parse(localStorage.getItem('choosedColors'));
    changeChoosedColors();
} else {
    arrChoosedColors = [];
}

arrInputs.forEach(el => {
    el.onclick = function() {
        let color = el.parentElement.style.backgroundColor;
        color = color.replace(/[^0-9 ]/g, '');
        color = color.split(' ').map(Number);
        if (color.length == 3) {
            let hex = rgbToHex(color[0], color[1], color[2]);
            if (arrChoosedColors.length < 8 && !arrChoosedColors.some((i) => i === hex)) {
                arrChoosedColors.push(hex);
                changeChoosedColors();
            }
        }
    };
});

function changeChoosedColors () {
    for (let a of arrLi) {
        if (arrChoosedColors[a.id.replace(/[^0-9]/g, '')]) {
            a.style.backgroundColor = arrChoosedColors[a.id.replace(/[^0-9]/g, '')];
        } else {
            a.style.backgroundColor = '';
        }
    }  
    localStorage.setItem('choosedColors', JSON.stringify(arrChoosedColors));
}

arrGetInputs.forEach(el => {
    el.onclick = function () {
        let color = el.parentElement.style.backgroundColor;
        color = color.replace(/[^0-9 ]/g, '');
        color = color.split(' ').map(Number);
        if (color.length == 3) {
            let hex = rgbToHex(color[0], color[1], color[2]);

            const index = arrChoosedColors.indexOf(hex);
            if (index > -1) { 
                arrChoosedColors.splice(index, 1); 
            }
            changeChoosedColors();
            replaceColors(hex);
        }
    };
});