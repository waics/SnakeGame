const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // 每格大小
const canvasSize = 600;
let snake = [];
let direction = 'RIGHT';
let food = {};
let score = 0;
let gameInterval = null;
let speed = 100;
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

function initGame() {
    snake = [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 }
    ];
    direction = 'RIGHT';
    score = 0;
    document.getElementById('score').innerText = '分数: ' + score;
    placeFood();
    if (gameInterval) clearInterval(gameInterval);
    // 获取速度设置（滑块1-10，数值越大越快，速度间隔越小）
    if (speedSlider) {
        // 速度区间：1(最慢, 200ms) ~ 10(最快, 30ms)
        const sliderVal = parseInt(speedSlider.value, 10);
        speed = 200 - (sliderVal - 1) * 19;
    }
    gameInterval = setInterval(draw, speed);
}
function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / box)),
        y: Math.floor(Math.random() * (canvasSize / box))
    };
    // 避免食物生成在蛇身上
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = Math.floor(Math.random() * (canvasSize / box));
        food.y = Math.floor(Math.random() * (canvasSize / box));
    }
}

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 画蛇
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#4caf50' : '#8bc34a';
        ctx.fillRect(snake[i].x * box, snake[i].y * box, box, box);
        ctx.strokeStyle = '#222';
        ctx.strokeRect(snake[i].x * box, snake[i].y * box, box, box);
    }

    // 画食物
    ctx.fillStyle = '#ff5252';
    ctx.fillRect(food.x * box, food.y * box, box, box);

    // 移动蛇
    let head = { ...snake[0] };
    if (direction === 'LEFT') head.x--;
    if (direction === 'RIGHT') head.x++;
    if (direction === 'UP') head.y--;
    if (direction === 'DOWN') head.y++;

    // 撞墙或撞自己
    if (
        head.x < 0 || head.x >= canvasSize / box ||
        head.y < 0 || head.y >= canvasSize / box ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameInterval);
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', canvasSize / 2, canvasSize / 2);
        return;
    }

    snake.unshift(head);

    // 吃到食物
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = '分数: ' + score;
        placeFood();
    } else {
        snake.pop();
    }
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});




// 滑块变更时，显示数值并重启游戏
if (speedSlider && speedValue) {
    speedSlider.oninput = function() {
        speedValue.textContent = speedSlider.value;
    };
    speedSlider.onchange = function() {
        initGame();
    };
}

document.getElementById('restartBtn').onclick = initGame;

initGame();
