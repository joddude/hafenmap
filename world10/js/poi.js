var icon_size = 24;
var access_token = false;
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
  'Burrow': 'Burrow',
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
  'Crab': 'Crab',
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
  'Heartwood Tree': 'Heartwood_Tree',
  'Heavy Earth': 'Heavy_Earth',
  'Hedgehog': 'Hedgehog',
  'Horn Silver': 'Horn_Silver',
  'Hornblende': 'Hornblende',
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
  'Quest Giver': 'Quest_Giver',
  'Reddeer': 'Reddeer',
  'Rock Crystal': 'Rock_Crystal',
  'Salt Basin': 'Salt_Basin',
  'Sand': 'Sand',
  'Sandstone': 'Sandstone',
  'Schist': 'Schist',
  'Schrifterz': 'Schrifterz',
  'Silvershine': 'Silvershine',
  'Soil': 'Soil',
  'Stone Pillar': 'Stone_Pillar',
  'Sublime Portico': 'Sublime_Portico',
  'Swan': 'Swan',
  'Swirling Vortex': 'Swirling_Vortex',
  'Troll': 'Troll',
  'Village': 'Village',
  'Walrus': 'Walrus',
  'Water': 'Water',
  'Wolverine': 'Wolverine',
  'Wooden Roadsign': 'Wooden_Roadsign'
}

function start_poi() {
  $('#add-form-type').html(type_select());
  $('#edit-form-type').html(type_select());
  load_poi();
  poi_listeners();
}

function type_select() {
	var list = '<option class="type-icon"></option>';
	for (i in marker_icon) {
		list = list + '<option class="type-icon" style="background-image:url(markers/' + marker_icon[i] + '.png);">' + i + '</option>'
	}
	return list;
}

function load_poi() {
  $.get(sheet_api_url+'/values/'+ sheet_name+'?key='+api_key, function(data) {
    poi = convertToArrayOfObjects(data['values']);
    draw_markers();
	});
}

function draw_markers() {
  var marker, i;
  var infowindow = new google.maps.InfoWindow();
  for (i = 0; i < poi.length; i++) {
    if (level_id() != poi[i].Level) continue;
    var marker = new google.maps.Marker({
      position: projection.fromCoordToLatLng({x: poi[i].X, y: poi[i].Y}),
      icon: get_marker_icon(poi[i].Type),
      title: marker_title(i),
      map: map
    });
    markers.push(marker);
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(marker_info(i));
        infowindow.open(map, marker);
      }
    })(marker, i));
  }
}

function poi_listeners() {
  google.maps.event.addListener(map, 'click', function(event) {
    point_info(event);
  });
  google.maps.event.addListener(map, 'maptypeid_changed', function(event) {
    remove_markers();
    draw_markers();
  });
}

