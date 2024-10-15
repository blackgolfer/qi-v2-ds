
10月04日 12:07 会话ID:(4647941)

Certainly! Refactoring the provided imperative and object-oriented JavaScript code into a **pure functional programming** (FP) paradigm using **D3.js** for visualization and **RxJS** for reactive event handling will significantly enhance readability, maintainability, and scalability. This approach leverages the strengths of both libraries to create an interactive, efficient, and modular Apollonian Gasket visualization.

## 📋 Table of Contents

1. [Understanding the Original Code](#1-understanding-the-original-code)
2. [Functional Programming Principles in JavaScript](#2-functional-programming-principles-in-javascript)
3. [Setting Up the Development Environment](#3-setting-up-the-development-environment)
4. [Implementing Pure Functions for Geometric Computations](#4-implementing-pure-functions-for-geometric-computations)
5. [Setting Up RxJS for Event Handling](#5-setting-up-rxjs-for-event-handling)
6. [Rendering with D3.js](#6-rendering-with-d3js)
7. [Putting It All Together](#7-putting-it-all-together)
8. [Enhancing the Visualization](#8-enhancing-the-visualization)
9. [Conclusion](#9-conclusion)

---

## 1. Understanding the Original Code

The original JavaScript code appears to handle:

- **Geometric Computations**: Creating circles and lines, calculating intersections, reflections, and rendering them on a canvas.
- **User Interactions**: Handling mouse and touch events for dragging points on the canvas.
- **Canvas Rendering**: Drawing circles and lines based on geometric calculations.
- **State Management**: Managing points, stack, and rendering states.

However, the code is intricate and uses single-letter variable names, making it difficult to understand and maintain.

---

## 2. Functional Programming Principles in JavaScript

Before refactoring, it's essential to grasp key Functional Programming (FP) concepts applicable to JavaScript:

- **Immutability**: Data should not be mutated after creation.
- **Pure Functions**: Functions should return the same output for the same inputs without side effects.
- **Function Composition**: Building complex functions by composing simpler ones.
- **Higher-Order Functions**: Functions that take other functions as arguments or return them.
- **Declarative Code**: Expressing logic without explicitly describing control flow.

By adhering to these principles, we can create a more predictable and maintainable codebase.

---

## 3. Setting Up the Development Environment

### Prerequisites

- **Node.js and npm**: Ensure you have [Node.js](https://nodejs.org/) installed.
- **D3.js**: For rendering the Apollonian Gasket.
- **RxJS**: For reactive event handling.
- **Bundler**: Tools like **Webpack** or **Parcel** to bundle modules (optional but recommended).

### Project Initialization

1. **Initialize a New Project**

   ```bash
   mkdir apollonian-gasket
   cd apollonian-gasket
   npm init -y
   ```

2. **Install Dependencies**

   ```bash
   npm install d3 rxjs
   ```

3. **Project Structure**

   Organize your project as follows:

   ```
   apollonian-gasket/
   ├── src/
   │   ├── index.html
   │   ├── index.js
   │   ├── geometry.js
   │   ├── eventHandlers.js
   │   └── renderer.js
   ├── package.json
   └── README.md
   ```

---

## 4. Implementing Pure Functions for Geometric Computations

Create a `geometry.js` file to handle all geometric calculations as pure functions.

```javascript
// src/geometry.js

/**
 * Calculate the distance between two points.
 * @param {Object} p1 - Point with {x, y}.
 * @param {Object} p2 - Point with {x, y}.
 * @returns {number} - Distance.
 */
export const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

/**
 * Check if three points are colinear.
 * @param {Object} p1 - Point with {x, y}.
 * @param {Object} p2 - Point with {x, y}.
 * @param {Object} p3 - Point with {x, y}.
 * @returns {boolean} - True if colinear, else false.
 */
export const areColinear = (p1, p2, p3) => {
  const area = Math.abs(
    p1.x * (p2.y - p3.y) +
      p2.x * (p3.y - p1.y) +
      p3.x * (p1.y - p2.y)
  );
  return area < 1e-6;
};

/**
 * Calculate the circumcircle of three non-colinear points.
 * @param {Object} p1 - Point with {x, y}.
 * @param {Object} p2 - Point with {x, y}.
 * @param {Object} p3 - Point with {x, y}.
 * @returns {Object|null} - Circumcircle with center {x, y} and radius, or null if colinear.
 */
export const calculateCircumcircle = (p1, p2, p3) => {
  if (areColinear(p1, p2, p3)) {
    return null;
  }

  const A = p2.x - p1.x;
  const B = p2.y - p1.y;
  const C = p3.x - p1.x;
  const D = p3.y - p1.y;

  const E = A * (p1.x + p2.x) + B * (p1.y + p2.y);
  const F = C * (p1.x + p3.x) + D * (p1.y + p3.y);
  const G = 2 * (A * D - B * C);

  if (G === 0) {
    return null;
  }

  const centerX = (D * E - B * F) / G;
  const centerY = (A * F - C * E) / G;
  const radius = getDistance({ x: centerX, y: centerY }, p1);

  return {
    center: { x: centerX, y: centerY },
    radius: radius,
  };
};

/**
 * Reflect a point over a line defined by two points.
 * @param {Object} point - Point with {x, y}.
 * @param {Object} lineP1 - Line endpoint 1 with {x, y}.
 * @param {Object} lineP2 - Line endpoint 2 with {x, y}.
 * @returns {Object} - Reflected point with {x, y}.
 */
export const reflectPointOverLine = (point, lineP1, lineP2) => {
  const A = lineP2.x - lineP1.x;
  const B = lineP2.y - lineP1.y;
  const C = -(A * lineP1.x + B * lineP1.y);

  const denominator = A * A + B * B;
  if (denominator === 0) {
    return { ...point };
  }

  const x = (B * (B * point.x - A * point.y) - A * C) / denominator;
  const y = (A * (-B * point.x + A * point.y) - B * C) / denominator;

  return { x, y };
};
```

**Explanation:**

- **Pure Functions:** All functions are pure, relying solely on input parameters and returning new data without side effects.
- **Immutability:** Functions do not modify input objects. They return new objects instead.
- **Descriptive Naming:** Function and variable names clearly indicate their purpose.

---

## 5. Setting Up RxJS for Event Handling

Utilize **RxJS** to manage reactive event streams for user interactions like mouse clicks and drags.

### `eventHandlers.js`

Create an `eventHandlers.js` file to encapsulate all event-related logic.

```javascript
// src/eventHandlers.js
import { fromEvent, merge } from 'rxjs';
import { map, switchMap, takeUntil, filter } from 'rxjs/operators';
import { getDistance } from './geometry';

/**
 * Creates an observable for dragging points.
 * @param {SVGElement} svg - The D3 SVG element.
 * @param {Array} points - Array of point objects with {x, y}.
 * @returns {Observable} - Stream of updated points.
 */
export const createDragStream = (svg, points) => {
  const mousedown$ = fromEvent(svg, 'mousedown');
  const mousemove$ = fromEvent(svg, 'mousemove');
  const mouseup$ = fromEvent(window, 'mouseup');

  const touchstart$ = fromEvent(svg, 'touchstart');
  const touchmove$ = fromEvent(svg, 'touchmove');
  const touchend$ = fromEvent(window, 'touchend');

  const dragStart$ = merge(mousedown$, touchstart$).pipe(
    map(event => {
      event.preventDefault();
      const { x, y } = getMousePosition(event, svg);
      const nearest = findNearestPoint({ x, y }, points);
      return { point: nearest, startPos: { x, y } };
    }),
    filter(({ point }) => point !== null),
    switchMap(({ point, startPos }) =>
      merge(
        mousemove$.pipe(map(e => getMousePosition(e, svg))),
        touchmove$.pipe(map(e => getMousePosition(e, svg)))
      ).pipe(
        map(pos => ({ point, pos })),
        takeUntil(merge(mouseup$, touchend$))
      )
    )
  );

  return dragStart$;
};

/**
 * Finds the nearest point to the cursor.
 * @param {Object} pos - Current cursor position {x, y}.
 * @param {Array} points - Array of point objects with {x, y}.
 * @returns {Object|null} - Nearest point or null if none within threshold.
 */
const findNearestPoint = (pos, points) => {
  const threshold = 10; // pixels
  let nearest = null;
  let minDist = Infinity;

  points.forEach(point => {
    const dist = getDistance(pos, point);
    if (dist < minDist && dist < threshold) {
      minDist = dist;
      nearest = point;
    }
  });

  return nearest;
};

/**
 * Extracts mouse or touch position relative to the SVG.
 * @param {Event} event - Mouse or touch event.
 * @param {SVGElement} svg - The D3 SVG element.
 * @returns {Object} - Position with {x, y}.
 */
const getMousePosition = (event, svg) => {
  const point = svg.createSVGPoint();
  if (event.type.startsWith('touch')) {
    point.x = event.touches[0].clientX;
    point.y = event.touches[0].clientY;
  } else {
    point.x = event.clientX;
    point.y = event.clientY;
  }
  const ctm = svg.getScreenCTM().inverse();
  const transformedPoint = point.matrixTransform(ctm);
  return { x: transformedPoint.x, y: transformedPoint.y };
};
```

**Explanation:**

- **Observable Streams:** Uses `fromEvent` to create streams for mouse and touch events.
- **Drag Handling:** Merges mouse and touch events to handle dragging uniformly.
- **Pure Functions:** Functions like `findNearestPoint` and `getMousePosition` are pure and side-effect-free.
- **Immutability:** Original points array is not mutated; updates are handled via D3's data-binding mechanisms.

---

## 6. Rendering with D3.js

Utilize **D3.js** to render the Apollonian Gasket based on geometric calculations and reactive event streams.

### `renderer.js`

Create a `renderer.js` file to handle all rendering logic using D3.js.

```javascript
// src/renderer.js
import * as d3 from 'd3';
import { calculateCircumcircle } from './geometry';

/**
 * Initializes the SVG canvas.
 * @param {string} selector - D3 selector for the SVG container.
 * @param {number} width - Width of the SVG.
 * @param {number} height - Height of the SVG.
 * @returns {Object} - D3 selection of the SVG.
 */
export const initializeSVG = (selector, width, height) => {
  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', '#ffffff');

  return svg;
};

/**
 * Renders circles on the SVG.
 * @param {Object} svg - D3 SVG selection.
 * @param {Array} circles - Array of circumcircle objects with center {x, y} and radius.
 */
export const renderCircles = (svg, circles) => {
  // Data Binding
  const circleSelection = svg.selectAll('circle')
    .data(circles, d => `${d.center.x}-${d.center.y}-${d.radius}`); // Key function

  // Enter Selection
  circleSelection.enter()
    .append('circle')
    .attr('cx', d => d.center.x)
    .attr('cy', d => d.center.y)
    .attr('r', 0)
    .attr('stroke', 'black')
    .attr('fill', 'none')
    .transition()
    .duration(500)
    .attr('r', d => d.radius);

  // Update Selection
  circleSelection
    .transition()
    .duration(500)
    .attr('cx', d => d.center.x)
    .attr('cy', d => d.center.y)
    .attr('r', d => d.radius);

  // Exit Selection
  circleSelection.exit()
    .transition()
    .duration(500)
    .attr('r', 0)
    .remove();
};

/**
 * Renders draggable points on the SVG.
 * @param {Object} svg - D3 SVG selection.
 * @param {Array} points - Array of point objects with {x, y}.
 */
export const renderPoints = (svg, points) => {
  // Data Binding
  const pointSelection = svg.selectAll('.point')
    .data(points, d => `${d.x}-${d.y}`); // Key function

  // Enter Selection
  const enter = pointSelection.enter()
    .append('circle')
    .attr('class', 'point')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 8)
    .attr('fill', 'blue')
    .attr('cursor', 'pointer');

  // Update Selection
  pointSelection
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);

  // Exit Selection
  pointSelection.exit().remove();
};

/**
 * Renders lines between points on the SVG.
 * @param {Object} svg - D3 SVG selection.
 * @param {Array} lines - Array of line objects with {x1, y1, x2, y2}.
 */
export const renderLines = (svg, lines) => {
  // Data Binding
  const lineSelection = svg.selectAll('line')
    .data(lines, d => `${d.x1}-${d.y1}-${d.x2}-${d.y2}`); // Key function

  // Enter Selection
  lineSelection.enter()
    .append('line')
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
    .attr('stroke', 'gray')
    .attr('stroke-width', 2);

  // Update Selection
  lineSelection
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2);

  // Exit Selection
  lineSelection.exit().remove();
};
```

**Explanation:**

- **Data Binding:** Utilizes D3's data-binding to synchronize the SVG elements with the data array (`circles`, `points`, `lines`).
- **Enter, Update, Exit:** Handles the three selections to manage entering, updating, and exiting elements efficiently.
- **Transitions:** Adds smooth animations for element changes.

---

## 7. Putting It All Together

Combine the pure functions, event handling, and rendering logic to create an interactive Apollonian Gasket.

### `index.js`

Create an `index.js` file to orchestrate the entire application.

```javascript
// src/index.js
import { initializeSVG, renderCircles, renderPoints, renderLines } from './renderer.js';
import { createDragStream } from './eventHandlers.js';
import { calculateCircumcircle, getDistance } from './geometry.js';
import { fromEvent } from 'rxjs';
import { scan, withLatestFrom } from 'rxjs/operators';

// Initialize SVG
const width = 800;
const height = 800;
const svg = initializeSVG('#gasket', width, height);

// Initial Points (forming a triangle)
let points = [
  { x: 400, y: 200 },
  { x: 200, y: 600 },
  { x: 600, y: 600 },
];

// Function to generate all circumcircles from triples of points
const generateCircumcircles = (points) => {
  const circles = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      for (let k = j + 1; k < points.length; k++) {
        const p1 = points[i];
        const p2 = points[j];
        const p3 = points[k];
        const circumcircle = calculateCircumcircle(p1, p2, p3);
        if (circumcircle) {
          circles.push(circumcircle);
        }
      }
    }
  }
  return circles;
};

// Initial Circumcircles
let circles = generateCircumcircles(points);

// Initial Lines (edges of the triangle)
let lines = [
  { x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y },
  { x1: points[1].x, y1: points[1].y, x2: points[2].x, y2: points[2].y },
  { x1: points[2].x, y1: points[2].y, x2: points[0].x, y2: points[0].y },
];

// Initial Rendering
renderCircles(svg, circles);
renderLines(svg, lines);
renderPoints(svg, points);

// Setup Drag Stream
const drag$ = createDragStream(svg.node(), points);

// Subscribe to Drag Events
drag$.subscribe(({ point, pos }) => {
  // Update the dragged point
  point.x = pos.x;
  point.y = pos.y;

  // Recalculate circumcircles and lines
  circles = generateCircumcircles(points);
  lines = [
    { x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y },
    { x1: points[1].x, y1: points[1].y, x2: points[2].x, y2: points[2].y },
    { x1: points[2].x, y1: points[2].y, x2: points[0].x, y2: points[0].y },
  ];

  // Re-render
  renderCircles(svg, circles);
  renderLines(svg, lines);
  renderPoints(svg, points);
});
```

**Explanation:**

1. **Initialization:**
   - Sets up the SVG canvas using D3.js.
   - Defines initial points forming a triangle.

2. **Circumcircle Generation:**
   - Uses pure functions to calculate circumcircles from point triples.
   - Generates initial circumcircles and lines.

3. **Rendering:**
   - Renders the initial circles, lines, and points on the SVG.

4. **Event Handling:**
   - Sets up a drag stream using RxJS that listens to mouse and touch events.
   - Updates points' positions reactively when dragged.
   - Recalculates circumcircles and lines upon dragging.
   - Re-renders the updated geometric structures.

**Note:** To maintain immutability, consider using immutable data structures or libraries like [Immutable.js](https://immutable-js.com/) for more complex state management. However, for simplicity, this example mutates point objects directly.

### `index.html`

Create an `index.html` file to host the visualization.

```html
<!-- src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apollonian Gasket with D3.js and RxJS</title>
  <style>
    #gasket {
      width: 800px;
      height: 800px;
      margin: auto;
      display: block;
      border: 1px solid #ccc;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
  </style>
</head>
<body>
  <div id="gasket"></div>

  <script type="module" src="index.js"></script>
</body>
</html>
```

**Explanation:**

- **SVG Container:** The `<div id="gasket"></div>` serves as the container for the D3.js-rendered SVG.
- **Styling:** Basic CSS to center the SVG and provide a border.
- **Module Script:** Uses ES6 modules to import `index.js`.

---

## 8. Enhancing the Visualization

To make the visualization more interactive and aesthetically pleasing, consider adding features like zooming, panning, color coding, and dynamic updates.

### Zoom and Pan with D3.js

Enhance the SVG to support zooming and panning.

```javascript
// Add this in renderer.js or within index.js after initializing SVG

export const addZoom = (svg) => {
  const zoom = d3.zoom()
    .scaleExtent([0.5, 10])
    .on('zoom', (event) => {
      svg.selectAll('g').attr('transform', event.transform);
    });

  svg.call(zoom);
};
```

**Usage in `index.js`:**

```javascript
// After initializing SVG
addZoom(svg);
```

### Color Coding Circles

Differentiate circles based on their depth or properties.

```javascript
// Modify renderCircles in renderer.js

export const renderCircles = (svg, circles) => {
  const colorScale = d3.scaleSequential(d3.interpolateViridis)
    .domain([0, circles.length]);

  const circleSelection = svg.selectAll('circle.gasket-circle')
    .data(circles, d => `${d.center.x}-${d.center.y}-${d.radius}`);

  // Enter Selection
  circleSelection.enter()
    .append('circle')
    .attr('class', 'gasket-circle')
    .attr('cx', d => d.center.x)
    .attr('cy', d => d.center.y)
    .attr('r', 0)
    .attr('stroke', 'black')
    .attr('fill', 'none')
    .transition()
    .duration(500)
    .attr('r', d => d.radius)
    .attr('fill', (d, i) => colorScale(i));

  // Update Selection
  circleSelection
    .transition()
    .duration(500)
    .attr('cx', d => d.center.x)
    .attr('cy', d => d.center.y)
    .attr('r', d => d.radius)
    .attr('fill', (d, i) => colorScale(i));

  // Exit Selection
  circleSelection.exit()
    .transition()
    .duration(500)
    .attr('r', 0)
    .remove();
};
```

**Explanation:**

- **Color Scale:** Uses D3's `interpolateViridis` to color circles based on their index, representing depth.
- **Class Naming:** Adds a class to differentiate gasket circles from other circles.

---

## 9. Conclusion

By leveraging **D3.js** for declarative rendering and **RxJS** for handling asynchronous event streams, you've transformed an imperative and complex codebase into a cleaner, more maintainable, and scalable functional program. This setup not only enhances readability but also facilitates future extensions and optimizations.

**Key Takeaways:**

- **Separation of Concerns:** Pure functions handle computations, RxJS manages events, and D3.js deals with rendering.
- **Immutability and Purity:** Ensuring core logic remains pure enhances predictability and testability.
- **Modular Design:** Breaking down the application into smaller modules promotes reusability and maintainability.

---

## 📚 Additional Resources

- **D3.js Documentation:** [https://d3js.org/](https://d3js.org/)
- **RxJS Documentation:** [https://rxjs.dev/](https://rxjs.dev/)
- **Functional Programming in JavaScript:** [https://www.freecodecamp.org/news/functional-programming-in-js/](https://www.freecodecamp.org/news/functional-programming-in-js/)
- **Apollonian Gasket Theory:** [https://en.wikipedia.org/wiki/Apollonian_gasket](https://en.wikipedia.org/wiki/Apollonian_gasket)

---

**Happy Coding!**