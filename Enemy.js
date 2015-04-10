var Enemy = function(x, y) 
{
	this.image = document.createElement("img");
	this.image.src = "enemy.png";
	
	this.position = new Vector2();
	this.position.set(50, 50);
	this.velocity = new Vector2();
	
	this.width = 120;
	this.height = 179;
	
	this.direction = RIGHT;
	this.pause = 0;
}


Enemy.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2();
	var enemyAccel = 4000;
	var enemyDrag = 12;
	
	if ( this.direction == RIGHT)
	{
		acceleration.x = enemyAccel
	}
	else
	{
		acceleration.x = -enemyAccel;
	}
	
	var DragX = this.velocity.x * enemyDrag;
	acceleration.x -= DragX;
	
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
	
	if ( this.direction == RIGHT )
	{
		if ( !cell && (cellRight && nx) )
		{
			this.direction = LEFT;
		}
		
		if ( cellDown && (!cellDiag && nx) )
		{
			this.direction = LEFT;
		}
	}
	else
	{
		if ( cell && (!cellRight && nx) )
		{
			this.direction = LEFT;
		}
		if ( !cellDown && (cellDiag && nx) )
		{
			this.direction = LEFT;
		}
	}
}

Enemy.prototype.draw = function(offsetX, offsetY)
{
	context.drawImage(this.image, this.position.x - offsetX, this.position.y - offsetY, this.width, this.height);
};