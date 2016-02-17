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
  self.marker = {map: map};
  self.address = placeData.address;
  self.yelpDataRecieved = false;

  /* METHODS */

  // Return the full address, with the street and city separated by a comma
  self.getAddress = function() {
    return self.address.street + ', ' + self.address.city;
  };

  // Make and return the initial html for the info window
  self.makeInfoWindowHTML = function() {
    // 'sk-fading-circle' spinner code found at:
    // http://tobiasahlin.com/spinkit/
    var html = ' \
      <div id="iw-{self.yelpID}" class="iw-container"> \
        <div class="iw-header"> \
          <h2 class="iw-title"> \
            {self.name} \
          </h2> \
        </div> \
        <div class="iw-content"> \
          <div class="sk-fading-circle"> \
            <div class="sk-circle1 sk-circle"></div> \
            <div class="sk-circle2 sk-circle"></div> \
            <div class="sk-circle3 sk-circle"></div> \
            <div class="sk-circle4 sk-circle"></div> \
            <div class="sk-circle5 sk-circle"></div> \
            <div class="sk-circle6 sk-circle"></div> \
            <div class="sk-circle7 sk-circle"></div> \
            <div class="sk-circle8 sk-circle"></div> \
            <div class="sk-circle9 sk-circle"></div> \
            <div class="sk-circle10 sk-circle"></div> \
            <div class="sk-circle11 sk-circle"></div> \
            <div class="sk-circle12 sk-circle"></div> \
          </div> \
          <div class="yelp-info hidden"> \
          </div> \
        </div> \
        <div class="iw-bottom-gradient"> \
        </div> \
      </div>';

    return html
      .replace('{self.yelpID}', self.yelpID)
      .replace('{self.name}', self.name);
  };

  // Make an ajax request to the yelp business api about this Place
  self.requestYelpData = function() {

    var parameters = {
          oauth_consumer_key: YELP_CONSUMER_KEY,
          oauth_token: YELP_TOKEN,
          oauth_nonce: (Math.floor(Math.random() * 1e12).toString()),
          oauth_signature_method: 'HMAC-SHA1',
          oauth_timestamp: Math.floor(Date.now()/1000),
          callback: 'cb'
        };

    var url = YELP_URL + self.yelpID;
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
        self.yelpDataReceived = true;
        self.fillYelpInfoDiv(yelpData);
      },
      error: function(error) {
        console.log('Yelp Business API ajax request error:', error);
        self.fillYelpInfoDivErr(error);
      }
    };

    $.ajax(settings);
  };

  // Fill in the yelp-info div of the this Place's info window with data
  // returned from a yelp business api request.
  self.fillYelpInfoDiv = function(yelpData) {
    // Select this Place's yelp-info div in the DOM
    var $yelpInfoDiv = $('#iw-' + self.yelpID + ' .yelp-info');

    // Make the html and append it to the yelp-info div
    var html = self.makeYelpHTML(yelpData);
    $yelpInfoDiv.append(html);

    // Once the main yelp image has loaded, fade in the yelp-info div
    $(html).find('.yelp-img').on('load', function() {
      self.fadeOutSpinner(300);
      $yelpInfoDiv.delay(400).fadeIn('slow', function() {
        $yelpInfoDiv.removeClass('hidden');
      });
    });

  };

  // Fill in the yelp-info div of the this Place's info window with an error
  // message.
  self.fillYelpInfoDivErr = function(error) {
    // Select this Place's yelp-info div in the DOM
    var $yelpInfoDiv = $('#iw-' + self.yelpID + ' .yelp-info');

    var html = ' \
      <div class="yelp-error"> \
          <p class="yelp-error-emoticon">: (</p> \
          <p class="yelp-error-message"> \
            Unable to retrieve Yelp data. Please try again later. \
          </p> \
      </div> \
    ';

    $yelpInfoDiv.append(html);
    self.fadeOutSpinner(300);
    $yelpInfoDiv.delay(400).fadeIn('slow', function() {$yelpInfoDiv.removeClass('hidden'); });
  };

  // Given a JSON object of data returned from a yelp business API request,
  // return the html that will be used in the info window's 'yelp-info' div.
  self.makeYelpHTML = function(yelpData) {

    // Create an html template that will be filled in with yelp the data.
    var html = ' \
      <div class="snippet-and-img-div"> \
        <div class="yelp-snippet-div"> \
          <p class="yelp-snippet">"{snippet_text}"</p> \
        </div> \
        <div class="yelp-img-div"> \
          <img class="yelp-img" src="{image_url}" /> \
        </div> \
      </div> \
      <table> \
        <tbody> \
          <tr> \
            <td><img class="yelp-rating-img" src="{rating_img_url}"></td> \
            <td class="review-count">{review_count} Reviews</td> \
          </tr> \
          <tr> \
            <td>{display_phone}</td> \
            <td><a href="{yelp_url}">View on Yelp</a></td> \
          </tr> \
        </tbody> \
      </table> \
    ';

    // Remove country code from phone number
    var phoneNumber = yelpData.display_phone.substring(3);

    // An object containing the data that will be inserted into the html
    var data = {
      snippet_text: yelpData.snippet_text,
      image_url: yelpData.image_url,
      rating_img_url: yelpData.rating_img_url,
      review_count: yelpData.review_count,
      display_phone: phoneNumber,
      yelp_url: USER_ON_MOBILE ? yelpData.mobile_url : yelpData.url
    };

    // Loop over the `data` object and insert the data into the `html` template
    Object.keys(data).forEach(function(key) {
      html = html.replace('{' + key + '}', data[key]);
    });

    return html;
  };

  // Fade out the spinner that is inside this Place's InfoWindow
  self.fadeOutSpinner = function(speed) {
    var $spinnerDiv = $('#iw-' + self.yelpID + ' .sk-fading-circle');
    $spinnerDiv.fadeOut(speed, function() {
      $spinnerDiv.addClass('hidden');
    });
  };

  // Animate this Place's map marker to bounce one time.
  self.animateMarkerBounce = function() {
    if (!self.marker.getAnimation()) {
      self.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() { self.marker.setAnimation(null); }, 775);
    }
  };

};


