"use strict";

var MAP_CENTER = {lat:34.03, lng: -118.394}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: MAP_CENTER,
    zoom: 15,
    disableDefaultUI: true
  });
  var places = [];
  placesData.forEach(function(placeData) {
    var place = new Place(placeData);
    place.marker = new google.maps.Marker({
      position: placeData.location,
      title: placeData.name,
      map: map,
      animation: google.maps.Animation.DROP,
      //infowindow: new google.maps.InfoWindow({ content: makeInfoWindowContent(place) })
      infowindow: new InfoBubble({ map: map, content: makeInfoWindowContent(place) })
    });
    place.marker.addListener('click', function() { app.vm.selectPlace(place) });
    place.marker.infowindow.addListener('closeclick', function() { app.vm.deselectPlace(place) });
    places.push(place);
  });
  app.vm.init(map, places);
}

var makeInfoWindowContent = function(place) {
  var html = '<div class="place-info"><h2 class="info-heading">' + place.name +
    '</h2><div class="yelp-info hidden" id="yelp-' + place.businessID + '"></div></div>'
  return html;
};

var getYelpData = function(place) {
  var YELP_URL = 'https://api.yelp.com/v2/business/';
  var YELP_CONSUMER_KEY = 'GbivRhbPwg0gh-ti0WxOzw';
  var YELP_CONSUMER_SECRET = 'Pd6KFyeX_hMAL2c5prD--cn--9Q';
  var YELP_TOKEN = 'IUGGqvuWCnEZz4Fx12Fik9la9Wb17jgI';
  var YELP_TOKEN_SECRET = 'XnxVSRkveoNhJp8jEjihFYo64h4';

  var parameters = {
        oauth_consumer_key: YELP_CONSUMER_KEY,
        oauth_token: YELP_TOKEN,
        oauth_nonce: nonce_generate(),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now()/1000),
        callback: 'cb'
      };

  var url = YELP_URL + place.businessID;
  var signature = oauthSignature.generate('GET', url, parameters, YELP_CONSUMER_SECRET, YELP_TOKEN_SECRET);
  parameters.oauth_signature = signature;

  var settings = {
    url: url,
    data: parameters,
    cache: true,
    dataType: 'jsonp',
    jsonpCallback: 'cb',
    success: function(yelpData) {
      place.yelpDataReceived = true;
      populateYelpInfoDiv(yelpData, place);
    },
    error: function(error) {
      console.log(error);
    }
  };

  $.ajax(settings);
};

var populateYelpInfoDiv = function(yelpData, place) {
  var $yelpInfoDiv = $('#yelp-' + place.businessID);
  var $table = $('<table><tr><th>Yelp Rating:</th><td></td></tr></table>');
  var $ratingImg = $('<img class="yelp-rating-img" src="' + yelpData.rating_img_url + '" />');
  //$ratingImg.on('load', function() {
    //console.log('loaded!!!');
  //});
  $table.find('td').append($ratingImg);
  $table.append('<tr><th>Phone Number:</th><td>' + yelpData.display_phone + '</td></tr>');
  var $img = $('<img class="place-img" src="' + yelpData.image_url + '" />');
  $yelpInfoDiv.append($img);
  $yelpInfoDiv.append($table);
  $img.on('load', function() { $yelpInfoDiv.fadeIn('slow', function() {
    $yelpInfoDiv.removeClass('hidden')
    place.marker.infowindow.content = $yelpInfoDiv.parent().prop('outerHTML');
  }) });
}

var animateMarkerBounce = function(marker) {
  if (marker.getAnimation() === null) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() { marker.setAnimation(null) }, 1400);
  }
};

var myGoogleApiKey = 'AIzaSyAxa0WW4eWUbfRUm2lB-Lzh-GP6LYibtpI';

function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

