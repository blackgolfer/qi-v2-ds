// CanvasManager.js

import Circle from './Circle.js';
import PointManager from './PointManager.js';
import { calculateCircumcircle } from './utils.js';

/**
 * Manages the canvas, rendering, and interactions.
 */
class CanvasManager {
  /**
   * Constructs a CanvasManager.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {PointManager} pointManager - Instance of PointManager.
   */
  constructor(canvas, pointManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.pointManager = pointManager;
    this.shouldRender = true;

    // Event Binding
    this._bindEvents();

    // Initial Rendering
    this.render();
  }

  /**
   * Binds necessary events to the canvas.
   */
  _bindEvents() {
    this.canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this._handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseout', this._handleMouseOut.bind(this));

    // Touch Events
    this.canvas.addEventListener('touchstart', this._handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this._handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this._handleTouchEnd.bind(this), { passive: false });
  }

  /**
   * Handles mouse down events.
   * @param {MouseEvent} event
   */
  _handleMouseDown(event) {
    event.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const pos = {
      x: (event.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (event.clientY - rect.top) * (this.canvas.height / rect.height),
    };
    const nearest = this.pointManager.findNearestPoint(pos);
    if (nearest) {
      this.pointManager.draggedPointId = nearest.id;
      this.shouldRender = true;
      this.render();
    }
  }

  /**
   * Handles mouse move events.
   * @param {MouseEvent} event
   */
  _handleMouseMove(event) {
    if (this.pointManager.draggedPointId === null) return;
    event.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const pos = {
      x: (event.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (event.clientY - rect.top) * (this.canvas.height / rect.height),
    };
    this.pointManager.updatePointPosition(this.pointManager.draggedPointId, pos.x, pos.y);
    this.shouldRender = true;
    this.render();
  }

  /**
   * Handles mouse up events.
   * @param {MouseEvent} event
   */
  _handleMouseUp(event) {
    if (this.pointManager.draggedPointId !== null) {
      this.pointManager.draggedPointId = null;
      this.shouldRender = true;
      this.render();
    }
  }

  /**
   * Handles mouse out events.
   * @param {MouseEvent} event
   */
  _handleMouseOut(event) {
    if (this.pointManager.draggedPointId !== null) {
      this.pointManager.draggedPointId = null;
      this.shouldRender = true;
      this.render();
    }
  }

  /**
   * Handles touch start events.
   * @param {TouchEvent} event
   */
  _handleTouchStart(event) {
    event.preventDefault();
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const pos = {
        x: (touch.clientX - rect.left) * (this.canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (this.canvas.height / rect.height),
      };
      const nearest = this.pointManager.findNearestPoint(pos);
      if (nearest) {
        this.pointManager.draggedPointId = nearest.id;
        this.shouldRender = true;
        this.render();
      }
    }
  }

  /**
   * Handles touch move events.
   * @param {TouchEvent} event
   */
  _handleTouchMove(event) {
    if (this.pointManager.draggedPointId === null) return;
    event.preventDefault();
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const pos = {
        x: (touch.clientX - rect.left) * (this.canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (this.canvas.height / rect.height),
      };
      this.pointManager.updatePointPosition(this.pointManager.draggedPointId, pos.x, pos.y);
      this.shouldRender = true;
      this.render();
    }
  }

  /**
   * Handles touch end events.
   * @param {TouchEvent} event
   */
  _handleTouchEnd(event) {
    if (this.pointManager.draggedPointId !== null) {
      this.pointManager.draggedPointId = null;
      this.shouldRender = true;
      this.render();
    }
  }

  /**
   * Clears the canvas.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Renders the current state on the canvas.
   */
  render() {
    if (!this.shouldRender) return;

    this.clearCanvas();

    // Render Points
    this.pointManager.renderPoints(this.ctx);

    // Example: Render a circumcircle based on initial points
    if (this.pointManager.points.length >= 3) {
      const [p1, p2, p3] = this.pointManager.points;
      const circumcircle = calculateCircumcircle(p1, p2, p3);
      if (circumcircle) {
        const circle = new Circle(p1, p2, p3);
        circle.render(this.ctx);
      }
    }

    this.shouldRender = false;
  }
}

export default CanvasManager;
