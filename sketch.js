//TO BE VIEWED IN FULLSCREEN//
// Declaring global variables
let wallpaperChosen = false; // Flag to track if a wallpaper is chosen
let sunBtn, flowfieldModeBtn, ballBtn, backBtn, restartBtn; // Buttons for different wallpapers and actions

// Flowfield wallpaper variables
let flowfield; // Array to hold flowfield vectors
let flowfieldCustomBtn, flowfieldNormalBtn, flowfieldContinueBtn; // Buttons for flowfield customization
let flowfieldModeChosen = "normal"; // Flowfield mode: normal or custom
let resolution = 20; // Resolution for flowfield vectors
let particles = []; // Array to hold particle objects
let loopThreshold = 0.1; // Threshold for loop detection in particles
let numParticles; // Number of particles
let colourChange = 2; // Amount of color change
let colourChangeIncrease = true; // Flag to track if color change is increasing or decreasing
let noOfParticles = numParticles; // Number of particles (used for display)
let centerX1, centerY1, centerX2, centerY2, radius; // Color wheel center and radius variables
let selectedHue1 = 0,
  selectedHue2 = 0; // Selected hues from color wheel
let showColourWheel = false; // Flag to track if color wheel should be displayed

// Sunrise and sunset wallpaper variables
let sunContinueBtn; // Button to continue to sunrise/sunset wallpaper
let sun,
  progressAdding = 0.002,
  progressSetAlr = false; // Sun object and progress variables
let yoff1 = 0.0,
  yoff2 = 0.0; // Perlin noise offset variables
let bgColour,
  moonOpacAmt = 0; // Background color and moon opacity variables
let sunImg, moonImg, man; // Images for sun, moon, and man
let cloudLocation = []; // Array to hold cloud locations

// Bouncing balls wallpaper variables
let ballModeChosen = "normal"; // Ball mode: normal, ballChange, bgChange, bothChange
let ballNormalBtn, ballChangeBtn, bgChangeBtn, bothChangeBtn, ballContinueBtn; // Buttons for ball customization
let colours = [
  "cyan",
  "lime",
  "pink",
  "yellow",
  "orange",
  "#057DFF",
  "#FE0000",
  "#FEE892",
  "#F6FCFF",
]; // Array of colors for balls
let balls = []; // Array to hold ball objects
let noiseScale = 0.01; // Noise scale for color variation

function preload() {
  // Preload images and buttons
  sunExample = loadImage("sunrise-example.jpeg");
  flowfieldExample = loadImage("flowfield-example.jpeg");
  ballExample = loadImage("ball-example.jpeg");
  sunImg = loadImage("sun.png");
  moonImg = loadImage("moon.png");
  man = document.getElementById("man");
  sunBtn = document.getElementById("sun");
  ballBtn = document.getElementById("ball");
  ballChangeBtn = document.getElementById("ballChange");
  bgChangeBtn = document.getElementById("bgChange");
  bothChangeBtn = document.getElementById("bothChange");
  ballNormalBtn = document.getElementById("ballNormal");
  ballContinueBtn = document.getElementById("ballContinue");
  flowfieldModeBtn = document.getElementById("flowfield");
  flowfieldCustomBtn = document.getElementById("flowfieldCustom");
  flowfieldNormalBtn = document.getElementById("flowfieldNormal");
  flowfieldContinueBtn = document.getElementById("flowfieldContinue");
  sunContinueBtn = document.getElementById("sunContinue");
  backBtn = document.getElementById("back");
  restartBtn = document.getElementById("restart");
}

