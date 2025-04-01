// Elementos del DOM
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear-btn');
const predictBtn = document.getElementById('predict-btn');
const resultDiv = document.getElementById('result');

// Configuración inicial del canvas
function initCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round'; // Para líneas más suaves
}

// Variables de estado
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// ========================
// Funciones de dibujo
// ========================

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
}

function draw(e) {
    if (!isDrawing) return;
    
    const [x, y] = getPosition(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
}

// Función auxiliar para obtener posición (soporta touch)
function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if (e.type.includes('touch')) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.offsetX;
        y = e.offsetY;
    }
    
    return [x, y];
}

// ========================
// Event Listeners
// ========================

// Eventos de ratón
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Eventos táctiles (para móviles)
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e);
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
});
canvas.addEventListener('touchend', stopDrawing);

// Botón de borrado
clearBtn.addEventListener('click', () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    resultDiv.textContent = 'Draw a number (0-9)';
    resultDiv.style.color = '#333'; // Restablecer color
});

// ========================
// Lógica de predicción
// ========================

predictBtn.addEventListener('click', async () => {
    if (isCanvasEmpty()) {
        resultDiv.textContent = 'Please draw a number first';
        resultDiv.style.color = '#ea4335';
        return;
    }

    resultDiv.textContent = 'Prosessing...';
    resultDiv.style.color = '#333';

    try {
        // 1. Preparar imagen
        const imageData = prepareImageForModel();
        
        // 2. Enviar al backend
        const prediction = await sendToBackend(imageData);
        
        // 3. Mostrar resultado
        resultDiv.textContent = `Prediction: ${prediction}`;
        resultDiv.style.color = '#4285f4';
        
    } catch (error) {
        console.error('Error:', error);
        resultDiv.textContent = 'Error connecting to the server';  
        resultDiv.style.color = '#ea4335';
    }
});

// Función para verificar si el canvas está vacío
function isCanvasEmpty() {
    const pixelBuffer = new Uint32Array(
        ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
    return !pixelBuffer.some(color => color !== 0xFF000000);
}

// Preparar imagen para el modelo (28x28 en escala de grises)
function prepareImageForModel() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Redimensionar a 28x28
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    
    tempCtx.filter = 'grayscale(100%)';
    tempCtx.drawImage(canvas, 0, 0, 28, 28);
    
    return tempCanvas.toDataURL('image/png');
}

// Enviar imagen al backend
async function sendToBackend(imageData) {
    const blob = await fetch(imageData).then(res => res.blob());
    const formData = new FormData();
    formData.append('file', blob, 'digit.png');
    
    const response = await fetch('http://127.0.0.1:3000/predict', {
        method: 'POST',
        body: formData,
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.prediction;
}

initCanvas();