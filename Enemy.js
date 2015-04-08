var canvas = document.getElementById("gameCanvas");
var flipEnemy = false;

var Enemy = function() 
{
	this.image = document.createElement("img");
	
	this.xPos = canvas.width/2;
	this.yPos = canvas.height/2;
	
	this.width = 119;
	this.height = 103;
	
	this.velocityX = 0;
	this.velocityY = 0;
	
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.image.src = "enemy.png";
};

Enemy.prototype.update = function(deltaTime)
{
	if(this.xPos > canvas.width - (this.width / 2))
	{
		this.xPos = canvas.width - (this.width / 2);
	}
	if(this.xPos < 0 + (this.width / 2))
	{
		this.xPos = 0 + (this.width / 2);
	}
	if(this.yPos > canvas.height - (this.height / 2))
	{
		this.yPos = canvas.height - (this.height / 2);
	}
	if(this.yPos < 0 + (this.width / 2) - 7)
	{
		this.yPos = 0 + (this.width / 2) - 7;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_UP) == true)
	{
		this.yPos -= 5;
	}
	if(keyboard.isKeyDown(keyboard.KEY_DOWN) == true)
	{
		this.yPos += 5;
	}
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
	{
		this.xPos -= 5;
		flipEnemy = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true)
	{
		this.xPos += 5;
		flipEnemy = false;
	}
}

Enemy.prototype.draw = function()
{
	if(flipEnemy == true)
	{
		context.save();
			context.translate(this.width, 0);
			context.translate(this.xPos, this.yPos);
			context.scale(-1, 1);
			context.drawImage(this.image, +this.width/2, -this.height/2);
		context.restore();
	}else{
		context.save();
			context.translate(this.xPos, this.yPos);
			context.rotate(this.rotation);
			context.drawImage(this.image, -this.width/2, -this.height/2);
		context.restore();
	}
}