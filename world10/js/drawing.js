var drawing_sheet_name = 'hafenmap_drawing';
var objects_style = {
  editable: true,
  clickable: false,
  visible: true,
  //draggable: true
}


function start_drawing() {
  map.data.setStyle(objects_style);
  load_objects();
}


function load_objects() {
  remove_objects();
  $.get(sheet_api_url+'/values/'+ drawing_sheet_name+'?key='+api_key, function(data) {
    if (data['values']) {
      data['values'].forEach(function (object) {
        //console.log(JSON.parse(object));
        map.data.addGeoJson(JSON.parse(object))
      });
    }
    bindDataLayerListeners();
  });
}


function remove_objects() {
  map.data.forEach(function (object) {
    map.data.remove(object);
  });
}


function bindDataLayerListeners() {
  map.data.addListener('addfeature', save_objects);
  map.data.addListener('removefeature', save_objects);
  map.data.addListener('setgeometry', save_objects);
}


function save_objects(event) {
  console.log(event);
  check_auth();
  var data = {
    'values': [],
  }
  map.data.forEach(function (object) {
    object.toGeoJson(function (gj_object) {
      //console.log(JSON.stringify(gj_object))
      data.values.push([JSON.stringify(gj_object)]);
    });
  });
  var row1 = 1;
  var row2 = data.values.length;

  $.ajax({
    url: sheet_api_url+'/values/'+drawing_sheet_name+'!'+row1+':'+row2+'?valueInputOption=RAW&access_token='+access_token,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      console.log('Success saving');
    },
    error: function(data){
      console.log(data);
      alert('Saving error '+data.responseJSON.error.code+' - '+data.responseJSON.error.status+'\n'+data.responseJSON.error.message);
    }
  })
}


function pan() {
  map.data.setDrawingMode(null);
}


function add_line() {
  check_auth();
  map.data.setDrawingMode('LineString');
}


function add_polygon() {
  check_auth();
  map.data.setDrawingMode('Polygon');
}


function toggle_drawing() {
  if(map.data.style.visible) {
    map.data.setStyle({visible: false});
  } else {
    map.data.setStyle(objects_style);
  }
}

