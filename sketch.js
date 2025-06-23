// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

let Engine = Matter.Engine;
const Render = Matter.Render;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
var Constraint = Matter.Constraint;
let Mouse = Matter.Mouse;
let Collision = Matter.Collision;
var MouseConstraint = Matter.MouseConstraint;
let Sleeping = Matter.Sleeping;

let engine = Engine.create();  // create an engine

var gameStart = false;

var canvas;
var table = new Table();
var helper = new Helper();
var ballLayout = new BallLayout(800, 400 / 72);


////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1200, 600);
  angleMode(DEGREES);
  
  table.setupCushions();
  helper.setupMouseInteraction();
  

}
////////////////////////////////////////////////////////////
function draw() {
  background(125);

  Engine.update(engine);

  engine.world.gravity.y = 0; // set gravity
  table.drawTable();

  push();
    textSize(22);
    fill(255);
    stroke(255);
    text("CM2030 Mid Term", 450, 40);
  pop();

  let timer = new Timer();
  timer.drawTimer();

  if (!ballLayout.gameOption) {
     push();
    textSize(12);
    fill(255);
    text(
      'Select Mode with key: "o" for ordered, "u" for unordered, "p" for partially ordered',
      350,
      180
    );
    pop();
  } else {
    textSize(14);
    text("mode: " + ballLayout.gameOption, 25, 100);
    ballLayout.drawBalls();
    // scoreboard.drawScore();
    if (!gameStart) {
      textSize(12);
      fill(255, 255, 0)
      text(
        'Click anywhere with the D arc to place the cue ball (white)',
        350,
        180
      );
    } else {
      timer.startTimer();
      push();
      textSize(8);
      //draw the text telling the user
      //they can restart the game
      fill(255);
      text("press r to restart the game", 450, 50);
      pop();
      //draw the cue
      drawCueBall();
      // If the white ball is in the field of play but not 
      // constrained (in other words, not being setup to be
      // struck by the cue) then we are in play
      if (cueBallInField() && !cueBallConstrained()) {
        table.cushionCollision(ball)
        ballLayout.ballCollision(ball)
        ballLayout.ballInPocket();
        // check if game over
        // ballLayout.checkWin()
        if (cueBallStopped()) {
          // Set up constraint on the white ball so we can shoot again
          setUpCueConstraint(ball.position.x, ball.position.y);
          ballLayout.newTurn();
          //TODO
          // sp.deactivate()
        }
      } else if (!cueBallConstrained()) {
        // Ball has left the field so we allow the player to place it back
        // behind the D line
        // scoreboard.addScore(-4)
        removeCueBallFromWorld();
        // Setting gameStart to false allows the player to place the
        // whiteball and keep playing
        gameStart = false;
      }
    }
  }
}
////////////////////////////////////////////////////////////
function keyTyped(){
    //if the game hasn't started yet then the player can change the mode
  if (!gameStart && !ballLayout.gameOption) {
    //used to lowercase to allow both upper and lower case
    if (key.toLowerCase() === "u") {
      ballLayout.setGameOption("unordered");
    }
    if (key.toLowerCase() === "p") {
      ballLayout.setGameOption("partial");
    }
    if (key.toLowerCase() === "o") {
      ballLayout.setGameOption("ordered");
    }
  }
  //at any time the user can press r to restart the game by
  //reloading the window
  if (key.toLowerCase() === "r") {
    window.location.reload();
  }
}

