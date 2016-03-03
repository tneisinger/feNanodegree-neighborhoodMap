/* jshint multistr: true */

/* =============== CONSTANTS =============== */

var MAP_CENTER = {lat:34.027, lng: -118.401};

var MAP_ZOOM_LEVEL = selectZoomLevel();

// Yelp API constants
var YELP_URL = 'https://api.yelp.com/v2/business/';
var YELP_CONSUMER_KEY = 'GbivRhbPwg0gh-ti0WxOzw';
var YELP_CONSUMER_SECRET = 'Pd6KFyeX_hMAL2c5prD--cn--9Q';
var YELP_TOKEN = 'IUGGqvuWCnEZz4Fx12Fik9la9Wb17jgI';
var YELP_TOKEN_SECRET = 'XnxVSRkveoNhJp8jEjihFYo64h4';

// Determine if the user is on a mobile device
var USER_ON_MOBILE = Boolean(navigator.userAgent.match(/Mobi/));


/* =============== GENERAL FUNCTIONS =============== */

// Check if the first string is a substring of the second.
var isSubstring = function(substring, string) {
  return string.toLowerCase().indexOf(substring.toLowerCase()) > -1;
};

// Return the appropriate map zoom level based on the screen width
function selectZoomLevel() {
  if (window.innerWidth < 600) { return 13; }
  if (window.innerWidth < 1500) { return 14; }
  return 15;
}

/* =============== RAW DATA FOR DEFAULT PLACES =============== */

var placesData = [
  {
    name: 'Versailles',
    yelpID: 'versailles-restaurant-los-angeles',
    location: {'lat': 34.0210938, 'lng': -118.4036178},
    address: {street: '10319 Venice Blvd', city: 'Los Angeles, CA 90034'}
  }, {
    name: 'Ugly Roll Sushi',
    yelpID: 'ugly-roll-sushi-los-angeles',
    location: {'lat' : 34.0193032, 'lng' : -118.421074},
    address: {street: '11128 Palms Blvd', city: 'Los Angeles, CA 90034'}
  }, {
    name: 'Tara\'s Himalayan Cuisine',
    yelpID: 'taras-himalayan-cuisine-los-angeles',
    location : {'lat': 34.0170293, 'lng' : -118.4105646},
    address: {street: '10855 Venice Blvd', city: 'Los Angeles, CA 90034'}
  }, {
    name: 'Father\'s Office',
    yelpID: 'fathers-office-los-angeles',
    location: {'lat': 34.0303965, 'lng': -118.3847834},
    address: {street: '10319 Venice Blvd', city: 'Los Angeles, CA 90034'}
  }, {
    name: 'Public School 310',
    yelpID: 'public-school-310-culver-city-2',
    location: {'lat': 34.0243015, 'lng': -118.3944333},
    address: {street: '9411 Culver Blvd', city: 'Culver City, CA 90232'}
  }, {
    name: 'S & W Country Diner',
    yelpID: 's-and-w-country-diner-culver-city',
    location: {'lat': 34.02201069999999, 'lng': -118.3965204},
    address: {street: '9748 Washington Blvd', city: 'Culver City, CA 90232'}
  }, {
    name: 'Pinches Tacos',
    yelpID: 'pinches-tacos-culver-city',
    location: {'lat': 34.0301895, 'lng': -118.3831161},
    address: {street: '8665 Washington Blvd', city: 'Culver City, CA 90232'}
  }, {
    name: 'The Jerk Spot',
    yelpID: 'the-jerk-spot-culver-city',
    location: {'lat': 34.0274507, 'lng': -118.3908833},
    address: {street: '9006 Venice Blvd', city: 'Culver City, CA 90232'}
  }, {
    name: 'Campos Tacos',
    yelpID: 'campos-tacos-los-angeles',
    location: {'lat': 34.0377103, 'lng': -118.388866},
    address: {street: '2639 S Robertson Blvd', city: 'Los Angeles, CA 90034'}
  }, {
    name: 'Overland Cafe',
    yelpID: 'the-overland-los-angeles',
    location: {'lat': 34.0222854, 'lng': -118.410024},
    address: {street: '3601 Overland Ave', city: 'Los Angeles, CA 90034'}
  }, {
    name: 'K & A Canton Restaurant',
    yelpID: 'k-and-a-canton-restaurant-los-angeles',
    location: {'lat': 34.0308305, 'lng': -118.4008722},
    address: {street: '9840 National Blvd', city: 'Los Angeles, CA 90034'}
  }
];


