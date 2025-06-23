  /** 
    The class 'Table' is responsible for drawing a table with a 
   'slab' that has 6 cushions (1 cushion at either end of the table
    and two on each side).  Each cushion is separated by a 'pocket'.
    The class also has several methods for drawing the table, and 
    interaction with the player. 
  
    Standard table is 12ft (144 inches) long by 6ft (72 inches) wide
    This table is 800px long and 400px wide.
    The cushion width is typically 1 inch on standard table so we want to
    maintain proportions so we divide width by 72 then make it half (multiply by 1.5)
    as big to simulate the cushion overhang that exists on a standard table.
    This is arbitrary anyway.  What matters is that the sweet spot on each ball
    is slightly higher than the height of the cushion.
    const box = this.tableWidth/72 * 1.5;
    The cushion height on a snooker table is 0.635 : 
    https://plus.maths.org/content/outer-space-cushioning-blow
    const height = 0.635 * this.ballDiameter;
    We need to add 6 cushions
 */

class Table {
  constructor() {
    this.cushions = [];
    this.tableLength = 800;
    this.tableWidth = this.tableLength / 2;
    this.tableStartX = 150;
    this.tableStartY = 60;
    this.railingWidth = 15;
    this.tableMidX = 150 + this.tableLength/2;  // Not used but very useful for positioning elements
    this.ballDiameter = this.tableWidth/36;
    this.pocketSize = this.ballDiameter*1.5;
    this.dLineRadius = this.tableWidth/2; // radius of the D line arc
    this.cushionAngle = 0.05;
    this.cushionWidth = this.tableWidth / 72 * 1.5; // 1 inch on standard table 8.3 px here
    this.smallRailWidth = 365;
    this.dLineRadius = this.tableWidth/2; // radius of the D line arc
  }

  setupCushions = () => {
      // matter.js trapezoid (x,y, width, height, slope)
      // top left cushion
      this.cushions.push(
        Bodies.trapezoid(358, 79, this.smallRailWidth -22.5, this.cushionWidth, -this.cushionAngle, {
        isStatic: true,
        restitution: 1
        })
      );

      // top right cushion
      this.cushions.push(
        Bodies.trapezoid(742, 79, this.smallRailWidth - 22, this.cushionWidth, -this.cushionAngle, {
        isStatic: true,
        restitution: 1
        })
      );

      // left cushion
      this.cushions.push(
        Bodies.trapezoid(150 + this.railingWidth + 4, 259.5, this.smallRailWidth-22, this.cushionWidth, this.cushionAngle, {
        isStatic: true,
        restitution: 1,
        angle: Math.PI/2,
        })
      );

      // bottom left cushion
      this.cushions.push(
        Bodies.trapezoid(358, 441, this.smallRailWidth - 6, this.cushionWidth, this.cushionAngle, {
        isStatic: true,
        restitution: 1,
        })
      );

      // bottom right cushion
      this.cushions.push(
        Bodies.trapezoid(742, 441, this.smallRailWidth - 6 , this.cushionWidth, this.cushionAngle, {
        isStatic: true,
        restitution: 1,
        })
      );

      // right cushion
      this.cushions.push(
        Bodies.trapezoid(931, 260, this.smallRailWidth-24, this.cushionWidth, this.cushionAngle, {
        isStatic: true,
        restitution: 1,
        angle: -Math.PI/2,
        })
      );

      for (let cushion of this.cushions) {
        World.add(engine.world, cushion);
      }
    };

  drawCushions = () =>  {
    for (let cushion of this.cushions) {
      push();
        noStroke();
        fill(83, 95, 77);
        fill(cushion.render.visible ? "#346219":"#69F319");
        helper.drawVertices(cushion.vertices);
        stroke(255);
      pop();
    }
  }

  drawSlab = () => {
    noStroke();
    // Slab.  Color based on google search 
    fill(83, 108, 77);
    rect(this.tableStartX + 12, this.tableStartY, this.tableLength -24, this.tableWidth);
  }

