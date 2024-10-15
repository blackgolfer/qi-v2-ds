// utils.js

/**
 * Calculates the Euclidean distance between two points.
 * @param {Object} pointA - The first point with properties x and y.
 * @param {Object} pointB - The second point with properties x and y.
 * @returns {number} - The distance between pointA and pointB.
 */
export const calculateDistance = (pointA, pointB) => {
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
};

/**
 * Determines whether three points are colinear.
 * @param {Object} p1 - First point with properties x and y.
 * @param {Object} p2 - Second point with properties x and y.
 * @param {Object} p3 - Third point with properties x and y.
 * @returns {boolean} - True if points are colinear, else false.
 */
export const areColinear = (p1, p2, p3) => {
  const area = Math.abs(
    p1.x * (p2.y - p3.y) +
    p2.x * (p3.y - p1.y) +
    p3.x * (p1.y - p2.y)
  );
  return area < 1e-6; // Threshold for floating-point precision
};

/**
 * Calculates the circumcircle of three non-colinear points.
 * @param {Object} p1 - Point with properties x and y.
 * @param {Object} p2 - Point with properties x and y.
 * @param {Object} p3 - Point with properties x and y.
 * @returns {Object|null} - Object with center {x, y} and radius, or null if points are colinear.
 */
export const calculateCircumcircle = (p1, p2, p3) => {
  if (areColinear(p1, p2, p3)) return null;

  const A = p2.x - p1.x;
  const B = p2.y - p1.y;
  const C = p3.x - p1.x;
  const D = p3.y - p1.y;

  const E = A * (p1.x + p2.x) + B * (p1.y + p2.y);
  const F = C * (p1.x + p3.x) + D * (p1.y + p3.y);
  const G = 2 * (A * D - B * C);

  if (G === 0) return null; // Prevent division by zero

  const centerX = (D * E - B * F) / G;
  const centerY = (A * F - C * E) / G;
  const radius = calculateDistance({ x: centerX, y: centerY }, p1);

  return {
    center: { x: centerX, y: centerY },
    radius: radius,
  };
};

/**
 * Reflects a point across a line defined by two other points.
 * @param {Object} point - The point to reflect with properties x and y.
 * @param {Object} lineP1 - First point defining the line with properties x and y.
 * @param {Object} lineP2 - Second point defining the line with properties x and y.
 * @returns {Object} - The reflected point with properties x and y.
 */
export const reflectPointOverLine = (point, lineP1, lineP2) => {
  const A = lineP2.y - lineP1.y;
  const B = lineP1.x - lineP2.x;
  const C = lineP2.x * lineP1.y - lineP1.x * lineP2.y;

  const denominator = A * A + B * B;
  if (denominator === 0) return { ...point }; // Line is a point

  const x = (B * (B * point.x - A * point.y) - A * C) / denominator;
  const y = (A * (-B * point.x + A * point.y) - B * C) / denominator;

  return { x, y };
};
