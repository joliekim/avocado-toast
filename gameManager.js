class GameManager {
  constructor() {
    this.score = 0;
    this.toastBrownness = 0;
    this.avocadoMashQuality = 0;
    this.toppingsArrangement = 0;
    this.platePresentation = 0;
    
    // Game state tracking
    this.selectedIngredients = [];
    this.toastDone = false;
    this.avocadoMashed = false;
    this.toppingsAdded = false;
    this.plated = false;
  }
  
  changeScene(sceneName) {
    switch(sceneName) {
      case 'instructions':
        currentScene = new InstructionsScene();
        break;
      case 'toast':
        currentScene = new ToastScene();
        break;
      case 'mash':
        currentScene = new MashScene();
        break;
      case 'toppings':
        currentScene = new ToppingsScene();
        break;
      case 'plate':
        currentScene = new PlateScene();
        break;
      case 'results':
        currentScene = new ResultsScene();
        break;
      default:
        currentScene = new InstructionsScene();
    }
  }
  
  calculateScore() {
    // Calculate final score based on all mini-game performances
    this.score = (this.toastBrownness + this.avocadoMashQuality + 
                 this.toppingsArrangement + this.platePresentation) / 4 * 100;
    return this.score;
  }
  
  resetGame() {
    this.score = 0;
    this.toastBrownness = 0;
    this.avocadoMashQuality = 0;
    this.toppingsArrangement = 0;
    this.platePresentation = 0;
    
    this.selectedIngredients = [];
    this.toastDone = false;
    this.avocadoMashed = false;
    this.toppingsAdded = false;
    this.plated = false;
    
    this.changeScene('instructions');
  }
} 