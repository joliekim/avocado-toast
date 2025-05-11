// Global variables
let gameManager;
let currentScene;
let assets = {};
let sounds = {};
let gameState = "landing"; // Start with landing page state

// Font variables
let bodyFont;
let headingFont;

// Landing page variables
let bgStart;
let btnStart;

// Preload assets
function preload() {
  // Load fonts
  bodyFont = loadFont('assets/cheese_potato.otf');
  headingFont = loadFont('assets/good_ghost.otf');
  
  // Load landing page assets
  bgStart = loadImage('assets/startscreen_bg.png');
  btnStart = loadImage('assets/button_start.png');
  
  // Load background images
  assets.kitchenBg = loadImage('assets/kitchen_background.png');
  assets.woodenBoard = loadImage('assets/wooden_board.png');
  
  // Load ingredient images
  assets.bread = loadImage('assets/bread.png');
  assets.toastedBread = loadImage('assets/toasted_bread.png');
  assets.avocado = loadImage('assets/avocado.png');
  assets.mashedAvocado = loadImage('assets/mashed_avocado.png');
  
  // Load topping images
  assets.egg = loadImage('assets/egg.png');
  assets.chili = loadImage('assets/chili.png');
  assets.tomato = loadImage('assets/tomato.png');
  
  // Load UI elements
  assets.toaster = loadImage('assets/toaster.png');
  assets.plate = loadImage('assets/plate.png');
  assets.bowl = loadImage('assets/bowl.png');
  
  // Load sounds
  sounds.toastPop = loadSound('assets/toast_pop.mp3');
  sounds.squish = loadSound('assets/squish.mp3');
  sounds.bgMusic = loadSound('assets/kitchen_lofi.mp3');
}

// Setup the game
function setup() {
  createCanvas(800, 600);
  gameManager = new GameManager();
  
  // Set default text font
  textFont(bodyFont);
  
  // Initialize game but don't start yet - wait for start button click
  // The actual scene will be created when the start button is clicked
}

// Main draw loop
function draw() {
  if (gameState === "landing") {
    // Draw landing page
    drawLandingPage();
  } else if (gameState === "game") {
    background(255);
    
    // Draw the current scene
    if (currentScene) {
      currentScene.draw();
    }
  }
}

// Draw the landing page
function drawLandingPage() {
  image(bgStart, 0, 0, width, height); // Draw background
  drawStartButton();
  
  // Add title with heading font
  push();
  textFont(headingFont);
  textSize(50);
  textAlign(CENTER);
  fill(60, 100, 60);
  text("Mash & Munch", width/2, 150);
  
  // Add subtitle with body font
  textFont(bodyFont);
  textSize(24);
  fill(80, 50, 20);
  text("Create the perfect avocado toast!", width/2, 200);
  pop();
}

// Draw the start button
function drawStartButton() {
  image(btnStart, width/2 - 75, height - 130, 150, 130);
}

// Function to start the game - call this when your start button is clicked
function startGame() {
  gameState = "game";
  currentScene = new InstructionsScene();
  
  // Play background music on loop with error handling
  try {
    if (sounds.bgMusic && typeof sounds.bgMusic.setVolume === 'function') {
      sounds.bgMusic.setVolume(0.3);
      sounds.bgMusic.loop();
    }
  } catch (e) {
    console.log("Could not play background music");
  }
}

// Handle mouse interactions
function mousePressed() {
  if (gameState === "landing") {
    // Check if start button was clicked
    if (mouseX > width/2 - 75 && mouseX < width/2 + 75 &&
        mouseY > height - 130 && mouseY < height - 50) {
      startGame();
    }
  } else if (gameState === "game" && currentScene) {
    currentScene.mousePressed();
  }
}

function mouseDragged() {
  if (gameState === "game" && currentScene) {
    currentScene.mouseDragged();
  }
}

function mouseReleased() {
  if (gameState === "game" && currentScene) {
    currentScene.mouseReleased();
  }
}
