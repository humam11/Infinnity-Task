const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('canvas');
canvas.width = canvasContainer.clientWidth;
canvas.height = canvasContainer.clientHeight;
const ctx = canvas.getContext('2d');
const figureButtons = document.querySelectorAll('.figure-button');
const colorSelect = document.getElementById('color');
const clearButton = document.getElementById('clear-button');
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button');

let currentFigure = 'circle';
let currentColor = 'red';
let figures = [];

    
function generateFigureSymbol(id) {
      switch (id) {
        case 'circle':
          return '&#11044;';
        case 'square':
          return '&#11200;';
        case 'triangle':
          return '&#9650;';
        case 'pentagon':
          return '&#11039';
        case 'star':
          return '&#9733;';
        case 'heart':
          return '&#9829;';
        case 'diamond':
          return '&#11201;';
        case 'arrow':
          return '&#129093;';
        default:
          return '&#11044;';
      }
    }

figureButtons.forEach(button => {
    button.innerHTML = generateFigureSymbol(button.id);
});
        
function setActiveFigureButton(buttonId) {
    figureButtons.forEach(button => {
    if (button.id === buttonId) {
        button.classList.add('active');
        button.style.backgroundColor = '#007bff';
    } else {
        button.classList.remove('active');
        button.style.backgroundColor = currentColor;
    }
    });
}
        
function drawOrRedrawFigure(x, y, figureType, color) {
    ctx.fillStyle = color;
      
      if (figureType === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
      } else if (figureType === 'square') {
        ctx.beginPath();
        ctx.fillRect(x - 20, y - 20, 40, 40);
      } else if (figureType === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x + 20, y + 20);
        ctx.lineTo(x - 20, y + 20);
      } else if (figureType === 'pentagon') {
        ctx.beginPath();
        const sideLength = 30;
        ctx.moveTo(x, y - 30);
        for (let i = 1; i <= 5; i++) {
          const angle = (i * 2 * Math.PI) / 5;
          const px = x + sideLength * Math.sin(angle);
          const py = y - sideLength * Math.cos(angle);
          ctx.lineTo(px, py);
        }
      } else if (figureType === 'star') {
        ctx.beginPath();
        const outerRadius = 25;
        const innerRadius = 10;
        const spikes = 5;

        const rot = (Math.PI / 2) * 3;

        for (let i = 0; i < spikes; i++) {
          const x1 = x + Math.cos(rot + (i * Math.PI * 2) / spikes) * outerRadius;
          const y1 = y + Math.sin(rot + (i * Math.PI * 2) / spikes) * outerRadius;
          ctx.lineTo(x1, y1);

          const x2 = x + Math.cos(rot + Math.PI / spikes + (i * Math.PI * 2) / spikes) * innerRadius;
          const y2 = y + Math.sin(rot + Math.PI / spikes + (i * Math.PI * 2) / spikes) * innerRadius;
          ctx.lineTo(x2, y2);
        }

        ctx.closePath();
      } else if (figureType === 'heart') {
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let t = 0; t < 2 * Math.PI; t += 0.01) {
          const xCoord = 16 * Math.pow(Math.sin(t), 3);
          const yCoord = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
          ctx.lineTo(x + xCoord, y - yCoord);
        }
      } else if (figureType === 'diamond') {
        ctx.beginPath();
        const size = 20;
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size, y);
        ctx.closePath();
      } else if (figureType === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(x, y - 30);
        ctx.lineTo(x + 10, y - 10);
        ctx.lineTo(x + 5, y - 10);
        ctx.lineTo(x + 5, y);
        ctx.lineTo(x - 5, y);
        ctx.lineTo(x - 5, y - 10);
        ctx.lineTo(x - 10, y - 10);
        ctx.closePath();
      }
      
      ctx.fill();
    }

canvas.addEventListener('mousedown', (e) => {
    if (e.which != 1) return false;
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    drawOrRedrawFigure(x, y, currentFigure, currentColor);
    figures.push({ figure: currentFigure, x, y, color: currentColor });
    redoStack = [];
});


    
figureButtons.forEach(button => {
    button.addEventListener('click', () => {
    setActiveFigureButton(button.id);
    currentFigure = button.id.replace('-button', '');
    });
});
    
colorSelect.addEventListener('change', () => {
    currentColor = colorSelect.value;
    setActiveFigureButton(document.querySelector('.figure-button.active').id);
});
    
let backup = null;

clearButton.addEventListener('click', () => {
    backup = {
        imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
        figures: figures.slice(),
        redoStack: redoStack.slice(),
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    figures = [];
    redoStack = [];
});

undoButton.addEventListener('click', () => {
    if (figures.length > 0) {
        redoStack.push(figures.pop());
        redraw();
    } else if (backup) {
        ctx.putImageData(backup.imageData, 0, 0);
        figures = backup.figures.slice();
        redoStack = backup.redoStack.slice();
        backup = null;
    }
});

redoButton.addEventListener('click', () => {
    if (redoStack.length > 0) {
        figures.push(redoStack.pop());
        redraw();
    }
});

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    figures.forEach(figure => {
        drawOrRedrawFigure(figure.x, figure.y, figure.figure, figure.color);
    });
}