function setup() {
  // Setup canvas and initial state
  noStroke();
  createCanvas(windowWidth, windowHeight);
  // Adjust the positions of various buttons based on the height and width of the canvas
  sunBtn.style.left = width / 10 + "px";
  sunBtn.style.top = height - 100 + "px";
  ballBtn.style.left = width / 2 - 25 + "px";
  ballBtn.style.top = height - 100 + "px";
  flowfieldModeBtn.style.right = width / 10 + "px";
  flowfieldModeBtn.style.top = height - 100 + "px";

  // Check the chosen wallpaper type and initialize properties accordingly
  if (wallpaperChosen == "sun") {
    // Set the color mode to RGB
    colorMode(RGB);

    // Display the 'man' element
    man.style.display = "inline-block";

    // Generate cloud locations with randomized positions
    for (let i = 0; i < 8; i++) {
      let cloudX = random(width);
      let cloudY = random(0.2 * height);
      for (let j = 0; j < 75; j++) {
        cloudLocation.push([
          randomGaussian(cloudX, 20),
          randomGaussian(cloudY, 15),
        ]);
      }
    }

    // Initialize properties for the sun with a more pronounced arc
    sun = {
      x: 0,
      y: 0,
      size: 100,
      startX: -50,
      startY: (5 * height) / 7,
      endX: width + 50,
      endY: (5 * height) / 7,
      progress: 0,
      curveHeight: random(height * 0.6, height * 0.8), // Increased the curve height for a more pronounced arc
    };
  } else if (wallpaperChosen == "flowfield") {
    // Calculate the number of particles based on canvas size
    numParticles = round(sqrt(windowWidth * windowHeight) / 3.5);

    // Create particle objects
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    // Set the color mode to HSB
    colorMode(HSB, 360, 100, 100);

    // Generate flowfield and set the background to black
    flowfield = generateFlowfield(width / resolution, height / resolution);
    background(0);
  } else if (wallpaperChosen == "ball") {
    // Set the color mode to RGB
    colorMode(RGB);

    // Calculate the number of balls based on canvas size
    numBalls = round(0.000015 * width * height);

    // Create ball objects
    for (let i = 0; i < numBalls; i++) {
      balls[i] = new Ball();
    }
  }
}

