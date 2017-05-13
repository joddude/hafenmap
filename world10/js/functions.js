function Coord() {
  this.x;
  this.y;
}


function Coord(x,y) {
  this.x = x;
  this.y = y;
}


Coord.prototype.toString = function() {
  return "("+this.x+", "+this.y+")";
}


function myProjection() {
  var MAP_RANGE = 51200;
  this.worldOrigin_ = this.fromCoordToPoint(new Coord(gup('x','0'),gup('y','0')));
  this.pixelsPerLonDegree_ = MAP_RANGE / 360;
  this.pixelsPerLatDegree_ = MAP_RANGE / 180;
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


function url_update(){
  coord = projection.fromLatLngToCoord(map.getCenter());
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
