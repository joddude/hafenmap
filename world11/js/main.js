var tsz = [100, 100]
var gridActive = true;

//Change api key to YOUR_API_KEY in next line
var api_key = 'AIzaSyBRubiQU_lzu8FjQTy-L5I2z57MwtJRAUg';
//Change oauth client id to YOUR_OAUTH_CLIENT_ID in next line
var oauth_client_id = '899386149897-u1cbun7uijmk5bnh8q81d6t5t1rreaah.apps.googleusercontent.com';

var oauth_scopes = ['https://www.googleapis.com/auth/spreadsheets'];
var default_tileset = 'tiles/';
var default_spreadsheet_id = '1rrFKxDUFv7Pj1GXCEsMEhVHlyGJ0dXKL0zgRixhBIQ8';
var tileset = gup('tileset', default_tileset);
var spreadsheet_id = gup('spreadsheet', default_spreadsheet_id);
var sheet_api_url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_id;
var site_url = location.protocol + '//' + location.host + location.pathname;

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
      coord = fixCoord(coord, zoom);
      var x = coord.x;
      var y = coord.y;
      return 'http://www.odditown.com/haven/map/tiles/'+zoom+'/'+x+'_'+y+'.png';
  },
  tileSize: new google.maps.Size(tsz[0], tsz[1]),
  minZoom: 3,
  maxZoom: 9,
  name: 'Odditown map'
});

var LandMap = new google.maps.ImageMapType({
  getTileUrl: function(coord, zoom) {
      coord = fixCoord(coord, zoom);
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
      coord = fixCoord(coord, zoom);
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
      coord = fixCoord(coord, zoom);
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
      coord = fixCoord(coord, zoom);
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
      coord = fixCoord(coord, zoom);
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
      coord = fixCoord(coord, zoom);
      var x = coord.x;
      var y = coord.y;
      return tileset+'cave5/'+zoom+'/tile_'+x+'_'+y+'.png';
  },
  tileSize: new google.maps.Size(tsz[0], tsz[1]),
  minZoom: 5,
  maxZoom: 9,
  name: 'Cave 5'
});

var projection;
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