function draw() {
  if (wallpaperChosen == false) {
    // Display initial instructions and examples of wallpapers
    background("#778DA9");
    fill("#5E503F");
    textFont("Jersey 20 Charted");
    textSize(64);
    textAlign(CENTER);
    text("ScreenScape", width / 2, 75);
    fill("#E1E0DD");
    textFont("Roboto");
    textSize(24);
    textWrap(WORD);
    text(
      `Welcome to ScreenScape, a wallpaper app which offers a variety of interesting and widely customisable wallpapers which you can use for your personal devices. Please select your preferred wallpaper type by clicking on the respective wallpaper. You can then customize your wallpaper (depending on the wallpaper) afterwards.`,
      15,
      100,
      width - 25
    );
    image(sunExample, width / 10 - 55, height - 300, 300, 190);
    image(ballExample, width / 2 - 150, height - 300, 300, 190);
    image(flowfieldExample, (9 * width) / 10 - 210, height - 300, 300, 190);
  } else if (wallpaperChosen == "flowfield") {
    // Update and display particles for the flowfield wallpaper
    let newParticles = []; // Store new particles to be added
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      p.display();
      if (p.shouldRemove()) {
        particles.splice(i, 1);
        // Generate a new particle to replace the removed one
        newParticles.push(new Particle());
        noOfParticles += 1;
      }
    }
    // Add new particles after iterating through existing ones
    particles.push(...newParticles);
  } else if (wallpaperChosen == "flowfieldMode") {
    // Display instructions and options for customizing the flowfield wallpaper
    background("#778DA9");
    fill("#5E503F");
    textFont("Jersey 20 Charted");
    textSize(64);
    textAlign(CENTER);
    text("Flowfield", width / 2, 75);
    fill("#E1E0DD");
    textFont("Roboto");
    textSize(24);
    textWrap(WORD);
    text(
      `The flowfield wallpaper simulates particles moving around the screen with perlin noise for a flowy appearance, like a flowfield. Please choose your preferred colours for the flowfield. There are two options - the normal variant (all colours), or the custom variant, where you can choose two colours of your choice from the colour wheel to use in the flowfield. Please do experiment with this so as to find the best wallpaper suited for you.`,
      15,
      100,
      width - 25
    );
    if (showColourWheel == true) {
      // Draw the color wheel segments for colour wheel 1
      for (let angle = 0; angle < 360; angle += 0.4) {
        let h = angle;
        let s = 100;
        let b = 100;

        let rgb = color(h, s, b);
        fill(rgb);

        let x = centerX1 + radius * cos(radians(angle));
        let y = centerY1 + radius * sin(radians(angle));

        beginShape();
        vertex(centerX1, centerY1);
        vertex(x, y);
        vertex(x + 5, y - 5);
        endShape(CLOSE);
      }

      // Highlight selected segment
      fill(color(selectedHue1, 100, 100));
      circle(centerX1, centerY1 + 1.5 * radius, radius / 1.5);

      // Check for mouse click within the color wheel
      if (
        mouseIsPressed &&
        mouseX > centerX1 - radius &&
        mouseX < centerX1 + radius &&
        mouseY > centerY1 - radius &&
        mouseY < centerY1 + radius
      ) {
        let angle = atan2(mouseY - centerY1, mouseX - centerX1);
        angle = degrees(angle) + 360; // Handle negative angles
        angle %= 360;

        selectedHue1 = angle;
      }
      // Draw the color wheel segments for colour wheel 2
      for (let angle = 0; angle < 360; angle += 0.4) {
        let h = angle;
        let s = 100;
        let b = 100;

        let rgb = color(h, s, b);
        fill(rgb);

        let x = centerX2 + radius * cos(radians(angle));
        let y = centerY2 + radius * sin(radians(angle));

        beginShape();
        vertex(centerX2, centerY2);
        vertex(x, y);
        vertex(x + 5, y - 5);
        endShape(CLOSE);
      }

      // Highlight selected segment
      fill(color(selectedHue2, 100, 100));
      circle(centerX2, centerY2 + 1.5 * radius, radius / 1.5);

      // Check for mouse click within the color wheel
      if (
        mouseIsPressed &&
        mouseX > centerX2 - radius &&
        mouseX < centerX2 + radius &&
        mouseY > centerY2 - radius &&
        mouseY < centerY2 + radius
      ) {
        let angle = atan2(mouseY - centerY2, mouseX - centerX2);
        angle = degrees(angle) + 360; // Handle negative angles
        angle %= 360;

        selectedHue2 = angle;
      }
      fill(255);
      text(
        "Choose your custom colour ranges:",
        (centerX1 + centerX2) / 2,
        centerY1 - radius - 25
      );
    }
    if (
      flowfieldModeChosen == "normal" &&
      flowfieldNormalBtn.style.display == "none"
    ) {
      text("You have chosen normal mode.", width / 2, centerY1 - 20);
    }
  } else if (wallpaperChosen == "sun") {
    // Update and display elements for the sunrise/sunset wallpaper
    if (sun.progress < 0.5) {
      bgColour = lerpColor(color(0), color(0, 204, 255), 2 * sun.progress);
    } else if (sun.progress >= 0.5) {
      bgColour = lerpColor(
        color(0, 204, 255),
        color(0),
        2 * (sun.progress - 0.5)
      );
    }
    background(bgColour);
    // Update the sun's position for the next frame
    sun.progress += progressAdding; // Adjust this value to change the speed of the sunrise/sunset
    sun.x = lerp(sun.startX, sun.endX, sun.progress);
    // More pronounced arc path for the sun
    let peakProgress = (sun.progress - 0.5) * 2; // Scale progress to range -1 to 1
    sun.y =
      lerp(sun.startY, sun.endY, sun.progress) -
      sun.curveHeight * (1 - peakProgress * peakProgress);
    drawSun();
    // Reset sun position after sunset and choose a new curve height for the next day
    if (sun.progress >= 2) {
      sun.progress = 0;
      moonOpacAmt = 0;
      sun.curveHeight = random(height * 0.6, height * 0.8); // New random curve height
    } else if (sun.progress > 1) {
      if (sun.progress <= 1.5) {
        moonOpacAmt += 2;
        if (moonOpacAmt >= 255) {
          moonOpacAmt = 255;
        }
      } else if (sun.progress >= 1.75) {
        moonOpacAmt -= 2;
        if (moonOpacAmt <= 0) {
          moonOpacAmt = 0;
        }
      }
      tint(moonOpacAmt);
      image(moonImg, width / 2 - 140, 150, 140, 136.5);
    }
    drawClouds();
    drawMountains();
  } else if (wallpaperChosen == "sunMode") {
    // Display instructions for the sunrise/sunset wallpaper
    background("#778DA9");
    fill("#5E503F");
    textFont("Jersey 20 Charted");
    textSize(64);
    textAlign(CENTER);
    text("Sunrise and Sunset", width / 2, 75);
    fill("#E1E0DD");
    textFont("Roboto");
    textSize(24);
    textWrap(WORD);
    text(
      `The sunrise and sunset wallpaper simulates a man jogging tirelessly day and night without stopping. This motivational wallpaper features mountains in the background which are made using 1D noise, ground which the man runs on made using 2D noise, the sun rising and setting, the moon, and clouds made using random gaussian noise. Unfortunately, there are no customisation options for this wallpaper. If you are looking for customisability, please check out the other two wallpapers`,
      15,
      100,
      width - 25
    );
  } else if (wallpaperChosen == "ball") {
    // Display and update elements for the ball wallpaper
    if (ballModeChosen == "normal" || ballModeChosen == "ballChange") {
      background(0);
    } else if (ballModeChosen == "bgChange" || ballModeChosen == "bothChange") {
      let noiseR = noise(frameCount * 0.003) * 255;
      let noiseG = noise(frameCount * 0.004) * 255;
      let noiseB = noise(frameCount * 0.005) * 255;
      background(noiseR, noiseG, noiseB);
    }
    for (let i = 0; i < numBalls; i++) {
      balls[i].show();
      for (let j = 0; j < numBalls; j++) {
        if (i != j && balls[i].intersects(balls[j])) {
          balls[i].veloX = -balls[i].veloX;
          balls[i].veloY = -balls[i].veloY;
        }
      }
    }
  } else if (wallpaperChosen == "ballMode") {
    // Display instructions and options for customizing the ball wallpaper
    background("#778DA9");
    fill("#5E503F");
    textFont("Jersey 20 Charted");
    textSize(64);
    textAlign(CENTER);
    text("Sunrise and Sunset", width / 2, 75);
    fill("#E1E0DD");
    textFont("Roboto");
    textSize(24);
    textWrap(WORD);
    text(
      `The balls wallpaper simulates balls moving around the screen that bounce off the walls of the screen and other balls. Please choose your preferred mode for the wallpaper. There are four options - normal  (a few alternating colours with a black background), changing background, where the background colour changes using noise,  changing ball colour, where the colours of the balls change using noise, as well as both background and ball colour changing colour.`,
      15,
      100,
      width - 25
    );
    if (ballNormalBtn.style.display == "none") {
      textAlign(CENTER);
      if (ballModeChosen == "ballNormal") {
        text("You have chosen normal mode.", width / 2, height / 2);
      } else if (ballModeChosen == "ballChange") {
        text(
          "You have chosen changing ball colour mode.",
          width / 2,
          height / 2
        );
      } else if (ballModeChosen == "bgChange") {
        text(
          "You have chosen changing background colour mode.",
          width / 2,
          height / 2
        );
      } else if (ballModeChosen == "bothChange") {
        text(
          "You have chosen both background and ball colour changing mode.",
          width / 2,
          height / 2
        );
      }
    }
  }
}

