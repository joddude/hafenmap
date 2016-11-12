function Coord()
{
	this.x;
	this.y;
}

function Coord(x,y)
{
	this.x = x;
	this.y = y;
}

Coord.prototype.toString = function() {
	return "("+this.x+", "+this.y+")";
}