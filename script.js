// DOM Elements
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const timerElement = document.getElementById('timer');
const currentScoreElement = document.getElementById('currentScore');
const secretsFoundElement = document.getElementById('secretsFound');
const maxSecretsElement = document.getElementById('maxSecrets');
const staminaFill = document.getElementById('staminaFill');

// Game State
let seconds = 0;
let minutes = 0;
let hours = 0;
let currentScore = 0;
const maxQuizzes = 10;
let secretsFound = 0;
let maxSecrets = 5;
let stamina = 100;
let timerInterval;

// Game Settings
const defaultSettings = {
    theme: 'light-theme',
    quality: 'medium',
    maxFPS: 60,
    guiScale: 100,
    controlScheme: 'wasd',
    mouseSensitivity: 50,
    invertYAxis: false
};

// Current settings
let currentSettings = {...defaultSettings};

// Game state
let gameLoop = null;
let lastFrameTime = 0;
let frameInterval = 1000 / 60; // Start with 60 FPS

// Initialize the game
function init() {
    // Load saved settings or use defaults
    loadSettings();
    
    // Initialize hotbar with 9 slots
    initHotbar();
    
    // Start the game timer
    startTimer();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Initialize game state
    updateScore();
    updateStamina();
    
    // Apply settings to UI
    updateSettingsUI();
    
    // Apply all settings to the game
    applyAllSettings();
    
    // Start the game loop
    startGameLoop();
}

// Game loop
function startGameLoop() {
    // Clear any existing game loop
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
    }
    
    let lastTime = performance.now();
    let lag = 0;
    
    function loop(currentTime) {
        // Calculate delta time
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        lag += deltaTime;
        
        // Update game logic at fixed time steps
        while (lag >= frameInterval) {
            updateGame(frameInterval / 1000); // Convert to seconds
            lag -= frameInterval;
        }
        
        // Render the game
        renderGame(lag / frameInterval);
        
        // Continue the loop
        gameLoop = requestAnimationFrame(loop);
    }
    
    // Start the loop
    gameLoop = requestAnimationFrame(loop);
}

// Update game state
function updateGame(deltaTime) {
    // Update game objects, physics, etc.
    // This is where you'd update player position, check collisions, etc.
    
    // Example:
    // if (playerMovement.forward) player.position.z -= player.speed * deltaTime;
    // if (playerMovement.backward) player.position.z += player.speed * deltaTime;
    // if (playerMovement.left) player.position.x -= player.speed * deltaTime;
    // if (playerMovement.right) player.position.x += player.speed * deltaTime;
    
    // Update any game timers or animations
    updateGameState(deltaTime);
}

// Render the game
function renderGame(interpolation) {
    // Render the game with interpolation for smooth animation
    // This is where you'd draw your game using the current state
    
    // Example:
    // renderer.render(scene, camera);
    
    // Update any UI elements that need to be in sync with the game
    updateGameUI();
}

// Update game state (physics, AI, etc.)
function updateGameState(deltaTime) {
    // Update game objects, physics, AI, etc.
    // This is called from the game loop with a fixed time step
}

// Update game UI elements
function updateGameUI() {
    // Update any UI elements that need to be in sync with the game
    // This is called from the render loop
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
        try {
            currentSettings = {...defaultSettings, ...JSON.parse(savedSettings)};
            // Apply theme
            body.className = currentSettings.theme;
            themeToggle.checked = currentSettings.theme === 'dark-theme';
        } catch (e) {
            console.error('Error loading settings:', e);
            currentSettings = {...defaultSettings};
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        currentSettings.theme = 'dark-theme';
        body.className = 'dark-theme';
        themeToggle.checked = true;
    }
}

// Save settings to localStorage
function saveSettings() {
    try {
        localStorage.setItem('gameSettings', JSON.stringify(currentSettings));
        return true;
    } catch (e) {
        console.error('Error saving settings:', e);
        return false;
    }
}

