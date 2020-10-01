//gamestates
var PLAY, END, gameState;
PLAY = 1;
ENd = 0;
gameState = PLAY;

//monkey
var monkey, monkeyAnimation;

//ground
var ground;

//obstacle
var obstacle, obstacleGroup, obstacleImage;

//banna
var banana, bananaGroup, bananaImage;

//backgroundImage
var backgroundImage;

//Survival Time and score
var ST, score;
score = 0;

//highscore and ST
localStorage["Highscore"] = 0;
localStorage["HighST"] = 0;

function preload() {
  
  //monkey animation
  monkeyAnimation = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  
  //bananaImage
  bananaImage = loadImage("banana.png");
  
  //Obstacle
  obstacleImage = loadImage("obstacle.png");
  
  //background Image
  backgroundImage = loadImage("background.jpg");
}

function setup() {
  createCanvas(400, 400);
  
  //ground
  ground = createSprite(200, 395, 800, 20);
  ground.velocityX = -(6 + score/10);
  ground.shapeColor = "brown";
  
  //Monkey
  monkey = createSprite(25, 360, 10, 50);
  monkey.addAnimation("running", monkeyAnimation);
  monkey.scale = 0.1;
  
  //banana group
  bananaGroup = new Group();
  
  //obstacle group
  obstacleGroup = new Group();
}

function draw() {
  background(backgroundImage);
  
  stroke("black")
  textSize(20);
  fill("black");
  text("Survival Time: " + ST, 50, 50);
  text("HighST: " + localStorage["HighST"], 250, 50);
  
  text("score: " + score, 50, 100);
  text("Highscore: " + localStorage["Highscore"], 250, 100);
  
  if (gameState === PLAY) {
    //score
    ST = Math.ceil(frameCount/frameRate());
    
    //infinite ground
    if (ground.x < 0) {
      ground.x = ground.width/2
    }
    
    //jump
    if (keyDown("space") && monkey.y > 354) {
      monkey.velocityY = -16;
    }
    
    //gravity effect
    monkey.velocityY = monkey.velocityY + 0.8
    monkey.collide(ground);
    
    //banana spawn
    bananaSpawn();
    
    //score adding
    if (monkey.isTouching(bananaGroup)) {
      score += 1;
      bananaGroup.destroyEach();
    }
    
    //Obstacle spawn
    obstacleSpawn();
    
    //gameover
    if (monkey.isTouching(obstacleGroup)) {
      gameState = END;
    }
  }else if (gameState === END) {
    text("GameOver you lose", 100, 200);
    text("Press R to reset", 100, 300);
    
    //stops everthing
    ground.setVelocity(0, 0);
    obstacleGroup.setVelocityEach(0, 0);
    bananaGroup.setVelocityEach(0, 0);
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
    monkey.setVelocity(0, 0);
    
    //reset
    if (keyDown("r") && gameState === END) {
      reset();
      gameState = PLAY;
    }
  }
  
  drawSprites();
}

function bananaSpawn() {
  if (frameCount%80 === 0) {
    banana = createSprite(400, random(120, 300), 20, 20);
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    
    banana.velocityX = -(6 + score/5)
    
    banana.setlifetime = 100;
    
    bananaGroup.add(banana);
  }
}

function obstacleSpawn() {
  if (frameCount%300 === 0) {
    obstacle = createSprite(400, 370, 30, 30);
    obstacle.addImage(obstacleImage);
    
    obstacle.scale = 0.1;
    
    obstacle.setlifetime = 100;
    
    obstacle.velocityX = -(6 + ST/50);
    
    obstacleGroup.add(obstacle);
  }
}

function reset() {
  //destroys everthing
  obstacleGroup.destroyEach();
  bananaGroup.destroyEach();
  
  //set highscores
  if (ST > localStorage["HighST"]) {
    localStorage["HighST"] = ST;
  }
  
  if (score > localStorage["Highscore"]) {
    localStorage["Highscore"] = score;
  }
  
  //reset scores
  ST = 0;
  score = 0;
}
