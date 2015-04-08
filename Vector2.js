var canvas = document.getElementById("gameCanvas");

var Vector2 = function() 
{
	this.xPos = canvas.width/2;
	this.yPos = canvas.height/2;
};

Vector2.prototype.length = function()
{
	var length = Math.sqrt(Math.pow(this.xPos, 2) + Math.pow(this.yPos, 2));
	return length;
}

Vector2.prototype.setPos = function(x, y)
{
	this.xPos = x;
	this.yPos = y;
}

Vector2.prototype.normalize = function()
{
	this.xPos = this.xPos / Vector2.length;
	this.yPos = this.yPos / Vector2.length;
}

Vector2.prototype.add = function(V2)
{
	var result = new Vector2();
	
	result.xPos = this.xPos + V2.x
	result.yPos = this.yPos + V2.y
	
	return result;
}

Vector2.prototype.subtract = function(x2, y2)
{
	this.xPos -= x2;
	this.yPos -= y2;
}

Vector2.prototype.multiplyScalar = function(num)
{
	this.xPos = this.xPos * num;
	this.yPos = this.yPos * num;
}