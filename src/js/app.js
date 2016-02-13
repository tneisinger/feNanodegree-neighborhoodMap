"use strict";

/* Constants */
var MAP_CENTER = {lat:34.027, lng: -118.401}


/* General Utility Functions */

// Return true if the first string is a substring of the second string.
var isSubstring = function(substring, string) {
  return string.toLowerCase().indexOf(substring.toLowerCase()) > -1;
}

// Return true if the user is using a mobile device.
// Code found at: http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
var mobileCheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

// Determine if the user is on a mobile device
var userOnMobileDevice = mobileCheck();

/* Raw data for the places that display on the map by default */
var placesData = [
  {
    name: 'Versailles',
    yelpID: 'versailles-restaurant-los-angeles',
    location: {'lat': 34.0210938, 'lng': -118.4036178},
    address: '10319 Venice Blvd, Los Angeles, CA 90034'
  }, {
    name: 'Ugly Roll Sushi',
    yelpID: 'ugly-roll-sushi-los-angeles',
    location: {'lat' : 34.0193032, 'lng' : -118.421074},
    address: '11128 Palms Blvd, Los Angeles, CA 90034'
  }, {
    name: 'Tara\'s Himalayan Cuisine',
    yelpID: 'taras-himalayan-cuisine-los-angeles',
    location : {'lat': 34.0170293, 'lng' : -118.4105646},
    address: '10855 Venice Blvd, Los Angeles, CA 90034'
  }, {
    name: 'Father\'s Office',
    yelpID: 'fathers-office-los-angeles',
    location: {'lat': 34.0303965, 'lng': -118.3847834},
    address: '10319 Venice Blvd, Los Angeles, CA 90034'
  }, {
    name: 'Public School 310',
    yelpID: 'public-school-310-culver-city-2',
    location: {'lat': 34.0243015, 'lng': -118.3944333},
    address: '9411 Culver Blvd, Culver City, CA 90232'
  }, {
    name: 'S & W Country Diner',
    yelpID: 's-and-w-country-diner-culver-city',
    location: {'lat': 34.02201069999999, 'lng': -118.3965204},
    address: '9748 Washington Blvd, Culver City, CA 90232'
  }, {
    name: 'Pinches Tacos',
    yelpID: 'pinches-tacos-culver-city',
    location: {'lat': 34.0301895, 'lng': -118.3831161},
    address: '8665 Washington Blvd, Culver City, CA 90232'
  }, {
    name: 'The Jerk Spot',
    yelpID: 'the-jerk-spot-culver-city',
    location: {'lat': 34.0274507, 'lng': -118.3908833},
    address: '9006 Venice Blvd, Culver City, CA 90232'
  }, {
    name: 'Campos Tacos',
    yelpID: 'campos-tacos-los-angeles',
    location: {'lat': 34.0377103, 'lng': -118.388866},
    address: '2639 S Robertson Blvd, Los Angeles, CA 90034'
  }, {
    name: 'Overland Cafe',
    yelpID: 'the-overland-los-angeles',
    location: {'lat': 34.0222854, 'lng': -118.410024},
    address: '3601 Overland Ave, Los Angeles, CA 90034'
  }, {
    name: 'K & A Canton Restaurant',
    yelpID: 'k-and-a-canton-restaurant-los-angeles',
    location: {'lat': 34.0308305, 'lng': -118.4008722},
    address: '9840 National Blvd, Los Angeles, CA 90034'
  }
];


/* Constructor for Place objects */
var Place = function(placeData, map) {
  this.name = placeData.name;
  this.yelpID = placeData.yelpID;
  this.location = placeData.location;
  this.marker = {map: map};
  this.address = placeData.address;
  this.yelpDataRecieved = false;
};


/* Info Window Helper Functions */

