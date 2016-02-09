"use strict";

/* Constants */
var MAP_CENTER = {lat:34.027, lng: -118.401}


/* General Utility Functions */
var isSubstring = function(substring, string) {
  return string.toLowerCase().indexOf(substring.toLowerCase()) > -1;
}


/* Raw data for the places that display on the map by default */
var placesData = [
  {
    name: 'Versailles',
    yelpID: 'versailles-restaurant-los-angeles',
    location: {'lat': 34.0210938, 'lng': -118.4036178},
    yelpDataReceived: false
  }, {
    name: 'Ugly Roll Sushi',
    yelpID: 'ugly-roll-sushi-los-angeles',
    location: {'lat' : 34.0193032, 'lng' : -118.421074},
    yelpDataReceived: false
  }, {
    name: 'Tara\'s Himalayan Cuisine',
    yelpID: 'taras-himalayan-cuisine-los-angeles',
    location : {'lat': 34.0170293, 'lng' : -118.4105646},
    yelpDataReceived: false
  }, {
    name: 'Father\'s Office',
    yelpID: 'fathers-office-los-angeles',
    location: {'lat': 34.0303965, 'lng': -118.3847834},
    yelpDataReceived: false
  }, {
    name: 'Public School 310',
    yelpID: 'public-school-310-culver-city-2',
    location: {'lat': 34.0243015, 'lng': -118.3944333},
    yelpDataReceived: false
  }, {
    name: 'S & W Country Diner',
    yelpID: 's-and-w-country-diner-culver-city',
    location: {'lat': 34.02201069999999, 'lng': -118.3965204},
    yelpDataReceived: false
  }, {
    name: 'Pinches Tacos',
    yelpID: 'pinches-tacos-culver-city',
    location: {'lat': 34.0301895, 'lng': -118.3831161},
    yelpDataReceived: false
  }, {
    name: 'The Jerk Spot',
    yelpID: 'the-jerk-spot-culver-city',
    location: {'lat': 34.0274507, 'lng': -118.3908833},
    yelpDataReceived: false
  }, {
    name: 'Campos Tacos',
    yelpID: 'campos-tacos-los-angeles',
    location: {'lat': 34.0377103, 'lng': -118.388866},
    yelpDataReceived: false
  }, {
    name: 'Overland Cafe',
    yelpID: 'the-overland-los-angeles',
    location: {'lat': 34.0222854, 'lng': -118.410024},
    yelpDataReceived: false
  }, {
    name: 'K & A Canton Restaurant',
    yelpID: 'k-and-a-canton-restaurant-los-angeles',
    location: {'lat': 34.0308305, 'lng': -118.4008722},
    yelpDataReceived: false
  }
];


/* Constructor for Place objects */
var Place = function(placeData, map) {
  this.name = placeData.name;
  this.yelpID = placeData.yelpID;
  this.location = placeData.location;
  this.marker = {map: map};
};



/* Info Window Helper Functions */

// Make initial html for the given Place's info window.
var makeInfoWindowHTML = function(place) {
  var html = '<div class="info-window"><h2 class="iw-header">' + place.name +
    '</h2><div class="yelp-info hidden" id="yelp-' + place.yelpID + '"></div></div>'
  return html;
};

// Make an ajax request to the yelp business api
var getYelpData = function(place) {
  var YELP_URL = 'https://api.yelp.com/v2/business/';
  var YELP_CONSUMER_KEY = 'GbivRhbPwg0gh-ti0WxOzw';
  var YELP_CONSUMER_SECRET = 'Pd6KFyeX_hMAL2c5prD--cn--9Q';
  var YELP_TOKEN = 'IUGGqvuWCnEZz4Fx12Fik9la9Wb17jgI';
  var YELP_TOKEN_SECRET = 'XnxVSRkveoNhJp8jEjihFYo64h4';

  var parameters = {
        oauth_consumer_key: YELP_CONSUMER_KEY,
        oauth_token: YELP_TOKEN,
        oauth_nonce: (Math.floor(Math.random() * 1e12).toString()),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now()/1000),
        callback: 'cb'
      };

  var url = YELP_URL + place.yelpID;
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

