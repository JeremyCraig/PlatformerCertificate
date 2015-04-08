var canvas = document.getElementById("gameCanvas");
var flipPlayer = false;
var playerDead = false;

var Player = function() {
	this.image = document.createElement("img");
	
	this.position = new Vector2();
	this.position.set(10, canvas.height/2);
	
	this.width = 119;
	this.height = 103;
	
	this.velocity = new Vector2();
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.image.src = "hero1.png";
};

Player.prototype.update = function(deltaTime){
	/** Creates a border that the player cannot pass
	if(this.position.x > canvas.width - (this.width / 2)){
		this.position.x = canvas.width - (this.width / 2);
	}
	if(this.position.x < 0 + (this.width / 2)){
		this.position.x = 0 + (this.width / 2);
	}
	if(this.position.y > canvas.height - (this.height / 2)){
		this.position.y = canvas.height - (this.height / 2);
	}
	if(this.position.y < 0 + (this.width / 2) - 7){
		this.position.y = 0 + (this.width / 2) - 7;
	}**/
	
	var acceleration = new Vector2();
	var playerAccel = 3000;
	var playerDrag = 7;
	var playerGravity = TILE * 9.8 * 6;
	acceleration.y = playerGravity;

	if(keyboard.isKeyDown(keyboard.KEY_W) == true){
		acceleration.y -= playerAccel;
	}
	if(keyboard.isKeyDown(keyboard.KEY_S) == true){
		acceleration.y += playerAccel;
	}
	if(keyboard.isKeyDown(keyboard.KEY_A) == true){
		acceleration.x -= playerAccel;
		flipPlayer = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_D) == true){
		acceleration.x += playerAccel;
		flipPlayer = false;
	}
	
	var dragVector = this.velocity.multiplyScalar(playerDrag);
	dragVector.y = 0;
	acceleration = acceleration.subtract(dragVector);
	
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	
	var nx = this.position.x % TILE;
	var ny = this.position.y % TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellRight = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
	var cellDown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var cellDiag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1);
	
	if(this.velocity.y > 0){
		if((cellDown && !cell) || (cellDiag && !cellRight && nx)){
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
			ny = 0;
		}
	}else if(this.velocity.y < 0){
		if((cell && !cellDown) || (cellRight && !cellDiag && nx)){
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0;
			
			cell = cellDown;
			cellRight = cellDiag;
			cellDown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 2);
			cellDiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 2);
			ny = 0;
		}
	}	
	
	if(this.velocity.x > 0){
		if((cellRight && !cell) || (cellDiag && !cellDown && ny)){
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0;
		}
	}else if(this.velocity.x < 0){
		if((cell && !cellRight) || (cellDown && !cellDiag && ny)){
			this.position.x = tileToPixel(tx + 1);
			this.velocity.x = 0;
		}
	}
}

Player.prototype.draw = function(){
	if(flipPlayer == true){
		context.save();
			context.translate(this.width, 0);
			context.translate(this.position.x, this.position.y);
			context.scale(-1, 1);
			context.drawImage(this.image, +this.width/2, -this.height/2);
		context.restore();
	}else{
		context.save();
			context.translate(this.position.x, this.position.y);
			context.rotate(this.rotation);
			context.drawImage(this.image, -this.width/2, -this.height/2);
		context.restore();
	}
}