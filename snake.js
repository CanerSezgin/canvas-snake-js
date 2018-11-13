renderScores();
const cvs = document.getElementById('board');
const ctx = cvs.getContext('2d');

// Box Size (px)
ctx.scale(15,15)

let food = createFood();
function createFood(){
    return {
        x: Math.floor(Math.random()*30),
        y: Math.floor(Math.random()*30)
    }
}

function draw(){
    // Draw Board
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    for(let i = 0; i < snake.length; i++){
        // Draw Snake
        ctx.fillStyle = (i == 0 ) ? 'green' : 'white'
        ctx.fillRect(snake[i].x, snake[i].y, 1, 1);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 1, 1);
}

let dir = {x: 1, y: 0, }
let dirStr = 'ArrowRight'
document.addEventListener('keydown', direction);
function direction(event){
        if(dirStr != 'ArrowLeft' && event.key == 'ArrowRight') { 
            dir = {x: 1, y: 0};
            dirStr = 'ArrowRight';
        } else if (dirStr != 'ArrowRight' && event.key == 'ArrowLeft'){
            dir = {x: -1, y: 0};
            dirStr = 'ArrowLeft';
        } else if (dirStr != 'ArrowDown' && event.key == 'ArrowUp'){
            dirStr = 'ArrowUp';
            dir = {x: 0, y: -1};
        } else if (dirStr != 'ArrowUp' && event.key == 'ArrowDown') {
            dir = {x: 0, y: 1};
            dirStr = 'ArrowDown';
        }
}

var snake = [];
snake[0] = {x: 3, y: 1},
snake[1] = {x: 2, y: 1}
snake[2] = {x: 1, y: 1}
snake[3] = {x: 0, y: 1}
draw();

function move(){
    let headX = snake[0].x;
    let headY = snake[0].y;

    if(headX > 29 ) headX = 0;
    else if(headY > 29) headY = 0;
    else if (headX < 0) headX = 29;
    else if (headY < 0) headY = 29;

    const newHead = {
        x: headX + dir.x,
        y: headY + dir.y
    }

    collisionCheck(newHead);

    if(headX == food.x && headY == food.y){    
        food = createFood();
        score++;
        regulateScore(score, level)
        levelUp();
    } else {
        snake.pop();
    }
    snake.unshift(newHead);
    draw();
}

let isStarted = false
let game = null;
let speed = 10;
function start(){
    if(!isStarted){
        isStarted = true;
        game = setInterval(() => {
            move() 
        }, 1000/speed);
    }
}

function collisionCheck(newHead){
    for(let i = 0; i < snake.length; i++){
        if(newHead.x == snake[i].x && newHead.y == snake[i].y){
            clearInterval(game)
            setTimeout(() => {
                gameOver();
            }, 100);

        }
    }
    return false;
}

let score = 0;
let level = 1;
let regulated = 0;
$('#score').html(score);
$('#level').html(level);
function gameOver(){
    isStarted = false;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    ctx.fillStyle = 'white';
    ctx.font = '5px Changa one';
    ctx.fillText('Game Over', 3, 15);
    ctx.fillText(regulated, 14, 20);
    console.log('Game over')
    updateScores(regulated)
    restart();
}

function levelUp(){
    level = Math.floor(1 + score / 5);
    $('#level').html(level);
    speed = ( level * 3 ) + 7; 
    clearInterval(game);
    isStarted = false;
    start();

    console.log('level:', level, 'score:', score, 'speed:', speed);
}

function regulateScore(score, level){
    regulated = regulated + level * 10; 
    $('#score').html(regulated)
}

function restart(){
    dir = {x: 1, y: 0, };
    dirStr = 'ArrowRight';
    score = 0;
    level = 1;
    regulated = 0;
    $('#score').html(score);
    $('#level').html(level);
    food = createFood();
    game = null
    snake = [];
    snake[0] = {x: 3, y: 1},
    snake[1] = {x: 2, y: 1}
    snake[2] = {x: 1, y: 1}
    snake[3] = {x: 0, y: 1}
    renderScores();
}

function updateScores(newScore){
    var scores = JSON.parse(localStorage.getItem('scores'))
    if(!scores) scores = []
    var date = new Date().getTime();
    scores.unshift({
        score: newScore, 
        date: date
    })
    localStorage.setItem('scores', JSON.stringify(scores))
}

function renderScores(){
    var scores = JSON.parse(localStorage.getItem('scores'));
    
    var lastScores = '<tr> <th>Date</th> <th>Score</th> </tr>'
    var highestScores = '<tr> <th>Date</th> <th>Score</th> </tr>'

    if(scores) {
        if(scores.length < 5){
            limiter = scores.length
        } else {
            limiter = 5
        }
        // Last Scores
        var ls = scores.sort((a,b) => {
            return b.date-a.date   
        })
        for(let i = 0; i < limiter; i++){
            var date = new Date(ls[i].date)
            var dateEl = [date.getDate(), date.getMonth(), date.getFullYear(), date.getHours(), date.getMinutes(), date.getSeconds()]
            var dateAranged = []
            dateEl.forEach(el => {
                if(el < 10){
                    dateAranged.push('0' + el)
                } else {
                    dateAranged.push(el)
                }
            });
            var dateStr = `
                ${dateAranged[0]}/${dateAranged[1]}/${dateAranged[2]} -- 
                ${dateAranged[3]}:${dateAranged[4]}:${dateAranged[5]}
            `
            lastScores +=         
                        `<tr> 
                            <td> ${dateStr} </td>
                            <td> ${ls[i].score} </td> 
                        </tr>`
        }

        // Highest Scores
        var hs = scores.sort((a,b) => {
            return b.score-a.score   
        })
        var highestScores = '<tr> <th>Date</th> <th>Score</th> </tr>'
            for(let i = 0; i < limiter; i++){
                var date = new Date(hs[i].date)
                var dateEl = [date.getDate(), date.getMonth(), date.getFullYear(), date.getHours(), date.getMinutes(), date.getSeconds()]
                var dateAranged = []
                dateEl.forEach(el => {
                    if(el < 10){
                        dateAranged.push('0' + el)
                    } else {
                        dateAranged.push(el)
                    }
                });
                var dateStr = `
                    ${dateAranged[0]}/${dateAranged[1]}/${dateAranged[2]} -- 
                    ${dateAranged[3]}:${dateAranged[4]}:${dateAranged[5]}
                `
                
                highestScores +=         
                            `<tr> 
                                <td> ${dateStr} </td>
                                <td> ${hs[i].score} </td> 
                            </tr>`
            }
    }
    $('#lastScores').empty().append(lastScores);
    $('#highestScores').empty().append(highestScores);
}

function resetScores(){
    localStorage.removeItem('scores');
    location.reload();
}