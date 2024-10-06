// Initialize the canvas using Fabric.js
const canvas = new fabric.Canvas('c');

// Enable free drawing mode
canvas.isDrawingMode = true;
canvas.freeDrawingBrush.width = 5;
canvas.freeDrawingBrush.color = "#000000";

// Clear canvas function
document.getElementById("clearBtn").addEventListener("click", () => {
    canvas.clear();
});
