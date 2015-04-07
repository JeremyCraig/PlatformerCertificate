var canvas = document.getElementById("gameCanvas");

var Vector2 = function()
{
	this.image = document.createElement("img");
	
	this.xPos = canvas.width/2;
	this.yPos = canvas.height/2;
	
	this.width = 159;
	this.height = 163
	
	this.velocityX = 0;
	this.velocityY = 0;
	
	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.image.src = "hero.png";
};

Vector2.prototype.setpos/*(x, y)*/ = function(x, y)
{
	this.xPos = x;
	this.yPos = y;
};

//Pythagoras' Theorem: C(sq) = A(sq) + B(sq)
Vector2.prototype.length = function()
{
	var length = Math.sqrt(Math.pow(this.xPos, 2) + Math.pow(this.yPos, 2));
	return length;
};

Vector2.prototype.normalize = function()
{
	this.xPos = this.xPos / length;
	this.yPos = this.yPos / length;
};

//Add the components
Vector2.prototype.add/*(V2)*/ = function(x2, y2)
{
	var result = new Vector2();
	
	result.x = this.xPos + x2;
	result.y = this.yPos + y2;
	
	return result;
};

//Subtract the components
Vector2.prototype.subtract/*(V2)*/ = function(x2, y2)
{
	var result = new Vector2();
	
	result.x = this.xPos - x2;
	result.y = this.yPos - y2;
	
	return result;
};

//Multiply with a scalar
Vector2.prototype.multiplyScalar/*(num)*/ = function(num/*scalar*/)
{
	var result = new Vector2();

	result.x = this.xPos * num
	result.y = this.yPos * num
	
	return result;
};

