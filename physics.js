//function to help limit velocity of cue ball
  function limitVelocity(velocity) {
    return velocity > 0 ? min(velocity, 20) : max(velocity, -20);
  }
////////////////////////////////////////////////////////////////
function setupCueBall(x, y){
    ball = Bodies.circle(x, y, 5, {
      friction: 0,
      restitution: 0.97, // note that resititution effect is the sum of the 
                         // other body (cushion for example) as well
    });
    Body.setMass(ball, ball.mass * 10)
    World.add(engine.world, [ball]);
}

function cueBallInField() {
  /* 
    This function dectects whether the white ball is within the field of play.
    This also includes the position of the cue drawback as the cue stick end 
    (contact point) cannot ever be physically outside the table when setting
    up to strike the white ball.
  */
  // Table field dimensions are table length and width less or 
  // plus railings for a rectangular field
  // TopL(165, 75); TopR(935, 75), BotL(165, 445), BotR(935, 445)
  return (ball.position.y >= 75 && ball.position.y <= 445 &&
          ball.position.x >= 165 && ball.position.x <= 935)
}

function cueBallConstrained() {
  return ball.isConstrained;
}

function cueBallStopped() {
  if (
    Math.abs(ball.velocity.x) < 0.05 &&
    Math.abs(ball.velocity.y) < 0.05
  )
  return true;
}

function setUpCueConstraint(x, y) {
    ballConstraint = Constraint.create({
      pointA: { x: x, y: y },
      bodyB: ball,
      stiffness: 0.01,
      damping: 0.0001,
    });
    ball.isConstrained = true;
    //enables clicking when constraint is recreated
    document.getElementsByTagName("BODY")[0].style["pointer-events"] = "auto";
    World.add(engine.world, [ballConstraint]);
};

  //removes the constraint when ball is released
  function removeConstraint(ballConstraint){
    setTimeout(() => {
      Body.setVelocity(ball, {
        x: limitVelocity(ball.velocity.x),
        y: limitVelocity(ball.velocity.y),
      });
      ballConstraint.bodyB = null;
      ballConstraint.pointA = { x: 0, y: 0 };
      ball.isConstrained = false;
      World.remove(engine.world, [ballConstraint]);
    }, 100);
    //disables clicking of any kind when there is no constraint
    document.getElementsByTagName("BODY")[0].style["pointer-events"] = "none";
  };

  //draws constraints
  function drawConstraint(constraint) {
    push();
      var offsetA = constraint.pointA;
      var posA = { x: 0, y: 0 };
      if (constraint.bodyA) {
        posA = constraint.bodyA.position;
      }
      var offsetB = constraint.pointB;
      var posB = { x: 0, y: 0 };
      if (constraint.bodyB) {
        posB = constraint.bodyB.position;
      }
      strokeWeight(3);
      stroke(1);
      line(
        posA.x + offsetA.x,
        posA.y + offsetA.y,
        posB.x + offsetB.x,
        posB.y + offsetB.y
      );
    pop();
  };

  function limitVelocity(velocity) {
    return velocity > 0 ? min(velocity, 20) : max(velocity, -20);
  }

  function removeCueBallFromWorld() {
    World.remove(engine.world, [ball, ballConstraint])
  }

/////////////////////////////////////////////////////////////////
function setupMouseInteraction(){
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  //disables mouse interaction with the other balls
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  mouseConstraint.collisionFilter.mask = 0x0001;
  World.add(engine.world, mouseConstraint);
}

function drawCueBall() {
  push();
    fill(255);
    helper.drawVertices(ball.vertices);
    stroke(0)
    strokeWeight(2);
    drawConstraint(ballConstraint);
  pop();
}

function mouseReleased() {
  
  //if the game hasn't started but a mode has been selected, the user can place a whiteball
  if (!gameStart && ballLayout.gameOption) {
    //defines the Dline area that the cue can be placed
    if (dist(mouseX, mouseY, 150 + table.tableLength / 5, table.tableStartY + table.tableWidth/2) < 75 && mouseX < 350) {
      //starts the game
      gameStart = true;
      //draws the cue and the constraint based on the mouse position
      setupCueBall(mouseX, mouseY);
      setUpCueConstraint(mouseX, mouseY);
      ballLayout.setSleep(true);
      //sp.placeButtons();
    }
  } else if (gameStart) {
    //if the game has started and the mode has been selected then remove the constraint
    removeConstraint(ballConstraint);
    //make the balls awake so they can move around
    ballLayout.setSleep(false);
  }
}