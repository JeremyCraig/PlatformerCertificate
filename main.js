var player = new Player();
var keyboard = new Keyboard();
var enemy = new Enemy();

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

var tileset = document.createElement("img");
tileset.src = "tileset.png";

var LAYER_COUNT = 3;
var MAP = {tw:60, th:15};
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var LAYER_BACKGROUND = 2;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 0;

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

function drawMap(){
	for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++){
		var idx = 0;
		for( var y = 0; y < Level1.layers[layerIdx].height; y++ ){
			for( var x = 0; x < Level1.layers[layerIdx].width; x++ ){
				if( Level1.layers[layerIdx].data[idx] != 0 ){
					var tileIndex = Level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}

var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	drawMap();
	
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
	context.fillStyle = "#000000";
	context.font="14px Verdana";
	context.fillText("FPS: " + fps, 5, 20, 100);
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