// Update UI elements to reflect current settings
function updateSettingsUI() {
    // Theme
    document.getElementById('themeToggle').checked = currentSettings.theme === 'dark-theme';
    
    // Quality
    document.getElementById('qualitySelect').value = currentSettings.quality;
    
    // FPS
    document.getElementById('fpsSlider').value = currentSettings.maxFPS;
    document.getElementById('fpsValue').textContent = currentSettings.maxFPS;
    
    // GUI Scale
    document.getElementById('guiScale').value = currentSettings.guiScale;
    document.getElementById('guiScaleValue').textContent = currentSettings.guiScale;
    
    // Control Scheme
    document.querySelector(`input[name="controlScheme"][value="${currentSettings.controlScheme}"]`).checked = true;
    
    // Mouse Sensitivity
    document.getElementById('mouseSensitivity').value = currentSettings.mouseSensitivity;
    document.getElementById('sensitivityValue').textContent = currentSettings.mouseSensitivity;
    
    // Invert Y-Axis
    document.getElementById('invertYAxis').checked = currentSettings.invertYAxis;
    
    // Apply GUI Scale
    applyGUIScale(currentSettings.guiScale);
}

// Apply GUI scale to the interface
function applyGUIScale(scale) {
    const scaleFactor = scale / 100;
    const scaleContainer = document.querySelector('.scale-container');
    
    if (!scaleContainer) {
        console.error('Scale container not found');
        return;
    }
    
    // Apply the scale to the container
    scaleContainer.style.transform = `scale(${scaleFactor})`;
    
    // Update the viewport size to account for scaling
    const viewportWidth = window.innerWidth / scaleFactor;
    const viewportHeight = window.innerHeight / scaleFactor;
    
    // Update CSS variables
    document.documentElement.style.setProperty('--gui-scale', scale);
    document.documentElement.style.setProperty('--gui-scale-factor', scaleFactor);
    
    // Update current settings
    currentSettings.guiScale = scale;
    
    // Force a reflow to ensure smooth animation
    scaleContainer.offsetHeight;
    
    console.log('GUI scale updated:', scale, '(', scaleFactor, ')');
}

// Set up event listeners
function setupEventListeners() {
    // Menu button click
    menuBtn.addEventListener('click', toggleMenu);
    
    // Click outside menu to close it
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
            menuDropdown.classList.remove('active');
        }
    });
    
    // Settings controls
    setupSettingsControls();
}

// Set up settings controls event listeners
function setupSettingsControls() {
    // Theme Toggle - Immediate feedback
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('change', function() {
        currentSettings.theme = this.checked ? 'dark-theme' : 'light-theme';
        applyAllSettings();
        showNotification('Theme changed!');
    });
    
    // Quality Select - Immediate feedback
    const qualitySelect = document.getElementById('qualitySelect');
    qualitySelect.addEventListener('change', function() {
        currentSettings.quality = this.value;
        applyQualitySettings(this.value);
        showNotification(`Quality set to: ${this.value}`);
    });
    
    // FPS Slider - Live update display, apply on mouse up
    const fpsSlider = document.getElementById('fpsSlider');
    const fpsValue = document.getElementById('fpsValue');
    
    fpsSlider.addEventListener('input', function() {
        fpsValue.textContent = this.value;
        // Don't apply yet, wait for mouseup or apply button
    });
    
    fpsSlider.addEventListener('change', function() {
        currentSettings.maxFPS = parseInt(this.value, 10);
        frameInterval = 1000 / currentSettings.maxFPS;
        showNotification(`FPS limit set to: ${this.value}`);
    });
    
    // GUI Scale Slider - Live update
    const guiScale = document.getElementById('guiScale');
    const guiScaleValue = document.getElementById('guiScaleValue');
    
    guiScale.addEventListener('input', function() {
        const scale = parseInt(this.value, 10);
        guiScaleValue.textContent = scale;
        applyGUIScale(scale);
    });
    
    // Control Scheme Radio Buttons - Immediate feedback
    document.querySelectorAll('input[name="controlScheme"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                currentSettings.controlScheme = this.value;
                setupControls();
                showNotification(`Controls set to: ${this.value}`);
            }
        });
    });
    
    // Mouse Sensitivity Slider - Live update
    const sensitivitySlider = document.getElementById('mouseSensitivity');
    const sensitivityValue = document.getElementById('sensitivityValue');
    
    sensitivitySlider.addEventListener('input', function() {
        const sensitivity = parseInt(this.value, 10);
        sensitivityValue.textContent = sensitivity;
        currentSettings.mouseSensitivity = sensitivity;
    });
    
    // Invert Y-Axis Toggle - Immediate feedback
    const invertYAxis = document.getElementById('invertYAxis');
    invertYAxis.addEventListener('change', function() {
        currentSettings.invertYAxis = this.checked;
        showNotification(`Y-Axis ${this.checked ? 'Inverted' : 'Normal'}`);
    });
    
    // Apply Settings Button
    const applyBtn = document.getElementById('applySettings');
    applyBtn.addEventListener('click', function() {
        applySettings();
        // Add visual feedback
        const originalText = applyBtn.textContent;
        applyBtn.textContent = 'Applied!';
        applyBtn.style.background = 'rgba(0, 180, 0, 0.5)';
        setTimeout(() => {
            applyBtn.textContent = originalText;
            applyBtn.style.background = '';
        }, 1000);
    });
    
    // Reset to Default Button
    document.getElementById('resetSettings').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            resetSettings();
            showNotification('Settings reset to default');
        }
    });
}

