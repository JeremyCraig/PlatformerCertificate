var LAYER_COUNT = 6;
var MAP = {tw:80, th:20};
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var player = new Player();
var keyboard = new Keyboard();
var enemy = new Enemy();
var timer = 0;
var score = 0;

var LAYER_CONTAINERS = 5;
var LAYER_LADDERS = 4;
var LAYER_WATER = 3;
var LAYER_PLATFORMS = 2;
var LAYER_BACKGROUND = 1;
var LAYER_BACKWALL = 0;

var LAYER_OBJECT_ENEMIES = 3;
var LAYER_OBJECT_TRIGGERS = 4;

var win = false;

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

var tileset = document.createElement("img");
tileset.src = "tileset.png";

var health_bar5 = document.createElement("img");
health_bar5.src = "health bar(full).png";

var health_bar4 = document.createElement("img");
health_bar4.src = "health bar(1 Hit).png";

var health_bar3 = document.createElement("img");
health_bar3.src = "health bar(2 Hits).png";

var health_bar2 = document.createElement("img");
health_bar2.src = "health bar(3 Hits).png";

var health_bar1 = document.createElement("img");
health_bar1.src = "health bar(4 Hits).png";

var health_bar0 = document.createElement("img");
health_bar0.src = "health bar(5 Hits).png";

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

var cells = [];
function initialize(){
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++){
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < Level1.layers[layerIdx].height; y++){
			cells[layerIdx][y] = [];
			for(var x = 0; x < Level1.layers[layerIdx].width; x++){
				if(Level1.layers[layerIdx].data[idx] != 0){
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}else if(cells[layerIdx][y][x] != 1){
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
}

/** Axis Aligned Bounding Box checks **/
function intersects(x1, y1, w1, h1, x2, y2, w2, h2){
	if(y2 + h2 < y1 || x2 + w2 < x1 || x2 > x1 + w1 || y2 > y1 + h1){
		return false;
	}else
		return true;
}

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

function tileToPixel(tileCoord){
	return tileCoord * TILE;
}

function pixelToTile(pixel){
	return Math.floor(pixel / TILE);
}

function cellAtTileCoord(layer, tx, ty){
	if(tx<0 || tx>=MAP.tw || ty<0){
		return 1;
	}
	if(ty>=MAP.th){
		return 0;
	}
	return cells[layer][ty][tx];
}

function cellAtPixelCoord(layer, x, y){
	var tx = pixelToTile(x);
	var ty = pixelToTile(y);
	
	return cellAtTileCoord(layer, tx, ty);
}

function drawMap(offsetsX, offsetsY){
	for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++){
		var idx = 0;
		for( var y = 0; y < Level1.layers[layerIdx].height; y++ ){
			for( var x = 0; x < Level1.layers[layerIdx].width; x++ ){
				if( Level1.layers[layerIdx].data[idx] != 0 ){
					var tileIndex = Level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
					var dx =  x * TILE - offsetsX;
					var dy = (y-1) * TILE - offsetsY;
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, dx, dy, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}

function drawHearts(){
	if (player.health == 5){
		context.drawImage(health_bar5, 30, 30, 300, 50);
	}else if(player.health == 4){
		context.drawImage(health_bar4, 30, 30, 300, 50);
	}else if(player.health == 3){
		context.drawImage(health_bar3, 30, 30, 300, 50);
	}else if(player.health == 2){
		context.drawImage(health_bar2, 30, 30, 300, 50);
	}else if(player.health == 1){
		context.drawImage(health_bar1, 30, 30, 300, 50);
	}else{
		player.health = 0;
		player.isDead = true;
		context.drawImage(health_bar0, 30, 30, 300, 50);
	}
}
	

var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var bgMusic = new Howl(
	{
		urls:["background.ogg"],
		loop:true,
		buffer:true,
		volume:0.5
	});	
bgMusic.play();

function run()
{
	/*var hit=false;
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		if( bullets[i].position.x - worldOffsetX < 0 ||
			bullets[i].position.x - worldOffsetX > SCREEN_WIDTH)
		{
			hit = true;
		}
		for(var j=0; j<enemies.length; j++)
		{
			if(intersects( bullets[i].position.x, bullets[i].position.y, TILE, TILE,
				enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
			{
				// kill both the bullet and the enemy
				enemies.splice(j, 1);
				hit = true;
				// increment the player score
				score += 1;
				break;
			}
		}
		if(hit == true)
		{
			bullets.splice(i, 1);
			break;
		}
	}*/
	
	context.fillStyle = "#3399FF";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	timer += deltaTime;
	
	if(deltaTime > 0.03){
		deltaTime = 0.03;
	}
	
	var xScroll = player.position.x - player.startPos.x;
	var yScroll = 0;
	
	if ( xScroll < 0 )
		xScroll = 0;
	if ( xScroll > MAP.tw * TILE - canvas.width)
		xScroll = MAP.tw * TILE - canvas.width;
		
		
	if ( yScroll < 0 )
		yScroll = 0;
	if ( yScroll > MAP.th * TILE - canvas.height)
		yScroll = MAP.th * TILE - canvas.height;
		
	drawMap(xScroll, yScroll);
	
	if ( player.health > 0 )
	{
		player.update(deltaTime);
		
		player.draw(xScroll,yScroll);
	}
	drawHearts();
	
	var xColl = (player.position.x >=  (MAP.tw * TILE) - 70 - TILE && player.position.x < (MAP.tw * TILE));
	var yColl = (player.position.y >= canvas.height - 180 && player.position.y <= canvas.height);
	
	if( xColl && yColl){
		win = true;
		if(timer >= 0){
			timer = 0;
		}
	}
	
	if(win){ /** Win screen **/
		context.strokeRect(canvas.width - 70, canvas.height - 180, 70, 110);
		context.fillStyle = "#3399FF";
		context.fillRect(0, 0, MAP.tw * TILE, MAP.th * TILE);
		context.fillStyle = "green";
		context.font = "30px Ariel";
		var textToDisplay = "You Win!";
		context.fillText(textToDisplay, canvas.width/2, canvas.height/2);
	}
	
	context.fillStyle = "green";
	context.font = "30px Ariel";
	var textToDisplay = "Score: " + score;
	context.fillText(textToDisplay, 1000, 50);
	
	context.fillStyle = "green";
	context.font = "30px Ariel";
	var textToDisplay = "Time: " + Math.floor(timer);
	context.fillText(textToDisplay, 1150, 50);
	
	if(!player.playerDead){
		player.update(deltaTime);
		player.draw();
	}
	

	/*enemy.update(deltaTime);
	enemy.draw();*/
	
	var hit = intersects(player.xPos - player.width / 2, player.yPos - player.height / 2, player.width, player.height, enemy.xPos - enemy.width / 2, enemy.yPos - enemy.height / 2, enemy.width, enemy.height);
	if(hit == true){
		//player.playerDead = true;
	}
	
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "green";
	context.font="25px Verdana";
	context.fillText(fps, 5, 20, 100);
	
	enemy.update(deltaTime);
	enemy.draw();

}

initialize();
//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