// Make initial html for the given Place's info window.
var makeInfoWindowHTML = function(place) {
  var html = '<div class="iw-container"><div class="iw-header"><h2 class="iw-title">' +
    place.name + '</h2></div><div class="iw-content"><div class="yelp-info hidden" id="yelp-' +
    place.yelpID + '"></div></div><div class="iw-bottom-gradient"></div></div>'
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
      console.dir(yelpData);
      place.yelpDataReceived = true;
      fillYelpInfoDiv(yelpData, place);
    },
    error: function(error) {
      console.log(error);
    }
  };

  $.ajax(settings);
};

var yelpHTMLtemplate = `
  <div class="snippet-and-img-div">
    <div class="yelp-snippet-div">
      <p class="yelp-snippet">{0}</p>
    </div>
    <div class="yelp-img-div">
      <img class="yelp-img" src="{1}" />
    </div>
  </div>
  <table>
    <tbody>
      <tr>
        <th>Rating:</th>
        <td><img class="yelp-rating-img" src="{2}"></td>
      </tr>
      <tr>
        <th>Phone:</th>
        <td>{3}</td>
      </tr>
    </tbody>
  </table>
`;

var makeYelpHTML = function(yelpData, place) {
  var html = yelpHTMLtemplate;
  var args = [
    yelpData.snippet_text,
    yelpData.image_url,
    yelpData.rating_img_url,
    yelpData.display_phone
  ];
  for (var i = 0; i < args.length; i++) {
    html = html.replace('{' + i + '}', args[i]);
  }
  return html
};

// Fill in the yelp-info div of the given place's info window with data
// returned from a yelp business api request.
var fillYelpInfoDiv = function(yelpData, place) {
  var $yelpInfoDiv = $('#yelp-' + place.yelpID);
  var $html = $(makeYelpHTML(yelpData, place));
  $yelpInfoDiv.append($html);
  $html.find('.yelp-img').on('load', function() { $yelpInfoDiv.fadeIn('slow', function() {
    $yelpInfoDiv.removeClass('hidden')
    place.marker.infowindow.content = $yelpInfoDiv.parent().prop('outerHTML');
  }) });
};

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

// When the map is clicked, hide the search menu
$('#map').click(function(e) {

  // If the click is on an info window close button, don't hide the search menu
  if (e.target.tagName === 'IMG') { return }

  $('#search-menu').removeClass('open');    // Hide search menu
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
        infowindow: new google.maps.InfoWindow({
          content: makeInfoWindowHTML(place),
          // Adjust the offset so that the info window tail ends on top of the marker
          pixelOffset: new google.maps.Size(-1, 20)
        })
      });

      // Add event listeners to markers and info windows
      place.marker.addListener('click', function() { self.selectPlace(place) });
      place.marker.infowindow.addListener('closeclick', function() { self.deselectPlace(place) });

      // Change the default styles for info windows.
      // Code from: http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
      place.marker.infowindow.addListener('domready', function() {
        var iwOuter = $('.gm-style-iw');
        var iwBackground = iwOuter.prev();
        iwBackground.children(':nth-child(2)').css({'display': 'none'});
        iwBackground.children(':nth-child(4)').css({'display': 'none'});

        // Move the tail of the info window on top of the main info window div
        iwBackground.children(':nth-child(3)').find('div').children().css({
          top: '-4px',
          'z-index': '1'
        });

        // Get a reference to the close button
        var iwCloseBtn = iwOuter.next();

        // Get a reference to the transparent image which functions as the
        // close trigger
        var iwCloseTransparent = iwCloseBtn.next();

        // Move and style the close button
        iwCloseBtn.css({
          opacity: '1',
          right: '57px', top: '22px',
          border: '2px solid #13729f',
          'border-radius': '5px'
        });

        // Move the transparent image to cover the close button
        iwCloseTransparent.css({
          right: '45px',
          top: '15px',

          // The following css rules prevent a small transparent blue square
          // from appearing in chrome for android. Without these rules, the
          // blue square will appear whenever an info window's close button is tapped.
          '-webkit-touch-callout': 'none',
          '-webkit-user-select': 'none',
          '-khtml-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none',
          // Below is the rule that definitely removed the blue square
          '-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)'
        });
      });


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

  self.clearSearchString = function() {
    self.searchString('');
    self.onSearchChange();
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
