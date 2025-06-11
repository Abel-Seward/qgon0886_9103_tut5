let strokeColor; 
let baseCircleColor;   // color for the white background circle
let outerDotColor;     // color for the red dots outside
let angleDots = 0;     // controls how much the red dots rotate
let dotSizes = [];     // stores the size of each ring of dots
let circles = [];      // an array to store all circle objects

function setup() {
  background(2,78,107);
  // Create the canvas using the size of the window
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); // use radians for angle measurements

  // Set center of the screen and circle size
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  let radius = 200; 
  let spacing = radius * 1.5; // distance between circle centers

  // Add one circle in the center
  circles.push(new PatternCircle(centerX, centerY, radius));

  // Add 6 outer circles around the center
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = centerX + cos(angle) * spacing;
    let y = centerY + sin(angle) * spacing;
    circles.push(new PatternCircle(x, y, radius));
  }
}

function draw() {
  background(2, 78, 107,80);
  for (let c of circles) {
    c.update(); // update animations
    c.draw();   // draw each circle
  }
}

// When mouse is clicked, change colors of all circles
function mousePressed() {
  for (let c of circles) {
    c.generateColors();
  }
}

// This class creates each circle design
class PatternCircle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.angleDots = random(TWO_PI); // start rotation from a random angle
    this.dotSizes = [];
    this.trailLength = 30;
    this.dotProgress = 0;
    this.dotSpeed = 0.09;              
    this.generateColors();           // pick random colors
    this.dotsTrail = []; //Array of historical positional transparency for each point of each ring
    let maxRadius = this.r * 0.6;
    let ringIndex = 0;
    for (let i = 10; i < maxRadius; i += 12) {
      let numDots = floor(TWO_PI * i / 10);
      this.dotsTrail[ringIndex] = [];
      for (let j = 0; j < numDots; j++) {
        this.dotsTrail[ringIndex][j] = [];
      }
      ringIndex++;
    }
  }

  // Pick random colors for this circle
  generateColors() {
    this.strokeColor = color(random(0, 255), random(0, 100), random(10, 150));
    this.baseCircleColor = color(random(200, 255), random(200, 255), random(200, 255));
    this.bgColor = color(random(150, 255), random(150, 255), random(150, 255));
    this.lineColor = color(random(200, 255), random(200, 255), random(0, 100));
    this.outerDotColor = color(random(0, 255), random(0, 80), random(0, 255));

    this.dotSizes = [];
    let maxRadius = this.r * 0.6;
    for (let r = 10; r < maxRadius; r += 12) {
      this.dotSizes.push(random(3, 6)); // choose size for each ring of dots
    }
  }

  // Slowly rotate the red dots
  update() {
    this.angleDots += 0.005;
    this.dotProgress = (this.dotProgress + this.dotSpeed) % TWO_PI;
  
    let maxRadius = this.r * 0.6;
    let ringIndex = 0;
    for (let i = 10; i < maxRadius; i += 12) {
      let numDots = floor(TWO_PI * i / 10);
      let dotIndex = floor((this.dotProgress * numDots) / TWO_PI);
      let angle = TWO_PI * dotIndex / numDots + this.angleDots;
      let dx = cos(angle) * i;
      let dy = sin(angle) * i;
      // access the trail array for the first dot on this ring
      let trail = this.dotsTrail[ringIndex][0]; 
      trail.push(createVector(dx, dy));
      if (trail.length > this.trailLength) trail.shift();// remove oldest position if trail is longer than allowed length
  
      ringIndex++;
    }
  }

  // Draw everything in this circle
  draw() {
    push();
    translate(this.x, this.y); // move to the circle's center

    // Draw white background circle
    fill(this.baseCircleColor);
    noStroke();
    circle(0, 0, this.r * 1.3);

    //draw dots with new function
    this.drawOuterDotsWithTrail();

    // Draw the pink background circle
    fill(this.bgColor);
    stroke(this.strokeColor);
    strokeWeight(5);
    circle(0, 0, this.r * 0.63);

    // Draw lines from center like spikes
    stroke(this.lineColor);
    let spikes = 30;
    let innerR = 20;
    let outerR = 59;
    for (let i = 0; i < spikes; i++) {
      strokeWeight(i % 2 === 0 ? 3 : 1.5); // thick and thin lines
      let angle1 = TWO_PI * i / spikes;
      let angle2 = TWO_PI * (i + 1) / spikes;
      let x1 = cos(angle1) * innerR;
      let y1 = sin(angle1) * innerR;
      let x2 = cos(angle2) * outerR;
      let y2 = sin(angle2) * outerR;
      line(x1, y1, x2, y2);
    }

    // Draw several small colored circles in the center
    noStroke();
    fill(255, 65, 70);
    circle(0, 0, this.r * 0.23);

    fill(100, 130, 100);
    circle(0, 0, this.r * 0.2);

    noFill();
    stroke(80, 255, 120);
    strokeWeight(2.5);
    fill(180, 50, 80);
    circle(0, 0, this.r * 0.15);

    fill(30, 180, 60);
    circle(0, 0, this.r * 0.07);

    fill(255);
    circle(0, 0, this.r * 0.03);

    // Draw two black arcs for decoration
    stroke(30, 40, 50, 90);
    strokeWeight(2);
    noFill();
    arc(0, 0, 24, 23, PI * 1.05, PI * 1.85);
    arc(0, 0, 20, 25, PI * 0.45, PI * 0.75);

    // Draw two animated bezier curves.
    let rotateAngle = frameCount * 0.02;
    push();
    rotate(rotateAngle);

    stroke(255, 0, 100);
    strokeWeight(5);
    noFill();
    bezier(0, 0, this.r * 0.3, -this.r * 0.1, this.r * 0.5, this.r * 0.05, this.r * 0.65, this.r * 0.2);

    stroke(255, 60, 160);
    strokeWeight(3);
    bezier(0, 0, this.r * 0.3, -this.r * 0.1, this.r * 0.5, this.r * 0.05, this.r * 0.65, this.r * 0.2);

    pop(); // end bezier rotation
    pop(); // end main drawing
  }

  drawOuterDotsWithTrail() {
    noStroke();
  
    for (let ringIndex = 0; ringIndex < this.dotsTrail.length; ringIndex++) {
      let dotSize = this.dotSizes[ringIndex];// get the size of the dots for this ring
      let trail = this.dotsTrail[ringIndex][0];// access the trail history for the first dot in this ring
      // iterate through the saved trail positions to draw the tail effect
      for (let k = 0; k < trail.length; k++) {
        let pos = trail[k];
        let alpha = map(k, 0, trail.length - 1, 50, 255);// calculate transparency
        fill(red(this.outerDotColor), green(this.outerDotColor), blue(this.outerDotColor), alpha);
        ellipse(pos.x, pos.y, dotSize);
      }
    }
  }
  
  drawOuterDots(x, y, r) {
    let maxRadius = r * 0.6;
    let ringIndex = 0;

    for (let i = 10; i < maxRadius; i += 12) {
      let numDots = floor(TWO_PI * i / 10); // how many dots on this ring
      let dotSize = this.dotSizes[ringIndex];
      let activeDot = floor(this.dotProgress*numDots/TWO_PI);

      for (let t = 0; t < this.trailLength; t++) {
        let index = (activeDot - t + numDots)%numDots
        let angle = TWO_PI * index / numDots;
        let dx = x + cos(angle) * i;
        let dy = y + sin(angle) * i;

        let alpha = map(t, 0, this.trailLength, 255, 0);
        fill(this.outerDotColor, alpha);
        noStroke();
        ellipse(dx, dy, dotSize); // draw each dot     
      }
      ringIndex++;
    }
  }
}