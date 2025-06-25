
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
var timer;
var scoreBoard = new ScoreBoard();
var ballLayout = new BallLayout(800, 400 / 72);



////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1200, 600);
  angleMode(DEGREES);
  
  table.setupCushions();
  helper.setupMouseInteraction();

  timer = new Timer();
}



////////////////////////////////////////////////////////////
function draw() {
  background(125);
  // Note sure why I cannot use these as global  or in setup
  const cWhite = (255, 255, 255); // color variable
  const cYellow = color(255, 255, 0);

  Engine.update(engine);

  engine.world.gravity.y = 0; // set gravity
  table.drawTable();

  push();
  // helper.drawText(text, xpos, ypos, textsize, fill, stroke)
  helper.drawText("CM2030 Mid Term - Snooker", 450, 40, 22, 255, cWhite)

  // Timer is a run down clock 
  timer.drawTimer();

  if (!ballLayout.gameOption) {
    push()
      helper.drawText( "To start, there are three possible play modes: ", 350, 180, 12, cWhite);
      helper.drawText('- "1" for standard starting positions layout\n- "2" for random all\n- "3" for random reds only', 350, 210, 12, cWhite);
    pop()
  } else {
    push()
      helper.drawText("mode: " + ballLayout.gameOption, 10, 100, 14, cWhite);
    pop()
    ballLayout.drawBalls();
    push()
      scoreBoard.drawScore();
    pop()  
    if (!gameStart) {
      push()
        helper.drawText('Click anywhere with the D arc to place the cue ball (white)',350, 180, 12, cYellow);
      pop()
    } else {
      timer.startTimer();
      push()
        helper.drawText("*** n to start\na new game", 10, 120, 12, cYellow)
      pop()
      //draw the cue and ball
      drawCueBall();
      // If the white ball is in the field of play but not 
      // constrained (in other words, not being setup to be
      // struck by the cue) then we are in play
      if (cueBallInPlay() && !cueBallConstrained()) {
        table.cushionCollision(ball)
        ballLayout.ballCollision(ball)
        ballLayout.ballInPocket();
        // check if game over
        ballLayout.checkWin()
        if (cueBallStopped()) {
          // Set up constraint on the white ball so we can shoot again
          setUpCueConstraint(ball.position.x, ball.position.y);
          ballLayout.newTurn();
        }
      } else if (!cueBallConstrained()) {
        // Ball has left the field so we allow the player to place it back
        // behind the D line
        scoreBoard.addScore(-4);
        ballLayout.drawPenalty();
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
    if (key.toLowerCase() === "1") {
      ballLayout.setGameOption("standard");
    }
    if (key.toLowerCase() === "2") {
      ballLayout.setGameOption("unordered");
    }
    if (key.toLowerCase() === "3") {
      ballLayout.setGameOption("random");
    }
  }
  //at any time the user can press r to restart the game by
  //reloading the window
  if (key.toLowerCase() === "n") {
    window.location.reload();
  }
}

