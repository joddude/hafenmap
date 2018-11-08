var COORDSPP = 5.12;

function Coord(x,y) {
  this.x = x;
  this.y = y;
}

Coord.prototype.toString = function() {
  return "("+this.x+", "+this.y+")";
}


function myProjection() {
  var MAP_RANGE = 51200;
  this.worldOrigin_ = this.fromCoordToPoint(new Coord(0, 0));
  this.pixelsPerLonDegree = MAP_RANGE / 360;
  this.pixelsPerLatDegree = MAP_RANGE / 180;
};

myProjection.prototype.fromPointToCoord = function(point) {
  return new Coord(COORDSPP * point.x, COORDSPP * point.y);
};

myProjection.prototype.fromCoordToPoint = function(coord) {
  return new google.maps.Point(coord.x / COORDSPP, coord.y / COORDSPP);
};

myProjection.prototype.fromLatLngToCoord = function(latLng) {
  return this.fromPointToCoord(this.fromLatLngToPoint(latLng));
};

myProjection.prototype.fromCoordToLatLng = function(coord) {
  return this.fromPointToLatLng(this.fromCoordToPoint(coord));
};

myProjection.prototype.fromLatLngToPoint = function(latLng) {
  var origin = this.worldOrigin_;
  var x = origin.x + latLng.lng() * this.pixelsPerLonDegree;
  var y = origin.y + latLng.lat() * this.pixelsPerLatDegree;
  return new google.maps.Point(x, y);
};

myProjection.prototype.fromPointToLatLng = function(point) {
  var origin = this.worldOrigin_;
  var lng = (point.x - origin.x) / this.pixelsPerLonDegree;
  var lat = (point.y - origin.y) / this.pixelsPerLatDegree;
  return new google.maps.LatLng(lat, lng);
};


function gup(name,dflt) {
  name = name.replace(/[[]/,'\\\[').replace(/[]]/,'\\\]');
  var regexS = '[?#&]'+name+'=([^&#]*)';
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return dflt;
  else
    return results[1];
}


function CoordMapType(tileSize) {
  this.tileSize = tileSize;
}

CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  coord = fixCoord(coord, zoom);
  var factor = Math.pow(2, 9-zoom);
  var x = ((coord.x)*factor);
  var y = ((coord.y)*factor);
  var div = ownerDocument.createElement('div');
  div.innerHTML = '('+x+','+y+')';
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.fontSize = '10';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';
  div.style.borderColor = '#000000';
  div.className = 'gridTile';
  return div;
};

CoordMapType.prototype.toggle = function() {
  if (map.overlayMapTypes.getLength()) {
    map.overlayMapTypes.pop();
  } else {
    map.overlayMapTypes.push(new CoordMapType(new google.maps.Size(tsz[0], tsz[1])))
  }
};


function url_update(){
  var coord = projection.fromLatLngToCoord(map.getCenter());
  location.hash = '#level='+map.getMapTypeId()+
    '&x='+coord.x.toFixed(2)+
    '&y='+coord.y.toFixed(2)+
    '&zoom='+map.zoom+
    '&spreadsheet='+spreadsheet_id+
    '&tileset='+tileset;
}


function open_spreadsheet(){
  window.open('https://docs.google.com/spreadsheets/d/'+spreadsheet_id+'/edit', '_blank');
}


function fixCoord(coord, zoom) {
  var x = coord.x;
  var y = coord.y;
  var factor = Math.pow(2, zoom) * 512;
  if (x > factor/2)
    x = x - factor;
  return {x: x, y: y};
}
