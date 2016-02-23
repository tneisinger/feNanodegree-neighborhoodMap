function selectZoomLevel(){return window.innerWidth<600?13:window.innerWidth<1500?14:15}function AppViewModel(){var a=this;a.map=null,a.isSearchMenuOpen=ko.observable(!1),a.searchString=ko.observable(""),a.selectedPlace=ko.observable(null),a.allPlaces=ko.observableArray(placesData.map(function(a){return new Place(a)})),a.allPlaces.sort(function(a,b){return a.name<b.name?-1:a.name>b.name?1:0}),a.visiblePlaces=ko.computed(function(){return ko.utils.arrayFilter(a.allPlaces(),function(a){return a.marker?a.marker.getVisible():!0})}),a.initMap=function(){a.map=new google.maps.Map(document.getElementById("map"),{center:MAP_CENTER,zoom:MAP_ZOOM_LEVEL,disableDefaultUI:!0}),a.map.setOptions({styles:[{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}]});var b=a.allPlaces(),c=[];b.forEach(function(b){b.marker=new google.maps.Marker({position:b.location,title:b.name,map:a.map,infowindow:new google.maps.InfoWindow({content:b.makeInfoWindowHTML(),pixelOffset:new google.maps.Size(-1,20)})}),b.marker.addListener("click",function(){a.selectPlace(b)}),b.marker.infowindow.addListener("closeclick",function(){a.deselectPlace(),b.yelpDataReceived||b.marker.infowindow.setContent(b.makeInfoWindowHTML())}),b.marker.infowindow.addListener("domready",function(){b.yelpDataReceived||ko.applyBindings(app.vm,document.getElementById("iw-"+b.yelpID));var a=$(".gm-style-iw"),c=a.prev();c.children(":nth-child(2)").css({display:"none"}),c.children(":nth-child(4)").css({display:"none"}),c.children(":nth-child(3)").find("div").children().css({top:"-4px","z-index":"1"}),a.parent().css({"pointer-events":"none"});var d=a.next();d.css({opacity:"1",right:"57px",top:"22px",border:"2px solid #13729f","border-radius":"5px","pointer-events":"auto"}),d.mouseout(function(){$(this).css({opacity:"1"})});var e=d.next();e.css({right:"45px",top:"15px","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none","-webkit-tap-highlight-color":"rgba(255, 255, 255, 0)","pointer-events":"auto"})}),c.push(b)}),a.allPlaces(c),google.maps.event.addListenerOnce(a.map,"tilesloaded",function(){a.fadeInHamburgerBtn()}),a.map.addListener("click",function(){a.isSearchMenuOpen()&&a.closeSearchMenu()})},a.mapError=function(){var a=$("#map-error-div");a.fadeIn(function(){a.removeClass("hidden")}),console.log("An error occured while trying to load the Google Maps API")},a.fadeInHamburgerBtn=function(){var a=$(".hamburger-btn");setTimeout(function(){a.fadeIn("slow",function(){a.removeClass("hidden")})},500)},a.openSearchMenu=function(){a.isSearchMenuOpen(!0)},a.closeSearchMenu=function(){a.isSearchMenuOpen(!1),$(".search-menu input").blur()},a.onSearchChange=function(){a.allPlaces(ko.utils.arrayMap(a.allPlaces(),function(b){return isSubstring(a.searchString(),b.name)?b.marker.setVisible(!0):(b.marker.setVisible(!1),b===a.selectedPlace()&&a.deselectPlace()),b}))},a.clearSearchString=function(){a.searchString(""),a.onSearchChange()},a.selectPlace=function(b){return a.selectedPlace()===b?void b.animateMarkerBounce():(b.yelpDataReceived||a.requestYelpData(b),a.selectedPlace()&&a.deselectPlace(),a.selectedPlace(b),a.isSearchMenuOpen(!1),b.animateMarkerBounce(),void b.marker.infowindow.open(a.map,b.marker))},a.deselectPlace=function(){a.selectedPlace()&&a.selectedPlace().marker.infowindow.close(),a.selectedPlace(null)},a.requestYelpData=function(b){var c={oauth_consumer_key:YELP_CONSUMER_KEY,oauth_token:YELP_TOKEN,oauth_nonce:Math.floor(1e12*Math.random()).toString(),oauth_signature_method:"HMAC-SHA1",oauth_timestamp:Math.floor(Date.now()/1e3),callback:"cb"},d=YELP_URL+b.yelpID,e=oauthSignature.generate("GET",d,c,YELP_CONSUMER_SECRET,YELP_TOKEN_SECRET);c.oauth_signature=e;var f={url:d,data:c,cache:!0,dataType:"jsonp",jsonpCallback:"cb",success:function(c){b.yelpDataReceived=!0,b.storeYelpData(c),a.selectedPlace(b),b.fadeInYelpInfoDiv()},error:function(a){console.log("Yelp Business API ajax request error:",a),b.fadeInYelpErrorDiv()}};$.ajax(f)}}var MAP_CENTER={lat:34.027,lng:-118.401},MAP_ZOOM_LEVEL=selectZoomLevel(),YELP_URL="https://api.yelp.com/v2/business/",YELP_CONSUMER_KEY="GbivRhbPwg0gh-ti0WxOzw",YELP_CONSUMER_SECRET="Pd6KFyeX_hMAL2c5prD--cn--9Q",YELP_TOKEN="IUGGqvuWCnEZz4Fx12Fik9la9Wb17jgI",YELP_TOKEN_SECRET="XnxVSRkveoNhJp8jEjihFYo64h4",USER_ON_MOBILE=Boolean(navigator.userAgent.match(/Mobi/)),isSubstring=function(a,b){return b.toLowerCase().indexOf(a.toLowerCase())>-1},placesData=[{name:"Versailles",yelpID:"versailles-restaurant-los-angeles",location:{lat:34.0210938,lng:-118.4036178},address:{street:"10319 Venice Blvd",city:"Los Angeles, CA 90034"}},{name:"Ugly Roll Sushi",yelpID:"ugly-roll-sushi-los-angeles",location:{lat:34.0193032,lng:-118.421074},address:{street:"11128 Palms Blvd",city:"Los Angeles, CA 90034"}},{name:"Tara's Himalayan Cuisine",yelpID:"taras-himalayan-cuisine-los-angeles",location:{lat:34.0170293,lng:-118.4105646},address:{street:"10855 Venice Blvd",city:"Los Angeles, CA 90034"}},{name:"Father's Office",yelpID:"fathers-office-los-angeles",location:{lat:34.0303965,lng:-118.3847834},address:{street:"10319 Venice Blvd",city:"Los Angeles, CA 90034"}},{name:"Public School 310",yelpID:"public-school-310-culver-city-2",location:{lat:34.0243015,lng:-118.3944333},address:{street:"9411 Culver Blvd",city:"Culver City, CA 90232"}},{name:"S & W Country Diner",yelpID:"s-and-w-country-diner-culver-city",location:{lat:34.02201069999999,lng:-118.3965204},address:{street:"9748 Washington Blvd",city:"Culver City, CA 90232"}},{name:"Pinches Tacos",yelpID:"pinches-tacos-culver-city",location:{lat:34.0301895,lng:-118.3831161},address:{street:"8665 Washington Blvd",city:"Culver City, CA 90232"}},{name:"The Jerk Spot",yelpID:"the-jerk-spot-culver-city",location:{lat:34.0274507,lng:-118.3908833},address:{street:"9006 Venice Blvd",city:"Culver City, CA 90232"}},{name:"Campos Tacos",yelpID:"campos-tacos-los-angeles",location:{lat:34.0377103,lng:-118.388866},address:{street:"2639 S Robertson Blvd",city:"Los Angeles, CA 90034"}},{name:"Overland Cafe",yelpID:"the-overland-los-angeles",location:{lat:34.0222854,lng:-118.410024},address:{street:"3601 Overland Ave",city:"Los Angeles, CA 90034"}},{name:"K & A Canton Restaurant",yelpID:"k-and-a-canton-restaurant-los-angeles",location:{lat:34.0308305,lng:-118.4008722},address:{street:"9840 National Blvd",city:"Los Angeles, CA 90034"}}],Place=function(a,b){var c=this;c.name=a.name,c.yelpID=a.yelpID,c.location=a.location,c.address=a.address,c.yelpDataReceived=!1,c.getAddress=function(){return c.address.street+", "+c.address.city},c.makeInfoWindowHTML=function(){var a='       <div id="iw-{yelpID}" class="iw-container" data-bind="with: selectedPlace">         <div class="iw-header">           <h2 class="iw-title">{name}</h2>         </div>         <div class="iw-content">           <div class="sk-fading-circle">             <div class="sk-circle1 sk-circle"></div>             <div class="sk-circle2 sk-circle"></div>             <div class="sk-circle3 sk-circle"></div>             <div class="sk-circle4 sk-circle"></div>             <div class="sk-circle5 sk-circle"></div>             <div class="sk-circle6 sk-circle"></div>             <div class="sk-circle7 sk-circle"></div>             <div class="sk-circle8 sk-circle"></div>             <div class="sk-circle9 sk-circle"></div>             <div class="sk-circle10 sk-circle"></div>             <div class="sk-circle11 sk-circle"></div>             <div class="sk-circle12 sk-circle"></div>           </div>           <div class="yelp-info hidden" data-bind="if: yelpDataReceived">             <div class="snippet-and-img-div">              <div class="yelp-snippet-div">                <p class="yelp-snippet" data-bind="text: yelpData.snippet"></p>              </div>              <div class="yelp-img-div">                <img class="yelp-img" data-bind="attr: { src: yelpData.imageUrl }">              </div>            </div>            <table>              <tbody>                <tr>                  <td>                    <img class="yelp-rating-img" data-bind="attr: { src: yelpData.ratingImgUrl }">                  </td>                  <td class="review-count" data-bind="text: yelpData.reviewCount"></td>                </tr>                <tr>                  <td data-bind="text: yelpData.displayPhone"></td>                  <td>                    <a data-bind="attr: { href: yelpData.yelpUrl }">View on Yelp</a>                </tr>              </tbody>            </table>          </div>           <div class="yelp-error hidden">               <p class="yelp-error-emoticon">: (</p>               <p class="yelp-error-message">                 Unable to retrieve Yelp data. Please try again later.               </p>           </div>         </div>         <div class="iw-bottom-gradient">         </div>       </div>';return a.replace("{yelpID}",c.yelpID).replace("{name}",c.name)},c.fadeInYelpInfoDiv=function(a){var b=$("#iw-"+c.yelpID+" .yelp-info");c.fadeOutSpinner(300),b.delay(400).fadeIn("slow",function(){b.removeClass("hidden")})},c.fadeInYelpErrorDiv=function(a){var b=$("#iw-"+c.yelpID+" .yelp-error");c.fadeOutSpinner(300),b.delay(400).fadeIn("slow",function(){b.removeClass("hidden")})},c.storeYelpData=function(a){var b=a.display_phone.substring(3);c.yelpData={snippet:a.snippet_text,imageUrl:a.image_url,ratingImgUrl:a.rating_img_url,reviewCount:a.review_count+" Reviews",displayPhone:b,yelpUrl:USER_ON_MOBILE?a.mobile_url:a.url}},c.fadeOutSpinner=function(a){var b=$("#iw-"+c.yelpID+" .sk-fading-circle");b.fadeOut(a,function(){b.addClass("hidden")})},c.animateMarkerBounce=function(){c.marker.getAnimation()||(c.marker.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){c.marker.setAnimation(null)},700))}},app={vm:new AppViewModel};ko.applyBindings(app.vm);