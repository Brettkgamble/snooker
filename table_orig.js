  /** 
 * TODO - Refactor to a class
 * The class 'Table' is responsible for drawing a table with a 
 * 'slab' that has 6 cushions (1 cushion at either end of the table
 *  and two on each side).  Each cushion is separated by a 'pocket'.
 *  The class also has several methods for drawing the table, and 
 *  interaction with the player. 
 * 
 *  Standard table is 12ft (144 inches) long by 6ft (72 inches) wide
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
  // Table slab
  const tableLength = 800;
  const tableWidth = tableLength / 2;
  const tableStartX = 150;
  const tableStartY = 60;
  const railingWidth = 15;
  const tableMidX = 150 + tableLength/2;  // Not used but very useful for positioning elements
  

  // 
  const cushions = [];
  const cushionAngle = 0.05;
  const cushionWidth = tableWidth / 72 * 1.5; // 1 inch on standard table 8.3 px here
  const smallRailWidth = 365;

  const ballDiameter = tableWidth/36;
  const pocketSize = ballDiameter*1.5;

  const dLineRadius = tableWidth/2; // radius of the D line arc

  /* 
    The slab is the main hard surface that is covered in green felt
  */
  function drawSlab() {
    noStroke();
    // Slab.  Color based on google search 
    fill(83, 108, 77);
    rect(tableStartX + 12, tableStartY, tableLength -24, tableWidth);
  }

  /* 
        Cushions (trapezoids) are the main interactivity for the table itself.
        Cushions are the physics of the rails which are drawn on the surface.
        When a ball makes contact with a cushion it will bounce off
        in a direction perpendicular to its approach.  The cushion will 
        also absorb some of the energy of a ball, the effect being that
        the rate of deacceleration after hitting a cushion is increased.
        There are 6 cushions.
        - one at each end 
        - two on each side
        The cushions are separated by pockets 
  */
  function setupCushions() {
    // matter.js trapezoid (x,y, width, height, slope)
    
    // top left cushion
    cushions.push(
      Bodies.trapezoid(358, 79, smallRailWidth -22.5, cushionWidth, -cushionAngle, {
      isStatic: true,
      restitution: 1
      })
    );

    // top right cushion
    cushions.push(
      Bodies.trapezoid(742, 79, smallRailWidth - 22, cushionWidth, -cushionAngle, {
      isStatic: true,
      restitution: 1
      })
    );

    // left cushion
    cushions.push(
      Bodies.trapezoid(150 + railingWidth + 4, 259.5, smallRailWidth-22, cushionWidth, cushionAngle, {
      isStatic: true,
      restitution: 1,
      angle: Math.PI/2,
      })
    );

    // bottom left cushion
    cushions.push(
      Bodies.trapezoid(358, 441, smallRailWidth - 6, cushionWidth, cushionAngle, {
      isStatic: true,
      restitution: 1,
      })
    );

    // bottom right cushion
    cushions.push(
      Bodies.trapezoid(742, 441, smallRailWidth - 6 , cushionWidth, cushionAngle, {
      isStatic: true,
      restitution: 1,
      })
    );

    // right cushion
    cushions.push(
      Bodies.trapezoid(931, 260, smallRailWidth-24, cushionWidth, cushionAngle, {
      isStatic: true,
      restitution: 1,
      angle: -Math.PI/2,
      })
    );

    for (let cushion of cushions) {
      World.add(engine.world, cushion);
    }
  }

  function drawCushions() {
    for (let cushion of cushions) {
      push();
        noStroke();
        fill(83, 95, 77);
        drawVertices(cushion.vertices);
        stroke(255);
      pop();
    }
  }

  function drawRailings() {
    fill(99, 59, 59);
    //left
    rect(
      tableStartX, 
      tableStartY + 25, 
      railingWidth, 
      tableWidth - 50
    );
  
    //top
    rect(
      162, 
      60, 
      tableLength - railingWidth -12, 
      railingWidth
    );
   
    //right
    rect(tableStartX + tableLength - railingWidth,
      tableStartY + 20, 
      railingWidth, 
      tableWidth - railingWidth - 20
    );

    //bottom
    rect(
      150 + 25, 
      tableWidth + 45, 
      tableLength - railingWidth * 2 - 10, 
      15
    );
  }

/**
     * The pocket silhouettes are the yellow background areas that define the container
     * for a pocket hole.  
     * rect notes:
     * rect (x, y, width, height, top-left-round, top-right-round, btoom-right-round, bottom-left-round)
  */
  const drawYellowPockets = () => {
    fill (241, 215, 74);
    //top left
    rect(
      tableStartX, tableStartY, 28, 28, 15, 0, 0, 0);
    //top mid
    rect(tableMidX - 12, tableStartY, 24, 15);
    //top right
    rect(tableStartX + tableLength - 28, tableStartY, 28, 28, 0, 15, 0, 0);
    //bottom left
    rect(tableStartX, tableStartY + tableWidth - 28, 28, 28, 0, 0, 0, 15);
    //bottom mid
    rect(tableMidX - 12, tableStartY + tableWidth - railingWidth, 24, 15);
    //bottom right
    rect(tableStartX + tableLength - 28, tableStartY + tableWidth - 28, 28, 28, 0, 0, 15, 0);
  };

  // mid x is left gap (150) + tableLength/2 - pocketSize/2 
  function drawHoles() {
    fill(125);
    //top left
    ellipse(tableStartX + 22, tableStartY + 22, pocketSize);
    //top mid
    ellipse(tableMidX, tableStartY + 15, pocketSize);
    //top right
    ellipse(150 + tableLength - 22, tableStartY + 22, pocketSize);
    //bottom left
    ellipse(tableStartX + 22, tableStartY + tableWidth - 22, pocketSize);
    //bottom mid
    ellipse(tableMidX, tableStartY + tableWidth - 15 , pocketSize);
    //bottom right
    ellipse(150 + tableLength - 22, tableStartY + tableWidth - 22, pocketSize);
  }

  function drawDLine() {
    const dlineXstart = 150 + tableLength / 5;
    const dlineYstart = tableStartY + railingWidth + cushionWidth;
    const dlineYend = tableStartY + tableWidth - 22;
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
            arc(150 + tableLength / 5, tableStartY + tableWidth/2, 150, 150, 90, 270);
        pop()
      
  }


  function drawTable() {
    drawSlab();
    setupCushions();
    drawCushions();
    drawRailings();
    drawYellowPockets();
    drawHoles();
    drawDLine();

  }