// Fill in the yelp-info div of the given place's info window with data
// returned from a yelp business api request.
var populateYelpInfoDiv = function(yelpData, place) {
  var $yelpInfoDiv = $('#yelp-' + place.yelpID);
  var $table = $('<table><tr><th>Rating:</th><td></td></tr></table>');
  var $ratingImg = $('<img class="yelp-rating-img" src="' + yelpData.rating_img_url + '" />');
  $table.find('td').append($ratingImg);
  $table.append('<tr><th>Phone:</th><td>' + yelpData.display_phone + '</td></tr>');
  var $img = $('<img class="yelp-img" src="' + yelpData.image_url + '" />');
  $yelpInfoDiv.append($img);
  $yelpInfoDiv.append($table);
  $img.on('load', function() { $yelpInfoDiv.fadeIn('slow', function() {
    $yelpInfoDiv.removeClass('hidden')
    place.marker.infowindow.content = $yelpInfoDiv.parent().prop('outerHTML');
  }) });
}


/* Map Marker Animations */ 

var animateMarkerBounce = function(marker) {
  if (marker.getAnimation() === null) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() { marker.setAnimation(null) }, 775);
  }
};


/* Setup Search Menu Slide Animations */

// When the hamburger icon is clicked, slide in the search menu
$('#hamburger-button').click(function() {
  $('#search-menu').addClass('open');
});

// When the map is clicked, slide out the search menu
$('#map').click(function() {
  $('#search-menu').removeClass('open');
});


/* App ViewModel */
function AppViewModel() {
  var self = this;
  self.map = null;

  // searchSring is the value inside the input element at the top of the search-menu
  self.searchString = ko.observable('');

  // selectedPlace is the Place Object that has been selected by the user.
  self.selectedPlace = ko.observable(null);

  // Array of all Place objects.
  self.allPlaces = ko.observableArray(placesData.map(function(data) {return new Place(data)}));

  // Array of all the Place objects whose map markers are visible on the map
  self.visiblePlaces = ko.computed(function() {
    return ko.utils.arrayFilter(self.allPlaces(), function(place) {
      return place.marker.map === self.map;
    });
  });

  // This method is the callback for the google maps api script
  self.initMap = function() {

    // Create the map
    self.map = new google.maps.Map(document.getElementById('map'), {
      center: MAP_CENTER,
      zoom: 13,
      disableDefaultUI: true
    });

    // Get all the Place objects
    var places = self.allPlaces();

    // Create a temporary array for storing the updated Place objects
    var placesWithMarkers = [];

    // Give each Place object a map marker and an info window
    places.forEach(function(place) {
      place.marker = new google.maps.Marker({
        position: place.location,
        title: place.name,
        map: self.map,
        animation: google.maps.Animation.DROP,
        infowindow: new InfoBubble({ map: self.map, content: makeInfoWindowHTML(place) })
      });
      
      // Add event listeners to markers and info windows
      place.marker.addListener('click', function() { self.selectPlace(place) });
      place.marker.infowindow.addListener('closeclick', function() { self.deselectPlace(place) });

      // Append this Place object to the temporary array
      placesWithMarkers.push(place);
    });
    
    // Replace the objects in allPlaces with the new Place objects.
    self.allPlaces(placesWithMarkers);

    // TODO: When the map is finished loading, do something
    google.maps.event.addListenerOnce(self.map, 'idle', function() {
      console.log('map is done loading!');
      //$('#map').focus();
    });
  }

  // When the user changes the searchString, map over allPlaces.
  // If the new searchString is a subtring of a given place's name, show that
  // place's map marker.  Otherwise, hide that place's map marker, and if that
  // place is the selectedPlace, deselect that place.
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

  // This method runs whenever a Place object is selected.
  // A Place object can be selected by either clicking on its map marker or by
  // clicking on its corresponding <li> element in the search menu.
  self.selectPlace = function(place) {

    // If the yelp data for this Place hasn't been retrieved, request it
    if (!place.yelpDataReceived) { getYelpData(place) }

    // If another Place is currently selected, close its info window and set
    // the given Place as the selectedPlace
    if (self.selectedPlace()) { self.selectedPlace().marker.infowindow.close() }
    self.selectedPlace(place);

    // Animate the given Place's map marker
    animateMarkerBounce(place.marker);

    // Open the given Place's map marker
    place.marker.infowindow.open(self.map, place.marker);
  };

  // Deselect the given Place.
  // The current selected Place gets deselected whenever its info window is
  // closed, or if the user enters a search string in the search menu that
  // isn't a substring of the selected Place's name.
  self.deselectPlace = function(place) {
    // TODO: Decide of the following code is necessary.  IF NOT, remove 'place'
    // argument above and in all calls of this function.
    //
    //if (place && self.selectedPlace() === place) {
      //place.marker.infowindow.close();
      //self.selectedPlace(null);
    //}
    self.selectedPlace().marker.infowindow.close();
    self.selectedPlace(null);
  };
}

/* Kickoff the app */
var app = { vm: new AppViewModel() };
ko.applyBindings(app.vm);