// Apply settings from the UI
function applySettings() {
    // Update current settings from UI
    currentSettings = {
        theme: document.getElementById('themeToggle').checked ? 'dark-theme' : 'light-theme',
        quality: document.getElementById('qualitySelect').value,
        maxFPS: parseInt(document.getElementById('fpsSlider').value, 10),
        guiScale: parseInt(document.getElementById('guiScale').value, 10),
        controlScheme: document.querySelector('input[name="controlScheme"]:checked').value,
        mouseSensitivity: parseInt(document.getElementById('mouseSensitivity').value, 10),
        invertYAxis: document.getElementById('invertYAxis').checked
    };
    
    // Apply all settings
    applyAllSettings();
    
    // Save settings
    saveSettings();
    
    // Show feedback
    showNotification('Settings saved!');
    
    // Close the menu
    menuDropdown.classList.remove('active');
}

// Apply all current settings to the game
function applyAllSettings() {
    // Apply theme
    body.className = currentSettings.theme;
    
    // Apply GUI scale
    applyGUIScale(currentSettings.guiScale);
    
    // Apply FPS limit
    frameInterval = 1000 / currentSettings.maxFPS;
    
    // Apply quality settings
    applyQualitySettings(currentSettings.quality);
    
    // Apply control scheme
    setupControls();
    
    // Save settings after applying
    saveSettings();
}

// Apply quality settings
function applyQualitySettings(quality) {
    const body = document.body;
    const scaleContainer = document.querySelector('.scale-container');
    
    // Remove all quality classes first
    body.classList.remove('quality-low', 'quality-medium', 'quality-high', 'quality-ultra');
    
    // Add the selected quality class
    body.classList.add(`quality-${quality}`);
    
    // Apply specific settings based on quality
    switch(quality) {
        case 'low':
            // Minimal effects, pixelated rendering
            document.documentElement.style.setProperty('--blur-amount', '0px');
            document.documentElement.style.setProperty('--saturate-amount', '0.8');
            document.documentElement.style.setProperty('--contrast-amount', '0.9');
            document.documentElement.style.setProperty('--neon-intensity', '0.7');
            if (scaleContainer) {
                scaleContainer.style.filter = 'saturate(0.8) contrast(0.9)';
            }
            break;
            
        case 'medium':
            // Basic effects, slight enhancements
            document.documentElement.style.setProperty('--blur-amount', '0.5px');
            document.documentElement.style.setProperty('--saturate-amount', '1');
            document.documentElement.style.setProperty('--contrast-amount', '1');
            document.documentElement.style.setProperty('--neon-intensity', '0.9');
            if (scaleContainer) {
                scaleContainer.style.filter = 'saturate(1) contrast(1)';
            }
            break;
            
        case 'high':
            // Enhanced effects, better visuals
            document.documentElement.style.setProperty('--blur-amount', '0.2px');
            document.documentElement.style.setProperty('--saturate-amount', '1.1');
            document.documentElement.style.setProperty('--contrast-amount', '1.1');
            document.documentElement.style.setProperty('--neon-intensity', '1');
            if (scaleContainer) {
                scaleContainer.style.filter = 'saturate(1.1) contrast(1.1)';
            }
            // Apply high quality settings
            document.body.style.imageRendering = 'auto';
            document.body.style.fontSmooth = 'antialiased';
            document.body.style.webkitFontSmoothing = 'antialiased';
            break;
            
        case 'ultra':
            // Apply ultra quality settings
            document.body.style.imageRendering = 'auto';
            document.body.style.fontSmooth = 'antialiased';
            document.body.style.webkitFontSmoothing = 'subpixel-antialiased';
            break;
    }
    
    // Update current settings
    currentSettings.quality = quality;
    
    console.log('Quality settings applied:', quality);
}

