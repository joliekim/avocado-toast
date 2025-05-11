// Base Scene class
class Scene {
  constructor() {
    this.buttons = [];
  }
  
  addButton(x, y, width, height, text, callback) {
    this.buttons.push({
      x, y, width, height, text, callback, hidden: false
    });
    return this.buttons.length - 1; // Return button index
  }
  
  drawButtons() {
    for (let button of this.buttons) {
      if (!button.hidden) {
        this.drawButton(button);
      }
    }
  }
  
  drawButton(button) {
    push();
    // Button background
    fill(255, 200, 200);
    stroke(200, 100, 100);
    strokeWeight(3);
    rect(button.x, button.y, button.width, button.height, 10);
    
    // Button text
    fill(80);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(bodyFont);
    text(button.text, button.x + button.width/2, button.y + button.height/2);
    pop();
  }
  
  checkButtons() {
    for (let button of this.buttons) {
      if (!button.hidden && 
          mouseX > button.x && mouseX < button.x + button.width &&
          mouseY > button.y && mouseY < button.y + button.height) {
        button.callback();
        return true;
      }
    }
    return false;
  }
  
  draw() {
    // To be implemented by subclasses
    this.drawButtons();
  }
  
  mousePressed() {
    return this.checkButtons();
  }
  
  mouseDragged() {
    // To be implemented by subclasses
  }
  
  mouseReleased() {
    // To be implemented by subclasses
  }
}

// Instructions Scene
class InstructionsScene extends Scene {
  constructor() {
    super();
    
    // Add start game button
    this.addButton(width/2 - 100, height - 100, 200, 50, "Start Cooking!", () => {
      gameManager.changeScene('toast');
    });
  }
  
  draw() {
    // Draw kitchen background
    image(assets.kitchenBg, 0, 0, width, height);
    
    // Draw title
    push();
    textAlign(CENTER);
    textSize(40);
    textFont(headingFont);
    fill(60, 100, 60);
    text("🥑 Mash & Munch 🍞", width/2, 80);
    
    // Draw instructions
    textFont(bodyFont);
    textSize(24);
    fill(40);
    text("Welcome to Mash & Munch!", width/2, 150);
    
    textSize(18);
    text("Your goal is to create the perfect avocado toast through a series of mini-games:", width/2, 200);
    
    textAlign(LEFT);
    textSize(16);
    let instructionsY = 250;
    text("1. Toast the bread to golden perfection", width/2 - 200, instructionsY);
    instructionsY += 40;
    text("2. Mash the avocado to your desired consistency", width/2 - 200, instructionsY);
    instructionsY += 40;
    text("3. Add and arrange toppings creatively", width/2 - 200, instructionsY);
    instructionsY += 40;
    text("4. Plate your creation for the final presentation", width/2 - 200, instructionsY);
    
    textAlign(CENTER);
    textSize(20);
    text("Ready to make the perfect avocado toast?", width/2, height - 150);
    pop();
    
    // Draw buttons
    super.draw();
  }
}

// Toast Scene - First mini-game
class ToastScene extends Scene {
  constructor() {
    super();
    this.toastingStarted = false;
    this.toastingTime = 0;
    this.maxToastingTime = 100;
    this.toastingComplete = false;
    this.toasterX = width/2 - 100;
    this.toasterY = height/2 - 50;
    this.breadInToaster = true;
    this.breadX = this.toasterX + 20;
    this.breadY = this.toasterY - 20;
    
    // Add toast button
    this.startButtonIndex = this.addButton(width/2 - 100, height - 100, 200, 50, "Start Toasting", () => {
      if (!this.toastingStarted && !this.toastingComplete) {
        this.toastingStarted = true;
        this.buttons[this.startButtonIndex].hidden = true;
        this.buttons[this.stopButtonIndex].hidden = false;
      }
    });
    
    // Add stop toasting button (initially hidden)
    this.stopButtonIndex = this.addButton(width/2 - 100, height - 100, 200, 50, "Stop Toasting", () => {
      if (this.toastingStarted && !this.toastingComplete) {
        this.toastingComplete = true;
        this.evaluateToast();
        
        // Pop the toast
        sounds.toastPop.play();
        this.breadInToaster = false;
        
        // Change button to continue
        this.buttons[this.stopButtonIndex].text = "Continue to Mashing";
        this.buttons[this.stopButtonIndex].callback = () => {
          gameManager.toastDone = true;
          gameManager.changeScene('mash');
        };
      }
    });
    
    // Hide stop button initially
    this.buttons[this.stopButtonIndex].hidden = true;
  }
  
