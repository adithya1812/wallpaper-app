function generateFlowfield(cols, rows) {
  // Generate a 2D array representing the flow field
  let field = [];
  for (let i = 0; i < cols; i++) {
    field[i] = [];
    for (let j = 0; j < rows; j++) {
      // Calculate angle based on Perlin noise for each cell
      let angle = noise(i / resolution, j / resolution) * TWO_PI;
      // Create a 2D vector with magnitude 1 based on the angle
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      field[i][j] = v; // Store the vector in the flow field array
    }
  }
  return field; // Return the generated flow field
}

class Particle {
  constructor() {
    // Initialize particle properties
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    // Determine particle color based on flow field mode
    if (flowfieldModeChosen == "normal") {
      this.color = random(360); // Random hue for normal mode
    } else if (flowfieldModeChosen == "custom") {
      this.color = random(
        min(selectedHue1, selectedHue2), // Random hue within custom range
        max(selectedHue1, selectedHue2)
      );
    }
    this.size = 2.5; // Particle size
    this.prevPos = this.pos.copy(); // Store previous position for movement calculations
  }

  update() {
    // Update particle position and velocity based on flow field
    let col = floor(this.pos.x / resolution);
    let row = floor(this.pos.y / resolution);

    col = constrain(col, 0, flowfield.length - 1);
    row = constrain(row, 0, flowfield[col].length - 1);

    let flow = flowfield[col][row];

    this.acc.set(flow.x, flow.y);
    this.vel.add(this.acc);
    this.vel.limit(2);

    this.pos.add(this.vel);

    // Handle particle movement looping
    let distance = this.pos.dist(this.prevPos);
    if (distance < loopThreshold) {
      this.vel.mult(-1);
    } else {
      this.prevPos = this.pos.copy();
    }

    // Adjust particle color based on flow field mode and color change direction
    if (flowfieldModeChosen == "normal") {
      if (colourChangeIncrease == true) {
        this.color = this.color + colourChange;
        if (this.color >= 360) {
          this.color = 330;
          colourChangeIncrease = false;
        }
      } else if (colourChangeIncrease == false) {
        this.color = this.color - colourChange;
        if (this.color <= 0) {
          this.color = 30;
          colourChangeIncrease = true;
        }
      }
    } else if (flowfieldModeChosen == "custom") {
      if (colourChangeIncrease == true) {
        this.color = this.color + colourChange;
        if (this.color >= max(selectedHue1, selectedHue2)) {
          this.color = max(selectedHue1, selectedHue2);
          colourChangeIncrease = false;
        }
      } else if (colourChangeIncrease == false) {
        this.color = this.color - colourChange;
        if (this.color <= min(selectedHue1, selectedHue2)) {
          this.color = min(selectedHue1, selectedHue2);
          colourChangeIncrease = true;
        }
      }
    }
  }

  display() {
    // Display the particle with its current color
    fill(this.color, 100, 100);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  shouldRemove() {
    // Check if the particle is out of bounds
    return (
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    );
  }
}
