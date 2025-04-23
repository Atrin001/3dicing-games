document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const gameSections = document.querySelectorAll('.game-section');
    
    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.getAttribute('data-game');
            
            // Remove active class from all buttons and sections
            tabButtons.forEach(btn => btn.classList.remove('active'));
            gameSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button and corresponding section
            button.classList.add('active');
            document.getElementById(`${gameId}-game`).classList.add('active');
        });
    });
    
    // --------- REGULAR DICE GAME ---------
    const regularRollBtn = document.getElementById('regular-rollBtn');
    const regularResetBtn = document.getElementById('regular-resetBtn');
    const regularDice1 = document.getElementById('regular-dice1');
    const regularDice2 = document.getElementById('regular-dice2');
    const regularScore1 = document.getElementById('regular-score1');
    const regularScore2 = document.getElementById('regular-score2');
    const regularResult = document.getElementById('regular-result');
    
    // Game state variables
    let player1Score = 0;
    let player2Score = 0;
    
    // Function to roll the dice and update the display
    function rollRegularDice() {
        // Add rolling animation
        regularDice1.classList.add('rolling');
        regularDice2.classList.add('rolling');
        
        // Generate random numbers between 1 and 6 for both players
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        
        // Set a timeout to show the animation before displaying results
        setTimeout(() => {
            // Update dice visualization
            updateDiceDisplay(regularDice1, roll1);
            updateDiceDisplay(regularDice2, roll2);
            
            // Remove rolling animation
            regularDice1.classList.remove('rolling');
            regularDice2.classList.remove('rolling');
            
            // Determine the winner and update scores
            if (roll1 > roll2) {
                player1Score++;
                regularResult.textContent = "Player 1 wins this round!";
                regularResult.style.color = "#4caf50";
            } else if (roll2 > roll1) {
                player2Score++;
                regularResult.textContent = "Player 2 wins this round!";
                regularResult.style.color = "#2196f3";
            } else {
                regularResult.textContent = "It's a tie!";
                regularResult.style.color = "#ff9800";
            }
            
            // Update score display
            regularScore1.textContent = `Score: ${player1Score}`;
            regularScore2.textContent = `Score: ${player2Score}`;
        }, 600);
    }
    
    // Function to reset the regular game
    function resetRegularGame() {
        player1Score = 0;
        player2Score = 0;
        regularScore1.textContent = 'Score: 0';
        regularScore2.textContent = 'Score: 0';
        regularResult.textContent = 'Ready to play!';
        regularResult.style.color = '#333';
        
        // Reset dice to show just one dot (for number 1)
        updateDiceDisplay(regularDice1, 1);
        updateDiceDisplay(regularDice2, 1);
    }
    
    // Event listeners for regular game
    regularRollBtn.addEventListener('click', rollRegularDice);
    regularResetBtn.addEventListener('click', resetRegularGame);
    
    
    // --------- SNAKES & LADDERS GAME ---------
// ---------- Snakes & Ladders Game Logic (Improved) ---------- //

const snakesRollBtn = document.getElementById('snakes-rollBtn');
const snakesResetBtn = document.getElementById('snakes-resetBtn');
const snakesDice = document.getElementById('snakes-dice');
const snakesResult = document.getElementById('snakes-result');
const snakesMovesLog = document.getElementById('snakes-moves');
const player1Position = document.getElementById('player1-position');
const player2Position = document.getElementById('player2-position');
const player1Token = document.querySelector('.player1-token');
const player2Token = document.querySelector('.player2-token');

// let currentPlayer = 1;
let playerPositions = { 1: 1, 2: 1 };

const snakes = {
    16: 6, 47: 26, 49: 11, 56: 53, 62: 19,98: 78
};

const ladders = {
    1: 38, 4: 14, 9: 31, 21: 42, 28: 84,
    36: 44, 51: 67, 71: 91, 80: 100
};

function rollSnakesDice() {
    snakesDice.classList.add('rolling');
    snakesRollBtn.disabled = true;

    const roll = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
        updateDiceDisplay(snakesDice, roll);
        snakesDice.classList.remove('rolling');
        handlePlayerMove(roll);
    }, 600);
}

