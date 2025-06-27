// Matter.js aliases
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

let engine, world;
let cue;
let pivot;
let cueLength = 200;
let angle = 0;
let mouseConstraint;

function setup() {
  createCanvas(800, 600);

  // Create physics engine
  engine = Engine.create();
  world = engine.world;

  // Create the cue stick as a rectangle
  cue = Bodies.rectangle(width / 2, height / 2, cueLength, 10, {
    density: 0.02,
    frictionAir: 0.05,
    collisionFilter: { group: -1 }, // No collisions for now
  });

  // Add cue to world
  World.add(world, cue);

  // Add pivot constraint (simulate fixed point like a hand hold)
  pivot = Constraint.create({
    pointA: { x: width / 2, y: height / 2 },
    bodyB: cue,
    pointB: { x: -cueLength / 2 + 10, y: 0 },
    stiffness: 1,
    length: 0,
  });
  World.add(world, pivot);

  // Add mouse control
  let canvasmouse = Mouse.create(canvas.elt);
  canvasmouse.pixelRatio = pixelDensity();
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: canvasmouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });
  World.add(world, mouseConstraint);
}

function draw() {
  background(30);
  Engine.update(engine);

  // Draw cue
  push();
  fill(150, 100, 50);
  stroke(255);
  strokeWeight(2);
  translate(cue.position.x, cue.position.y);
  rotate(cue.angle);
  rectMode(CENTER);
  rect(0, 0, cueLength, 10);
  pop();

  // Draw pivot point
  fill(255, 0, 0);
  noStroke();
  ellipse(pivot.pointA.x, pivot.pointA.y, 8);
}

function keyPressed() {
  const angleStep = 0.05;

  if (keyCode === LEFT_ARROW) {
    Body.rotate(cue, -angleStep);
  } else if (keyCode === RIGHT_ARROW) {
    Body.rotate(cue, angleStep);
  }
}

function mouseReleased() {
  if (mouseConstraint.body === cue) {
    // Add a small "strike" force when released
    let forceMagnitude = 0.05;
    let angle = cue.angle;
    let force = {
      x: forceMagnitude * cos(angle),
      y: forceMagnitude * sin(angle),
    };
    Body.applyForce(cue, cue.position, force);
  }
}