function level_id() {
  var level = map.getMapTypeId();
  if (level == 'public_map') level = 'land';
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

function marker_title(i) {
 var info = poi[i].Type + ' ' + poi[i].Name;
  if (poi[i].Quality != '0') {
    info = info + ' (q' + poi[i].Quality + ')';
  }
  return info;
}

function marker_info(i) {
  var info = (
    '<p>' +
    'Type: ' + poi[i].Type + '<br/>' +
    'Name: ' + poi[i].Name + '<br/>' +
    'Quality: ' + poi[i].Quality + '<br/>' +
    'Level: ' + poi[i].Level + '<br/>' +
    'X: ' + poi[i].X + '<br/>' +
    'Y: ' + poi[i].Y + '<br/>' +
    '</p>' +
    '<button class="btn btn-default btn-sm" data-toggle="modal" onclick="edit_poi_dialog('+i+')"><span class="glyphicon glyphicon-map-marker"></span> Edit</button>'
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
    '<p>' +
    'Level: ' + Level + '<br/>' +
    'X: ' + X + '<br/>' +
    'Y: ' + Y + '<br/>' +
    '</p>' +
    '<button class="btn btn-default btn-sm" data-toggle="modal" onclick="add_poi_dialog('+X+','+Y+')"><span class="glyphicon glyphicon-map-marker"></span> Add</button>'
  );
  infowindow_coord.setPosition(event.latLng);
  infowindow_coord.open(map);
}

function add_poi_dialog(X=0, Y=0) {
  check_auth();
  level=level_id();
  $('#add-form-level').val(level);
  $('#add-form-x').val(X);
  $('#add-form-y').val(Y);
  $('.modal.in').not('#addModal').modal('hide');
  $('#addModal').modal('show');
}

function edit_poi_dialog(i) {
  check_auth();
  $('#edit-form-poi-id').val(i);
  $('#edit-form-type').val(poi[i].Type);
  $('#edit-form-name').val(poi[i].Name);
  $('#edit-form-quality').val(poi[i].Quality);
  $('#edit-form-level').val(poi[i].Level);
  $('#edit-form-x').val(poi[i].X);
  $('#edit-form-y').val(poi[i].Y);
  $('.modal.in').not('#editModal').modal('hide');
  $('#editModal').modal('show');
}

function add_poi() {
  $('#addModal').modal('hide');
  var Type = $('#add-form-type').val();
  var Name = $('#add-form-name').val();
  var Level = $('#add-form-level').val();
  var X = $('#add-form-x').val();
  var Y = $('#add-form-y').val();
  var Quality = $('#add-form-quality').val();
  var MapLink = site_url+'#&level='+Level+'&x='+X+'&y='+Y+'&zoom=9&spreadsheet='+spreadsheet_id+'&tileset='+tileset;
  var data = {
    'values': [
        [Type, Name, Level, X, Y, Quality, MapLink],
    ],
  }
  $.ajax({
    url: sheet_api_url+'/values/'+sheet_name+':append?valueInputOption=RAW&access_token='+access_token,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      remove_markers();
      load_poi();
    },
    error: function(data){
      console.log(data);
      alert('Error '+data.responseJSON.error.code+' - '+data.responseJSON.error.status+'\n'+data.responseJSON.error.message);
    }
  })
}

function edit_poi() {
  $('#editModal').modal('hide');
  var i = $('#edit-form-poi-id').val();
  var row = parseInt(i)+2;
  var Type = $('#edit-form-type').val();
  var Name = $('#edit-form-name').val();
  var Level = $('#edit-form-level').val();
  var X = $('#edit-form-x').val();
  var Y = $('#edit-form-y').val();
  var Quality = $('#edit-form-quality').val();
  var MapLink = site_url+'#&level='+Level+'&x='+X+'&y='+Y+'&zoom=9&spreadsheet='+spreadsheet_id+'&tileset='+tileset;
  var data = {
    'values': [
        [Type, Name, Level, X, Y, Quality, MapLink],
    ],
  }
  $.ajax({
    url: sheet_api_url+'/values/'+sheet_name+'!'+row+':'+row+'?valueInputOption=RAW&access_token='+access_token,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      remove_markers();
      load_poi();
    },
    error: function(data){
      console.log(data);
      alert('Error '+data.responseJSON.error.code+' - '+data.responseJSON.error.status+'\n'+data.responseJSON.error.message);
    }
  })
}

function remove_poi() {
  $('#editModal').modal('hide');
  var i = $('#edit-form-poi-id').val();
  var row = parseInt(i)+2;
  var data = {
    'requests': [
      {
        'deleteDimension': {
          'range': {
            'sheetId': 0,
            'dimension': 'ROWS',
            'startIndex': row-1,
            'endIndex': row
          }
        }
      }
    ]
  }
  $.ajax({
    url: sheet_api_url+':batchUpdate?access_token='+access_token,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      remove_markers();
      load_poi();
    },
    error: function(data){
      console.log(data);
      alert('Error '+data.responseJSON.error.code+' - '+data.responseJSON.error.status+'\n'+data.responseJSON.error.message);
    }
  })
}

function check_auth() {
  gapi.auth.authorize(
    {
      'client_id': oauth_client_id,
      'scope': oauth_scopes.join(' '),
      'immediate': true
    }, auth_result);
}

function auth_result(authResult) {
    console.log(authResult);
  if (authResult.access_token) {
    access_token = authResult.access_token;
    console.log(access_token);
  } else {
    start_auth();
  }
}

function start_auth() {
  gapi.auth.authorize(
    {
      'client_id': oauth_client_id,
      'scope': oauth_scopes,
      'immediate': false
    }, auth_result);
}
