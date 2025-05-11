// Global variables
let gameManager;
let currentScene;
let assets = {};
let sounds = {};
let gameState = "landing"; // Start with landing page state

// Font variables
let headingFont; // For headings
let bodyFont;    // For body text

// Landing page variables
let bgStart;
let btnStart;

// Preload assets
function preload() {
  // Load fonts with error handling
  loadFont('assets/crayon_crumble.ttf', 
    font => {
      headingFont = font;
      console.log("Heading font loaded successfully");
    },
    error => {
      console.error("Failed to load heading font:", error);
      headingFont = null;
    }
  );
  
  loadFont('assets/harley_smith.otf', 
    font => {
      bodyFont = font;
      console.log("Body font loaded successfully");
    },
    error => {
      console.error("Failed to load body font:", error);
      bodyFont = null;
    }
  );
  
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
  
  // Check if font files exist
  fetch('assets/crayon_crumble.ttf')
    .then(response => {
      if (response.ok) {
        console.log("crayon_crumble.ttf file exists!");
      } else {
        console.error("crayon_crumble.ttf file not found!");
      }
    });
  
  fetch('assets/harley_smith.otf')
    .then(response => {
      if (response.ok) {
        console.log("harley_smith.otf file exists!");
      } else {
        console.error("harley_smith.otf file not found!");
      }
    });
  
  gameManager = new GameManager();
  
  // Set default text font if loaded
  if (bodyFont) {
    textFont(bodyFont);
  }
  
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
  image(bgStart, 0, 0, width, height);
  drawStartButton();
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
