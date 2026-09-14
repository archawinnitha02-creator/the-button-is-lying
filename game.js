// Game state
const gameState = {
    score: 0,
    combo: 0,
    lives: 3,
    bestScore: localStorage.getItem('buttonLyingBestScore') || 0,
    round: 0,
    gameActive: false,
    buttonClickable: true,
    soundEnabled: true,
    playerBehavior: {
        clickedLargestButton: 0,
        clickedFirstButton: 0,
        clickedCenterButton: 0,
        totalClicks: 0
    },
    specialRoundsTriggered: new Set(),
    unlockedGameKnowsYou: false
};

// Audio context
let audioContext;
const sounds = {};

// Initialize audio context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play sound
function playSound(type) {
    if (!gameState.soundEnabled || !audioContext) return;

    try {
        const ctx = audioContext;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        switch (type) {
            case 'correct':
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                break;
            case 'wrong':
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
                break;
            case 'click':
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
                break;
            case 'special':
                osc.frequency.setValueAtTime(1000, now);
                osc.frequency.exponentialRampToValueAtTime(1500, now + 0.3);
                break;
        }

        osc.start(now);
        osc.stop(now + 0.2);
    } catch (e) {
        console.log('Audio context error:', e);
    }
}

// Create particles
function createParticles(x, y, color, count = 10) {
    const container = document.getElementById('particle-container');
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 10px ${color}`;

        const angle = (Math.PI * 2 * i) / count;
        const velocity = 3 + Math.random() * 3;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity;
        let life = 1;

        container.appendChild(particle);

        const animate = () => {
            life -= 0.05;
            x += vx;
            y += vy;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = life;

            if (life > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        animate();
    }
}

// Screen shake
function screenShake(intensity = 10, duration = 300) {
    const gameArea = document.getElementById('game-area');
    const startTime = Date.now();

    const shake = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            const x = (Math.random() - 0.5) * intensity;
            const y = (Math.random() - 0.5) * intensity;
            gameArea.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        } else {
            gameArea.style.transform = 'translate(0, 0)';
        }
    };
    shake();
}

// Glitch effect
function glitchEffect(duration = 200) {
    const gameArea = document.getElementById('game-area');
    gameArea.classList.add('glitch');
    setTimeout(() => {
        gameArea.classList.remove('glitch');
    }, duration);
}

// Invert colors
function invertScreen(duration = 400) {
    const gameArea = document.getElementById('game-area');
    gameArea.classList.add('inverted');
    setTimeout(() => {
        gameArea.classList.remove('inverted');
    }, duration);
}

// Color utilities
const colors = [
    { name: 'RED', hex: '#ff0000' },
    { name: 'BLUE', hex: '#0000ff' },
    { name: 'GREEN', hex: '#00ff00' },
    { name: 'YELLOW', hex: '#ffff00' },
    { name: 'CYAN', hex: '#00ffff' },
    { name: 'MAGENTA', hex: '#ff00ff' },
    { name: 'ORANGE', hex: '#ff8800' },
    { name: 'PURPLE', hex: '#8800ff' }
];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getColorByName(name) {
    return colors.find(c => c.name === name);
}

// Round data structure
class Round {
    constructor() {
        this.instruction = '';
        this.correctAnswers = [];
        this.buttons = [];
        this.trickType = 'none';
    }
}

// Generate rounds based on game progression
function generateRound(roundNumber) {
    const round = new Round();
    const difficulty = Math.floor((roundNumber - 1) / 5);
    
    // Determine trick type
    const tricks = [
        'lying-text',
        'reverse-mode',
        'ignore-message',
        'moving-buttons',
        'fake-countdown',
        'screen-flip',
        'memory',
        'obvious-answer',
        'reverse-psychology',
        'combo-break'
    ];

    let trickIndex = Math.floor(Math.random() * Math.min(difficulty + 2, tricks.length));
    round.trickType = tricks[trickIndex];

    // Generate based on trick
    switch (round.trickType) {
        case 'lying-text':
            return generateLyingTextRound();
        case 'reverse-mode':
            return generateReverseModeRound();
        case 'ignore-message':
            return generateIgnoreMessageRound();
        case 'moving-buttons':
            return generateMovingButtonsRound();
        case 'fake-countdown':
            return generateFakeCountdownRound();
        case 'screen-flip':
            return generateScreenFlipRound();
        case 'memory':
            return generateMemoryRound();
        case 'obvious-answer':
            return generateObviousAnswerRound();
        case 'reverse-psychology':
            return generateReversePsychologyRound();
        case 'combo-break':
            return generateCombBreakRound();
        default:
            return generateSimpleRound();
    }
}

function generateSimpleRound() {
    const round = new Round();
    const color = getRandomColor();
    round.instruction = `CLICK THE ${color.name} BUTTON`;
    round.correctAnswers = [color.name];

    const buttonCount = 3 + Math.floor(Math.random() * 4);
    const colors_ = [color];

    while (colors_.length < buttonCount) {
        const c = getRandomColor();
        if (!colors_.find(x => x.name === c.name)) {
            colors_.push(c);
        }
    }

    colors_.sort(() => Math.random() - 0.5);

    round.buttons = colors_.map(c => ({
        label: c.name,
        color: c.hex,
        colorName: c.name
    }));

    return round;
}

function generateLyingTextRound() {
    const round = new Round();
    const actualColor = getRandomColor();
    const labelColor = getRandomColor();

    round.instruction = `CLICK THE ${labelColor.name} BUTTON`;
    round.correctAnswers = [actualColor.name];

    const buttonCount = 3 + Math.floor(Math.random() * 4);
    let buttons = [];

    buttons.push({
        label: labelColor.name,
        color: actualColor.hex,
        colorName: actualColor.name
    });

    let usedColors = [actualColor];
    while (buttons.length < buttonCount) {
        const c = getRandomColor();
        if (!usedColors.find(x => x.name === c.name)) {
            usedColors.push(c);
            buttons.push({
                label: c.name,
                color: c.hex,
                colorName: c.name
            });
        }
    }

    buttons.sort(() => Math.random() - 0.5);
    round.buttons = buttons;
    return round;
}

function generateReverseModeRound() {
    const round = new Round();
    const excludeColor = getRandomColor();
    round.instruction = `CLICK EVERYTHING EXCEPT ${excludeColor.name}`;
    round.correctAnswers = colors.filter(c => c.name !== excludeColor.name).map(c => c.name);

    const buttonCount = 3 + Math.floor(Math.random() * 3);
    let buttons = [];
    let usedColors = [];

    for (let i = 0; i < buttonCount; i++) {
        const c = getRandomColor();
        if (!usedColors.find(x => x.name === c.name)) {
            usedColors.push(c);
            buttons.push({
                label: c.name,
                color: c.hex,
                colorName: c.name
            });
        }
    }

    round.buttons = buttons;
    return round;
}

function generateIgnoreMessageRound() {
    const round = new Round();
    const color = getRandomColor();
    round.instruction = `IGNORE THIS MESSAGE\nCLICK THE ${color.name} BUTTON`;
    round.correctAnswers = [color.name];

    const buttonCount = 3 + Math.floor(Math.random() * 4);
    let buttons = [];
    let usedColors = [color];

    buttons.push({
        label: color.name,
        color: color.hex,
        colorName: color.name
    });

    while (buttons.length < buttonCount) {
        const c = getRandomColor();
        if (!usedColors.find(x => x.name === c.name)) {
            usedColors.push(c);
            buttons.push({
                label: c.name,
                color: c.hex,
                colorName: c.name
            });
        }
    }

    buttons.sort(() => Math.random() - 0.5);
    round.buttons = buttons;
    return round;
}

function generateMovingButtonsRound() {
    const round = new Round();
    const color = getRandomColor();
    round.instruction = `CLICK THE ${color.name} BUTTON`;
    round.correctAnswers = [color.name];
    round.movingButton = true;

    const buttonCount = 3 + Math.floor(Math.random() * 4);
    let buttons = [];
    let usedColors = [color];

    buttons.push({
        label: color.name,
        color: color.hex,
        colorName: color.name
    });

    while (buttons.length < buttonCount) {
        const c = getRandomColor();
        if (!usedColors.find(x => x.name === c.name)) {
            usedColors.push(c);
            buttons.push({
                label: c.name,
                color: c.hex,
                colorName: c.name
            });
        }
    }

    buttons.sort(() => Math.random() - 0.5);
    round.buttons = buttons;
    return round;
}

function generateFakeCountdownRound() {
    const round = new Round();
    const color = getRandomColor();
    round.instruction = `CLICK THE ${color.name} BUTTON\n3... 2... 1...`;
    round.correctAnswers = [color.name];

    const buttonCount = 3 + Math.floor(Math.random() * 4);
    let buttons = [];
    let usedColors = [color];

    buttons.push({
        label: color.name,
        color: color.hex,
        colorName: color.name
    });

    while (buttons.length < buttonCount) {
        const c = getRandomColor();
        if (!usedColors.find(x => x.name === c.name)) {
            usedColors.push(c);
            buttons.push({
                label: c.name,
                color: c.hex,
                colorName: c.name
            });
        }
    }

    buttons.sort(() => Math.random() - 0.5);
    round.buttons = buttons;
    return round;
}

function generateScreenFlipRound() {
    const round = new Round();
    const color = getRandomColor();
    round.instruction = `CLICK THE ${color.name} BUTTON`;
    round.correctAnswers = [color.name];
    round.screenFlip = true;

    const buttonCount = 3 + Math.floor(Math.random() * 4);
    let buttons = [];
    let usedColors = [color];

    buttons.push({
        label: color.name,
        color: color.hex,
        colorName: color.name
    });

    while (buttons.length < buttonCount) {
        const c = getRandomColor();
        if (!usedColors.find(x => x.name === c.name)) {
            usedColors.push(c);
            buttons.push({
                label: c.name,
                color: c.hex,
                colorName: c.name
            });
        }
    }

    buttons.sort(() => Math.random() - 0.5);
    round.buttons = buttons;
    return round;
}

function generateMemoryRound() {
    const round = new Round();
    const color = getRandomColor();
    round.instruction = `REMEMBER THE COLOR`;
    round.correctAnswers = [color.name];
    round.memory = true;
    round.memoryColor = color;

    const buttonCount = 4 + Math.floor(Math.random() * 3);
    let buttons = [];
    let usedColors = [color];

    while (buttons.length < buttonCount) {
        const c = getRandomColor();
        if (!usedColors.find(x => x.name === c.name)) {
            usedColors.push(c);
            buttons.push({
                label: c.name,
                color: c.hex,
                colorName: c.name
            });
        }
    }

    buttons.sort(() => Math.random() - 0.5);
    round.buttons = buttons;
    return round;
}

function generateObviousAnswerRound() {
    const round = new Round();
    const correctColor = getRandomColor();
    round.instruction = `CLICK THE ${correctColor.name} BUTTON`;
    round.correctAnswers = [correctColor.name];

    const buttonCount = 3 + Math.floor(Math.random() * 3);
    let buttons = [];

    buttons.push({
        label: 'CLICK ME',
        color: '#ffff00',
        colorName: 'CLICK_ME',
        size: 'large'
    });

    buttons.push({
        label: correctColor.name,
        color: correctColor.hex,
        colorName: correctColor.name,
        size: 'normal'
    });

    let usedColors = [correctColor];
    while (buttons.length < buttonCount) {
        const c = getRandomColor();
        if (!usedColors.find(x => x.name === c.name)) {
            usedColors.push(c);
            buttons.push({
                label: c.name,
                color: c.hex,
                colorName: c.name,
                size: 'normal'
            });
        }
    }

    buttons.sort(() => Math.random() - 0.5);
    round.buttons = buttons;
    return round;
}

function generateReversePsychologyRound() {
    const round = new Round();
    const correctColor = getRandomColor();
    round.instruction = `DO NOT CLICK THE ${correctColor.name} BUTTON`;
    round.correctAnswers = [correctColor.name];

    const buttonCount = 3 + Math.floor(Math.random() * 4);
    let buttons = [];
    let usedColors = [correctColor];

    buttons.push({
        label: correctColor.name,
        color: correctColor.hex,
        colorName: correctColor.name
    });

    while (buttons.length < buttonCount) {
        const c = getRandomColor();
        if (!usedColors.find(x => x.name === c.name)) {
            usedColors.push(c);
            buttons.push({
                label: c.name,
                color: c.hex,
                colorName: c.name
            });
        }
    }

    buttons.sort(() => Math.random() - 0.5);
    round.buttons = buttons;
    return round;
}

function generateCombBreakRound() {
    const round = new Round();
    const color = getRandomColor();
    round.instruction = `CLICK THE ${color.name} BUTTON`;
    round.correctAnswers = [color.name];

    const buttonCount = 4 + Math.floor(Math.random() * 3);
    let buttons = [];
    let usedColors = [color];

    buttons.push({
        label: color.name,
        color: color.hex,
        colorName: color.name
    });

    while (buttons.length < buttonCount) {
        const c = getRandomColor();
        if (!usedColors.find(x => x.name === c.name)) {
            usedColors.push(c);
            buttons.push({
                label: c.name,
                color: c.hex,
                colorName: c.name
            });
        }
    }

    buttons.sort(() => Math.random() - 0.5);
    round.buttons = buttons;
    return round;
}

function renderRound(round) {
    const instruction = document.getElementById('instruction');
    const container = document.getElementById('buttons-container');
    const roundNum = document.getElementById('round-number');

    roundNum.textContent = `Round ${gameState.round}`;
    instruction.textContent = round.instruction;
    container.innerHTML = '';

    if (round.memory) {
        const flashColor = round.memoryColor.hex;
        container.style.background = flashColor;
        setTimeout(() => {
            container.style.background = '';
        }, 800);
    }

    if (round.screenFlip) {
        setTimeout(() => {
            invertScreen(300);
        }, 500);
    }

    round.buttons.forEach((btn, index) => {
        const button = document.createElement('button');
        button.className = 'game-btn';
        button.textContent = btn.label;
        button.style.background = btn.color;
        button.style.color = getLuminance(btn.color) > 128 ? '#000' : '#fff';

        if (btn.size === 'large') {
            button.style.padding = '40px 80px';
            button.style.fontSize = '28px';
        }

        button.dataset.colorName = btn.colorName;
        button.dataset.index = index;

        button.addEventListener('click', (e) => handleButtonClick(e, round));

        if (round.movingButton && btn.colorName === round.correctAnswers[0]) {
            animateMovingButton(button);
        }

        container.appendChild(button);
    });
}

function animateMovingButton(button) {
    const startTime = Date.now();
    const duration = 3000;

    const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            const progress = elapsed / duration;
            const angle = progress * Math.PI * 4;
            const distance = 50 * Math.sin(angle);
            
            button.style.transform = `translate(${distance}px, ${Math.sin(angle * 1.5) * 20}px)`;
            requestAnimationFrame(animate);
        }
    };
    animate();
}

function getLuminance(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

function handleButtonClick(event, round) {
    if (!gameState.buttonClickable) return;

    gameState.buttonClickable = false;
    playSound('click');

    const button = event.target;
    const clickedColor = button.dataset.colorName;

    gameState.playerBehavior.totalClicks++;

    const isCorrect = round.correctAnswers.includes(clickedColor);

    if (isCorrect) {
        handleCorrectAnswer(button, clickedColor);
    } else {
        handleWrongAnswer(button, clickedColor);
    }
}

function handleCorrectAnswer(button, clickedColor) {
    playSound('correct');
    button.classList.add('correct');

    const clickX = button.offsetLeft + button.offsetWidth / 2;
    const clickY = button.offsetTop + button.offsetHeight / 2;
    const buttonColor = button.style.background;

    createParticles(clickX, clickY, buttonColor, 15);
    screenShake(5, 200);

    gameState.score++;
    gameState.combo++;

    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback correct';
    feedback.textContent = `+1 POINT! COMBO: ${gameState.combo}`;
    feedback.style.display = 'block';

    setTimeout(() => {
        feedback.style.display = 'none';
    }, 600);

    updateDisplay();
    checkSpecialRound();

    if (gameState.score === 50 && !gameState.unlockedGameKnowsYou) {
        gameState.unlockedGameKnowsYou = true;
        showSpecialBanner('THE GAME KNOWS YOU');
        playSound('special');
    }

    setTimeout(() => {
        gameState.buttonClickable = true;
        nextRound();
    }, 800);
}

function handleWrongAnswer(button, clickedColor) {
    playSound('wrong');
    button.classList.add('wrong');

    gameState.lives--;
    gameState.combo = 0;

    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback wrong';
    feedback.textContent = 'WRONG! -1 LIFE';
    feedback.style.display = 'block';

    setTimeout(() => {
        feedback.style.display = 'none';
    }, 600);

    updateDisplay();

    if (gameState.lives <= 0) {
        setTimeout(() => {
            endGame();
        }, 800);
    } else {
        setTimeout(() => {
            gameState.buttonClickable = true;
            nextRound();
        }, 800);
    }
}

function checkSpecialRound() {
    const specialRoundTrigger = 10;
    const roundsCompleted = gameState.score;

    if (roundsCompleted > 0 && roundsCompleted % specialRoundTrigger === 0) {
        const specialTypes = ['MEMORY', 'SPEED', 'SILENT', 'CHAOS'];
        const specialType = specialTypes[Math.floor(roundsCompleted / specialRoundTrigger) % specialTypes.length];

        if (!gameState.specialRoundsTriggered.has(roundsCompleted)) {
            gameState.specialRoundsTriggered.add(roundsCompleted);
            showSpecialBanner(`⚡ ${specialType} ROUND ⚡`);
            playSound('special');
        }
    }
}

function showSpecialBanner(text) {
    const banner = document.getElementById('special-round-banner');
    banner.textContent = text;
    banner.style.opacity = '0';
    banner.style.animation = 'none';
    
    setTimeout(() => {
        banner.style.animation = 'bannerPop 0.8s ease forwards';
    }, 10);
}

function nextRound() {
    gameState.round++;
    const round = generateRound(gameState.round);
    renderRound(round);
    startRoundTimer();
}

function startRoundTimer() {
    const timerBar = document.getElementById('timer-bar');
    timerBar.style.animation = 'none';

    void timerBar.offsetWidth;

    const timeLimit = gameState.unlockedGameKnowsYou ? 2000 : 3000;
    timerBar.style.animation = `timerCountdown ${timeLimit / 1000}s linear forwards`;

    setTimeout(() => {
        if (gameState.gameActive && gameState.buttonClickable) {
            gameState.lives--;
            gameState.combo = 0;
            updateDisplay();

            if (gameState.lives <= 0) {
                endGame();
            } else {
                gameState.buttonClickable = true;
                nextRound();
            }
        }
    }, timeLimit);
}

function updateDisplay() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('combo').textContent = gameState.combo;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('best-score').textContent = Math.max(gameState.bestScore, gameState.score);
}

function endGame() {
    gameState.gameActive = false;
    playSound('wrong');

    if (gameState.score > gameState.bestScore) {
        gameState.bestScore = gameState.score;
        localStorage.setItem('buttonLyingBestScore', gameState.bestScore);
    }

    showScreen('gameover-screen');
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('gameover-best').textContent = gameState.bestScore;
    document.getElementById('final-combo').textContent = gameState.combo;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startGame() {
    gameState.score = 0;
    gameState.combo = 0;
    gameState.lives = 3;
    gameState.round = 0;
    gameState.gameActive = true;
    gameState.buttonClickable = true;
    gameState.playerBehavior = {
        clickedLargestButton: 0,
        clickedFirstButton: 0,
        clickedCenterButton: 0,
        totalClicks: 0
    };
    gameState.specialRoundsTriggered = new Set();

    showScreen('game-screen');
    updateDisplay();

    nextRound();
}

document.getElementById('start-btn').addEventListener('click', () => {
    initAudio();
    startGame();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    initAudio();
    startGame();
});

document.getElementById('mute-btn').addEventListener('click', () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    const btn = document.getElementById('mute-btn');
    btn.textContent = gameState.soundEnabled ? '🔊' : '🔇';
});

window.addEventListener('load', () => {
    gameState.bestScore = localStorage.getItem('buttonLyingBestScore') || 0;
    updateDisplay();
});