// Set up controls based on selected scheme
function setupControls() {
    // Remove existing event listeners if any
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('mousemove', handleMouseMove);
    
    // Set up controls based on the selected scheme
    switch(currentSettings.controlScheme) {
        case 'wasd':
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
            break;
            
        case 'arrows':
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
            break;
            
        case 'touch':
            // Setup touch controls
            setupTouchControls();
            break;
    }
    
    // Always set up mouse controls if needed
    if (currentSettings.controlScheme !== 'touch') {
        document.addEventListener('mousemove', handleMouseMove);
    }
}

// Input handling functions
function handleKeyDown(e) {
    const key = e.key.toLowerCase();
    const isWASD = currentSettings.controlScheme === 'wasd';
    
    // Map keys based on control scheme
    const keyMap = {
        'w': isWASD ? 'forward' : null,
        'a': isWASD ? 'left' : null,
        's': isWASD ? 'backward' : null,
        'd': isWASD ? 'right' : null,
        'arrowup': !isWASD ? 'forward' : null,
        'arrowleft': !isWASD ? 'left' : null,
        'arrowdown': !isWASD ? 'backward' : null,
        'arrowright': !isWASD ? 'right' : null,
        ' ': 'jump',
        'shift': 'sprint'
    };
    
    const action = keyMap[key];
    if (action) {
        // Handle the action (e.g., update player movement state)
        console.log('Key pressed:', key, 'Action:', action);
        // playerMovement[action] = true;
    }
}

function handleKeyUp(e) {
    // Similar to handleKeyDown but for key up events
    // playerMovement[action] = false;
}

function handleMouseMove(e) {
    // Handle mouse movement with sensitivity
    const sensitivity = currentSettings.mouseSensitivity / 100;
    const movementX = e.movementX * sensitivity;
    let movementY = e.movementY * sensitivity;
    
    // Invert Y axis if needed
    if (currentSettings.invertYAxis) {
        movementY = -movementY;
    }
    
    // Update camera or view based on mouse movement
    // camera.rotate(movementX, movementY);
}

function setupTouchControls() {
    // Setup touch controls for mobile devices
    const touchArea = document.getElementById('gameContainer') || document.body;
    
    // Remove any existing touch listeners
    touchArea.removeEventListener('touchstart', handleTouchStart);
    touchArea.removeEventListener('touchmove', handleTouchMove);
    touchArea.removeEventListener('touchend', handleTouchEnd);
    
    // Add new touch listeners
    touchArea.addEventListener('touchstart', handleTouchStart, { passive: false });
    touchArea.addEventListener('touchmove', handleTouchMove, { passive: false });
    touchArea.addEventListener('touchend', handleTouchEnd, { passive: false });
}

let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!e.touches[0]) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    // Handle movement or camera rotation based on touch position
    // This is a simplified example - you'd need to implement the actual touch controls
    // based on your game's requirements
}

function handleTouchEnd(e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();
    
    // Handle touch end (e.g., stop movement, detect taps, etc.)
}

// Reset settings to defaults
function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        currentSettings = {...defaultSettings};
        updateSettingsUI();
        applySettings();
        showNotification('Settings reset to defaults!');
    }
}

// Show a notification
function showNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--accent-color);
        color: #fff;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px var(--accent-color);
        z-index: 1000;
        animation: fadeInOut ${duration}ms ease-in-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, duration);
}

// Add fadeInOut keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, 20px); }
        10% { opacity: 1; transform: translate(-50%, 0); }
        90% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);
    
    // Plus sign click
    const plus = document.querySelector('.plus');
    plus.addEventListener('click', () => {
        // Animate plus sign on click
        plus.style.transform = 'scale(1.2)';
        setTimeout(() => {
            plus.style.transform = 'scale(1)';
        }, 200);
        
        // Simulate stamina usage
        if (stamina > 0) {
            stamina -= 10;
            if (stamina < 0) stamina = 0;
            updateStamina();
            
            // Simulate finding a secret (20% chance)
            if (Math.random() < 0.2 && secretsFound < maxSecrets) {
                secretsFound++;
                if (secretsFound === maxSecrets) {
                    maxSecretsElement.classList.remove('hidden');
                }
                updateScore();
            }
            
            // Simulate completing a quiz (40% chance)
            if (Math.random() < 0.4 && currentScore < maxQuizzes) {
                currentScore++;
                updateScore();
            }
        }
    });
    
    // Regenerate stamina over time
    setInterval(() => {
        if (stamina < 100) {
            stamina += 0.5;
            updateStamina();
        }
    }, 1000);

