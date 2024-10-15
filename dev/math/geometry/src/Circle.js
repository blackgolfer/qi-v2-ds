// Circle.js

import { calculateDistance, calculateCircumcircle, reflectPointOverLine } from './utils.js';

/**
 * Represents a geometric circle or a line.
 */
class Circle {
  /**
   * Constructs a Circle or a Line.
   * @param {Object} p1 - Point with properties x and y.
   * @param {Object} p2 - Point with properties x and y.
   * @param {Object} [p3] - Third point with properties x and y (optional).
   */
  constructor(p1, p2, p3 = undefined) {
    if (p3 === undefined) {
      // Representing a simple circle
      this.center = p1;
      this.radius = p2;
      this.isLine = false;
      this.p1 = null;
      this.p2 = null;
    } else {
      // Determine if points are colinear to decide between circle and line
      const circumcircle = calculateCircumcircle(p1, p2, p3);
      if (circumcircle) {
        this.isLine = false;
        this.center = circumcircle.center;
        this.radius = circumcircle.radius;
        this.p1 = null;
        this.p2 = null;
      } else {
        // Points are colinear; represent as a line
        this.isLine = true;
        this.center = null;
        this.radius = -1;
        this.p1 = p1;
        this.p2 = p2;
      }
    }
  }

  /**
   * Determines the intersection points with another Circle or Line.
   * @param {Circle} other - Another Circle instance.
   * @returns {Array|null} - Array of intersection points or null if no intersection.
   */
  getIntersections(other) {
    if (this.isLine && other.isLine) {
      // Intersection between two lines
      return this._intersectLines(other);
    } else if (this.isLine || other.isLine) {
      // Intersection between a line and a circle
      const line = this.isLine ? this : other;
      const circle = this.isLine ? other : this;
      return this._intersectLineCircle(line, circle);
    } else {
      // Intersection between two circles
      return this._intersectCircles(other);
    }
  }

  /**
   * Intersects two lines.
   * @param {Circle} other - Another Circle instance representing a line.
   * @returns {Array|null} - Array with one intersection point or null if parallel.
   */
  _intersectLines(other) {
    const A1 = this.p2.y - this.p1.y;
    const B1 = this.p1.x - this.p2.x;
    const C1 = this.p2.x * this.p1.y - this.p1.x * this.p2.y;

    const A2 = other.p2.y - other.p1.y;
    const B2 = other.p1.x - other.p2.x;
    const C2 = other.p2.x * other.p1.y - other.p1.x * other.p2.y;

    const determinant = A1 * B2 - A2 * B1;
    if (determinant === 0) {
      // Lines are parallel
      return null;
    }

    const x = (B2 * (-C1) - B1 * (-C2)) / determinant;
    const y = (A1 * (-C2) - A2 * (-C1)) / determinant;

    return [{ x, y }];
  }

  /**
   * Intersects a line with a circle.
   * @param {Circle} line - Line instance.
   * @param {Circle} circle - Circle instance.
   * @returns {Array|null} - Array of intersection points or null if no intersection.
   */
  _intersectLineCircle(line, circle) {
    const dx = line.p2.x - line.p1.x;
    const dy = line.p2.y - line.p1.y;
    const A = dx * dx + dy * dy;
    const B = 2 * (dx * (line.p1.x - circle.center.x) + dy * (line.p1.y - circle.center.y));
    const C = (line.p1.x - circle.center.x) ** 2 + (line.p1.y - circle.center.y) ** 2 - circle.radius ** 2;
    const discriminant = B * B - 4 * A * C;

    if (discriminant < 0) return null; // No intersection

    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-B + sqrtDiscriminant) / (2 * A);
    const t2 = (-B - sqrtDiscriminant) / (2 * A);

    const intersection1 = { x: line.p1.x + t1 * dx, y: line.p1.y + t1 * dy };
    const intersection2 = { x: line.p1.x + t2 * dx, y: line.p1.y + t2 * dy };

    return discriminant === 0 ? [intersection1] : [intersection1, intersection2];
  }

  /**
   * Intersects two circles.
   * @param {Circle} other - Another Circle instance.
   * @returns {Array|null} - Array of intersection points or null if no intersection.
   */
  _intersectCircles(other) {
    const d = calculateDistance(this.center, other.center);

    // No intersection or one circle within another
    if (d > this.radius + other.radius || d < Math.abs(this.radius - other.radius) || d === 0) {
      return null;
    }

    const a = (this.radius ** 2 - other.radius ** 2 + d ** 2) / (2 * d);
    const h = Math.sqrt(this.radius ** 2 - a ** 2);
    const midX = this.center.x + (a * (other.center.x - this.center.x)) / d;
    const midY = this.center.y + (a * (other.center.y - this.center.y)) / d;

    const intersection1 = {
      x: midX + (h * (other.center.y - this.center.y)) / d,
      y: midY - (h * (other.center.x - this.center.x)) / d,
    };
    const intersection2 = {
      x: midX - (h * (other.center.y - this.center.y)) / d,
      y: midY + (h * (other.center.x - this.center.x)) / d,
    };

    return [intersection1, intersection2];
  }

  /**
   * Reflects a point over this circle or line.
   * @param {Object} point - The point to reflect with properties x and y.
   * @returns {Object|null} - Reflected point or null if reflection is undefined.
   */
  reflect(point) {
    if (this.isLine && this.p1 && this.p2) {
      // Reflect point over a line
      return reflectPointOverLine(point, this.p1, this.p2);
    } else if (!this.isLine && this.center) {
      // Reflect point over a circle (inversion)
      const dx = point.x - this.center.x;
      const dy = point.y - this.center.y;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared === 0) return null; // Undefined reflection
      const scale = (this.radius * this.radius) / distanceSquared;
      return {
        x: this.center.x + dx * scale,
        y: this.center.y + dy * scale,
      };
    }
    return null;
  }

  /**
   * Renders the circle or line on the given canvas context.
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
   */
  render(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.isLine ? 'black' : 'red';
    if (this.isLine) {
      ctx.moveTo(this.p1.x, this.p1.y);
      ctx.lineTo(this.p2.x, this.p2.y);
    } else if (this.center && this.radius > 0) {
      ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    }
    ctx.stroke();
  }
}

export default Circle;
