// main.js

import PointManager from './PointManager.js';
import CanvasManager from './CanvasManager.js';

// Wait for the DOM to load
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasManager.shouldRender = true;
    canvasManager.render();
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // Initial resize

  // Initialize points (example with three points forming a triangle)
  const initialPoints = [
    { x: canvas.width / 2, y: canvas.height * 0.2 },
    { x: canvas.width * 0.3, y: canvas.height * 0.8 },
    { x: canvas.width * 0.7, y: canvas.height * 0.8 },
  ];

  const pointManager = new PointManager(initialPoints, 8);
  const canvasManager = new CanvasManager(canvas, pointManager);
});
