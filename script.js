const board = document.getElementById('board');
const diceButton = document.getElementById('roll-dice');
const diceResult = document.getElementById('dice-result');
const playerInfo = document.getElementById('player-info');
const messageDisplay = document.getElementById('message');

const boardSquares = [
  'Go', 'Mediterranean Avenue', 'Community Chest', 'Baltic Avenue', 'Income Tax', 'Reading Railroad', 'Oriental Avenue', 'Chance', 'Vermont Avenue', 'Connecticut Avenue',
  'Jail', 'St. Charles Place', 'Electric Company', 'States Avenue', 'Virginia Avenue', 'Pennsylvania Railroad', 'St. James Place', 'Community Chest', 'Tennessee Avenue', 'New York Avenue',
  'Free Parking', 'Kentucky Avenue', 'Chance', 'Indiana Avenue', 'Illinois Avenue', 'B. & O. Railroad', 'Atlantic Avenue', 'Ventnor Avenue', 'Water Works', 'Marvin Gardens',
  'Go To Jail', 'Pacific Avenue', 'North Carolina Avenue', 'Community Chest', 'Pennsylvania Avenue', 'Short Line', 'Chance', 'Park Place', 'Luxury Tax', 'Boardwalk'
];

const properties = [
  { name: 'Mediterranean Avenue', color: 'brown', price: 60, rent: 2 },
  { name: 'Baltic Avenue', color: 'brown', price: 60, rent: 4 },
  { name: 'Oriental Avenue', color: 'lightblue', price: 100, rent: 6 },
  { name: 'Vermont Avenue', color: 'lightblue', price: 100, rent: 6 },
  { name: 'Connecticut Avenue', color: 'lightblue', price: 120, rent: 8 },
  { name: 'St. Charles Place', color: 'pink', price: 140, rent: 10 },
  { name: 'States Avenue', color: 'pink', price: 140, rent: 10 },
  { name: 'Virginia Avenue', color: 'pink', price: 160, rent: 12 },
  { name: 'St. James Place', color: 'orange', price: 180, rent: 14 },
  { name: 'Tennessee Avenue', color: 'orange', price: 180, rent: 14 },
  { name: 'New York Avenue', color: 'orange', price: 200, rent: 16 },
  { name: 'Kentucky Avenue', color: 'red', price: 220, rent: 18 },
  { name: 'Indiana Avenue', color: 'red', price: 220, rent: 18 },
  { name: 'Illinois Avenue', color: 'red', price: 240, rent: 20 },
  { name: 'Atlantic Avenue', color: 'yellow', price: 260, rent: 22 },
  { name: 'Ventnor Avenue', color: 'yellow', price: 260, rent: 22 },
  { name: 'Marvin Gardens', color: 'yellow', price: 280, rent: 24 },
  { name: 'Pacific Avenue', color: 'green', price: 300, rent: 26 },
  { name: 'North Carolina Avenue', color: 'green', price: 300, rent: 26 },
  { name: 'Pennsylvania Avenue', color: 'green', price: 320, rent: 28 },
  { name: 'Park Place', color: 'darkblue', price: 350, rent: 35 },
  { name: 'Boardwalk', color: 'darkblue', price: 400, rent: 50 },
  { name: 'Reading Railroad', color: 'black', price: 200, rent: 25 },
  { name: 'Pennsylvania Railroad', color: 'black', price: 200, rent: 25 },
  { name: 'B. & O. Railroad', color: 'black', price: 200, rent: 25 },
  { name: 'Short Line', color: 'black', price: 200, rent: 25 },
  { name: 'Electric Company', color: 'gray', price: 150, rent: 4 },
  { name: 'Water Works', color: 'gray', price: 150, rent: 4 },
];

let players = [
  { name: 'Player 1', position: 0, money: 1500, element: null },
  { name: 'Player 2', position: 0, money: 1500, element: null }
];
let currentPlayerIndex = 0;

// Create the board
function createBoard() {
  for (let i = 0; i < boardSquares.length; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.textContent = boardSquares[i];
    square.id = `square-${i}`;

    if (properties.find(prop => prop.name === boardSquares[i])) {
      square.classList.add('property');
    }
    if (i === 0 || i === 10 || i === 20 || i === 30) {
      square.classList.add('corner');
    }

    board.appendChild(square);
  }
}

// Create players
function createPlayers() {
  players.forEach((player, index) => {
    const playerElement = document.createElement('div');
    playerElement.classList.add('player', `player${index + 1}`);
    player.element = playerElement;
    document.getElementById('square-0').appendChild(playerElement);
  });
}

// Roll the dice
function rollDice() {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  const total = dice1 + dice2;
  diceResult.textContent = `Dice: ${dice1} + ${dice2} = ${total}`;
  movePlayer(total);
}

// Move the player
function movePlayer(spaces) {
  const currentPlayer = players[currentPlayerIndex];
  const currentPosition = currentPlayer.position;
  const newPosition = (currentPosition + spaces) % boardSquares.length;

  currentPlayer.position = newPosition;
  const newSquare = document.getElementById(`square-${newPosition}`);
  newSquare.appendChild(currentPlayer.element);

  updatePlayerInfo();
  checkSquare(newPosition);
  switchPlayer();
}

// Check the square
function checkSquare(position) {
  const squareName = boardSquares[position];
  const property = properties.find(prop => prop.name === squareName);
  if (property) {
    messageDisplay.textContent = `You landed on ${property.name}. Price: ${property.price}`;
  } else {
    messageDisplay.textContent = `You landed on ${squareName}.`;
  }
}

// Switch player
function switchPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  messageDisplay.textContent = `${players[currentPlayerIndex].name}'s turn.`;
}

// Update player info
function updatePlayerInfo() {
  playerInfo.innerHTML = '';
  players.forEach(player => {
    const playerDiv = document.createElement('div');
    playerDiv.textContent = `${player.name}: $${player.money}`;
    playerInfo.appendChild(playerDiv);
  });
}

// Initialize the game
function initializeGame() {
  createBoard();
  createPlayers();
  updatePlayerInfo();
  messageDisplay.textContent = `${players[currentPlayerIndex].name}'s turn.`;
}

// Event listeners
diceButton.addEventListener('click', rollDice);

// Start the game
initializeGame();
