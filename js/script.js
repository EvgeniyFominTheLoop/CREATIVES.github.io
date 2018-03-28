(function() { // Сlosure begin
  window.lat = 46.635312;
  window.lng = 32.616983;
  
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(updatePosition);
    }
  return null;
  };

  function updatePosition(position) {
    if (position) {
      window.lat = position.coords.latitude;
      window.lng = position.coords.longitude;
    }
  }
  
  // setTimeout(function(){updatePosition(getLocation());}, 5000);

  // window.onload = function(){updatePosition(getLocation());}
  
  function currentLocation() {
    return {lat:window.lat, lng:window.lng};
  };

  var map;
  var mark;
  var initialize = function() {
    map  = new google.maps.Map(document.getElementById('map-canvas'), {
      center:{lat:lat,lng:lng},
      zoom:15,
      styles: [
            {elementType: 'geometry', stylers: [{color: '#282828'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#004044'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#383838'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#383838'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#004044'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    });
    mark = new google.maps.Marker({position:{lat:lat, lng:lng}, map:map});
  };
  
  window.initialize = initialize;

  var redraw = function(payload) {
    lat = payload.message.lat;
    lng = payload.message.lng;
    map.setCenter({lat:lat, lng:lng, alt:0});
    mark.setPosition({lat:lat, lng:lng, alt:0});
  };

  var pnChannel = "map2-channel";
  
  var pubnub = new PubNub({
    publishKey:   'pub-c-829f7b02-c53e-4453-b839-7a9763479cfd',
    subscribeKey: 'sub-c-6a54af62-2d2c-11e8-a27a-a2b5bab5b996'
  });
  
  pubnub.subscribe({channels: [pnChannel]});
  pubnub.addListener({message:redraw});

  setInterval(function() {
    pubnub.publish({channel:pnChannel, message:currentLocation()});
  }, 50000);

})(); // Сlosure end