  draw() {
    // Draw wooden board background
    image(assets.woodenBoard, 0, 0, width, height);
    
    // Draw title
    push();
    textAlign(CENTER);
    textSize(30);
    textFont(headingFont);
    fill(60, 100, 60);
    text("Step 1: Toast the Bread", width/2, 80);
    
    // Draw instructions
    textFont(bodyFont);
    textSize(18);
    fill(40);
    text("Toast your bread to golden perfection!", width/2, 120);
    text("Click 'Start Toasting' and stop at just the right moment.", width/2, 150);
    pop();
    
    // Draw toaster
    image(assets.toaster, this.toasterX, this.toasterY, 200, 150);
    
    // Draw bread (either in toaster or popped up)
    if (this.breadInToaster) {
      // Bread in toaster, only top visible
      let breadImg = this.toastingComplete ? assets.toastedBread : assets.bread;
      image(breadImg, this.breadX, this.breadY + 50, 160, 30);
    } else {
      // Bread popped up
      let breadImg = assets.toastedBread;
      image(breadImg, this.breadX, this.breadY - 50, 160, 120);
    }
    
    // Update toasting progress
    if (this.toastingStarted && !this.toastingComplete) {
      this.toastingTime++;
      
      // Auto-complete if maxed out
      if (this.toastingTime >= this.maxToastingTime) {
        this.toastingComplete = true;
        this.evaluateToast();
        
        // Pop the toast
        sounds.toastPop.play();
        this.breadInToaster = false;
        
        // Change button to continue
        this.buttons[this.stopButtonIndex].text = "Continue to Mashing";
        this.buttons[this.stopButtonIndex].callback = () => {
          gameManager.toastDone = true;
          gameManager.changeScene('mash');
        };
      }
    }
    
    // Draw toasting progress bar
    if (this.toastingStarted) {
      push();
      fill(200, 100, 50);
      rect(width/2 - 150, height - 150, 300, 20);
      
      // Progress
      let progress = this.toastingTime / this.maxToastingTime;
      
      // Color changes from yellow to brown
      let r = 255;
      let g = 255 - (progress * 200);
      let b = 100 - (progress * 100);
      
      fill(r, g, b);
      rect(width/2 - 150, height - 150, 300 * progress, 20);
      pop();
    }
    
    // Draw toast quality feedback if complete
    if (this.toastingComplete) {
      push();
      textAlign(CENTER);
      textSize(24);
      
      let quality = this.getToastQuality();
      let message = "";
      let color;
      
      if (quality > 0.9) {
        message = "Perfect golden toast! 😋";
        color = (0, 150, 0);
      } else if (quality > 0.7) {
        message = "Pretty good toast! 👍";
        color = (100, 150, 0);
      } else if (quality > 0.4) {
        message = "Acceptable toast. 🤔";
        color = (150, 150, 0);
      } else {
        message = "Burnt or undercooked... 😬";
        color = (150, 0, 0);
      }
      
      fill(color);
      text(message, width/2, height - 180);
      pop();
    }
    
    // Draw buttons
    super.draw();
  }
  
  evaluateToast() {
    // Calculate toast quality based on timing
    gameManager.toastBrownness = this.getToastQuality();
  }
  
  getToastQuality() {
    // Perfect toast is around 60-70% of max time
    let perfectTime = this.maxToastingTime * 0.65;
    let distance = Math.abs(this.toastingTime - perfectTime);
    let maxDistance = this.maxToastingTime * 0.65; // Maximum possible distance
    
    // Convert to a 0-1 score (1 being perfect)
    return Math.max(0, 1 - (distance / maxDistance));
  }
}

// Mash Scene - Second mini-game
class MashScene extends Scene {
  constructor() {
    super();
    this.mashCount = 0;
    this.maxMashCount = 30;
    this.mashComplete = false;
    this.mashQuality = 0;
    this.lastMashTime = 0;
    this.mashRhythm = [];
    this.avocadoX = width/2 - 100;
    this.avocadoY = height/2 - 50;
    this.bowlX = width/2 - 150;
    this.bowlY = height/2 - 100;
    this.mashEffect = 0;
    
    // Add continue button (initially hidden)
    this.continueButtonIndex = this.addButton(width/2 - 100, height - 100, 200, 50, "Continue to Toppings", () => {
      gameManager.avocadoMashed = true;
      gameManager.changeScene('toppings');
    });
    
    // Hide continue button initially
    this.buttons[this.continueButtonIndex].hidden = true;
  }
  