function changeFlowfieldMode() {
  // Change wallpaper mode to flowfield
  wallpaperChosen = "flowfieldMode";
  // Set initial values for color wheel position and radius
  radius = (2 * height) / 15;
  centerX1 = width / 2 - radius - 100;
  centerY1 = height - radius - 100;
  centerX2 = centerX1 + 2 * radius + 25;
  centerY2 = centerY1;
  // Adjust button positions and display settings
  flowfieldCustomBtn.style.top = centerY1 - 20 + "px";
  flowfieldNormalBtn.style.top = centerY1 - 20 + "px";
  backBtn.style.top = centerY1 + 40 + "px";
  flowfieldContinueBtn.style.top = centerY1 + 40 + "px";
  // Set color mode and hide unnecessary buttons
  colorMode(HSB, 360, 100, 100);
  sunBtn.style.display = "none";
  flowfieldModeBtn.style.display = "none";
  ballBtn.style.display = "none";
  // Display appropriate buttons
  flowfieldCustomBtn.style.display = "inline-block";
  flowfieldNormalBtn.style.display = "inline-block";
  backBtn.style.display = "inline-block";
  flowfieldContinueBtn.style.display = "inline-block";
  // Set positions for back and continue buttons
  backBtn.style.top = centerY1 + 40 + "px";
  backBtn.style.left = 50 + "px";
  backBtn.style.right = width / 2 - 25 + "px";
  flowfieldContinueBtn.style.right = 50 + "px";
  flowfieldContinueBtn.style.left = width / 2 + 25 + "px";
}

function changeBallMode() {
  // Change wallpaper mode to ball mode
  wallpaperChosen = "ballMode";
  // Hide unnecessary buttons and display appropriate ones
  sunBtn.style.display = "none";
  flowfieldModeBtn.style.display = "none";
  ballBtn.style.display = "none";
  ballNormalBtn.style.display = "inline-block";
  ballChangeBtn.style.display = "inline-block";
  bgChangeBtn.style.display = "inline-block";
  bothChangeBtn.style.display = "inline-block";
  ballContinueBtn.style.display = "inline-block";
  backBtn.style.display = "inline-block";
  // Set positions for various buttons
  ballChangeBtn.style.top = height / 2 + "px";
  ballChangeBtn.style.left = width / 2 + "px";
  bothChangeBtn.style.top = height / 2 + "px";
  bothChangeBtn.style.right = width / 2 + "px";
  ballNormalBtn.style.top = height / 2 + 40 + "px";
  ballNormalBtn.style.right = width / 2 + "px";
  bgChangeBtn.style.top = height / 2 + 40 + "px";
  bgChangeBtn.style.left = width / 2 + "px";
  ballContinueBtn.style.top = height / 2 + 80 + "px";
  ballContinueBtn.style.left = width / 2 + "px";
  backBtn.style.top = height / 2 + 80 + "px";
  backBtn.style.right = width / 2 + "px";
}

