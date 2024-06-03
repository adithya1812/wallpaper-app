class Ball {
  constructor() {
    // Initialize ball properties with random values
    this.x = random(width);
    this.y = random(height);
    this.size = random(40, 100);
    this.radius = this.size / 2;
    this.colour = random(colours); // Randomly choose a color from the available color array
    this.veloX = random(1, 5); // Random horizontal velocity
    this.veloY = random(1, 5); // Random vertical velocity
    // Function to check collision with other balls and adjust position and color if necessary
    this.intersects = function (other) {
      let d = dist(this.x, this.y, other.x, other.y);
      if (d <= this.radius + other.radius) {
        let overlap = this.radius + other.radius - d;
        this.x += overlap / 4;
        this.y += overlap / 4;
        other.x -= overlap / 4;
        other.y -= overlap / 4;
        this.colour = random(colours); // Change color after collision
        return true; // Collision detected
      } else {
        return false; // No collision
      }
    };
    noStroke(); // No stroke for drawing balls
  }

  show() {
    if (ballModeChosen == "normal" || ballModeChosen == "bgChange") {
      // Display ball with fixed or changing color based on chosen mode
      this.move(); // Move the ball
      // Set color based on chosen color
      fill(this.colour); // Set fill color
      circle(this.x, this.y, this.size); // Draw the ball
    } else if (
      ballModeChosen == "ballChange" ||
      ballModeChosen == "bothChange"
    ) {
      // Display ball with color changing based on noise
      this.move(); // Move the ball
      // Generate noise values for color variation
      let noiseR = noise(this.x * noiseScale, this.y * noiseScale);
      let noiseG = noise(this.x * noiseScale + 100, this.y * noiseScale + 100); // Offset noise for color variation
      let noiseB = noise(this.x * noiseScale + 200, this.y * noiseScale + 200); // Offset noise for color variation
      // Map noise values to color range (0-255)
      r = map(noiseR, 0, 1, 0, 255);
      g = map(noiseG, 0, 1, 0, 255);
      b = map(noiseB, 0, 1, 0, 255);
      let newColor = color(r, g, b); // Create color object
      fill(newColor); // Set fill color
      circle(this.x, this.y, this.size); // Draw the ball
    }
  }

  move() {
    this.bounce(); // Check for boundary collision and bounce if necessary
    this.x += this.veloX; // Update x position
    this.y += this.veloY; // Update y position
  }

  bounce() {
    // Check for boundary collision and adjust velocity and position if necessary
    if (this.x > width - this.size / 2 || this.x < this.size / 2) {
      this.veloX = -this.veloX; // Reverse horizontal velocity
      // Adjust position to prevent sticking at boundary
      if (this.x > width - this.size / 2) {
        this.x = this.x - this.size / 14;
      } else if (this.x < this.size / 2) {
        this.x = this.x + this.size / 14;
      }
    }
    if (this.y > height - this.size / 2 || this.y < this.size / 2) {
      this.veloY = -this.veloY; // Reverse vertical velocity
      // Adjust position to prevent sticking at boundary
      if (this.y > height - this.size / 2) {
        this.y = this.y - this.size / 14;
      } else if (this.y < this.size / 2) {
        this.y = this.y + this.size / 14;
      }
    }
  }
}
