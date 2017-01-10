function addruler() {

  var icon_size = 24;
  var icon_url= 'markers/Marker_Outside_Chartreuse.png';

  var ruler1 = new google.maps.Marker({
    position: map.getCenter() ,
    icon: {
      url: icon_url,
      scaledSize: new google.maps.Size(icon_size, icon_size),
      anchor: new google.maps.Point(icon_size/2, icon_size)
    },
    map: map,
    draggable: true
  });

  var ruler2 = new google.maps.Marker({
    position: map.getCenter() ,
    icon: {
      url: icon_url,
      scaledSize: new google.maps.Size(icon_size, icon_size),
      anchor: new google.maps.Point(icon_size/2, icon_size)
    },
    map: map,
    draggable: true
  });

  var rulerpoly = new google.maps.Polyline({
    path: [ruler1.position, ruler2.position] ,
    strokeColor: "#FFFF00",
    strokeOpacity: .7,
    strokeWeight: 7,
    map: map,
  });

  var rulerpoly_label = new Label({
    position: map.getCenter(),
    text: '0 minimaps',
    map: map
  });

	google.maps.event.addListener(ruler1, 'drag', function() {
	  var pos1 = ruler1.getPosition();
	  var pos2 = ruler2.getPosition();
  	rulerpoly.setPath([pos1, pos2]);
  	var d = distance(pos1, pos2);
	  rulerpoly_label.set("text", d);
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(pos1);
    bounds.extend(pos2);
	  rulerpoly_label.set("position", bounds.getCenter());
	});
	google.maps.event.addListener(ruler2, 'drag', function() {
	  var pos1 = ruler1.getPosition();
	  var pos2 = ruler2.getPosition();
  	rulerpoly.setPath([pos1, pos2]);
  	var d = distance(pos1, pos2);
	  rulerpoly_label.set("text", d);
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(pos1);
    bounds.extend(pos2);
	  rulerpoly_label.set("position", bounds.getCenter());
	});

}


/*
// old distance function from legacy
function distance(latlng1, latlng2) {
	var coord1 = projection.fromLatLngToCoord(latlng1)
	var coord2 = projection.fromLatLngToCoord(latlng2)
	var dx = coord1.x - coord2.x;
	var dy = coord1.y - coord2.y;
	var d = Math.sqrt(dx*dx + dy*dy)*100;
	var CONST = 500000;
	var agil = Math.ceil(Math.pow(d*11, 1.5)/CONST);
	if (d>=5000) return Math.round(d/50)/100+" SG, "+agil;
	else return Math.round(d)+" t, "+agil;
}
*/


function distance(latlng1, latlng2) {
	var coord1 = projection.fromLatLngToCoord(latlng1)
	var coord2 = projection.fromLatLngToCoord(latlng2)
	var dx = coord1.x - coord2.x;
	var dy = coord1.y - coord2.y;
	var d = Math.sqrt(dx*dx + dy*dy).toFixed(2);
	return d+' minimaps';
}


function Label(opt_options) {
  // Initialization
  this.setValues(opt_options);
  // Label specific
  var span = this.span_ = document.createElement('span');
  span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
        'white-space: nowrap; border: 0px; font-family:arial; font-weight:bold;' +
        'padding: 2px; background-color: #ddd; '+
        'opacity: .90; '+
        'filter: alpha(opacity=90); '+
        '-ms-filter: "alpha(opacity=90)"; '+
        '-khtml-opacity: .90; '+
        '-moz-opacity: .90;';
  var div = this.div_ = document.createElement('div');
  div.appendChild(span);
  div.style.cssText = 'position: absolute; display: none';
};


Label.prototype = new google.maps.OverlayView;


// Implement onAdd
Label.prototype.onAdd = function() {
  var pane = this.getPanes().floatPane;
  pane.appendChild(this.div_);
  // Ensures the label is redrawn if the text or position is changed.
  var me = this;
  this.listeners_ = [
    google.maps.event.addListener(this, 'position_changed',
    function() { me.draw(); }),
    google.maps.event.addListener(this, 'text_changed',
    function() { me.draw(); })
  ];
};


// Implement onRemove
Label.prototype.onRemove = function() { this.div_.parentNode.removeChild(this.div_ );
  // Label is removed from the map, stop updating its position/text.
  for (var i = 0, I = this.listeners_.length; i < I; ++i) {
    google.maps.event.removeListener(this.listeners_[i]);
  }
};


// Implement draw
Label.prototype.draw = function() {
  var projection = this.getProjection();
  var position = projection.fromLatLngToDivPixel(this.get('position'));
  var div = this.div_;
  div.style.left = position.x + 'px';
  div.style.top = position.y + 'px';
  div.style.display = 'block';
  this.span_.innerHTML = this.get('text').toString();
};

