var canvas = document.getElementById('ctx');
var ctx = canvas.getContext('2d');
var newScorer = document.getElementById('top-scorer');
var WIDTH = 700;
var HEIGHT = 500;
ctx.font = '20px calibri';
var snakeList,
  foodList,
  direction,
  eaten,
  intervakVal,
  score,
  obstacleImg,
  stayGoldImg,
  headSnakeImg,
  topScore,
  count = 0;
bonusfood = false;
running = false;
var gameOver = new Audio('GameOver.mp3');
var Maorissio = new Audio('Maorissio.mp3');

ctx.fillText('Click me to start the game', 240, 250);
var snakeBody = {
  width: 15,
  height: 15,
  color: 'red'
};

var food = {
  width: 50,
  height: 70,
  url: 'img/onlygold.png',
  natanFood: 'img/natan_burned.png'
};

var obstacle = {
  width: 20,
  height: 20,
  url: 'img/mine-removebg.png'
};

document.getElementById('ctx').onmousedown = function() {
  if (running) {
    clearInterval(intervalVal);
    running = false;
  }

  startGame();
};

document.onkeydown = function(event) {
  //0-left
  //1-up
  //2-right
  //3-down
  if (event.keyCode == 37 && direction != 2) {
    direction = 0;
  } else if (event.keyCode == 38 && direction != 3) {
    direction = 1;
  } else if (event.keyCode == 39 && direction != 0) {
    direction = 2;
  } else if (event.keyCode == 40 && direction != 1) {
    direction = 3;
  }
};

testCollision = function(rect1, rect2) {
  return (
    rect1.x <= rect2.x + food.width - 5 &&
    rect2.x <= rect1.x + snakeBody.width - 5 &&
    rect1.y <= rect2.y + food.height - 5 &&
    rect2.y <= rect1.y + snakeBody.height - 5
  );
};

testCollisionObstacle = function(headerSnake, currentObstacle) {
  return (
    headerSnake.x <= currentObstacle.x + obstacle.width &&
    currentObstacle.x <= headerSnake.x + snakeBody.width &&
    headerSnake.y <= currentObstacle.y + obstacle.height &&
    currentObstacle.y <= headerSnake.y + snakeBody.height
  );
};

testCollisionSnake = function(snake1, snake2) {
  return Math.abs(snake1.x - snake2.x) < 5 && Math.abs(snake1.y - snake2.y) < 5;
};

drawSnake = function(sb, i) {
  ctx.save();
  if (i == 0) {
    ctx.fillStyle = 'black';
    ctx.fillRect(sb.x, sb.y, snakeBody.width, snakeBody.height);
    ctx.restore();
  } else {
    ctx.fillStyle = snakeBody.color;
    ctx.fillRect(sb.x, sb.y, snakeBody.width, snakeBody.height);

    ctx.restore();
  }
};

drawFood = function(f, i) {
  ctx.save();
  stayGoldImg = new Image();
  if (bonusfood) {
    stayGoldImg.src = food.natanFood;
  } else {
    stayGoldImg.src = food.url;
  }
  ctx.drawImage(stayGoldImg, f.x, f.y, food.width, food.height);
  ctx.restore();
};

drawObstacle = function(f, i) {
  ctx.save();
  obstacleImg = new Image();
  obstacleImg.src = obstacle.url;
  ctx.drawImage(obstacleImg, f.x, f.y, obstacle.width, obstacle.height);
  ctx.restore();
};