  draw() {
    // Draw wooden board background
    image(assets.woodenBoard, 0, 0, width, height);
    
    // Draw title
    push();
    textAlign(CENTER);
    textSize(30);
    textFont(headingFont);
    fill(60, 100, 60);
    text("Step 2: Mash the Avocado", width/2, 80);
    
    // Draw instructions
    textFont(bodyFont);
    textSize(18);
    fill(40);
    text("Mash the avocado by clicking repeatedly on it.", width/2, 120);
    text("Try to maintain a steady rhythm for the best consistency!", width/2, 150);
    pop();
    
    // Draw bowl
    image(assets.bowl, this.bowlX, this.bowlY, 300, 200);
    
    // Draw avocado (whole or increasingly mashed)
    if (this.mashCount === 0) {
      // Whole avocado
      image(assets.avocado, this.avocadoX, this.avocadoY, 200, 150);
    } else {
      // Increasingly mashed avocado
      let mashProgress = this.mashCount / this.maxMashCount;
      
      // Draw mashed avocado with increasing "mashed" appearance
      push();
      tint(255, 255 * (1 - mashProgress * 0.3)); // Slightly change appearance
      image(assets.mashedAvocado, this.avocadoX, this.avocadoY, 200, 150);
      pop();
      
      // Visual mash effect
      if (this.mashEffect > 0) {
        push();
        noStroke();
        fill(142, 170, 96, this.mashEffect * 255);
        ellipse(this.avocadoX + 100, this.avocadoY + 75, 50 * this.mashEffect);
        this.mashEffect -= 0.05;
        pop();
      }
    }
    
    // Draw mashing progress bar
    push();
    fill(200, 200, 200);
    rect(width/2 - 150, height - 150, 300, 20);
    
    // Progress
    let progress = this.mashCount / this.maxMashCount;
    fill(142, 170, 96); // Avocado green
    rect(width/2 - 150, height - 150, 300 * progress, 20);
    pop();
    
    // Show mashing complete message
    if (this.mashComplete) {
      push();
      textAlign(CENTER);
      textSize(24);
      
      let quality = this.mashQuality;
      let message = "";
      let color;
      
      if (quality > 0.9) {
        message = "Perfect creamy consistency! 😋";
        color = (0, 150, 0);
      } else if (quality > 0.7) {
        message = "Nice and smooth! 👍";
        color = (100, 150, 0);
      } else if (quality > 0.4) {
        message = "A bit chunky, but usable. 🤔";
        color = (150, 150, 0);
      } else {
        message = "Very inconsistent mashing... 😬";
        color = (150, 0, 0);
      }
      
      fill(color);
      text(message, width/2, height - 180);
      
      // Show continue button
      this.buttons[this.continueButtonIndex].hidden = false;
      pop();
    }
    
    // Draw buttons
    super.draw();
  }
  
  mousePressed() {
    // First check buttons
    if (super.mousePressed()) return;
    
    // Check if clicked on avocado
    if (!this.mashComplete &&
        mouseX > this.avocadoX && mouseX < this.avocadoX + 200 &&
        mouseY > this.avocadoY && mouseY < this.avocadoY + 150) {
      
      // Increment mash count
      this.mashCount++;
      
      // Play squish sound
      sounds.squish.play();
      
      // Add visual effect
      this.mashEffect = 1.0;
      
      // Track rhythm
      let currentTime = millis();
      if (this.lastMashTime > 0) {
        let interval = currentTime - this.lastMashTime;
        this.mashRhythm.push(interval);
      }
      this.lastMashTime = currentTime;
      
      // Check if mashing is complete
      if (this.mashCount >= this.maxMashCount) {
        this.mashComplete = true;
        this.evaluateMashing();
      }
    }
  }
  