function handlePlayerMove(roll) {
    const currentPos = playerPositions[currentPlayer];
    let targetPos = currentPos + roll;

    if (targetPos > 100) {
        snakesResult.textContent = `Player ${currentPlayer} needs exact roll to reach 100.`;
        snakesResult.style.color = '#f44336';
        setTimeout(switchTurn, 800);  // Small delay so message is readable
        return;
    }

    updatePlayerVisual(currentPlayer, targetPos);
    snakesMovesLog.textContent = `Player ${currentPlayer} rolled ${roll} and moved to ${targetPos}`;

    // Default result message
    let message = `Player ${currentPlayer} moved to ${targetPos}`;
    let color = '#333';

    if (snakes[targetPos]) {
        const snakeTail = snakes[targetPos];
        message = `Player ${currentPlayer} hit a snake! Slid to ${snakeTail}`;
        color = '#f44336';
        targetPos = snakeTail;
    } else if (ladders[targetPos]) {
        const ladderTop = ladders[targetPos];
        message = `Player ${currentPlayer} climbed a ladder to ${ladderTop}`;
        color = '#4caf50';
        targetPos = ladderTop;
    }

    // Apply updates with a slight delay for animation effect
    setTimeout(() => {
        snakesResult.textContent = message;
        snakesResult.style.color = color;

        updatePlayerVisual(currentPlayer, targetPos);
        playerPositions[currentPlayer] = targetPos;

        if (targetPos === 100) {
            snakesResult.textContent = `Player ${currentPlayer} wins!`;
            snakesResult.style.color = '#ff9800';
            snakesRollBtn.disabled = true;
        } else {
            setTimeout(switchTurn, 1000);  // Let player see the result before switching turn
        }
    }, 400);
}

function updatePlayerVisual(player, pos) {
    const marker = player === 1 ? player1Position : player2Position;
    marker.textContent = pos;
    const leftPercent = ((pos - 1) / 99) * 100;
    marker.style.left = `calc(${leftPercent}% + 15px)`;
}

function switchTurn() {
    if (playerPositions[1] < 100 && playerPositions[2] < 100) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        snakesResult.textContent = `Player ${currentPlayer}'s turn`;
        snakesResult.style.color = currentPlayer === 1 ? '#4caf50' : '#2196f3';

        player1Token.classList.toggle('active-player', currentPlayer === 1);
        player2Token.classList.toggle('active-player', currentPlayer === 2);
        snakesRollBtn.disabled = false;
    }
}

function resetSnakesGame() {
    playerPositions = { 1: 1, 2: 1 };
    currentPlayer = 1;

    updatePlayerVisual(1, 1);
    updatePlayerVisual(2, 1);

    player1Token.classList.add('active-player');
    player2Token.classList.remove('active-player');

    snakesResult.textContent = 'Roll dice to start!';
    snakesResult.style.color = '#333';
    snakesMovesLog.textContent = 'Game ready to begin';
    updateDiceDisplay(snakesDice, 1);
    snakesRollBtn.disabled = false;
}

snakesRollBtn.addEventListener('click', rollSnakesDice);
snakesResetBtn.addEventListener('click', resetSnakesGame);



// --------- BACKGAMMON GAME ---------
const backgammonRollBtn = document.getElementById('backgammon-rollBtn');
const backgammonResetBtn = document.getElementById('backgammon-resetBtn');
const backgammonDoubleBtn = document.getElementById('backgammon-doubleBtn');
const backgammonDice1 = document.getElementById('backgammon-dice1');
const backgammonDice2 = document.getElementById('backgammon-dice2');
const backgammonMoves = document.getElementById('backgammon-moves');
const backgammonResult = document.getElementById('backgammon-result');
const backgammonCube = document.getElementById('backgammon-cube');

// Backgammon game state variables
let doubleValue = 1;
let currentPlayer = 1;
let canDouble = true;

