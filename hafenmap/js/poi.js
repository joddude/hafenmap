var icon_size = 24;
var poi = [];
var markers = [];

var marker_icon = {
  'Default': 'Marker_Outside_Azure',
  'Abyssal Chasm': 'Abyssal_Chasm',
  'Ancient Windthrow': 'Ancient_Windthrow',
  'Badger': 'Badger',
  'Barter Stand': 'Barter_Stand',
  'Basalt': 'Basalt',
  'Bat': 'Bat',
  'Bear': 'Bear',
  'Black Coal': 'Black_Coal',
  'Black Ore': 'Black_Ore',
  'Bloodstone': 'Bloodstone',
  'Boar': 'Boar',
  'Border Cairn': 'Border_Cairn',
  'Cassiterite': 'Cassiterite',
  'Cave': 'Cave',
  'Cave Organ': 'Cave_Organ',
  'Chalcopyrite': 'Chalcopyrite',
  'Charter Stone': 'Charter_Stone',
  'Cinnabar': 'Cinnabar',
  'Claim': 'Claim',
  'Clay': 'Clay',
  'Clay Pit': 'Clay_Pit',
  'Coronation Stone': 'Coronation_Stone',
  'Direvein': 'Direvein',
  'Dolomite': 'Dolomite',
  'Dragonfly': 'Dragonfly',
  'Feldspar': 'Feldspar',
  'Fish': 'Fish',
  'Flint': 'Flint',
  'Fox': 'Fox',
  'Galena': 'Galena',
  'Geyser': 'Geyser',
  'Gneiss': 'Gneiss',
  'Granite': 'Granite',
  'Guano Pile': 'Guano_Pile',
  'Headwaters': 'Headwaters',
  'Heart of the Woods': 'Heart_of_the_Woods',
  'Heavy Earth': 'Heavy_Earth',
  'Hedgehog': 'Hedgehog',
  'Horn Silver': 'Horn_Silver',
  'Horse': 'Horse',
  'Ice Spire': 'Ice_Spire',
  'Iron Ochre': 'Iron_Ochre',
  'Jotun Mussel': 'Jotun_Mussel',
  'Leaf Ore': 'Leaf_Ore',
  'Limestone': 'Limestone',
  'Lynx': 'Lynx',
  'Malachite': 'Malachite',
  'Mammoth': 'Mammoth',
  'Marble': 'Marble',
  'Milestone': 'Milestone',
  'Mine Hole': 'Mine_Hole',
  'Moose': 'Moose',
  'Mussels': 'Mussels',
  'Porphyry': 'Porphyry',
  'Quartz': 'Quartz',
  'Reddeer': 'Reddeer',
  'Rock Crystal': 'Rock_Crystal',
  'Salt Basin': 'Salt_Basin',
  'Sand': 'Sand',
  'Sandstone': 'Sandstone',
  'Schist': 'Schist',
  'Schrifterz': 'Schrifterz',
  'Silvershine': 'Silvershine',
  'Soil': 'Soil',
  'Sublime Portico': 'Sublime_Portico',
  'Troll': 'Troll',
  'Village': 'Village',
  'Water': 'Water',
  'Wooden Roadsign': 'Wooden_Roadsign'
}


function start_poi() {
  $.get(sheet_api_url+'?key='+api_key, function(data) {
    poi = convertToArrayOfObjects(data['values']);
    draw_markers();
	});
  poi_listeners();
}


function draw_markers() {
  var marker, i;
  var infowindow = new google.maps.InfoWindow();
  for (i = 0; i < poi.length; i++) {
    if (level_id() != poi[i].Level) continue;
    var marker = new google.maps.Marker({
      position: projection.fromCoordToLatLng({x: poi[i].X, y: poi[i].Y}),
      icon: get_marker_icon(poi[i].Type),
      title: marker_title(poi[i]),
      map: map
    });
    markers.push(marker);
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(marker_info(poi[i]));
        infowindow.open(map, marker);
      }
    })(marker, i));
  }
}


function poi_listeners() {
  google.maps.event.addListener(map, "click", function(event) {
    point_info(event);
  });
  google.maps.event.addListener(map, "maptypeid_changed", function(event) {
    reload_markers(event);
  });
}


function level_id() {
  var level = map.getMapTypeId();
  if (level == 'land2') level = 'land';
  return level;
}


function convertToArrayOfObjects(data) {
  var keys = data.shift(),
    i = 0, k = 0,
    obj = null,
    output = [];
  for (i = 0; i < data.length; i++) {
    obj = {};
    for (k = 0; k < keys.length; k++) {
      obj[keys[k]] = data[i][k];
    }
    output.push(obj);
  }
  return output;
}


function get_marker_icon(marker_type) {
  if (marker_icon[marker_type]) {
  	return {
      url: 'markers/' + marker_icon[marker_type] + '.png',
      scaledSize: new google.maps.Size(icon_size, icon_size),
      anchor: new google.maps.Point(icon_size/2, icon_size/2)
  	};
  } else {
  	return {
      url: 'markers/' + marker_icon['Default'] + '.png',
      scaledSize: new google.maps.Size(icon_size, icon_size),
      anchor: new google.maps.Point(icon_size/2, icon_size)
  	};
  }
}


function remove_markers(){
  for(i=0; i<markers.length; i++){
    markers[i].setMap(null);
  }
}


function reload_markers() {
  remove_markers();
  draw_markers();
}


function marker_title(poi) {
 var info = poi.Type + ' ' + poi.Name;
  if (poi.AvgQuality != '0') {
    info = info + ' (q' + poi.AvgQuality + ')';
  }
  return info;
}


function marker_info(poi) {
  var info = (
    poi.Type + ' ' + poi.Name + '<br/>' +
    'AvgQuality: ' + poi.AvgQuality + '<br/>' +
    'Essence: ' + poi.Essence + '<br/>' +
    'Substance: ' + poi.Substance + '<br/>' +
    'Vitality: ' + poi.Vitality + '<br/>' +
    'Level: ' + poi.Level + '<br/>' +
    'X: ' + poi.X + '<br/>' +
    'Y: ' + poi.Y
  );
  return info;
}


function point_info(event) {
  var coord = projection.fromLatLngToCoord(event.latLng);
  var infowindow_coord = new google.maps.InfoWindow();
  var Level = level_id();
  var X = coord.x.toFixed(2);
  var Y = coord.y.toFixed(2);
  infowindow_coord.setContent(
    'Level: ' + Level + '<br/>' +
    'X: ' + X + '<br/>' +
    'Y: ' + Y
  );
  infowindow_coord.setPosition(event.latLng);
  infowindow_coord.open(map);
}

