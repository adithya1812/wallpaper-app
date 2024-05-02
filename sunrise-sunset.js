function drawSun() {
  // Draw the sun image at its current position
  noTint(); // Disable tinting for the image
  image(sunImg, sun.x, sun.y, 300, 300); // Display the sun image
}

function setSunProgress() {
  // Set the progress of the sun animation if not already set
  if (progressSetAlr == false) {
    sun.progress = 0; // Set sun's progress to 0
    progressSetAlr = true; // Mark progress as set
  }
}

function drawMountains() {
  // Draw the mountains in the background
  fill("#3F362E"); // Set fill color for the mountains
  beginShape(); // Begin defining the shape of the mountains
  let xoff1 = yoff1; // Initialize x offset for noise
  for (let x = 0; x <= width + 10; x += 10) {
    // Loop through horizontal pixels
    // Calculate a y value using Perlin noise
    let y = map(noise(xoff1), 0, 1, 0.3 * height, height);
    vertex(x, y); // Set vertex for the mountain shape
    xoff1 += 0.05; // Increment x dimension for noise variation
  }
  yoff1 += 0.01; // Increment y dimension for noise variation
  vertex(width, height); // Set bottom-right vertex of the shape
  vertex(0, height); // Set bottom-left vertex of the shape
  endShape(CLOSE); // End and close the shape
  fill("green"); // Set fill color for the ground
  beginShape(); // Begin defining the shape of the ground
  let xoff2 = 0; // Initialize x offset for noise
  for (let x = 0; x <= width + 30; x += 30) {
    // Loop through horizontal pixels
    // Calculate a y value using 2D Perlin noise
    let y = map(noise(xoff2, yoff2), 0, 1, 0.75 * height, height);
    vertex(x, y); // Set vertex for the ground shape
    man.style.left = width - 200 + "px"; // Position man element horizontally
    man.style.top = y - 275 + "px"; // Position man element vertically
    xoff2 += 0.05; // Increment x dimension for noise variation
  }
  yoff2 += 0.01; // Increment y dimension for noise variation
  vertex(width, height); // Set bottom-right vertex of the shape
  vertex(0, height); // Set bottom-left vertex of the shape
  endShape(CLOSE); // End and close the shape
}

function drawClouds() {
  // Draw clouds with a translucent white color
  fill(255, 4);
  // Loop through each cloud location
  for (let i = 0; i < cloudLocation.length; i++) {
    cloudLocation[i][0] += randomGaussian(0.01 * 100, 1); // Update cloud position horizontally
    cloudLocationX = cloudLocation[i][0] % width; // Get adjusted cloud position within canvas width
    if (cloudLocationX > 0) {
      circle(cloudLocationX, cloudLocation[i][1], 100); // Draw cloud with adjusted position
    } else if (cloudLocationX <= 0) {
      circle(width + cloudLocationX, cloudLocation[i][1], 75); // Draw cloud with adjusted position
    }
  }
}
