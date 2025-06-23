class BallLayout {
    constructor(tableLength, ballDiameter) {
        this.world = World;
        this.gameOption = "";

        // used for random placement of balls to ensure they are within the table limits
        this.tableXMin = 150 + 12 + table.railingWidth + table.cushionWidth;
        this.tableXMax = 950 - 24 - table.railingWidth - table.cushionWidth;
        this.tableYMin = 60 + 12 + table.railingWidth + table.cushionWidth;
        this.tableYMax = 460 - 12 - table.railingWidth - table.cushionWidth;

        this.ballDiameter = ballDiameter;
        this.ballRadius = ballDiameter / 2;
        this.ballSpacing = 7;

        this.balls = {
            red: [],
            color: []
        }

        /* 
           
        */
        this.coloredBalls = {
            black: {
                x: 150 + tableLength - (tableLength/12),
                y: 260,
                color: "black",
                value: 7
            },
            pink: {
                x: 750,
                y: 260,
                color: "pink",
                value: 6
            },
            blue: {
                x: 150 + tableLength/2,
                y: 260,
                color: "blue",
                value: 5
            },
            brown: {
                x: 150 + tableLength / 5,
                y: 260,
                color: "brown",
                value: 4
            },
            green: {
                x: 150 + tableLength / 5,
                y: 335,
                color: "green",
                value: 3
            },
            yellow: {
                x: 150 + tableLength / 5,
                y: 185,
                color: "yellow",
                value: 2
            },
        }
    }

    setGameOption = (gameOption) => {
        this.gameOption = gameOption;
        this.createBalls(gameOption);
    }


    createBall(x, y, color, value) {
        // console.log('ball', x, y, color, value)
        let ball = new Ball(x, y, color, value);
        // console.log('Ball', ball)
        this.balls[color == "red" ? "red" : "color"].push(ball);
        World.add(engine.world, [ball.object])
    }

    createRedBalls() {
        let initialX = 750 + this.ballDiameter;
        let initialY = 262;
        let radius= 4.7;
        for (var i = 0; i < 6; i++) {
            let yPos = initialY  - i * radius + 2.5;
            for (var j = 0; j < i; j++) {
                this.createBall(
                    initialX + i * (this.ballRadius + this.ballSpacing),
                    yPos + 2 * j * (this.ballDiameter),
                    'red',
                    1
                );
            }
        }
    }

    createOrderedColoredBalls() {
        for (let color in this.coloredBalls) {
            this.createBall(
                this.coloredBalls[color].x,
                this.coloredBalls[color].y,
                this.coloredBalls[color].color,
                this.coloredBalls[color].value,
            )
        }
    }

    createUnorderedBalls() {
        // table x limits are 150 to 950
        // table y limits are 60 to 460
        // FIrst randomly generate 15 red balls
        for (let i = 0; i < 15; i++) {
            this.createBall(
                random(this.tableXMin, this.tableXMax),
                random(this.tableYMin, this.tableYMax),
                'red',
                1
            );
            Sleeping.set(this.balls["red"][i]["object"], false);
        }
        // colored balls
        for (let i = 0; i < Object.keys(this.coloredBalls).length; i++) {
            let color = Object.keys(this.coloredBalls)[i];
            this.createBall(
                random(this.tableXMin, this.tableXMax),
                random(this.tableYMin, this.tableYMax),
                color,
                this.coloredBalls[color].value
            );
            
        Sleeping.set(this.balls["color"][i]["object"], false);

        }
    }   

    createPartiallyOrderedBalls() {
        // table x limits are 150 to 950
        // table y limits are 60 to 460
        // FIrst randomly generate 15 red balls
        for (let i = 0; i < 15; i++) {
            this.createBall(
                random(this.tableXMin, this.tableXMax),
                random(this.tableYMin, this.tableYMax),
                'red',
                1
            );
            Sleeping.set(this.balls["red"][i]["object"], false);
        }
        // colored balls
        for (let i = 0; i < Object.keys(this.coloredBalls).length; i++) {
            let color = Object.keys(this.coloredBalls)[i];
            this.createBall(
                this.coloredBalls[color].x,
                this.coloredBalls[color].y,
                this.coloredBalls[color].color,
                this.coloredBalls[color].value,
            );
        }
    }

    createBalls(gameOption) {
        switch (gameOption) {
            case "ordered":
                this.createRedBalls();
                this.createOrderedColoredBalls();
                break;
            case "unordered":
                this.createUnorderedBalls();
                break;
            case "partial":
                this.createPartiallyOrderedBalls();
                break;
            default: 
                break;
        }
    }

    setSleep(asleep) {
        for (let balltype in this.balls) {
            for (let ball of this.balls[balltype]) {
                Sleeping.set(ball.object, asleep);
            }
        }
    }

    drawBalls() {
        
        for (let balltype in this.balls) {
            // console.log(balltype);
            for (let ball of this.balls[balltype]) {
                // console.log(ball.object);
                push();
                switch (ball.color) {
                    case 'black':
                        fill(0);
                        break;
                    case 'blue':
                        fill(70, 0, 255);
                        break;
                    case 'brown':
                        fill(150, 75, 0);
                        break;
                    case 'green':
                        fill(0, 128, 0);
                        break;
                    case 'pink':
                        fill(241, 156, 187);
                        break;
                    case 'red':
                        fill(200, 0, 0);
                        break;
                    case 'yellow':
                        fill(255, 255, 0);
                        break;
                    default:
                        fill(125);
                        break;
                }

                noStroke();
                helper.drawVertices(ball.object.vertices);
            }
        }
    }
}
