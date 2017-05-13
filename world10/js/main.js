var tsz = [100, 100]
var gridActive = true;
var COORDSPP = 5.12;

//Change api key to YOUR_API_KEY in next line
var api_key = 'AIzaSyBRubiQU_lzu8FjQTy-L5I2z57MwtJRAUg';
//Change oauth client id to YOUR_OAUTH_CLIENT_ID in next line
var oauth_client_id = '899386149897-u1cbun7uijmk5bnh8q81d6t5t1rreaah.apps.googleusercontent.com';

var oauth_scopes = ['https://www.googleapis.com/auth/spreadsheets'];
var default_tileset = 'tiles/';
var default_spreadsheet_id = '1vQxLvqzQ8Z_N2ifbAni7Fu5NLEuT5tNR05Z_8bPQqHw';
var tileset = gup('tileset',default_tileset);
var spreadsheet_id = gup('spreadsheet', default_spreadsheet_id);
var sheet_api_url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_id;
var site_url = location.protocol + '/' + location.host + location.pathname;

var projection;
myProjection.prototype.fromPointToCoord = function(point) {return new Coord(COORDSPP*point.x, COORDSPP*point.y)};
myProjection.prototype.fromCoordToPoint = function(coord) {return new google.maps.Point(coord.x/COORDSPP, coord.y/COORDSPP);};
myProjection.prototype.fromLatLngToCoord = function(latLng) {return this.fromPointToCoord(this.fromLatLngToPoint(latLng))};
myProjection.prototype.fromCoordToLatLng = function(coord) {return this.fromPointToLatLng(this.fromCoordToPoint(coord))};

myProjection.prototype.fromLatLngToPoint = function(latLng) {
  var origin = this.worldOrigin_;
  var x = origin.x + latLng.lng() * this.pixelsPerLonDegree_;
  var y = origin.y + latLng.lat() * this.pixelsPerLatDegree_;
  return new google.maps.Point(x, y);
};

myProjection.prototype.fromPointToLatLng = function(point) {
  var origin = this.worldOrigin_;
  var lng = (point.x - origin.x) / this.pixelsPerLonDegree_;
  var lat = (point.y - origin.y) / this.pixelsPerLatDegree_;
  return new google.maps.LatLng(lat, lng);
};

CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var factor = Math.pow(2,9-zoom);
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

var overlay = new CoordMapType(new google.maps.Size(tsz[0], tsz[1]));

var map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 0, lng: 0},
  zoom: parseInt(gup('zoom','4')),
  streetViewControl: false,
  mapTypeControlOptions: {
    mapTypeIds: ['public_map', 'land', 'cave1', 'cave2', 'cave3', 'cave4', 'cave5']
  }
});

var PublicMap = new google.maps.ImageMapType({
  getTileUrl: function(coord, zoom) {
      var x = coord.x;
      var y = coord.y;
      return 'http://www.odditown.com:8080/haven/tiles/live/'+zoom+'/'+x+'_'+y+'.png';
  },
  tileSize: new google.maps.Size(tsz[0], tsz[1]),
  minZoom: 3,
  maxZoom: 9,
  name: 'Odditown map'
});

var LandMap = new google.maps.ImageMapType({
  getTileUrl: function(coord, zoom) {
      var x = coord.x;
      var y = coord.y;
      return tileset+'land/'+zoom+'/tile_'+x+'_'+y+'.png';
  },
  tileSize: new google.maps.Size(tsz[0], tsz[1]),
  minZoom: 5,
  maxZoom: 9,
  name: 'Land'
});

var Cave1Map = new google.maps.ImageMapType({
  getTileUrl: function(coord, zoom) {
      var x = coord.x;
      var y = coord.y;
      return tileset+'cave1/'+zoom+'/tile_'+x+'_'+y+'.png';
  },
  tileSize: new google.maps.Size(tsz[0], tsz[1]),
  minZoom: 5,
  maxZoom: 9,
  name: 'Cave 1'
});

var Cave2Map = new google.maps.ImageMapType({
  getTileUrl: function(coord, zoom) {
      var x = coord.x;
      var y = coord.y;
      return tileset+'cave2/'+zoom+'/tile_'+x+'_'+y+'.png';
  },
  tileSize: new google.maps.Size(tsz[0], tsz[1]),
  minZoom: 5,
  maxZoom: 9,
  name: 'Cave 2'
});
var Cave3Map = new google.maps.ImageMapType({
  getTileUrl: function(coord, zoom) {
      var x = coord.x;
      var y = coord.y;
      return tileset+'cave3/'+zoom+'/tile_'+x+'_'+y+'.png';
  },
  tileSize: new google.maps.Size(tsz[0], tsz[1]),
  minZoom: 5,
  maxZoom: 9,
  name: 'Cave 3'
});
var Cave4Map = new google.maps.ImageMapType({
  getTileUrl: function(coord, zoom) {
      var x = coord.x;
      var y = coord.y;
      return tileset+'cave4/'+zoom+'/tile_'+x+'_'+y+'.png';
  },
  tileSize: new google.maps.Size(tsz[0], tsz[1]),
  minZoom: 5,
  maxZoom: 9,
  name: 'Cave 4'
});
var Cave5Map = new google.maps.ImageMapType({
  getTileUrl: function(coord, zoom) {
      var x = coord.x;
      var y = coord.y;
      return tileset+'cave5/'+zoom+'/tile_'+x+'_'+y+'.png';
  },
  tileSize: new google.maps.Size(tsz[0], tsz[1]),
  minZoom: 5,
  maxZoom: 9,
  name: 'Cave 5'
});

projection = new myProjection();
PublicMap.projection = projection
LandMap.projection = projection
Cave1Map.projection = projection
Cave2Map.projection = projection
Cave3Map.projection = projection
Cave4Map.projection = projection
Cave5Map.projection = projection

map.mapTypes.set('public_map', PublicMap);
map.mapTypes.set('land', LandMap);
map.mapTypes.set('cave1', Cave1Map);
map.mapTypes.set('cave2', Cave2Map);
map.mapTypes.set('cave3', Cave3Map);
map.mapTypes.set('cave4', Cave4Map);
map.mapTypes.set('cave5', Cave5Map);

map.setMapTypeId(gup('level','public_map'));
map.overlayMapTypes.insertAt(0, overlay);

google.maps.event.addListener(map, 'bounds_changed', function() {
  url_update();
});

google.maps.event.addListener(map, 'maptypeid_changed', function(event) {
  url_update();
});


start_poi();

start_drawing();

