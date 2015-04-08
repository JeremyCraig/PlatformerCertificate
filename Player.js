var canvas = document.getElementById("gameCanvas");
var flipPlayer = false;

var Player = function()
{
	this.image = document.createElement("img");
	
	this.a = new Vector2();
	this.xPos = canvas.width/2;
	this.yPos = canvas.height/2;
	
	this.width = 119;
	this.height = 103;
	
	this.velocityX = 0;
	this.velocityY = 0;
	
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.image.src = "hero.png";
};

Player.prototype.update = function(deltaTime)
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

	if(keyboard.isKeyDown(keyboard.KEY_W) == true)
	{
		this.yPos -= 5;
	}
	if(keyboard.isKeyDown(keyboard.KEY_S) == true)
	{
		this.yPos += 5;
	}
	if(keyboard.isKeyDown(keyboard.KEY_A) == true)
	{
		this.xPos -= 5;
		flipPlayer = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_D) == true)
	{
		this.xPos += 5;
		flipPlayer = false;
	}
}

Player.prototype.draw = function()
{
	if(flipPlayer == true)
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