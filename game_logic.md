- [My proposal](#my-proposal)
    - [ 🥑 Mash \& Munch 🍞 ](#--mash--munch--)
    - [Game Concept: 🥑 Mash \& Munch – The Perfect Avocado Toast](#game-concept--mash--munch--the-perfect-avocado-toast)
    - [🧭 Inspiration](#-inspiration)
    - [🎮 Game Overview](#-game-overview)
    - [🧩 Core Gameplay Mechanics](#-core-gameplay-mechanics)
    - [🧱 Code Structure (p5.js)](#-code-structure-p5js)
    - [🎨 Visual + Audio Ideas](#-visual--audio-ideas)
    - [🧠 Challenges to Expect](#-challenges-to-expect)

<br>

---

# My proposal

### <span style="color: #8EAD6B"> 🥑 Mash & Munch 🍞 </span>

### Game Concept: 🥑 Mash & Munch – The Perfect Avocado Toast

*Mash & Munch* is a **casual, minigame-based cooking game** where your goal is to create the most delicious and aesthetically pleasing avocado toast. The game blends tactile minigames with drag-and-drop creativity, allowing players to toast bread, mash avocados, and arrange toppings with precision—or chaos.

---

### 🧭 Inspiration

Inspired by **Cooking Mama**’s minigame format and the satisfying vibes of casual food prep games like **Good Pizza, Great Pizza**, this game turns a humble piece of toast into a canvas for culinary expression. Also influenced by the stylized food culture of **Japanese lunchbox games (like お弁当メーカー)** and cozy visual aesthetics.

---

### 🎮 Game Overview

* **Goal**: Build the *perfect* avocado toast based on flavor, aesthetics, and creativity.
* **Flow**:

  1. Select ingredients
  2. Toast bread
  3. Mash avocado
  4. Add toppings
  5. Plate and style
* **Replayability**: Daily challenges, unlockable toppings, and social sharing for your toast creations.

---

### 🧩 Core Gameplay Mechanics

| Feature       | Description                                                |
| ------------- | ---------------------------------------------------------- |
| Toasting Game | Tap to start/stop toaster. Perfect timing = golden crisp   |
| Mashing Game  | Rhythmic mashing via mouse presses. Add optional mix-ins   |
| Topping Drag  | Drag & drop toppings; rotate/resize for design points      |
| Style Points  | Composition is scored for symmetry, creativity, minimalism |
| Feedback      | Judge reacts with emojis and comments (😋, 🤔, 😬)         |

---

### 🧱 Code Structure (p5.js)

**Classes**

* `GameManager`

  * Tracks `scene`, controls transitions
* `Scene` subclasses:

  * `StartScene`, `ToastScene`, `MashScene`, `TopScene`, `PlateScene`
* `UIManager`

  * Draws buttons, instructions, top bars
* `AssetLoader`

  * Handles images/sounds
* `Ingredient`, `Button`, `Toaster`, `Toast`, etc.

**Key Functions**

* `drawScene()` – Renders current state
* `handleInteraction()` – Clicks, drags, holds
* `evaluateToast()` – Computes toast score from taste + aesthetics
* `updateStatsOverTime()` – If timing-based mechanics are needed

---

### 🎨 Visual + Audio Ideas

* **Visual Style**: Hand-drawn, textured pastels (inspired by Japanese game UIs)
* **Backgrounds**: Wooden boards, striped cloth, sunny kitchen
* **Sprites**: Avocado halves, toppings (egg, chili, feta, etc.)
* **Audio**:

  * Toast pop SFX
  * Mashing squish SFX
  * Lo-fi kitchen background loop

---

### 🧠 Challenges to Expect

| Area                 | Challenge                                                   |
| -------------------- | ----------------------------------------------------------- |
| Interaction Logic    | Getting click-drag-drop mechanics to feel responsive        |
| Animation Smoothness | Easing in toast browning or topping dropping                |
| Image Layering       | Making layers (toast, toppings, UI) render cleanly          |
| Scene Management     | Keeping scene transitions clean and modular                 |
| Responsive Design    | Adapting layout for desktop web sizes with `resizeCanvas()` |

---

Let me know if you want this exported as a `.md` file or packaged with the project structure.