/* =============== APP VIEWMODEL =============== */
function AppViewModel() {
  var self = this;

  // For now, set the map to null.  The real map will be assigned when the
  // initMap callback is called by the Google Maps api.
  self.map = null;

  self.isSearchMenuOpen = ko.observable(false);

  // searchSring is the value inside the input element at the top of the search-menu
  self.searchString = ko.observable('');

  // selectedPlace is the Place Object that has been selected by the user.  The
  // selectedPlace will have its InfoWindow open above its marker.
  self.selectedPlace = ko.observable(null);

  // Sort the placesData alphabetically by name
  placesData.sort(function(a, b) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  });

  // Convert each object in placesData to a Place object and store all of them
  // in an observable array.
  self.allPlaces = ko.observableArray(placesData.map(function(data) {
    return new Place(data);
  }));

  // A ko.computed Array of all the Place objects whose map markers are visible on the map
  self.visiblePlaces = ko.computed(function() {
    return ko.utils.arrayFilter(self.allPlaces(), function(place) {
      return place.marker.map === self.map;
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

      place.marker.addListener('click', function() { self.selectPlace(place); });
      place.marker.infowindow.addListener('closeclick', function() {
        self.deselectPlace();

        // If a yelp ajax request fails, an error message will appear in the
        // selected Place's info window.  That error message will remain in the
        // info window until the setContent method is called on it.  In order
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

        // Hide certain ugly divs are that generated by the google maps API
        var iwOuter = $('.gm-style-iw');
        var iwBackground = iwOuter.prev();
        iwBackground.children(':nth-child(2)').css({'display': 'none'});
        iwBackground.children(':nth-child(4)').css({'display': 'none'});

        // Move the tail of the info window to be on top of the main info window
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
      var $hamburgerBtn = $('#hamburger-btn');
      setTimeout(function() {
        $hamburgerBtn.fadeIn('slow', function() {
          $hamburgerBtn.removeClass('hidden');
        });
      }, 500);
    });

    // If the map is clicked while the seach menu is open, close the menu
    self.map.addListener('click', function() {
      if (self.isSearchMenuOpen()) {
        self.closeSearchMenu();
      }
    });
  };

  self.openSearchMenu = function() {
    self.isSearchMenuOpen(true);
  };

  self.closeSearchMenu = function() {
    self.isSearchMenuOpen(false);
    // For mobile, you must remove focus from the input element when closing the
    // search menu.  If not, the keyboard on mobile devices will constantly pop
    // up whenever the user interacts with the map.
    $('#search-menu input').blur();
  };

  // When the user changes the searchString, map over allPlaces.  If the new
  // searchString is a subtring of a given place's name, show that place's map
  // marker.  Otherwise, hide that place's map marker. If the selectedPlace
  // does not match the searchString, deselect it.
  self.onSearchChange = function() {
    self.allPlaces(ko.utils.arrayMap(self.allPlaces(), function(place) {
      if (isSubstring(self.searchString(), place.name)) {
        place.marker.setMap(self.map);
      } else {
        place.marker.setMap(null);
        if (place === self.selectedPlace()) { self.deselectPlace(); }
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

    // If the yelp data for this Place hasn't been retrieved, request it
    if (!place.yelpDataReceived) { place.requestYelpData(); }

    // If another Place is currently selected, deselect it
    if (self.selectedPlace()) { self.deselectPlace(); }

    // Set the given Place as the selectedPlace
    self.selectedPlace(place);

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
}


// Start the app
var app = { vm: new AppViewModel() };
ko.applyBindings(app.vm);