updateSnakeList = function() {
  for (var i = snakeList.length - 1; i >= 0; i--) {
    if (direction == 0) {
      if (i == 0) {
        snakeList[i].x = snakeList[i].x - 5;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    } else if (direction == 1) {
      if (i == 0) {
        snakeList[i].y = snakeList[i].y - 5;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    } else if (direction == 2) {
      if (i == 0) {
        snakeList[i].x = snakeList[i].x + 5;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    } else if (direction == 3) {
      if (i == 0) {
        snakeList[i].y = snakeList[i].y + 5;
      } else {
        snakeList[i].x = snakeList[i - 1].x;
        snakeList[i].y = snakeList[i - 1].y;
      }
    }
  }
};

checkSnakePosition = function() {
  if (snakeList[0].x > 700) {
    snakeList[0].x = 0;
  }

  if (snakeList[0].x < 0) {
    snakeList[0].x = 700;
  }

  if (snakeList[0].y > 500) {
    snakeList[0].y = 0;
  }

  if (snakeList[0].y < 0) {
    snakeList[0].y = 500;
  }
};

isGameOver = function() {
  for (i in snakeList) {
    if (i == 0) continue;
    if (testCollisionSnake(snakeList[0], snakeList[i])) {
      whereGameOver();
      return;
    }
  }
  for (i in obstacleList) {
    if (testCollisionObstacle(snakeList[0], obstacleList[i])) {
      whereGameOver();
      return;
    }
  }
};

whereGameOver = function() {
  clearInterval(intervalVal);
  ctx.fillText('Game Over! Click to restart', 240, 250);
  Maorissio.pause();
  Maorissio.currentTime = 0;
  gameOver.play();
  if (score > topScore[0].point) {
    document.getElementById('new-score').innerHTML = score;
    newScorer.style.display = 'flex';
  }
};

updateSnakePosition = function() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  isEaten();
  obstacleList.forEach(drawObstacle);
  foodList.forEach(drawFood);
  snakeList.forEach(drawSnake);
  if (score % 10 == 0 && score !== 0) {
    bonusfood = true;
  }

  if (testCollision(snakeList[0], foodList[0])) {
    foodList = [];
    eaten = true;
    if (bonusfood) {
      score += 5;
      bonusfood = false;
    } else {
      score += 1;
    }
    count++;

    var new_X, new_Y;
    if (direction == 0) {
      new_X = snakeList[0].x - 10;
      new_Y = snakeList[0].y;
    } else if (direction == 1) {
      new_X = snakeList[0].x;
      new_Y = snakeList[0].y - 10;
    } else if (direction == 2) {
      new_X = snakeList[0].x + 10;
      new_Y = snakeList[0].y;
    } else if (direction == 3) {
      new_X = snakeList[0].x - 10;
      new_Y = snakeList[0].y + 10;
    }
    snakeList.unshift({ x: new_X, y: new_Y });
  }
  ctx.fillText('Score: ' + score, 590, 30);
  ctx.fillText(`Top Scorer(${topScore[0].name}): ${topScore[0].point}`, 50, 30);
  isGameOver();
  checkSnakePosition();
  updateSnakeList();
};

startGame = function() {
  snakeList = [{ x: 220, y: 200 }, { x: 210, y: 200 }, { x: 200, y: 200 }];
  foodList = [];
  obstacleList = [];
  direction = 99;
  eaten = true;
  score = 0;
  running = true;
  Maorissio.play();
  maxValue();
  intervalVal = setInterval(updateSnakePosition, 15);
};

isEaten = function() {
  while (eaten) {
    var pos_x = Math.random() * 685 - 8;
    var pos_y = Math.random() * 485 - 8;
    foodList[0] = { x: pos_x, y: pos_y };
    if (score == 0) {
      pos_x = Math.random() * 685 + 5;
      pos_y = Math.random() * 485 + 5;
      obstacleList[0] = { x: pos_x, y: pos_y };
    } else if (count % 15 == 0) {
      pos_x = Math.random() * 685 + 5;
      pos_y = Math.random() * 485 + 5;
      obstacleList.unshift({ x: pos_x, y: pos_y });
    }

    eaten = false;
  }
};

maxValue = function() {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', 'http://localhost:5000/api/users', false);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send();
  topScore = JSON.parse(xhttp.responseText);
};

saveDataInDB = function() {
  var newName = document.getElementById('winner-name').value;
  console.log(newName);
  var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
  xmlhttp.open('POST', 'http://localhost:5000/api/users', true);
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  xmlhttp.send(JSON.stringify({ name: newName, point: score }));
  if (newName !== '') {
    newScorer.style.display = 'none';
  }
};

cancel = function() {
  newScorer.style.display = 'none';
};
