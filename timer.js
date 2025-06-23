class Timer {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.limitMinutes = 10;
        this.limitSeconds = 0;
    }

    startTimer() {
        if (frameCount % 60 === 0) {
            if (this.limitMinutes == 0 && this.limitSeconds == 0) {
                this.limitMinutes = 0;
                this.limitSeconds = 0;
                noLoop();
            } else if (this.limitSeconds == 0) {
                this.limitMinutes -= 1;
                this.limitSeconds = 60;
            }
            this.limitSeconds -= 1;
        }
    }

      //draws the timer
  drawTimer() {
    push();
    textSize(18);
    fill("white");
    stroke(255);
    //adds a "0" before the minutes and seconds if they're less than 10
    if (this.limitMinutes + this.limitSeconds != 0) {
      text(
        `Time left: ${this.limitMinutes < 10 ? "0" + this.limitMinutes : this.limitMinutes}:${
          this.limitSeconds < 10 ? "0" + this.limitSeconds : this.limitSeconds
        }`,
        10,
        50
      );
    } else {
      text("TIME'S UP!", 1050, 200);
    }

    pop();
  };

}