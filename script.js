document.addEventListener('DOMContentLoaded', () => {
    const dino = document.getElementById('dino');
    const rock = document.getElementById('rock');
    const score = document.getElementById('scoreValue');
    const highScore = document.getElementById('highScoreValue');
    const gameOver = document.getElementById('game-over');
    const finalScore = document.getElementById('finalScore');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const muteToggle = document.getElementById('mute-toggle');

    let isJumping = false;
    let scoreValue = 0;
    let highScoreValue = 0;
    let isMuted = false;
    let gameInterval;
    let gameStarted = false;
    let collisionSoundPlayed = false;
    let highScoreSoundPlayed = false;

    const jumpSound = new Audio('sounds/jump.wav');
    const collisionSound = new Audio('sounds/die.wav');
    const highScoreSound = new Audio('sounds/point.wav');

    function jump() {
        if (!isJumping) {
            isJumping = true;
            dino.classList.add('jump');
            if (!isMuted) jumpSound.play().catch(() => {});
            setTimeout(() => {
                dino.classList.remove('jump');
                isJumping = false;
            }, 500);
        }
    }

    function checkCollision() {
        const dinoRect = dino.getBoundingClientRect();
        const rockRect = rock.getBoundingClientRect();

        return !(
            dinoRect.bottom < rockRect.top ||
            dinoRect.top > rockRect.bottom ||
            dinoRect.right < rockRect.left ||
            dinoRect.left > rockRect.right
        );
    }

    function updateScore() {
        scoreValue++;
        score.textContent = scoreValue;
        if (scoreValue > highScoreValue) {
            highScoreValue = scoreValue;
            highScore.textContent = highScoreValue;
            if (!isMuted && !highScoreSoundPlayed) {
                highScoreSound.play().catch(() => {});
                highScoreSoundPlayed = true; // Ensure the sound plays only once
            }
            try {
                localStorage.setItem('dinoHighScore', highScoreValue);
            } catch (error) {
                console.error('localStorage save error:', error);
            }
        }
    }

    function endGame() {
        rock.style.animationPlayState = 'paused';
        clearInterval(gameInterval);  // Stop the game loop
        gameStarted = false;
        finalScore.textContent = scoreValue;
        gameOver.classList.remove('hidden');
        restartBtn.classList.remove('hidden'); // Show only the restart button
        if (!isMuted && !collisionSoundPlayed) {
            collisionSound.play().catch(() => {});
            collisionSoundPlayed = true; // Ensure the collision sound plays only once
        }
    }

    function startGame() {
        if (gameStarted) return;
        gameStarted = true;
        scoreValue = 0;
        score.textContent = scoreValue;
        rock.style.animationPlayState = 'running';
        gameOver.classList.add('hidden');
        startBtn.classList.add('hidden');  // Hide the start button after starting the game
        restartBtn.classList.add('hidden'); // Hide the restart button until game ends
        gameInterval = setInterval(gameLoop, 50);  // Start the game loop
        collisionSoundPlayed = false; // Reset sound trigger for new game
        highScoreSoundPlayed = false;
    }

    function toggleTheme() {
        document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme');
    }

    function toggleMute() {
        isMuted = !isMuted;
        muteToggle.textContent = isMuted ? 'Unmute Sound🔊' : 'Mute Sound🔇';
    }

    function gameLoop() {
        if (checkCollision()) {
            endGame();
        } else {
            updateScore();
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || event.code === 'ArrowUp') {
            jump();
        }
    });

    document.addEventListener('touchstart', jump);

    startBtn.addEventListener('click', startGame);  // Start button to initiate the game
    restartBtn.addEventListener('click', startGame);  // Restart button now restarts the game
    themeToggle.addEventListener('click', toggleTheme);
    muteToggle.addEventListener('click', toggleMute);

    const savedHighScore = localStorage.getItem('dinoHighScore');
    if (savedHighScore) {
        highScoreValue = parseInt(savedHighScore);
        highScore.textContent = highScoreValue;
    }
});