/* =============== PLACE OBJECT CONSTRUCTOR =============== */
var Place = function(placeData, map) {
  var self = this;

  /* ATTRIBUTES */

  self.name = placeData.name;
  self.yelpID = placeData.yelpID;
  self.location = placeData.location;
  self.address = placeData.address;
  self.yelpDataReceived = false;
  self.ajaxResponseReceived = false;

  /* METHODS */

  // Return the full address, with the street and city separated by a comma
  self.getAddress = function() {
    return self.address.street + ', ' + self.address.city;
  };

  // Make and return the initial html for the info window
  self.makeInfoWindowHTML = function() {

    // Get the html template for the info windows from index.html
    var html = $('#iw-content-template').html();

    // Replace '{yelpID}' and '{name}' with the yelpID and name of this Place
    return html
      .replace('{yelpID}', self.yelpID)
      .replace('{name}', self.name);
  };

  self.fadeInYelpInfoDiv = function(yelpData) {
    // Select this Place's yelp-info div in the DOM
    var $yelpInfoDiv = $('#iw-' + self.yelpID + ' .yelp-info');

    // Fade out the spinner and fade in the .yelp-info div
    //self.fadeOutSpinner(300);
    $yelpInfoDiv.delay(400).fadeIn('slow', function() {
      $yelpInfoDiv.removeClass('hidden');
    });
  };

  self.fadeInYelpErrorDiv = function(yelpData) {
    // Select this Place's yelp-error div in the DOM
    var $yelpErrorDiv = $('#iw-' + self.yelpID + ' .yelp-error');

    // Fade out the spinner and fade in the .yelp-error div
    self.fadeOutSpinner(300);
    $yelpErrorDiv.delay(400).fadeIn('slow', function() {
      $yelpErrorDiv.removeClass('hidden');
    });
  };

  // Given a yelpData object returned from the yelp Business API,
  // store the necessary data in this Place.
  self.storeYelpData = function(yelpData) {

    // Remove country code from phone number
    var phoneNumber = yelpData.display_phone.substring(3);

    // Store the data
    self.yelpData = {
      snippet: yelpData.snippet_text,
      imageUrl: yelpData.image_url,
      ratingImgUrl: yelpData.rating_img_url,
      reviewCount: yelpData.review_count + ' Reviews',
      displayPhone: phoneNumber,
      yelpUrl: USER_ON_MOBILE ? yelpData.mobile_url : yelpData.url
    };
  };

  // Fade out the spinner that is inside this Place's InfoWindow
  self.fadeOutSpinner = function(speed) {
    //var $spinnerDiv = $('#iw-' + self.yelpID + ' .sk-fading-circle');
    //$spinnerDiv.fadeOut(speed, function() {
      //$spinnerDiv.addClass('hidden');
    //});
  };

  // Animate this Place's map marker to bounce one time.
  self.animateMarkerBounce = function() {
    if (!self.marker.getAnimation()) {
      self.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() { self.marker.setAnimation(null); }, 700);
    }
  };

};