  drawRailings = () => {
    fill(99, 59, 59);
    //left
    rect(
      this.tableStartX, 
      this.tableStartY + 25, 
      this.railingWidth, 
      this.tableWidth - 50
    );
  
    //top
    rect(
      162, 
      60, 
      this.tableLength - this.railingWidth -12, 
      this.railingWidth
    );
   
    //right
    rect(this.tableStartX + this.tableLength - this.railingWidth,
      this.tableStartY + 20, 
      this.railingWidth, 
      this.tableWidth - this.railingWidth - 20
    );

    //bottom
    rect(
      150 + 25, 
      this.tableWidth + 45, 
      this.tableLength - this.railingWidth * 2 - 10, 
      15
    );
  }

  drawYellowPockets = () => {
    fill (241, 215, 74);
    //top left
    rect(
      this.tableStartX, this.tableStartY, 28, 28, 15, 0, 0, 0);
    //top mid
    rect(this.tableMidX - 12, this.tableStartY, 24, 15);
    //top right
    rect(this.tableStartX + this.tableLength - 28, this.tableStartY, 28, 28, 0, 15, 0, 0);
    //bottom left
    rect(this.tableStartX, this.tableStartY + this.tableWidth - 28, 28, 28, 0, 0, 0, 15);
    //bottom mid
    rect(this.tableMidX - 12, this.tableStartY + this.tableWidth - this.railingWidth, 24, 15);
    //bottom right
    rect(this.tableStartX + this.tableLength - 28, this.tableStartY + this.tableWidth - 28, 28, 28, 0, 0, 15, 0);
  };

  // mid x is left gap (150) + tableLength/2 - pocketSize/2 
  drawHoles = () => {
    fill(125);
    //top left
    ellipse(this.tableStartX + 22, this.tableStartY + 22, this.pocketSize);
    //top mid
    ellipse(this.tableMidX, this.tableStartY + 15, this.pocketSize);
    //top right
    ellipse(150 + this.tableLength - 22, this.tableStartY + 22, this.pocketSize);
    //bottom left
    ellipse(this.tableStartX + 22, this.tableStartY + this.tableWidth - 22, this.pocketSize);
    //bottom mid
    ellipse(this.tableMidX, this.tableStartY + this.tableWidth - 15 , this.pocketSize);
    //bottom right
    ellipse(150 + this.tableLength - 22, this.tableStartY + this.tableWidth - 22, this.pocketSize);
  }

  drawDLine = () => {
    const dlineXstart = 150 + this.tableLength / 5;
    const dlineYstart = this.tableStartY + this.railingWidth + this.cushionWidth;
    const dlineYend = this.tableStartY + this.tableWidth - 22;
    // fill(255)
        //  ellipse(dlineXstart, tableStartY + tableWidth/2, 20, 20);  // Test point
        push();
          stroke(255);
            line(
                dlineXstart,
                dlineYstart,
                dlineXstart,
                dlineYend,
            );  
            noFill();
            // arc(dlineXstart, 200, dLineRadius, dLineRadius, 90, 180);
            arc(150 + this.tableLength / 5, this.tableStartY + this.tableWidth/2, 150, 150, 90, 270);
        pop()
      
  }

  cushionCollision = (cue) => {
    //changes the render of the cushion when colliding with the cue ball
   
    for (let cushion of this.cushions){
        if(Collision.collides(cue, cushion)){
           // during the cusion draw, this property
           // determines the color of the cushion to 
           // simulate a cushion strike
           cushion.render.visible = false;
        }
        else{
          cushion.render.visible = true;
        }
    }
  }

  drawTable = () => {
    this.drawSlab();
    this.drawCushions(this.cushions);
    this.drawRailings();
    this.drawYellowPockets();
    this.drawHoles();
    this.drawDLine();
  }
}
