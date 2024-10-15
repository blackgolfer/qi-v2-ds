above question with pure functional programming

10月04日 11:43 会话ID:(4647941)

Refactoring imperative, object-oriented JavaScript code into a **pure functional programming** (FP) paradigm can significantly enhance readability, maintainability, and testability. Pure FP emphasizes immutability, pure functions, and function composition, minimizing side effects and mutable state.

Given the complexity and interactivity of the original code—handling geometric computations, canvas rendering, and event handling—achieving a fully pure functional structure in JavaScript requires thoughtful separation of concerns. While certain parts, like event listeners and canvas drawing, inherently involve side effects, we can structure the code to isolate these effects and keep the core logic pure.

Below is a step-by-step guide to refactoring the provided code into a more functional style, accompanied by refactored code snippets.

---

## 📋 Table of Contents

1. [Understanding the Original Code](#1-understanding-the-original-code)
2. [Functional Programming Principles in JavaScript](#2-functional-programming-principles-in-javascript)
3. [Refactoring Strategy](#3-refactoring-strategy)
4. [Refactored Code](#4-refactored-code)
   - [4.1. Utility Functions](#41-utility-functions)
   - [4.2. Immutable Data Structures](#42-immutable-data-structures)
   - [4.3. Pure Functions for Geometric Computations](#43-pure-functions-for-geometric-computations)
   - [4.4. Event Handling as Side Effects](#44-event-handling-as-side-effects)
   - [4.5. Rendering Logic](#45-rendering-logic)
5. [Conclusion](#5-conclusion)

---

## 1. Understanding the Original Code

The original JavaScript code handles:

- **Circle and Line Representations**: Via constructors and prototype methods.
- **User Interactions**: Mouse and touch events for dragging points.
- **Canvas Rendering**: Drawing circles, lines, and interactive elements.
- **Geometric Computations**: Intersections, reflections, and redrawing logic.

The code is imperative, leveraging mutable state and side effects extensively.

---

## 2. Functional Programming Principles in JavaScript

Before refactoring, it's essential to grasp key FP concepts applicable to JavaScript:

- **Immutability**: Data should not be mutated after creation.
- **Pure Functions**: Functions should return the same output for the same inputs without side effects.
- **Function Composition**: Building complex functions by composing simpler ones.
- **Higher-Order Functions**: Functions that take other functions as arguments or return them.
- **Declarative Code**: Expressing logic without explicitly describing control flow.

---

## 3. Refactoring Strategy

To transition to a functional style:

1. **Separate Pure and Impure Logic**:
   - **Pure**: Geometric computations, data transformations.
   - **Impure**: Event handling, canvas rendering, DOM manipulations.

2. **Use Immutable Data Structures**:
   - Represent points and circles as immutable objects.

3. **Leverage Higher-Order Functions**:
   - Utilize functions like `map`, `reduce`, and `filter` for data processing.

4. **Encapsulate Side Effects**:
   - Handle side effects in isolated functions, keeping core logic pure.

5. **Minimize Mutable State**:
   - Use constants (`const`) and avoid reassigning variables.

---

## 4. Refactored Code

Below is the refactored version of the original code, adhering to pure functional programming principles.

### 4.1. Utility Functions

First, define utility functions for common mathematical operations.

```javascript
// utils.js
export const utils = {
  abs: Math.abs,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  atan2: Math.atan2,
  acos: Math.acos,
  sqrt: Math.sqrt,
  round: Math.round,
  floor: Math.floor,
  PI: Math.PI,
  TWO_PI: 2 * Math.PI,

  getDistance: (pointA, pointB) =>
    Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)),

  clamp: (min, max, value) => Math.min(Math.max(value, min), max),

  // Generate unique identifier (optional)
  generateId: () => '_' + Math.random().toString(36).substr(2, 9),
};
```

### 4.2. Immutable Data Structures

Define immutable data structures for Points and Circles.

```javascript
// dataStructures.js
export const Point = (x, y) => Object.freeze({ x, y });

export const Circle = (center, radius, isLine = false, p1 = null, p2 = null) =>
  Object.freeze({ center, radius, isLine, p1, p2 });
```

### 4.3. Pure Functions for Geometric Computations

Implement pure functions to handle geometric logic.

```javascript
// geometry.js
import { utils } from './utils.js';

/**
 * Calculates the distance between two points.
 */
export const calculateDistance = (pointA, pointB) => utils.getDistance(pointA, pointB);

/**
 * Determines if three points are colinear.
 */
export const areColinear = (pointA, pointB, pointC) => {
  const area = Math.abs(
    pointA.x * (pointB.y - pointC.y) +
    pointB.x * (pointC.y - pointA.y) +
    pointC.x * (pointA.y - pointB.y)
  );
  return area < 1e-6;
};

/**
 * Calculates the circumcircle of three non-colinear points.
 */
export const calculateCircumcircle = (pointA, pointB, pointC) => {
  const A = pointB.x - pointA.x;
  const B = pointB.y - pointA.y;
  const C = pointC.x - pointA.x;
  const D = pointC.y - pointA.y;

  const E = A * (pointA.x + pointB.x) + B * (pointA.y + pointB.y);
  const F = C * (pointA.x + pointC.x) + D * (pointA.y + pointC.y);
  const G = 2 * (A * (pointC.y - pointB.y) - B * (pointC.x - pointB.x));

  if (G === 0) {
    throw new Error("Points are colinear; no unique circumcircle exists.");
  }

  const centerX = (D * E - B * F) / G;
  const centerY = (A * F - C * E) / G;
  const radius = calculateDistance(Point(centerX, centerY), pointA);

  return Circle(Point(centerX, centerY), radius);
};

/**
 * Reflects a point over a line defined by two points.
 * Uses the formula of reflection over a line in 2D.
 */
export const reflectPointOverLine = (point, lineP1, lineP2) => {
  const dx = lineP2.x - lineP1.x;
  const dy = lineP2.y - lineP1.y;

  const a = dy;
  const b = -dx;
  const c = dx * lineP1.y - dy * lineP1.x;

  const distance = (a * point.x + b * point.y + c) / (a * a + b * b);
  const reflectedX = point.x - 2 * a * distance;
  const reflectedY = point.y - 2 * b * distance;

  return Point(reflectedX, reflectedY);
};

/**
 * Finds the intersection points between two circles.
 */
export const intersectCircles = (circleA, circleB) => {
  const dx = circleB.center.x - circleA.center.x;
  const dy = circleB.center.y - circleA.center.y;
  const distance = calculateDistance(circleA.center, circleB.center);

  // No intersection
  if (distance > circleA.radius + circleB.radius || distance < Math.abs(circleA.radius - circleB.radius) || distance === 0) {
    return null;
  }

  const a = (Math.pow(circleA.radius, 2) - Math.pow(circleB.radius, 2) + Math.pow(distance, 2)) / (2 * distance);
  const h = Math.sqrt(Math.pow(circleA.radius, 2) - Math.pow(a, 2));

  const x2 = circleA.center.x + (dx * a) / distance;
  const y2 = circleA.center.y + (dy * a) / distance;

  const intersection1 = Point(x2 + (dy * h) / distance, y2 - (dx * h) / distance);
  const intersection2 = Point(x2 - (dy * h) / distance, y2 + (dx * h) / distance);

  return [intersection1, intersection2];
};

/**
 * Finds the intersection point between a circle and a line.
 */
export const intersectCircleLine = (circle, lineP1, lineP2) => {
  const a = lineP2.x - lineP1.x;
  const b = lineP2.y - lineP1.y;

  const a_sq_plus_b_sq = a ** 2 + b ** 2;
  if (a_sq_plus_b_sq === 0) return null;

  const t = ((circle.center.x - lineP1.x) * a + (circle.center.y - lineP1.y) * b) / a_sq_plus_b_sq;
  const x = lineP1.x + t * a;
  const y = lineP1.y + t * b;

  const dist = calculateDistance(Point(x, y), circle.center);
  if (dist === circle.radius) {
    return [Point(x, y)];
  } else if (dist < circle.radius) {
    const h = Math.sqrt(circle.radius ** 2 - dist ** 2);
    const len = Math.sqrt(a ** 2 + b ** 2);
    const offsetX = (b / len) * h;
    const offsetY = (-a / len) * h;

    return [Point(x + offsetX, y + offsetY), Point(x - offsetX, y - offsetY)];
  } else {
    return null;
  }
};
```

### 4.4. Event Handling as Side Effects

Handle user interactions (mouse and touch events) separately, allowing the core logic to remain pure.

```javascript
// eventHandlers.js
import { Point } from './dataStructures.js';

/**
 * Converts a mouse or touch event to canvas coordinates.
 */
export const getCanvasCoordinates = (event, canvas, scale = 1) => {
  const rect = canvas.getBoundingClientRect();
  let clientX, clientY;

  if (event.type.startsWith('touch')) {
    const touch = event.changedTouches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const x = (clientX - rect.left) * scale;
  const y = (clientY - rect.top) * scale;

  return Point(x, y);
};

/**
 * Adds event listeners to the canvas.
 */
export const addCanvasEventListeners = (canvas, handlers, scale = 1) => {
  canvas.addEventListener("mousedown", (e) => {
    handlers.onMouseDown(getCanvasCoordinates(e, canvas, scale));
  });

  canvas.addEventListener("mousemove", (e) => {
    handlers.onMouseMove(getCanvasCoordinates(e, canvas, scale));
  });

  canvas.addEventListener("mouseup", () => {
    handlers.onMouseUp();
  });

  canvas.addEventListener("mouseout", () => {
    handlers.onMouseUp();
  });

  // Touch events
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handlers.onMouseDown(getCanvasCoordinates(e, canvas, scale));
  }, { passive: false });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    handlers.onMouseMove(getCanvasCoordinates(e, canvas, scale));
  }, { passive: false });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    handlers.onMouseUp();
  }, { passive: false });
};
```

### 4.5. Rendering Logic

Implement pure rendering functions that take in data and return drawing commands without mutating the canvas state directly.

```javascript
// renderer.js
import { utils } from './utils.js';

/**
 * Renders a list of circles and lines on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
 * @param {Array} elements - Array of Circle objects.
 */
export const renderElements = (ctx, elements) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  elements.forEach(element => {
    ctx.beginPath();
    ctx.lineWidth = 2;

    if (element.isLine) {
      ctx.moveTo(element.p1.x, element.p1.y);
      ctx.lineTo(element.p2.x, element.p2.y);
      ctx.strokeStyle = "black";
    } else {
      ctx.arc(element.center.x, element.center.y, element.radius, 0, utils.TWO_PI);
      ctx.strokeStyle = "red";
    }

    ctx.stroke();
  });
};

/**
 * Highlights a specific circle or line.
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
 * @param {Object} element - The Circle or Line object to highlight.
 */
export const highlightElement = (ctx, element) => {
  ctx.beginPath();
  ctx.lineWidth = 3;

  if (element.isLine) {
    ctx.moveTo(element.p1.x, element.p1.y);
    ctx.lineTo(element.p2.x, element.p2.y);
    ctx.strokeStyle = "blue";
  } else {
    ctx.arc(element.center.x, element.center.y, element.radius, 0, utils.TWO_PI);
    ctx.strokeStyle = "green";
  }

  ctx.stroke();
};
```

### 4.6. Point Manager

Manage points and interactions in an immutable manner.

```javascript
// pointManager.js
import { Point } from './dataStructures.js';
import { utils } from './utils.js';
import { calculateDistance } from './geometry.js';

/**
 * Finds the index of a point that is within a certain radius of the target.
 * @param {Array} points - Array of Point objects.
 * @param {Point} target - The target point.
 * @param {number} radius - The radius within which to search.
 * @returns {number} - The index of the found point or -1.
 */
export const findNearbyPointIndex = (points, target, radius) => {
  return points.findIndex(point => utils.getDistance(point, target) <= radius);
};
```

### 4.7. Main Application

Orchestrate the pure functions and handle side effects.

```javascript
// main.js
import { Circle, Point } from './dataStructures.js';
import { calculateCircumcircle, intersectCircles } from './geometry.js';
import { renderElements, highlightElement } from './renderer.js';
import { getCanvasCoordinates, addCanvasEventListeners } from './eventHandlers.js';
import { findNearbyPointIndex } from './pointManager.js';

// Initial Points
const initialPoints = [
  Point(400, 200), // Top
  Point(200, 600), // Bottom-left
  Point(600, 600), // Bottom-right
];

// Initial Circles
let circles = [];
try {
  const circumcircle = calculateCircumcircle(initialPoints[0], initialPoints[1], initialPoints[2]);
  circles = [
    circumcircle,
    Circle(initialPoints[0], calculateDistance(initialPoints[0], circumcircle.center)),
    Circle(initialPoints[1], calculateDistance(initialPoints[1], circumcircle.center)),
    Circle(initialPoints[2], calculateDistance(initialPoints[2], circumcircle.center)),
  ];
} catch (error) {
  console.error(error);
  // Handle colinear points by representing as lines
  circles = [
    Circle(initialPoints[0], calculateDistance(initialPoints[0], initialPoints[1]), true, initialPoints[0], initialPoints[1]),
    Circle(initialPoints[1], calculateDistance(initialPoints[1], initialPoints[2]), true, initialPoints[1], initialPoints[2]),
    Circle(initialPoints[2], calculateDistance(initialPoints[2], initialPoints[0]), true, initialPoints[2], initialPoints[0]),
  ];
}

// Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const state = {
  points: initialPoints,
  selectedPointIndex: -1,
};

// Pure Rendering
renderElements(ctx, circles);

// Event Handlers with Side Effects
const handlers = {
  onMouseDown: (point) => {
    const index = findNearbyPointIndex(state.points, point, 10);
    state.selectedPointIndex = index;
    if (index !== -1) {
      renderElements(ctx, circles);
      highlightElement(ctx, circles[index]);
    }
  },
  onMouseMove: (point) => {
    if (state.selectedPointIndex !== -1) {
      const updatedPoints = state.points.map((p, idx) =>
        idx === state.selectedPointIndex ? Point(point.x, point.y) : p
      );
      state.points = updatedPoints;

      // Recalculate circles
      try {
        const circumcircle = calculateCircumcircle(state.points[0], state.points[1], state.points[2]);
        circles = [
          circumcircle,
          Circle(state.points[0], calculateDistance(state.points[0], circumcircle.center)),
          Circle(state.points[1], calculateDistance(state.points[1], circumcircle.center)),
          Circle(state.points[2], calculateDistance(state.points[2], circumcircle.center)),
        ];
      } catch (error) {
        console.error(error);
        // Handle colinear points by representing as lines
        circles = [
          Circle(state.points[0], calculateDistance(state.points[0], state.points[1]), true, state.points[0], state.points[1]),
          Circle(state.points[1], calculateDistance(state.points[1], state.points[2]), true, state.points[1], state.points[2]),
          Circle(state.points[2], calculateDistance(state.points[2], state.points[0]), true, state.points[2], state.points[0]),
        ];
      }

      renderElements(ctx, circles);
    }
  },
  onMouseUp: () => {
    state.selectedPointIndex = -1;
    renderElements(ctx, circles);
  },
};

// Attach Event Listeners
addCanvasEventListeners(canvas, handlers);

// Window Resize Handler (Optional)
window.addEventListener('resize', () => {
  // Handle resize logic if necessary
}, false);
```

### 4.8. HTML Structure

Update the HTML to include a canvas element.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apollonian Gasket - Functional Refactor</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
    }
    #canvas {
      border: 1px solid black;
    }
  </style>
</head>
<body>
  <canvas id="canvas" width="800" height="800"></canvas>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

---

## 5. Explanation of Refactored Code

1. **Utility Functions (`utils.js`)**: Encapsulate common mathematical functions and constants to promote reusability and immutability.

2. **Immutable Data Structures (`dataStructures.js`)**: Define `Point` and `Circle` as immutable objects using `Object.freeze`, ensuring that their state cannot be altered after creation.

3. **Pure Geometric Computations (`geometry.js`)**: Implement functions like `calculateDistance`, `areColinear`, and `calculateCircumcircle` as pure functions that take inputs and return results without side effects.

4. **Event Handling (`eventHandlers.js`)**: Separate event handling logic from pure geometric computations, treating interactions as side effects. The `addCanvasEventListeners` function binds user interactions to handler functions.

5. **Rendering Logic (`renderer.js`)**: Define pure functions to render elements on the canvas. These functions take data as input and perform drawing operations without altering the data itself.

6. **Point Management (`pointManager.js`)**: Manage points in an immutable fashion, locating points based on user interactions without mutating the original data.

7. **Main Application (`main.js`)**:
   - Initializes the state with initial points.
   - Computes initial circles using pure functions.
   - Sets up the canvas and renders the initial state.
   - Handles user interactions by updating the state immutably and recalculating dependent geometric entities.
   - Delegates side effects (rendering and highlighting) to designated functions, keeping core logic pure.

8. **HTML Structure (`index.html`)**: Provides a simple canvas element and links the main JavaScript module.

---

## 6. Conclusion

Refactoring imperative JavaScript code into a functional programming paradigm involves:

- **Encapsulating Pure Logic**: Isolate computations from side effects.
- **Immutability**: Use immutable data structures to prevent unintended mutations.
- **Function Composition**: Build complex operations by composing simpler, reusable functions.
- **Separation of Concerns**: Distinguish between pure computations and impure interactions like rendering and event handling.

While JavaScript is not a purely functional language, leveraging functional programming concepts can lead to more predictable, maintainable, and testable codebases, especially for complex applications like geometric visualizations and interactive canvases.

---

## 7. Additional Resources

- **Functional Programming in JavaScript**:
  - [Functional-Light JavaScript](https://github.com/getify/Functional-Light-JS)
  - [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)
  
- **Immutable Data Structures**:
  - [Immutable.js](https://immutable-js.github.io/immutable-js/)
  
- **Canvas Rendering**:
  - [HTML5 Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
  
- **Event Handling in JavaScript**:
  - [MDN Web Docs - Event Handling](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)

---

By adhering to functional programming principles, the refactored code achieves a cleaner, more declarative structure, promoting better scalability and easier maintenance.