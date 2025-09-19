// Game state
const gameState = {
    horrorKeyFragments: 0,
    totalKeyFragments: 4,
    horrorModeUnlocked: false
};

// DOM Elements
const startMenu = document.getElementById('startMenu');
const startButton = document.getElementById('startButton');
const doorSelection = document.getElementById('doorSelection');
const normalDoor = document.getElementById('normalDoor');
const horrorDoor = document.getElementById('horrorDoor');
const horrorLock = document.getElementById('horrorLock');
const horrorText = document.getElementById('horrorText');

// Initialize the game
function init() {
    // Load saved game state if available
    loadGameState();
    
    // Check if horror mode is unlocked
    updateHorrorDoorState();
    
    // Add event listeners
    startButton.addEventListener('click', showDoorSelection);
    normalDoor.addEventListener('click', startNormalMode);
    horrorDoor.addEventListener('click', startHorrorMode);
    
    // Show the start menu
    startMenu.style.display = 'flex';
}

// Show door selection screen
function showDoorSelection() {
    startMenu.style.opacity = '0';
    
    // Wait for fade out transition to complete
    setTimeout(() => {
        startMenu.style.display = 'none';
        doorSelection.classList.add('visible');
    }, 500);
}

// Start normal mode
function startNormalMode() {
    // Hide the door selection
    doorSelection.classList.remove('visible');
    
    // Start the game with normal mode
    console.log('Starting Normal Mode');
    // Add your game start logic here
}

// Start horror mode
function startHorrorMode() {
    // Check if horror mode is unlocked
    if (!gameState.horrorModeUnlocked) {
        // Show a message that horror mode is locked
        alert('Horror Mode is locked! Collect all key fragments to unlock.');
        return;
    }
    
    // Hide the door selection
    doorSelection.classList.remove('visible');
    
    // Start the game with horror mode
    console.log('Starting Horror Mode');
    // Add your horror mode start logic here
}

// Update the horror door state based on key fragments
function updateHorrorDoorState() {
    gameState.horrorModeUnlocked = gameState.horrorKeyFragments >= gameState.totalKeyFragments;
    
    if (gameState.horrorModeUnlocked) {
        horrorDoor.classList.add('unlocked');
        horrorText.classList.remove('hidden');
    } else {
        horrorDoor.classList.remove('unlocked');
        horrorText.classList.add('hidden');
    }
}

// Add a key fragment
function addKeyFragment() {
    if (gameState.horrorKeyFragments < gameState.totalKeyFragments) {
        gameState.horrorKeyFragments++;
        updateHorrorDoorState();
        saveGameState();
        
        // Show a message when all fragments are collected
        if (gameState.horrorKeyFragments === gameState.totalKeyFragments) {
            console.log('Horror Mode Unlocked!');
        }
        
        return true;
    }
    return false;
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        Object.assign(gameState, parsedState);
    }
}

// For testing: Add a key fragment (can be called from console)
window.addKeyFragment = addKeyFragment;

// For testing: Reset game state (can be called from console)
window.resetGameState = function() {
    gameState.horrorKeyFragments = 0;
    gameState.horrorModeUnlocked = false;
    updateHorrorDoorState();
    saveGameState();
    console.log('Game state reset');
};

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