// Toggle menu visibility
function toggleMenu(e) {
    if (e) e.stopPropagation();
    const isActive = menuDropdown.classList.toggle('active');
    menuBtn.classList.toggle('active', isActive);
    
    // Toggle event listener for closing on outside click
    if (isActive) {
        setTimeout(() => document.addEventListener('click', closeMenuOnClickOutside));
    } else {
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

// Close menu when clicking outside
function closeMenuOnClickOutside(e) {
    if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
        menuDropdown.classList.remove('active');
        menuBtn.classList.remove('active');
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

// Initialize menu button
document.addEventListener('DOMContentLoaded', () => {
    // Make sure the menu is hidden initially
    menuDropdown.style.display = 'block';
    menuDropdown.classList.remove('active');
});

// Toggle between light and dark theme
function toggleTheme() {
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        currentSettings.theme = 'dark-theme';
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        currentSettings.theme = 'light-theme';
    }
    saveSettings();
}

// Update the game timer
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }
    
    const displayHours = hours.toString().padStart(2, '0');
    const displayMinutes = minutes.toString().padStart(2, '0');
    const displaySeconds = seconds.toString().padStart(2, '0');
    
    timerElement.textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
}

// Update score display
function updateScore() {
    currentScoreElement.textContent = currentScore;
    secretsFoundElement.textContent = secretsFound;
    if (secretsFound === maxSecrets) {
        maxSecretsElement.textContent = `/${maxSecrets}`;
    }
}

// Update stamina bar with Minecraft-style colors
function updateStamina() {
    staminaFill.style.width = `${stamina}%`;
    
    // Change color based on stamina level (Minecraft boss bar colors)
    if (stamina < 20) {
        // Red when low (like when a boss is almost dead)
        document.documentElement.style.setProperty('--stamina-color', '#ff5555');
        // Add pulsing effect when very low
        if (stamina < 10) {
            staminaFill.style.animation = 'pulse 1s infinite';
        } else {
            staminaFill.style.animation = 'none';
        }
    } else if (stamina < 50) {
        // Yellow/Orange for medium
        document.documentElement.style.setProperty('--stamina-color', '#ffaa00');
        staminaFill.style.animation = 'none';
    } else {
        // Green/Teal for high (Minecraft boss bar color)
        document.documentElement.style.setProperty('--stamina-color', '#55ff55');
        staminaFill.style.animation = 'none';
    }
}

// Initialize hotbar with 9 slots
function initHotbar() {
    const hotbar = document.querySelector('.hotbar');
    hotbar.innerHTML = ''; // Clear any existing slots
    
    // Create 9 slots
    for (let i = 0; i < 9; i++) {
        const slot = document.createElement('div');
        slot.className = 'hotbar-slot';
        slot.setAttribute('data-slot', i + 1);
        
        // Add the slot number indicator (1-9)
        const slotNumber = document.createElement('div');
        slotNumber.className = 'slot-number';
        slotNumber.textContent = i + 1 === 10 ? '0' : (i + 1).toString();
        
        // Add the item container (initially empty)
        const item = document.createElement('div');
        item.className = 'hotbar-item';
        
        // Add the selection indicator (initially hidden)
        const selection = document.createElement('div');
        selection.className = 'selection-indicator';
        
        // Add elements to the slot
        slot.appendChild(selection);
        slot.appendChild(item);
        slot.appendChild(slotNumber);
        
        // Add click event for selection
        slot.addEventListener('click', () => selectHotbarSlot(i + 1));
        
        // Add keyboard shortcuts (1-9)
        if (i < 9) { // Only for slots 1-9 (0 will be handled separately)
            const key = (i + 1).toString();
            window.addEventListener('keydown', (e) => {
                if (e.key === key) {
                    selectHotbarSlot(i + 1);
                }
            });
        }
        
        hotbar.appendChild(slot);
    }
    
    // Add key listener for 0 (10th slot)
    window.addEventListener('keydown', (e) => {
        if (e.key === '0') {
            selectHotbarSlot(10);
        }
    });
    
    // Select first slot by default
    selectHotbarSlot(1);
}

// Select a hotbar slot
function selectHotbarSlot(slotNumber) {
    // Remove active class from all slots
    document.querySelectorAll('.hotbar-slot').forEach(slot => {
        slot.classList.remove('active');
    });
    
    // Add active class to selected slot
    const selectedSlot = document.querySelector(`.hotbar-slot[data-slot="${slotNumber}"]`);
    if (selectedSlot) {
        selectedSlot.classList.add('active');
    }
    
    // Update any game state if needed
    // currentHotbarSlot = slotNumber;
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
