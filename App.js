import React, { useRef, useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [cursor, setCursor] = useState('default');
  const [eraserActive, setEraserActive] = useState(false);
  const [eraserSize, setEraserSize] = useState(10);
  const [penSize, setPenSize] = useState(5);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [rewriteSpeed, setRewriteSpeed] = useState(7);
  const [drawingData, setDrawingData] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800; // Set a fixed width for the canvas
    canvas.height = 500; // Set a fixed height for the canvas
    canvas.style.border = '7px solid rgba(0, 255, 255, 0.7)';
    canvas.style.cursor = cursor;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = penSize;
    context.shadowBlur = 5;
    context.shadowColor = color;
    contextRef.current = context;
    const toggleGlow = () => {
     const canvas = canvasRef.current;
      canvas.classList.toggle('glowing');
};



    if (backgroundImage) {
      const bgImage = new Image();
      bgImage.src = backgroundImage;
      bgImage.onload = () => {
        context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [cursor, backgroundImage, color, penSize]);

  const startDrawing = (e) => {
    e.preventDefault();
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setDrawingData((prevData) => [...prevData, { offsetX, offsetY, move: true }]);
    canvasRef.current.classList.add('glowing');
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    canvasRef.current.classList.remove('glowing');
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;

    if (eraserActive) {
      contextRef.current.clearRect(offsetX, offsetY, eraserSize, eraserSize);
    } else {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }

    setDrawingData((prevData) => [...prevData, { offsetX, offsetY, move: false }]);
  };

  const changeColor = (newColor) => {
    setColor(newColor);
    contextRef.current.strokeStyle = newColor;
    contextRef.current.shadowColor = newColor;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setDrawingData([]);
  };

  const toggleEraser = () => {
    setEraserActive(!eraserActive);
  };

  const uploadBackground = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const applyBackground = (bgImage) => {
    setBackgroundImage(bgImage);
  };

  const rewriteDrawing = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);

    let index = 0;
    const speed = 11 - rewriteSpeed;

    const interval = setInterval(() => {
      if (index >= drawingData.length) {
        clearInterval(interval);
        return;
      }

      const point = drawingData[index];
      if (point.move) {
        context.beginPath();
        context.moveTo(point.offsetX, point.offsetY);
      } else {
        context.lineTo(point.offsetX, point.offsetY);
        context.stroke();
      }
      index++;
    }, speed);
  };

  return (
    <div className="App">
      <h1>K-Smartboard</h1>
      <div className="workspace">
        {/* Toolbar on the left side */}
        <div className="toolbar">
          <div className="color-selection">
            {[
              '#000000',
              '#FF0000',
              '#00FF00',
              '#0000FF',
              '#FFFF00',
              '#FF00FF',
              '#00FFFF',
              '#FFFFFF',
              '#FFA500',
              '#800080',
              '#008080',
            ].map((col) => (
              <button
                key={col}
                className="color-button"
                style={{ backgroundColor: col }}
                onClick={() => changeColor(col)}
              />
            ))}
          </div>

          <button className="futuristic-button" onClick={clearCanvas}>Clear All</button>
          <button className="futuristic-button" onClick={toggleEraser}>
            {eraserActive ? 'Disable Eraser' : 'Eraser'}
          </button>
          {eraserActive && (
            <label>
              Eraser Size:
              <input
                type="range"
                min="5"
                max="50"
                value={eraserSize}
                onChange={(e) => setEraserSize(e.target.value)}
              />
            </label>
          )}

          {/* Pen Size Slider */}
          <label>
            Pen Size:
            <input
              type="range"
              min="1"
              max="30"
              value={penSize}
              onChange={(e) => setPenSize(e.target.value)}
            />
          </label>

          <div className="background-toolbar">
            <button className="futuristic-button" onClick={() => applyBackground('phonics.png')}>Phonics</button>
            <button className="futuristic-button" onClick={() => applyBackground('maths.png')}>Maths</button>
            <button className="futuristic-button" onClick={() => applyBackground('writing.png')}>Writing</button>
            <button className="futuristic-button" onClick={() => setBackgroundImage(null)}>Black</button>
            <label className="upload-label">
              Upload Background:
              <input type="file" onChange={uploadBackground} />
            </label>
          </div>

          <div className="rewrite-functionality">
            <button className="futuristic-button" onClick={rewriteDrawing}>Rewrite</button>
            <label>

              <input
                type="range"
                min="1"
                max="10"
                value={rewriteSpeed}
                onChange={(e) => setRewriteSpeed(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Canvas on the right side */}
        <canvas
          ref={canvasRef}
          className="whiteboard"
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={finishDrawing}
          onTouchMove={draw}
          onTouchCancel={finishDrawing}
        />
      </div>
    </div>
  );
};

export default App;
