let strokeColor; 
let baseCircleColor;   // color for the white background circle
let outerDotColor;     // color for the red dots outside
let angleDots = 0;     // controls how much the red dots rotate
let dotSizes = [];     // stores the size of each ring of dots
let circles = [];      // an array to store all circle objects

function setup() {
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
  background('#024E6B'); // dark background
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
    this.dotSpeed = 0.01;              
    this.generateColors();           // pick random colors
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
  }

  // Draw everything in this circle
  draw() {
    push();
    translate(this.x, this.y); // move to the circle’s center

    // Draw white background circle
    fill(this.baseCircleColor);
    noStroke();
    circle(0, 0, this.r * 1.3);

    // Draw rotating red dots
    push();
    rotate(this.angleDots); 
    this.drawOuterDots(0, 0, this.r);
    pop();

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
    stroke(80, 255, 120, 60);
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

  // Draw red dots in rings around the center
  drawOuterDots(x, y, r) {
    let maxRadius = r * 0.6;
    let ringIndex = 0;

    for (let i = 10; i < maxRadius; i += 12) {
      let numDots = floor(TWO_PI * i / 10); // how many dots on this ring
      let dotSize = this.dotSizes[ringIndex];
      let activeDot = floor(this.dotProgress*numDots/TWO_PI);

      for (let j = 0; j < numDots; j++) {
        let distFromActive = (j - activeDot + numDots)%numDots
        if(distFromActive < this.trailLength){
        let angle = TWO_PI * j / numDots;
        let dx = x + cos(angle) * i;
        let dy = y + sin(angle) * i;
        fill(this.outerDotColor);
        noStroke();
        ellipse(dx, dy, dotSize); // draw each dot
        }
      }
      ringIndex++;
    }
  }
}