  evaluateMashing() {
    // Calculate mashing quality based on rhythm consistency
    if (this.mashRhythm.length < 2) {
      this.mashQuality = 0.5; // Default if not enough data
    } else {
      // Calculate standard deviation of intervals
      let sum = this.mashRhythm.reduce((a, b) => a + b, 0);
      let mean = sum / this.mashRhythm.length;
      
      let squaredDiffs = this.mashRhythm.map(x => Math.pow(x - mean, 2));
      let variance = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
      let stdDev = Math.sqrt(variance);
      
      // Lower standard deviation means more consistent rhythm
      // Convert to a 0-1 score (1 being perfect)
      let maxStdDev = 500; // Maximum acceptable standard deviation
      this.mashQuality = Math.max(0, 1 - (stdDev / maxStdDev));
    }
    
    gameManager.avocadoMashQuality = this.mashQuality;
  }
}

// Toppings Scene - Third mini-game
class ToppingsScene extends Scene {
  constructor() {
    super();
    this.toppings = [];
    this.availableToppings = [
      { name: 'egg', img: 'egg', width: 80, height: 60 },
      { name: 'chili', img: 'chili', width: 40, height: 20 },
      { name: 'tomato', img: 'tomato', width: 50, height: 50 }
    ];
    this.selectedTopping = null;
    this.draggedTopping = null;
    this.plateX = width/2 - 150;
    this.plateY = height/2 - 100;
    this.toastX = this.plateX + 50;
    this.toastY = this.plateY + 50;
    
    // Add finish button
    this.addButton(width/2 - 100, height - 100, 200, 50, "Finish & Plate", () => {
      this.evaluateToppings();
      gameManager.toppingsAdded = true;
      gameManager.changeScene('results');
    });
  }
  
  draw() {
    // Draw wooden board background
    image(assets.woodenBoard, 0, 0, width, height);
    
    // Draw title
    push();
    textAlign(CENTER);
    textSize(30);
    textFont(headingFont);
    fill(60, 100, 60);
    text("Step 3: Add Toppings", width/2, 80);
    
    // Draw instructions
    textFont(bodyFont);
    textSize(18);
    fill(40);
    text("Drag and drop toppings onto your toast.", width/2, 120);
    text("Create a beautiful arrangement!", width/2, 150);
    pop();
    
    // Draw plate
    image(assets.plate, this.plateX, this.plateY, 300, 200);
    
    // Draw toast with mashed avocado
    image(assets.toastedBread, this.toastX, this.toastY, 200, 100);
    image(assets.mashedAvocado, this.toastX + 20, this.toastY + 20, 160, 60);
    
    // Draw topping options at the bottom
    this.drawToppingOptions();
    
    // Draw placed toppings
    for (let topping of this.toppings) {
      image(
        assets[topping.img], 
        topping.x, 
        topping.y, 
        topping.width, 
        topping.height
      );
    }
    
    // Draw currently dragged topping
    if (this.draggedTopping) {
      image(
        assets[this.draggedTopping.img], 
        mouseX - this.draggedTopping.width/2, 
        mouseY - this.draggedTopping.height/2, 
        this.draggedTopping.width, 
        this.draggedTopping.height
      );
    }
    
    // Draw buttons
    super.draw();
  }
  
  drawToppingOptions() {
    push();
    fill(255, 240);
    rect(50, height - 200, width - 100, 80, 10);
    
    textAlign(CENTER);
    textSize(16);
    fill(80);
    text("Available Toppings - Click to select", width/2, height - 180);
    
    // Draw topping icons
    let startX = 100;
    let iconY = height - 150;
    let spacing = 100;
    
    for (let i = 0; i < this.availableToppings.length; i++) {
      let topping = this.availableToppings[i];
      let x = startX + i * spacing;
      
      image(
        assets[topping.img], 
        x, 
        iconY, 
        topping.width, 
        topping.height
      );
      
      // Highlight selected topping
      if (this.selectedTopping === i) {
        noFill();
        stroke(255, 100, 100);
        strokeWeight(3);
        rect(x - 5, iconY - 5, topping.width + 10, topping.height + 10);
      }
    }
    pop();
  }
  