var placesData = [
  {
    name: 'Versailles',
    businessID: 'versailles-restaurant-los-angeles',
    location: {'lat': 34.0210938, 'lng': -118.4036178},
    yelpDataReceived: false
  }, {
    name: 'Ugly Roll Sushi',
    businessID: 'ugly-roll-sushi-los-angeles',
    location: {'lat' : 34.0193032, 'lng' : -118.421074},
    yelpDataReceived: false
  }, {
    name: 'Tara\'s Himalayan Cuisine',
    businessID: 'taras-himalayan-cuisine-los-angeles',
    location : {'lat': 34.0170293, 'lng' : -118.4105646},
    yelpDataReceived: false
  }, {
    name: 'Father\'s Office',
    businessID: 'fathers-office-los-angeles',
    location: {'lat': 34.0303965, 'lng': -118.3847834},
    yelpDataReceived: false
  }, {
    name: 'Public School 310',
    businessID: 'public-school-310-culver-city-2',
    location: {'lat': 34.0243015, 'lng': -118.3944333},
    yelpDataReceived: false
  }, {
    name: 'S & W Country Diner',
    businessID: 's-and-w-country-diner-culver-city',
    location: {'lat': 34.02201069999999, 'lng': -118.3965204},
    yelpDataReceived: false
  }, {
    name: 'Pinches Tacos',
    businessID: 'pinches-tacos-culver-city',
    location: {'lat': 34.0301895, 'lng': -118.3831161},
    yelpDataReceived: false
  }, {
    name: 'The Jerk Spot',
    businessID: 'the-jerk-spot-culver-city',
    location: {'lat': 34.0274507, 'lng': -118.3908833},
    yelpDataReceived: false
  }, {
    name: 'Campos Tacos',
    businessID: 'campos-tacos-los-angeles',
    location: {'lat': 34.0377103, 'lng': -118.388866},
    yelpDataReceived: false
  }, {
    name: 'Overland Cafe',
    businessID: 'the-overland-los-angeles',
    location: {'lat': 34.0222854, 'lng': -118.410024},
    yelpDataReceived: false
  }, {
    name: 'K & A Canton Restaurant',
    businessID: 'k-and-a-canton-restaurant-los-angeles',
    location: {'lat': 34.0308305, 'lng': -118.4008722},
    yelpDataReceived: false
  }
];

var isSubstring = function(substring, string) {
  return string.toLowerCase().indexOf(substring.toLowerCase()) > -1;
}

var Place = function(data) {
  this.name = data.name;
  this.businessID = data.businessID;
  this.location = data.location;
};

function AppViewModel() {
  var self = this;
  self.searchString = ko.observable('');
  self.selectedPlace = ko.observable(null);
  self.allPlaces = ko.observableArray();
  self.visiblePlaces = ko.computed(function() {
    return ko.utils.arrayFilter(self.allPlaces(), function(place) {
      return place.marker.map !== null;
    });
  });

  self.init = function(map, places) {
    self.map = map;
    self.allPlaces(places);
  };

  self.testFunction = function(item) {
    console.log(item.name);
  };

  self.onSearchChange = function() {
    self.allPlaces(ko.utils.arrayMap(self.allPlaces(), function(place) {
      if (isSubstring(self.searchString(), place.name)) {
        place.marker.setMap(self.map);
      } else {
        place.marker.setMap(null);
        if (place === self.selectedPlace()) { self.deselectPlace(place) }
      }
      return place;
    }));
  };

  self.selectPlace = function(place) {
    if (!place.yelpDataReceived) { getYelpData(place) }
    if (self.selectedPlace()) { self.selectedPlace().marker.infowindow.close() }
    self.selectedPlace(place);
    animateMarkerBounce(place.marker);
    place.marker.infowindow.open(self.map, place.marker);
  };

  self.deselectPlace = function(place) {
    if (place && self.selectedPlace() === place) {
      place.marker.infowindow.close();
      self.selectedPlace(null);
    }
  };
}

var app = { vm: new AppViewModel() };
ko.applyBindings(app.vm);