function changeSun() {
  // Change wallpaper mode to sun mode
  wallpaperChosen = "sunMode";
  // Hide unnecessary buttons and display appropriate ones
  sunBtn.style.display = "none";
  flowfieldModeBtn.style.display = "none";
  ballBtn.style.display = "none";
  sunContinueBtn.style.display = "inline-block";
  sunContinueBtn.style.top = height - 200 + "px";
  sunContinueBtn.style.left = width / 2 - 25 + "px";
  backBtn.style.display = "inline-block";
  backBtn.style.top = height - 200 + "px";
  backBtn.style.right = width / 2 - 25 + "px";
}

function flowfieldCustom() {
  // Show color wheel for custom flowfield mode
  flowfieldCustomBtn.style.display = "none";
  flowfieldNormalBtn.style.display = "none";
  backBtn.style.top = centerY1 - 20 + "px";
  backBtn.style.left = width - 148 + "px";
  backBtn.style.right = null;
  flowfieldContinueBtn.style.right = 50 + "px";
  flowfieldContinueBtn.style.left = null;
  showColourWheel = true;
  flowfieldModeChosen = "custom";
}

function flowfieldNormal() {
  // Set flowfield mode to normal
  flowfieldCustomBtn.style.display = "none";
  flowfieldNormalBtn.style.display = "none";
  backBtn.style.right = width / 2 - 25 + "px";
  flowfieldContinueBtn.style.left = width / 2 + 25 + "px";
  flowfieldModeChosen = "normal";
}

function flowfieldContinue() {
  // Set wallpaper mode to flowfield and hide buttons
  wallpaperChosen = "flowfield";
  flowfieldCustomBtn.style.display = "none";
  flowfieldNormalBtn.style.display = "none";
  backBtn.style.display = "none";
  flowfieldContinueBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
  setup();
}

function ballChange() {
  // Set ball mode to changing ball color
  ballModeChosen = "ballChange";
  ballNormalBtn.style.display = "none";
  ballChangeBtn.style.display = "none";
  bgChangeBtn.style.display = "none";
  bothChangeBtn.style.display = "none";
}

function bgChange() {
  // Set ball mode to changing background color
  ballModeChosen = "bgChange";
  ballNormalBtn.style.display = "none";
  ballChangeBtn.style.display = "none";
  bgChangeBtn.style.display = "none";
  bothChangeBtn.style.display = "none";
}

function bothChange() {
  // Set ball mode to changing both background and ball color
  ballModeChosen = "bothChange";
  ballNormalBtn.style.display = "none";
  ballChangeBtn.style.display = "none";
  bgChangeBtn.style.display = "none";
  bothChangeBtn.style.display = "none";
}

function ballNormal() {
  // Set ball mode to normal
  ballModeChosen = "ballNormal";
  ballNormalBtn.style.display = "none";
  ballChangeBtn.style.display = "none";
  bgChangeBtn.style.display = "none";
  bothChangeBtn.style.display = "none";
}

function ballContinue() {
  // Set wallpaper mode to ball mode and hide buttons
  wallpaperChosen = "ball";
  ballNormalBtn.style.display = "none";
  ballChangeBtn.style.display = "none";
  bgChangeBtn.style.display = "none";
  bothChangeBtn.style.display = "none";
  backBtn.style.display = "none";
  ballContinueBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
  setup();
}

function sunContinue() {
  // Set wallpaper mode to sun mode and hide buttons
  wallpaperChosen = "sun";
  backBtn.style.display = "none";
  sunContinueBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
  setup();
}

function homepage() {
  // Reset to homepage, hiding other elements and showing main buttons
  wallpaperChosen = false;
  flowfieldModeChosen = false;
  showColourWheel = false;
  flowfieldCustomBtn.style.display = "none";
  flowfieldNormalBtn.style.display = "none";
  flowfieldContinueBtn.style.display = "none";
  ballNormalBtn.style.display = "none";
  ballChangeBtn.style.display = "none";
  bgChangeBtn.style.display = "none";
  bothChangeBtn.style.display = "none";
  ballContinueBtn.style.display = "none";
  sunContinueBtn.style.display = "none";
  backBtn.style.display = "none";
  sunBtn.style.display = "inline-block";
  flowfieldModeBtn.style.display = "inline-block";
  ballBtn.style.display = "inline-block";
  restartBtn.style.display = "none";
}

function restart() {
  // Reload the page to restart the application
  location.reload();
}