// Function to roll the dice for backgammon
function rollBackgammonDice() {
    // Add rolling animation
    backgammonDice1.classList.add('rolling');
    backgammonDice2.classList.add('rolling');
    
    // Disable roll button during animation
    backgammonRollBtn.disabled = true;
    
    // Generate random numbers between 1 and 6 for both dice
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    
    // Set a timeout to show the animation
    setTimeout(() => {
        // Update dice visualization
        updateDiceDisplay(backgammonDice1, roll1);
        updateDiceDisplay(backgammonDice2, roll2);
        
        // Remove rolling animation
        backgammonDice1.classList.remove('rolling');
        backgammonDice2.classList.remove('rolling');
        
        // Re-enable roll button
        backgammonRollBtn.disabled = false;
        
        // Determine moves available
        if (roll1 === roll2) {
            // Doubles
            backgammonMoves.textContent = `Available moves  for playe${currentPlayer}:  ${roll1}, ${roll1}, ${roll1}, ${roll1}`;
            backgammonResult.textContent = `Doubles! Four moves of ${roll1}`;
            backgammonResult.style.color = "#ff9800";
        } else {
            backgammonMoves.textContent = `Available moves for playe${currentPlayer}  : ${roll1}, ${roll2}`;
            document.getElementById("backgammon-currentPlayer").textContent = `Player ${currentPlayer}'s moves`;
            backgammonResult.style.color = currentPlayer === 1 ? "#4caf50" : "#2196f3";
        }
        
        // Switch player after roll
        currentPlayer = currentPlayer === 1 ? 2 : 1;       
        backgammonResult.textContent = `Player ${currentPlayer}'s turn`;

        
        // Enable double button for next player
        canDouble = true;
    }, 600);
}

// Function to handle doubling the cube
function handleDouble() {
    if (!canDouble) return;
    
    if (doubleValue < 64) {
        doubleValue *= 2;
        backgammonCube.textContent = `Cube: ${doubleValue}`;
        backgammonResult.textContent = `Player ${currentPlayer} doubled to ${doubleValue}!`;
        backgammonResult.style.color = "#ff9800";
        
        // Disable doubling for this player until next turn
        canDouble = false;
    } else {
        backgammonResult.textContent = "Maximum double reached!";
    }
}

// Function to reset the backgammon game
function resetBackgammonGame() {
    doubleValue = 1;
    currentPlayer = 1;
    canDouble = true;
    backgammonCube.textContent = 'Cube: 1';
    backgammonResult.textContent = 'Roll dice to play!';
    backgammonResult.style.color = '#333';
    backgammonMoves.textContent = 'Available moves: -';
    document.getElementById("backgammon-currentPlayer").textContent = `Player 1's turn`;
    
    // Reset dice to show just one dot
    updateDiceDisplay(backgammonDice1, 1);
    updateDiceDisplay(backgammonDice2, 1);
}


// Event listeners for backgammon game
backgammonRollBtn.addEventListener('click', rollBackgammonDice);
backgammonDoubleBtn.addEventListener('click', handleDouble);
backgammonResetBtn.addEventListener('click', resetBackgammonGame);


    // --------- UTILITY FUNCTIONS ---------
    
    // Function to update dice display based on roll value
    function updateDiceDisplay(diceElement, value) {
        // Clear previous dots
        while (diceElement.firstChild) {
            diceElement.removeChild(diceElement.firstChild);
        }
        
        // Add dots based on value
        for (let i = 0; i < value; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            
            // Position dots according to dice value patterns
            switch (value) {
                case 1:
                    dot.classList.add('center');
                    break;
                case 2:
                    dot.classList.add(i === 0 ? 'top-left' : 'bottom-right');
                    break;
                case 3:
                    dot.classList.add(i === 0 ? 'top-left' : i === 1 ? 'center' : 'bottom-right');
                    break;
                case 4:
                    dot.classList.add(i === 0 ? 'top-left' : i === 1 ? 'top-right' : i === 2 ? 'bottom-left' : 'bottom-right');
                    break;
                case 5:
                    dot.classList.add(i === 0 ? 'top-left' : i === 1 ? 'top-right' : i === 2 ? 'center' : i === 3 ? 'bottom-left' : 'bottom-right');
                    break;
                case 6:
                    dot.classList.add(i === 0 ? 'top-left' : i === 1 ? 'top-right' : i === 2 ? 'middle-left' : i === 3 ? 'middle-right' : i === 4 ? 'bottom-left' : 'bottom-right');
                    break;
            }
            
            diceElement.appendChild(dot);
        }
    }
    
    // Initialize games on load
    resetRegularGame();
    resetBackgammonGame();
    resetSnakesGame();
    
    // Set first tab as active by default
    tabButtons[0].click();
});