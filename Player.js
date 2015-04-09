var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_CLIMB = 6;
var ANIM_SHOOT_LEFT = 7;
var ANIM_SHOOT_RIGHT = 8;
var ANIM_MAX = 9;

var Player = function() {
	this.sprite = new Sprite("ChuckNorris.png");
	this.sprite.buildAnimation(12, 8, 165, 126, 0.10, [0, 1, 2, 3, 4, 5, 6, 7]);//idle left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [8, 9, 10, 11, 12]);// LEFT_JUMP
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);//LEFT_WALK
	this.sprite.buildAnimation(12, 8, 165, 126, 0.10, [52, 53, 54, 55, 56, 57, 58, 59]);//RIGHT IDLE
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [60, 61, 62, 63, 64]);//RIGHT JUMP
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);//RIGHT WALK
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 51]);//climb
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41]);//shoot left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92]);//shoot right
	
	this.position = new Vector2();
	this.position.set(100, 550);
	
	this.width = 119;
	this.height = 103;
	
		for(var i=0; i<6; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}
	
	this.velocity = new Vector2();
	this.angularVelocity = 0;
	
	this.falling = true;
	this.jumping = false;
	
	this.direction = RIGHT;
	
	this.rotation = 0;
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
	
	{
		this.sprite.update(deltaTime);
	}

	
	var acceleration = new Vector2();
	var playerAccel = 3000;
	var playerDrag = 7;
	var playerGravity = TILE * 9.8 * 6;
	acceleration.y = playerGravity;
	var jumpForce = 50000
	
	var currFrame = this.sprite.currentFrame;
	
	if(keyboard.isKeyDown(keyboard.KEY_A) == true ){
		acceleration.x -= playerAccel;
		left = true;
		this.direction = LEFT;
		if(this.sprite.currentAnimation != ANIM_WALK_LEFT && this.jumping == false && this.falling == false)
			this.sprite.setAnimation(ANIM_WALK_LEFT);
	}else if(keyboard.isKeyDown(keyboard.KEY_D) == true ){
		acceleration.x += playerAccel;
		right = true;
		this.direction = RIGHT;
		if(this.sprite.currentAnimation != ANIM_WALK_RIGHT && this.jumping == false && this.falling == false)
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
	}else{
		if(this.jumping == false && this.falling == false){
			if(this.direction == LEFT){
				if(this.sprite.currentAnimation != ANIM_IDLE_LEFT)
				this.sprite.setAnimation(ANIM_IDLE_LEFT);
			}else{
				if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
				this.sprite.setAnimation(ANIM_IDLE_RIGHT);
			}
		}
	}
	
	if(this.jumping || this.falling ){
		if(this.direction == LEFT){
			if(this.sprite.currentAnimation != ANIM_JUMP_LEFT)
			this.sprite.setAnimation(ANIM_JUMP_LEFT);
		}else{
			if(this.sprite.currentAnimation != ANIM_JUMP_RIGHT)
			this.sprite.setAnimation(ANIM_JUMP_RIGHT);
		}
	}
	
	if ( this.velocity.y > 0 ){
		this.falling = true;
	}else{
		this.falling = false;
	}
	
	if ( keyboard.isKeyDown(keyboard.KEY_W) && !this.jumping && !this.falling ){
		acceleration.y -= jumpForce;
		this.jumping = true;
		if(this.direction == LEFT){
			this.sprite.setAnimation(ANIM_JUMP_LEFT)
		}else{
			this.sprite.setAnimation(ANIM_JUMP_RIGHT)
		}
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
	
	if ( cellAtTileCoord(LAYER_LADDERS, tx, ty) ||
		(cellAtTileCoord(LAYER_LADDERS, tx+1, ty) && nx) ||
		(cellAtTileCoord(LAYER_LADDERS, tx, ty+1) && ny))
	{
		if(this.sprite.currentAnimation != ANIM_CLIMB)
		{
			this.sprite.setAnimation(ANIM_CLIMB);
			this.sprite.currentFrame = currFrame;
		}		
		if(keyboard.isKeyDown(keyboard.KEY_W))
		{
			this.velocity.yPos = -600;
		}
		else if(keyboard.isKeyDown(keyboard.KEY_S))
		{
			this.velocity.yPos = 600;
		}
		else
		{
			this.velocity.yPos = 0;
		}
	}
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellRight = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
	var cellDown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var cellDiag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1);
	
	if(this.velocity.y > 0){
		if((cellDown && !cell) || (cellDiag && !cellRight && nx)){
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
			this.jumping = false
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

Player.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x, this.position.y);
};