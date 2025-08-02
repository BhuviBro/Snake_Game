// Game Constants and Variables
let inputDir = { x: 0, y: 0 }; // Initial direction set to neutral (no movement)
const foodSound = new Audio('music/food.mp3'); // Sound on eating food
const gameOverSound = new Audio('music/gameover.mp3'); // Sound on game over
const moveSound = new Audio('music/move.mp3'); // Sound on movement
const musicSound = new Audio('music/music.mp3'); // Background music
let speed = 10; // Speed of the game
let score = 0; // Initial score
let lastPaintTime = 0; // Time tracking for frame rendering
let snakeArr = [     
  { x: 13, y: 15 } // Initial position of the snake
]


food = { x: 6, y: 7 }; // Initial food position

// Game Functions
function main(ctime) { // ctime --> Current Time 
  window.requestAnimationFrame(main); // Looping the main function using animation frame
 
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return; // Skip this frame if speed threshold not reached
  }
  lastPaintTime = ctime; // Update last paint time
  gameEngine(); // Call main game engine logic
}     

function isCollide(snake) {
 // If snake bumps into itself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // If snake hits the wall
  if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
    return true;
  }
}

function gameEngine() {
  // Part 1: Updating the snake's position and checking collisions
  
  if (isCollide(snakeArr)) {
    gameOverSound.play(); // Play game over sound
    musicSound.pause(); // Stop background music
    inputDir = { x: 0, y: 0 }; // Stop snake movement
    alert("Game Over Press Anykey to Play Again"); // Show game over alert
    snakeArr = [{ x: 13, y: 15 }]; // Reset snake to initial position
    musicSound.play(); // Restart music
    score = 0; // Reset score
  }

  // If snake has eaten the food, increase score and generate new food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play(); // Play food sound
    score += 1; // Increment score

    // Update high score if current score exceeds previous
    if(score > hiscoreval){
      hiscoreval = score;
      localStorage.setItem("hiscore",JSON.stringify(hiscoreval)); // Save new high score
      hiscoreBox.innerHTML = "High score: "+ hiscoreval; // Update high score display
    }

    scoreBox.innerHTML = "Score: " + score; // Update score display

    // Add a new head in the direction of movement (snake grows)
    snakeArr.unshift({ 
      x: snakeArr[0].x + inputDir.x, 
      y: snakeArr[0].y + inputDir.y 
    });

    // Generate new food at random location
    let a = 2;
    let b = 16;
    food = { 
      x: Math.round(a + (b - a) * Math.random()), 
      y: Math.round(a + (b - a) * Math.random()) 
    };
  }

  // Moving the snake by shifting each segment to the position of the previous one
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] }; // Copy position of i-th segment to (i+1)-th
  }

  // Update head's position based on input direction
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;


  // Part 2: Display the Snake and Food on the board
  // Clear the previous frame
  board.innerHTML = "";

  // Display the Snake
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement('div'); // Create a new div for each segment
    snakeElement.style.gridRowStart = e.y; // Set row position
    snakeElement.style.gridColumnStart = e.x; // Set column position
    if (index === 0) {
      snakeElement.classList.add('head'); // Add head styling for first segment
    }
    else {
      snakeElement.classList.add('snake'); // Add body styling
    }
    board.appendChild(snakeElement); // Add segment to the board
  });

  // Display the Food
  foodElement = document.createElement('div'); // Create a div for food
  foodElement.style.gridRowStart = food.y; // Set food row
  foodElement.style.gridColumnStart = food.x; // Set food column
  foodElement.classList.add('food'); // Add food styling
  board.appendChild(foodElement); // Add food to the board
}

// Main Logic Starts Here
musicSound.play(); // Play background music

let hiscore = localStorage.getItem("hiscore") // Retrieve saved high score
if(hiscore === null){
  hiscoreval = 0; // Set to 0 if not found
  localStorage.setItem("hiscore",JSON.stringify(hiscoreval)); // Save initial high score
}
else{
  hiscoreval = JSON.parse(hiscore); // Parse and assign high score
  hiscoreBox.innerHTML = "High score: "+ hiscore; // Display high score
}

window.requestAnimationFrame(main); // Start the game loop

// Listen for arrow key presses to control the snake
window.addEventListener('keydown', e => {
  inputDir = { x: 0, y: 1 }; // Default direction to start the game
  moveSound.play(); // Play movement sound

  // Change direction based on key pressed
  switch (e.key) {
    case "ArrowUp":
      console.log("ArrowUp");
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowDown":
      console.log("ArrowDown");
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case "ArrowRight":
      console.log("ArrowRight");
      inputDir.x = 1;
      inputDir.y = 0;
      break;
    case "ArrowLeft":
      console.log("ArrowLeft");
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    default:
      break;
  }
});
