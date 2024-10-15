// PointManager.js

import { calculateDistance } from './utils.js';

/**
 * Manages a collection of points, their interactions, and rendering.
 */
class PointManager {
  /**
   * Constructs a PointManager.
   * @param {Array} initialPoints - Array of initial points with properties x and y.
   * @param {number} radius - Radius for rendering points.
   */
  constructor(initialPoints, radius = 10) {
    this.points = initialPoints.map((point, index) => ({ ...point, id: index }));
    this.radius = radius;
    this.draggedPointId = null;
  }

  /**
   * Updates the position of a point.
   * @param {number} pointId - The ID of the point to update.
   * @param {number} newX - The new x-coordinate.
   * @param {number} newY - The new y-coordinate.
   */
  updatePointPosition(pointId, newX, newY) {
    this.points = this.points.map(point =>
      point.id === pointId ? { ...point, x: newX, y: newY } : point
    );
  }

  /**
   * Finds the nearest point to a given position within a threshold.
   * @param {Object} pos - The position with properties x and y.
   * @param {number} threshold - The maximum distance to consider.
   * @returns {Object|null} - The nearest point or null if none within threshold.
   */
  findNearestPoint(pos, threshold = 10) {
    let nearest = null;
    let minDist = Infinity;

    this.points.forEach(point => {
      const dist = calculateDistance(pos, point);
      if (dist < minDist && dist < threshold) {
        minDist = dist;
        nearest = point;
      }
    });

    return nearest;
  }

  /**
   * Renders all points on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
   */
  renderPoints(ctx) {
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    this.points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }
}

export default PointManager;
