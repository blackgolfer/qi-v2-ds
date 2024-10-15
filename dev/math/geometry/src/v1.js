(function (a, b) {
  "use strict";
  function e(a, b, c) {
    var d, e, f, g, h, i, j, k, l = 1e-6;
    if (void 0 === c) {
      this.m = a;
      this.r = b;
      this.isLine = !1;
      this.p1 = null;
      this.p2 = null;
    } else {
      d = a;
      e = b;
      f = c;
      g = d.x * (e.y - f.y) + e.x * (f.y - d.y) + f.x * (d.y - e.y);
      if (Math.abs(g) > l) {
        this.isLine = !1;
        i = (e.x - d.x);
        j = (f.x - d.x);
        k = (e.y - d.y);
        h = (f.y - d.y);
        this.m = {
          x: (h * i - j * k) / (2 * (i * h - j * k)),
          y: (j * k - i * h) / (2 * (i * h - j * k)),
        };
        this.r = Math.sqrt(
          (this.m.x - d.x) * (this.m.x - d.x) + (this.m.y - d.y) * (this.m.y - d.y),
        );
      } else {
        this.isLine = !0;
        this.m = null;
        this.r = -1;
        this.p1 = d;
        this.p2 = e;
      }
    }
  }
  function PointCollection(points, radius) {
    this.points = points.map(point => ({ x: point.x, y: point.y }));
    this.stack = [];
    this.draggedPoint = -1;
    this.radius = radius;
    for (let i = 0; i < points.length; i += 1) {
      this.stack[i] = i;
    }
  }
  function getPixelRatio() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStorePixelRatio =
      A.webkitBackingStorePixelRatio ||
      A.mozBackingStorePixelRatio ||
      A.msBackingStorePixelRatio ||
      A.oBackingStorePixelRatio ||
      A.backingStorePixelRatio ||
      1;
    return devicePixelRatio / backingStorePixelRatio;
  }
  function resizeCanvas() {
    const canvasWidth = z.parentNode.parentNode.offsetWidth;
    const canvasHeight = canvasWidth;
    const devicePixelRatio = getPixelRatio();
    const newCanvasWidth = canvasWidth * devicePixelRatio;
    const newCanvasHeight = canvasHeight * devicePixelRatio;

    if (newCanvasWidth !== z.width) {
      if (y) {
        for (let i = 0; i < 3; i++) {
          y.points[i].x = Math.round((y.points[i].x * canvasWidth * devicePixelRatio) / z.width);
          y.points[i].y = Math.round((y.points[i].y * canvasWidth * devicePixelRatio) / z.width);
        }
        y.radius = Math.round((canvasWidth * devicePixelRatio) / 50);
      }

      z.width = newCanvasWidth;
      z.height = newCanvasHeight;
      A = z.getContext("2d");
      z.style.width = `${canvasWidth}px`;
      z.style.height = `${canvasHeight}px`;

      if (y) {
        render();
      }
    }
  }
  function distanceSquared(a, b) {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
  }
  function getCursorPosition(event) {
    const { pageX: x, pageY: y } = event;
    const { scrollLeft, scrollTop } = document.documentElement;
    const { left: offsetX, top: offsetY } = event.target.getBoundingClientRect();

    return {
      x: x - scrollLeft + offsetX,
      y: y - scrollTop + offsetY,
    };
  }
  function handlePointerEvents() {
    let isPointerDown = false;
    let pointerPos = null;

    const handlePointerDown = (event) => {
      event.preventDefault();
      pointerPos = getCursorPosition(event);
      y.update(pointerPos.x * x, pointerPos.y * x, true);
      isPointerDown = true;
      o();
    };

    const handlePointerMove = (event) => {
      if (isPointerDown) {
        event.preventDefault();
        pointerPos = getCursorPosition(event);
        y.update(pointerPos.x * x, pointerPos.y * x, isPointerDown);
        o();
      }
    };

    const handlePointerUp = () => {
      y.release();
      isPointerDown = false;
    };

    z.addEventListener("mousedown", handlePointerDown, false);
    z.addEventListener("mousemove", handlePointerMove, false);
    z.addEventListener("mouseup", handlePointerUp, false);
    z.addEventListener("mouseout", handlePointerUp, false);

    z.addEventListener("touchstart", (event) => {
      event.preventDefault();
      handlePointerDown(event.changedTouches[0]);
    }, false);
    z.addEventListener("touchmove", (event) => {
      event.preventDefault();
      handlePointerMove(event.changedTouches[0]);
    }, false);
    z.addEventListener("touchend", handlePointerUp, false);
  }
  function draw() {
    if (resizeCanvas() && circles[3] && circles[4]) {
      if (showCircles) {
        for (let i = 0; i < 4; i++) {
          (context.strokeStyle = circleColor), circles[i].redraw();
        }
      }
      const circleSet = [circles[0], circles[1], circles[2], circles[4]];
      if (circles[3].r > 1) {
        if (showCircles) (context.strokeStyle = circleColor), circles[4].redraw();
        drawApollonianGasket(circleSet, iterations);
        (circleSet[3] = circles[3]), drawApollonianGasket(circleSet, iterations);
      }
    }
    showPoints && y.redraw();
  }
  function initializePoints() {
    const canvasWidth = z.width;
    const canvasHeight = z.height;
    const minDistance = Math.min(canvasWidth, canvasHeight) / 50;
    const initialPoints = [
      { x: canvasWidth / 2, y: canvasHeight * 0.4 },
      { x: canvasWidth * 0.35, y: canvasHeight * 0.8 },
      { x: canvasWidth * 0.65, y: canvasHeight * 0.8 },
    ];
    y = new PointManager(initialPoints, minDistance);
  }
  function computeInitialCircles() {
    const points = y.points;
    const centerCircle = new Circle(
      points[0],
      points[0],
      getMidpoint(points[0], points[1])
    );
    const circles = [];
    for (let i = 0; i < 2; i++) {
      const point1 = points[i];
      const point2 = points[(i + 1) % 3];
      const point3 = points[(i + 2) % 3];
      const line1 = new Line(point1, point2);
      const line2 = new Line(point2, point3);
      const intersection = line1.intersect(line2)[0];
      const circle = new Circle(intersection, intersection, getMidpoint(point1, intersection));
      circles[i] = circle;
    }
    C[0] = new Circle(points[0], getMidpoint(points[0], circles[0].center));
    C[1] = new Circle(points[1], getMidpoint(points[1], circles[0].center));
    C[2] = new Circle(points[2], getMidpoint(points[2], circles[1].center));
  }
  function findIntersection(b, c) {
    if (b.isLine || c.isLine) {
      const line = b.isLine ? b : c;
      const circle = b.isLine ? c : b;
      const intersection = line.intersect(circle);
      if (intersection.length > 0) {
        const midpoint = getMidpoint(intersection[0], intersection[1]);
        return midpoint;
      }
    } else {
      const vector = subtract(c.center, b.center);
      const distance = magnitude(vector);
      const direction = normalize(vector);
      if (distance < c.radius + b.radius) {
        const t = (distance * distance - c.radius * c.radius + b.radius * b.radius) / (2 * distance);
        const midpoint = add(b.center, multiply(direction, t));
        return midpoint;
      }
    }
    return null;
  }
  function calculateApollonianGasket() {
    const centers = [];
    const intersectingLines = [];
    const sides = [];
    const points = y.points;

    for (let i = 0; i < 3; i++) {
      const line1 = new Line(points[i], points[(i + 1) % 3]);
      const line2 = new Line(points[(i + 2) % 3], points[i]);
      const intersection = line1.intersect(line2)[0];
      const center = new Point(intersection.x, intersection.y);
      const side = new Line(center, center, points[(i + 1) % 3]);
      centers.push(center);
      intersectingLines.push(line1);
      sides.push(side);
    }

    const innerCircle = new Circle(
      centers[0],
      centers[0],
      getMidpoint(points[0], centers[0])
    );
    const outerCircle = new Circle(
      centers[0],
      getMidpoint(points[0], centers[0]),
      getMidpoint(points[0], points[1])
    );

    const pointSet = [points[0], points[1], points[2], innerCircle.center];
    drawApollonianGasket(pointSet, iterations);
    (pointSet[3] = outerCircle.center), drawApollonianGasket(pointSet, iterations);
  }
  function reflectCircleInLine(a, b) {
    if (b.isLine) {
      const p1Reflected = a.reflect(b.p1);
      const p2Reflected = a.reflect(b.p2);
      return new Circle(p1Reflected, p1Reflected, p2Reflected);
    }

    const topPoint = { x: b.center.x, y: b.center.y + b.radius };
    const rightPoint = { x: b.center.x + b.radius, y: b.center.y };
    const bottomPoint = { x: b.center.x, y: b.center.y - b.radius };

    const topReflected = a.reflect(topPoint);
    const rightReflected = a.reflect(rightPoint);
    const bottomReflected = a.reflect(bottomPoint);

    return new Circle(topReflected, rightReflected, bottomReflected);
  }
  function drawApollonianGasket(pointSet, iterations) {
    for (let i = 0; i < 3; i++) {
      const p1 = pointSet[i];
      const p2 = pointSet[(i + 1) % 3];
      const p3 = pointSet[3];

      const circle1 = new Circle(p1, p2, p3);
      const circle2 = new Circle(p2, p3, p1);
      const circle3 = new Circle(p3, p1, p2);

      const tangent1 = new Line(circle1.center, circle2.center);
      const tangent2 = new Line(circle2.center, circle3.center);
      const tangent3 = new Line(circle3.center, circle1.center);

      const reflectedCircle1 = reflectCircleInLine(circle2, tangent1);
      const reflectedCircle2 = reflectCircleInLine(circle3, tangent2);
      const reflectedCircle3 = reflectCircleInLine(circle1, tangent3);

      const newPoints = [
        pointSet[i],
        pointSet[(i + 1) % 3],
        pointSet[3],
        reflectedCircle1.center
      ];

      drawApollonianGasket(newPoints, iterations - 1);
    }
  }
  function initForm() {
    const container = document.getElementById("container");
    const form = document.createElement("form");
    form.style.textAlign = "center";
    const checkboxContainer = document.createElement("div");
    const checkboxes = [];
    const labels = [];
    const checkboxAttributes = [
      { id: "showApollonian", name: "showApollonian", value: "true", checked: true },
      { id: "showPerpendicular", name: "showPerpendicular", value: "false", checked: false },
      { id: "showDots", name: "showDots", value: "true", checked: true },
    ];
    for (let i = 0; i < 3; i++) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = checkboxAttributes[i].id;
      checkbox.name = checkboxAttributes[i].name;
      checkbox.value = checkboxAttributes[i].value;
      checkbox.checked = checkboxAttributes[i].checked;
      checkbox.addEventListener("change", (event) => {
        updateCheckboxValue(event.target.id, event.target.checked);
      });
      const label = document.createElement("label");
      label.htmlFor = checkboxAttributes[i].id;
      label.className = "form-check-label";
      label.appendChild(document.createTextNode(getCheckboxLabel(i)));
      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);
    }
    form.appendChild(checkboxContainer);
    const depthSliderContainer = document.createElement("div");
    depthSliderContainer.style.textAlign = "center";
    depthSliderContainer.style.marginTop = "1em";
    const depthSlider = document.createElement("input");
    depthSlider.id = "depth";
    depthSlider.type = "range";
    depthSlider.min = 0;
    depthSlider.max = 10;
    depthSlider.value = 4;
    depthSlider.step = 1;
    depthSlider.addEventListener("change", (event) => {
      updateDepth(parseInt(event.target.value));
    });
    const depthLabel = document.createElement("label");
    depthLabel.htmlFor = "depth";
    depthLabel.innerHTML = `Depth: ${depthSlider.value}`;
    depthSliderContainer.appendChild(depthSlider);
    depthSliderContainer.appendChild(depthLabel);
    const canvasContainer = document.createElement("div");
    canvasContainer.style.textAlign = "center";
    canvasContainer.style.marginTop = "1em";
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    canvas.className = "border";
    canvasContainer.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    container.appendChild(form);
    container.appendChild(depthSliderContainer);
    container.appendChild(canvasContainer);
    initCanvas();
    drawApollonianGasket();
    window.addEventListener("resize", initCanvas, false);
    window.addEventListener("orientationchange", initCanvas, false);
  }
  function getCheckboxLabel(index) {
    switch (index) {
      case 0:
        return "Show Apollonian circles";
      case 1:
        return "Show perpendicular circles";
      case 2:
        return "Show dots";
      default:
        return "";
    }
  }
  function updateCheckboxValue(id, value) {
    switch (id) {
      case "showApollonian":
        showApollonianCircles = value;
        break;
      case "showPerpendicular":
        showPerpendicularCircles = value;
        break;
      case "showDots":
        showDots = value;
        break;
      default:
        break;
    }
    drawApollonianGasket();
  }
  function updateDepth(value) {
    maxDepth = value;
    document.getElementById("depth").innerHTML = `Depth: ${value}`;
    drawApollonianGasket();
  }
  let x,
    y,
    z,
    A,
    B,
    C = [],
    D = !0,
    E = !0,
    F = !1,
    G = 4,
    H = console.log,
    I = Math.abs,
    J = Math.sin,
    K = Math.cos,
    L = Math.tan,
    M = Math.atan2,
    N = Math.acos,
    O = Math.sqrt,
    P = Math.round,
    Q = Math.PI,
    c = 2 * Math.PI,
    d = Math.max,
    i = Math.floor;
  const j = "rgb(23, 56, 154)",
    k = "rgba(242, 163, 63, 0.9)";
  (e.prototype = {
    intersect: function (other) {
      const isLine = this.isLine;
      const isOtherLine = other.isLine;
      if (isLine && isOtherLine) {
        const denominator =
          (other.p2.y - other.p1.y) * (this.p1.x - other.p1.x) -
          (other.p2.x - other.p1.x) * (this.p1.y - other.p1.y);
        if (denominator === 0) {
          return null;
        }
        const intersectionX =
          this.p1.x +
          ((this.p2.x - this.p1.x) *
            ((other.p2.y - other.p1.y) * (this.p1.x - other.p1.x) -
              (other.p2.x - other.p1.x) * (this.p1.y - other.p1.y))) /
          denominator;
        const intersectionY =
          this.p1.y +
          ((this.p2.y - this.p1.y) *
            ((other.p2.y - other.p1.y) * (this.p1.x - other.p1.x) -
              (other.p2.x - other.p1.x) * (this.p1.y - other.p1.y))) /
          denominator;
        return [{ x: intersectionX, y: intersectionY }];
      } else if (isLine || isOtherLine) {
        const line = isLine ? this : other;
        const circle = isLine ? other : this;
        const dx = line.p2.x - line.p1.x;
        const dy = line.p2.y - line.p1.y;
        const determinant =
          dx * dx + dy * dy - circle.r * circle.r;
        if (determinant < 0) {
          return null;
        }
        const t1 =
          (line.p1.x * line.p2.y - line.p2.x * line.p1.y +
            circle.m.x * dy -
            circle.m.y * dx +
            Math.sqrt(determinant) * dy) /
          (dx * dx + dy * dy);
        const t2 =
          (line.p1.x * line.p2.y - line.p2.x * line.p1.y +
            circle.m.x * dy -
            circle.m.y * dx -
            Math.sqrt(determinant) * dy) /
          (dx * dx + dy * dy);
        const intersection1 = {
          x: line.p1.x + t1 * dx,
          y: line.p1.y + t1 * dy,
        };
        const intersection2 = {
          x: line.p1.x + t2 * dx,
          y: line.p1.y + t2 * dy,
        };
        return [intersection1, intersection2];
      } else {
        const dx = this.m.x - other.m.x;
        const dy = this.m.y - other.m.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared > (this.r + other.r) ** 2) {
          return null;
        }
        const distance = Math.sqrt(distanceSquared);
        const a = (this.r ** 2 - other.r ** 2 + distanceSquared) / (2 * distance);
        const h = Math.sqrt(this.r ** 2 - a ** 2);
        const xm = (this.m.x + other.m.x) / 2;
        const ym = (this.m.y + other.m.y) / 2;
        const x1 = xm + a * (other.m.x - this.m.x) / distance;
        const y1 = ym + a * (other.m.y - this.m.y) / distance;
        const x2 = x1 + h * (other.m.y - this.m.y) / distance;
        const y2 = y1 - h * (other.m.x - this.m.x) / distance;
        const intersection1 = { x: x2, y: y2 };
        const intersection2 = { x: x1 - h * (other.m.y - this.m.y) / distance, y: y1 + h * (other.m.x - this.m.x) / distance };
        return [intersection1, intersection2];
      }
    },
    tangent: function (point) {
      if (this.isLine) {
        return this;
      }
      const slope = (point.y - this.m.y) / (point.x - this.m.x);
      const perpendicularSlope = -1 / slope;
      const x = (this.m.x + point.x + perpendicularSlope * (point.y - this.m.y)) / (1 + perpendicularSlope ** 2);
      const y = slope * (x - this.m.x) + this.m.y;
      return new Circle(point, { x, y }, point);
    },
    reflect: function ({ x: pointX, y: pointY }) {
      const circleCenterX = this.m.x;
      const circleCenterY = this.m.y;
      const circleRadius = this.r;

      if (this.isLine) {
        const lineLength = Math.sqrt(
          (this.p2.x - this.p1.x) ** 2 + (this.p2.y - this.p1.y) ** 2
        );
        const lineDirectionX = (this.p2.x - this.p1.x) / lineLength;
        const lineDirectionY = (this.p2.y - this.p1.y) / lineLength;

        const reflectedX =
          -pointX + 2 * this.p1.x + 2 * lineDirectionX * (this.p2.x - this.p1.x) * lineDirectionX;
        const reflectedY =
          -pointY + 2 * this.p1.y + 2 * lineDirectionY * (this.p2.y - this.p1.y) * lineDirectionY;

        return { x: reflectedX, y: reflectedY };
      }

      const pointDistanceFromCenter = Math.sqrt(
        (pointX - circleCenterX) ** 2 + (pointY - circleCenterY) ** 2
      );

      if (pointDistanceFromCenter < 1e-7) {
        return null;
      }

      const reflectedX =
        circleCenterX +
        (circleRadius * circleRadius * (pointX - circleCenterX)) /
          (pointDistanceFromCenter ** 2);
      const reflectedY =
        circleCenterY +
        (circleRadius * circleRadius * (pointY - circleCenterY)) /
          (pointDistanceFromCenter ** 2);

      return { x: reflectedX, y: reflectedY };
    },
    redraw() {
      if (this.isLine) {
        A.beginPath();
        A.moveTo(this.start.x, this.start.y);
        A.lineTo(this.end.x, this.end.y);
        A.stroke();
      } else {
        A.beginPath();
        A.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        A.stroke();
      }
    },
  }),
    (PointCollection.prototype = {
      update(a, c, d) {
        let pointIndex;
        let dragging = false;

        for (pointIndex = 0; pointIndex < this.point.length; pointIndex++) {
          const distance = l(this.point[pointIndex], { x: a, y: c });
          if (distance <= this.radius) {
            dragging = true;
            break;
          }
        }

        if (dragging) {
          b.body.style.cursor = "pointer";
        } else {
          b.body.style.cursor = "default";
        }

        if (d) {
          for (let stackIndex = this.stack.length - 1; stackIndex >= 0; stackIndex--) {
            const pointIndex = this.stack[stackIndex];
            const distance = l(this.point[pointIndex], { x: a, y: c });
            if (!this.draggedPoint && distance <= this.radius) {
              this.draggedPoint = pointIndex;
              this.moveToLast(stackIndex);
            } else if (this.draggedPoint >= 0 && a >= 0 && c >= 0 && a < z.width && c < z.height) {
              this.point[this.draggedPoint].x = a;
              this.point[this.draggedPoint].y = c;
            }
          }
        }
      },
      redraw() {
        const radius = this.radius;
        const ctx = A;
        const points = this.point;
        const stack = this.stack;

        ctx.fillStyle = "rgb(60, 60, 60)";
        ctx.strokeStyle = "rgb(0, 0, 0)";

        for (let i = 0; i < points.length; i += 1) {
          const pointIndex = stack[i];
          const point = points[pointIndex];

          ctx.beginPath();
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      },
      redrawOne(a, ctx) {
        ctx.fillStyle = "rgb(230, 230, 230)";
        ctx.beginPath();
        ctx.arc(
          this.point[this.stack[a]].x,
          this.point[this.stack[a]].y,
          this.radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      },
      release() {
        this.draggedPoint = -1;
        document.body.style.cursor = "default";
      },
      /**
       * Move the point at index `a` to the end of the stack.
       * @param {number} a - The index of the point to move.
       */
      moveToLast: function (index) {
        const point = this.stack[index];
        for (let i = index; i < this.stack.length - 1; i += 1) {
          this.stack[i] = this.stack[i + 1];
        }
        this.stack[this.stack.length - 1] = point;
      },
    }),
    initForm();
})(this, this.document);