  mousePressed() {
    // First check buttons
    if (super.mousePressed()) return;
    
    // Check if clicked on a topping option
    let startX = 100;
    let iconY = height - 150;
    let spacing = 100;
    
    for (let i = 0; i < this.availableToppings.length; i++) {
      let topping = this.availableToppings[i];
      let x = startX + i * spacing;
      
      if (mouseX > x && mouseX < x + topping.width &&
          mouseY > iconY && mouseY < iconY + topping.height) {
        this.selectedTopping = i;
        
        // Create a new topping to drag
        this.draggedTopping = {
          name: topping.name,
          img: topping.img,
          width: topping.width,
          height: topping.height,
          x: mouseX - topping.width/2,
          y: mouseY - topping.height/2
        };
        
        return;
      }
    }
    
    // Check if clicked on an existing topping to move it
    for (let i = this.toppings.length - 1; i >= 0; i--) {
      let topping = this.toppings[i];
      if (mouseX > topping.x && mouseX < topping.x + topping.width &&
          mouseY > topping.y && mouseY < topping.y + topping.height) {
        
        // Remove from placed toppings and make it the dragged topping
        this.draggedTopping = this.toppings.splice(i, 1)[0];
        return;
      }
    }
  }
  
  mouseDragged() {
    // Move the dragged topping
    if (this.draggedTopping) {
      this.draggedTopping.x = mouseX - this.draggedTopping.width/2;
      this.draggedTopping.y = mouseY - this.draggedTopping.height/2;
    }
  }
  
  mouseReleased() {
    // Place the dragged topping if it's over the toast
    if (this.draggedTopping) {
      let toppingCenterX = this.draggedTopping.x + this.draggedTopping.width/2;
      let toppingCenterY = this.draggedTopping.y + this.draggedTopping.height/2;
      
      if (toppingCenterX > this.toastX && toppingCenterX < this.toastX + 200 &&
          toppingCenterY > this.toastY && toppingCenterY < this.toastY + 100) {
        
        // Add to placed toppings
        this.toppings.push(this.draggedTopping);
      }
      
      // Clear dragged topping
      this.draggedTopping = null;
    }
  }
  
  evaluateToppings() {
    // Calculate topping arrangement score based on number and placement
    let score = 0;
    
    // Base score on number of toppings (up to 5)
    score += Math.min(this.toppings.length, 5) * 0.1;
    
    // Check for variety (different types of toppings)
    let uniqueToppings = new Set();
    for (let topping of this.toppings) {
      uniqueToppings.add(topping.name);
    }
    score += uniqueToppings.size * 0.1;
    
    // Final score between 0-1
    gameManager.toppingsArrangement = Math.min(1.0, score);
  }
}

// Results Scene - Final score display
class ResultsScene extends Scene {
  constructor() {
    super();
    
    // Calculate final score
    this.finalScore = gameManager.calculateScore();
    
    // Add play again button
    this.addButton(width/2 - 100, height - 100, 200, 50, "Play Again", () => {
      gameManager.resetGame();
    });
  }
  
  draw() {
    // Draw kitchen background
    image(assets.kitchenBg, 0, 0, width, height);
    
    // Draw title
    push();
    textAlign(CENTER);
    textSize(40);
    textFont(headingFont);
    fill(60, 100, 60);
    text("Your Avocado Toast Creation", width/2, 80);
    
    // Draw final score
    textSize(60);
    fill(40);
    text(Math.round(this.finalScore) + "/100", width/2, 180);
    
    // Draw score breakdown
    textSize(20);
    textAlign(LEFT);
    let scoreY = 250;
    let scoreX = width/2 - 150;
    
    text("Toast Quality: " + Math.round(gameManager.toastBrownness * 100) + "%", scoreX, scoreY);
    scoreY += 40;
    text("Avocado Mash: " + Math.round(gameManager.avocadoMashQuality * 100) + "%", scoreX, scoreY);
    scoreY += 40;
    text("Topping Arrangement: " + Math.round(gameManager.toppingsArrangement * 100) + "%", scoreX, scoreY);
    
    // Draw feedback message
    textAlign(CENTER);
    textSize(24);
    let message = "";
    
    if (this.finalScore > 90) {
      message = "Masterpiece! Your avocado toast is perfect! 😋";
      fill(0, 150, 0);
    } else if (this.finalScore > 70) {
      message = "Delicious! A very tasty creation! 👍";
      fill(100, 150, 0);
    } else if (this.finalScore > 50) {
      message = "Not bad! Your toast is pretty good. 🤔";
      fill(150, 150, 0);
    } else {
      message = "Keep practicing! Your toast needs work... 😬";
      fill(150, 0, 0);
    }
    
    text(message, width/2, height - 150);
    pop();
    
    // Draw buttons
    super.draw();
  }
} 