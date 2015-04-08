var canvas = document.getElementById("gameCanvas");
var flipPlayer = false;

var Player = function()
{
	this.image = document.createElement("img");
	
	this.width = 119;
	this.height = 103;
	
	this.position = new Vector2();
	this.position.set = (canvas.width / 2, canvas.height / 2);
	
	this.velocity = new Vector2();
	
	this.angularVelocity = 0;
	this.rotation = 0;
	this.image.src = "hero1.png";
};

Player.prototype.update = function(deltaTime)
{
	if(this.position.x > canvas.width - (this.width / 2))
	{
		this.position.x = canvas.width - (this.width / 2);
	}
	if(this.position.x < 0 + (this.width / 2))
	{
		this.position.x = 0 + (this.width / 2);
	}
	if(this.position.y > canvas.height - (this.height / 2))
	{
		this.position.y = canvas.height - (this.height / 2);
	}
	if(this.position.y < 0 + (this.width / 2) - 7)
	{
		this.position.y = 0 + (this.width / 2) - 7;
	}

	var acceleration = new Vector2();
	var playerAccel = 20;
	var playerDrag = 11;
	var playerGravity = TILE * 9.8 * 6;
	
	acceleration.y = playerGravity;
	
	if(keyboard.isKeyDown(keyboard.KEY_W) == true)
	{
		acceleration.y -= 5;
	}
	if(keyboard.isKeyDown(keyboard.KEY_S) == true)
	{
		acceleration.y += 5;
	}
	if(keyboard.isKeyDown(keyboard.KEY_A) == true)
	{
		acceleration.x -= 5;
		flipPlayer = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_D) == true)
	{
		acceleration.x += 5;
		flipPlayer = false;
	}
	
	acceleration = acceleration.subtract(this.velocity.multiplyScalar(playerDrag));
	
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	
	var nx = this.position.x % TILE;
	var ny = this.position.y % TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1);
	
	//Collision
	if ( this.velocity.y > 0 )
	{
		if ( (cell_down && !cell) || (cell_diag && !cell_right && nx) )
		{
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
			ny = 0;
		}
	}
	else if (this.velocity.y < 0 ) //if moving up
	{
		if ( (cell && !cell_down) || (cell_right && !cell_diag && nx) )
		{
			this.position.y = tiletoPixel(ty + 1);
			this.velocity.y = 0;
			
			cell = cell_down;
			cell_right = cell_diag;
			
			cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 2);
			cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 2);
			
			ny = 0;
		}
	}
	if (this.velocity.x > 0 )//if we're moving right
	{
		if ( (cell_right && !cell) || (cell_diag && !cell_down && ny) )
		{
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0;
		}
	}
	else if (this.velocity.x < 0) //if we're moving left
	{
		if ( (cell && !cell_right) || (cell_down && !cell_diag && ny) )
		{
			this.position.x = tileToPixel(tx+1);
			this.velocity.x = 0;
		}
	}
}

Player.prototype.draw = function()
{
	if(flipPlayer == true)
	{
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