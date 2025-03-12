const gameContainer = document.getElementById('game-container');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');

const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let gameActive = true;

// Shuffle the cards
function shuffleCards() {
  for (let i = cardValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
  }
}

// Create the cards
function createCards() {
  shuffleCards();
  cards = [];
  for (let i = 0; i < cardValues.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = cardValues[i];

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-face', 'card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-face', 'card-back');
    cardBack.textContent = cardValues[i];

    card.appendChild(cardFront);
    card.appendChild(cardBack);
    gameContainer.appendChild(card);
    card.addEventListener('click', handleCardClick);
    cards.push(card);
  }
}

// Handle card click
function handleCardClick(event) {
  if (!gameActive) return;
  const clickedCard = event.currentTarget;

  if (clickedCard.classList.contains('flipped') || flippedCards.length >= 2) {
    return;
  }

  clickedCard.classList.add('flipped');
  flippedCards.push(clickedCard);

  if (flippedCards.length === 2) {
    gameActive = false;
    setTimeout(checkMatch, 1000);
  }
}

// Check for a match
function checkMatch() {
  const [card1, card2] = flippedCards;
  const value1 = card1.dataset.value;
  const value2 = card2.dataset.value;

  if (value1 === value2) {
    message.textContent = 'Match!';
    matchedPairs++;
    card1.removeEventListener('click', handleCardClick);
    card2.removeEventListener('click', handleCardClick);
    if (matchedPairs === cardValues.length / 2) {
      gameOver();
    }
  } else {
    message.textContent = 'Try again!';
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  flippedCards = [];
  gameActive = true;
}

// Game over
function gameOver() {
  message.textContent = 'You win!';
  gameActive = false;
}

// Reset the game
function resetGame() {
  gameActive = true;
  matchedPairs = 0;
  flippedCards = [];
  message.textContent = '';
  gameContainer.innerHTML = '';
  createCards();
}

// Add event listener to reset button
resetButton.addEventListener('click', resetGame);

// Start the game
createCards();