/* =============== APP VIEWMODEL =============== */
function AppViewModel() {
  var self = this;

  // For now, set the map to null.  The real map will be assigned when the
  // initMap callback is called by the Google Maps api.
  self.map = null;

  // An observable that determines if the hamburger Button is visible or not.
  // When this observable gets set to true, the button will fade in using css
  // transitions.
  self.hamburgerBtnVisible = ko.observable(false);

  // An observable that determines if the google maps error message is visible
  // or not.  When this observable gets set tot true, the error message will
  // fade in using css transitions.
  self.mapErrMsgVisible = ko.observable(false);

  // An observable that determines whether the search menu is open or not.
  // This observable has no effect when the app is running on a device with
  // a screen wider than 1000px, because in that case, the search menu is
  // always open. Check css/main.css for details.
  self.isSearchMenuOpen = ko.observable(false);

  // searchSring is the value inside the input element at the top of the search-menu
  self.searchString = ko.observable('');

  self.searchInputHasFocus = ko.observable(false);

  // selectedPlace is the Place Object that has been selected by the user.  The
  // selectedPlace will have an open InfoWindow and be highlighted in the
  // search menu.
  self.selectedPlace = ko.observable(null);

  // Convert each object in placesData to a Place object and store all of them
  // in an observable array.
  self.allPlaces = ko.observableArray(placesData.map(function(data) {
    return new Place(data);
  }));

  // Sort the Places alphabetically by name
  self.allPlaces.sort(function (a, b) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  });

  // A ko.computed Array of all the Place objects whose map markers are visible on the map
  self.visiblePlaces = ko.computed(function() {
    return ko.utils.arrayFilter(self.allPlaces(), function(place) {
      // If a Place's marker hasn't been defined yet, consider it visible.
      if (!place.marker) { return true; }
      return place.marker.getVisible();
    });
  });

  // This method is the callback for the google maps api.
  // It defines the map, map markers, and sets up the info windows
  self.initMap = function() {

    // Create the map
    self.map = new google.maps.Map(document.getElementById('map'), {
      center: MAP_CENTER,
      zoom: MAP_ZOOM_LEVEL,
      disableDefaultUI: true
    });

    // Remove google 'point of interest' elements from the map
    self.map.setOptions({
      styles: [{
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [{"visibility": "off"}]
      }]
    });

    // Get all the Place objects
    var places = self.allPlaces();

    // Create a temporary array for storing the updated Place objects
    var placesWithMarkers = [];

    places.forEach(function(place) {

      // Give each Place object a map marker and an info window
      place.marker = new google.maps.Marker({
        position: place.location,
        title: place.name,
        map: self.map,
        infowindow: new google.maps.InfoWindow({
          content: place.makeInfoWindowHTML(),

          // Adjust the offset so that the info window tail touches the center of marker
          pixelOffset: new google.maps.Size(-1, 20)
        })
      });

      // If a map marker is clicked, select the corresponding Place.
      place.marker.addListener('click', function() { self.selectPlace(place); });

      // When closing an info window, deselect the corresponding Place and
      // if no yelpData was received, reset the info window content.
      place.marker.infowindow.addListener('closeclick', function() {
        self.deselectPlace();
        // If a yelp ajax request fails, an error message will appear in the
        // selected Place's info window.  That error message will remain in the
        // info window unless the setContent method is called on it.  In order
        // for the Info Window to behave correctly the next time it is opened,
        // its content must be reset to the initial value with the
        // makeInfoWindowHTML method.
        if (!place.yelpDataReceived) {
          place.marker.infowindow.setContent(place.makeInfoWindowHTML());
        }
      });

      // Change the default appearance of info windows. Code inspired by:
      // http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
      place.marker.infowindow.addListener('domready', function() {

        // If the yelp data for this Place has not been received, that means
        // that either this info window is being opened for the first time, or
        // that its content was reset when it was last closed.  In both of
        // those cases, it is necessary to applyBindings to the info window
        // html.  If the yelpData has been received, then the bindings
        // have already been applied. Applying them again would cause an error.
        // See the definition for the 'closeclick' info window listener above
        // for more details.
        if (!place.yelpDataReceived) {
          ko.applyBindings(self, document.getElementById('iw-' + place.yelpID));
        }

        // Hide certain ugly divs that are generated by the google maps API
        var iwOuter = $('.gm-style-iw');
        var iwBackground = iwOuter.prev();
        iwBackground.children(':nth-child(2)').css({'display': 'none'});
        iwBackground.children(':nth-child(4)').css({'display': 'none'});

        // Move the tail of the info window to be on top of the main info window div
        iwBackground.children(':nth-child(3)').find('div').children().css({
          top: '-4px',
          'z-index': '1'
        });

       // The parent divs of all '.gm-style-iw' divs are a bit wider and taller
       // than the visible part of the info windows, and will block clicks or
       // touches onto the underlying map.  To fix this, set these divs to
       // 'pointer-events: none'.  (NOTE: This change will propagate down to
       // children, so be sure to reset any children that should be clickable
       // to 'pointer-events: auto'.)
        iwOuter.parent().css({'pointer-events': 'none'});

        // Get a reference to the close button of the info window
        var iwCloseBtn = iwOuter.next();

        // Move and style the close button
        iwCloseBtn.css({
          opacity: '1',
          right: '57px', top: '22px',
          border: '2px solid #13729f',
          'border-radius': '5px',
          // Make sure that the close button is clickable
          'pointer-events': 'auto'
        });

        // The google maps API automatically applies 0.7 opacity to the button
        // after the mouseout event.  This function reverses this event to the
        // desired value.
        iwCloseBtn.mouseout(function(){
          $(this).css({opacity: '1'});
        });

        // Get a reference to the transparent image which functions as the
        // trigger for the close event
        var iwCloseTransparent = iwCloseBtn.next();

        // Move the transparent image to cover the close button
        iwCloseTransparent.css({
          right: '45px',
          top: '15px',

          // The following css rules prevent the transparent image from being
          // highlighted in blue when clicked, making it visible for a brief
          // moment in chrome for android.  Without these rules, the blue
          // highlighting will occur whenever an info window's close button is
          // tapped.
          '-webkit-touch-callout': 'none',
          '-webkit-user-select': 'none',
          '-khtml-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none',
          // Below is the rule that definitely removed the blue square
          '-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)',

          // Make sure that this transparent div is clickable, since a parent
          // of this element was set to 'point-events: none'.
          'pointer-events': 'auto'
        });
      });

      // Append this Place object to the temporary array
      placesWithMarkers.push(place);
    });

    // Replace the objects in allPlaces with the new Place objects.
    self.allPlaces(placesWithMarkers);

    // When the map is finished loading, fade in the hamburger button
    google.maps.event.addListenerOnce(self.map, 'tilesloaded', function() {
      self.hamburgerBtnVisible(true);
    });

    // If the map is clicked while the seach menu is open, close the menu
    self.map.addListener('click', function() {
      if (self.isSearchMenuOpen()) {
        self.closeSearchMenu();
      }
    });
  };

  self.closeSearchMenu = function() {
    self.isSearchMenuOpen(false);
    // For mobile, you must remove focus from the input element when closing the
    // search menu.  If not, the keyboard on mobile devices will constantly pop
    // up whenever the user interacts with the map.
    self.searchInputHasFocus(false);
  };

  // When the user changes the searchString, map over allPlaces.  If the new
  // searchString is a subtring of a given place's name, show that place's map
  // marker.  Otherwise, hide that place's map marker.  If the selectedPlace's
  // name does not match the search string, deselect it.
  self.onSearchChange = function() {
    self.allPlaces(ko.utils.arrayMap(self.allPlaces(), function(place) {
      if (isSubstring(self.searchString(), place.name)) {
        place.marker.setVisible(true);
      } else {
        place.marker.setVisible(false);
        if (place === self.selectedPlace()) {
          self.deselectPlace();
        }
      }
      return place;
    }));
  };

  // Clear the input field in the search menu
  self.clearSearchString = function() {
    self.searchString('');
    self.onSearchChange();
  };

  // Select the given Place.  A Place can be selected by clicking on its map
  // marker or by clicking on its <li> element in the search menu.
  self.selectPlace = function(place) {

    // If the given place is already selected, bounce the map marker but do
    // nothing else.
    if (self.selectedPlace() === place) {
      place.animateMarkerBounce();
      return;
    }

    // If the yelp data for this Place hasn't been received, request it
    if (!place.yelpDataReceived) { self.requestYelpData(place); }

    // If another Place is currently selected, deselect it
    if (self.selectedPlace()) { self.deselectPlace(); }

    // Set the given Place as the selectedPlace
    self.selectedPlace(place);

    // On devices with screens smaller than 1000px, close the search menu if
    // it is open.  The search menu never closes on devices with screens wider
    // than 1000px.  See css/main.css for details.
    self.isSearchMenuOpen(false);

    // Bounce the map marker and open the info window.
    place.animateMarkerBounce();
    place.marker.infowindow.open(self.map, place.marker);
  };

  // Close the selectedPlace's info window and set the selectedPlace to null.
  self.deselectPlace = function() {
    if (self.selectedPlace()) {
      self.selectedPlace().marker.infowindow.close();
    }
    self.selectedPlace(null);
  };

  self.requestYelpData = function(place) {

    var parameters = {
          oauth_consumer_key: YELP_CONSUMER_KEY,
          oauth_token: YELP_TOKEN,
          oauth_nonce: (Math.floor(Math.random() * 1e12).toString()),
          oauth_signature_method: 'HMAC-SHA1',
          oauth_timestamp: Math.floor(Date.now()/1000),
          callback: 'cb'
        };

    var url = YELP_URL + place.yelpID;
    var signature = oauthSignature.generate('GET', url, parameters,
        YELP_CONSUMER_SECRET, YELP_TOKEN_SECRET);

    parameters.oauth_signature = signature;

    var settings = {
      url: url,
      data: parameters,
      cache: true,
      dataType: 'jsonp',
      jsonpCallback: 'cb',
      success: function(yelpData) {
        place.ajaxResponseReceived = true;
        place.yelpDataReceived = true;
        place.storeYelpData(yelpData);
        self.selectedPlace(place);
        //place.fadeInYelpInfoDiv();
      },
      error: function(error) {
        place.ajaxResponseReceived = true;
        console.log('Yelp Business API ajax request error:', error);
        self.selectedPlace(place);
        //place.fadeInYelpErrorDiv();
      }
    };

    $.ajax(settings);
  };

}

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value));
        // Because we are toggling the display of the element, we have to delay
        // the fade to keep the display change from cancelling the fade.
        // With this setTimeout, there will be no fade.
        setTimeout(function() {
          ko.unwrap(value) ? $(element).addClass('fade-in') : $(element).removeClass('fade-in');
        }, 10);
    }
};

// Start the app
var app = { vm: new AppViewModel() };
ko.applyBindings(app.vm);
