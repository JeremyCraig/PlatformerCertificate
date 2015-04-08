var canvas = document.getElementById("gameCanvas");

var Vector2 = function() 
{
	this.x = canvas.width/2;
	this.y = canvas.height/2;
};

Vector2.prototype.length = function()
{
	var length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	return length;
}

Vector2.prototype.setPos = function(x, y)
{
	this.x = x;
	this.y = y;
}

Vector2.prototype.normalize = function()
{
	this.x = this.x / Vector2.length;
	this.y = this.y / Vector2.length;
}

Vector2.prototype.add = function(x, y)
{
	var result = new Vector2();
	
	result.x = this.x + x
	result.y = this.y + y
	
	return result;
}

Vector2.prototype.subtract = function(x, y)
{
	var result = new Vector2();
	
	result.x = this.x - x
	result.y = this.y - y
	
	return result;
}

Vector2.prototype.multiplyScalar = function(num)
{
	this.x = this.x * num;
	this.y = this.y * num;
}