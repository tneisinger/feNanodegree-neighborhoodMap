function selectZoomLevel(){return window.innerWidth<600?13:window.innerWidth<1500?14:15}function AppViewModel(){var a=this;a.map=null,a.isSearchMenuOpen=ko.observable(!1),a.searchString=ko.observable(""),a.selectedPlace=ko.observable(null),placesData.sort(function(a,b){return a.name<b.name?-1:a.name>b.name?1:0}),a.allPlaces=ko.observableArray(placesData.map(function(a){return new Place(a)})),a.visiblePlaces=ko.computed(function(){return ko.utils.arrayFilter(a.allPlaces(),function(b){return b.marker.map===a.map})}),a.initMap=function(){a.map=new google.maps.Map(document.getElementById("map"),{center:MAP_CENTER,zoom:MAP_ZOOM_LEVEL,disableDefaultUI:!0}),a.map.setOptions({styles:[{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}]});var b=a.allPlaces(),c=[];b.forEach(function(b){b.marker=new google.maps.Marker({position:b.location,title:b.name,map:a.map,infowindow:new google.maps.InfoWindow({content:b.makeInfoWindowHTML(),pixelOffset:new google.maps.Size(-1,20)})}),b.marker.addListener("click",function(){a.selectPlace(b)}),b.marker.infowindow.addListener("closeclick",function(){a.deselectPlace(),b.yelpDataReceived||b.marker.infowindow.setContent(b.makeInfoWindowHTML())}),b.marker.infowindow.addListener("domready",function(){var a=$(".gm-style-iw"),b=a.prev();b.children(":nth-child(2)").css({display:"none"}),b.children(":nth-child(4)").css({display:"none"}),b.children(":nth-child(3)").find("div").children().css({top:"-4px","z-index":"1"}),a.parent().css({"pointer-events":"none"});var c=a.next();c.css({opacity:"1",right:"57px",top:"22px",border:"2px solid #13729f","border-radius":"5px","pointer-events":"auto"}),c.mouseout(function(){$(this).css({opacity:"1"})});var d=c.next();d.css({right:"45px",top:"15px","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none","-webkit-tap-highlight-color":"rgba(255, 255, 255, 0)","pointer-events":"auto"})}),c.push(b)}),a.allPlaces(c),google.maps.event.addListenerOnce(a.map,"tilesloaded",function(){var a=$("#hamburger-btn");setTimeout(function(){a.fadeIn("slow",function(){a.removeClass("hidden")})},500)}),a.map.addListener("click",function(){a.isSearchMenuOpen()&&a.closeSearchMenu()})},a.openSearchMenu=function(){a.isSearchMenuOpen(!0)},a.closeSearchMenu=function(){a.isSearchMenuOpen(!1),$("#search-menu input").blur()},a.onSearchChange=function(){a.allPlaces(ko.utils.arrayMap(a.allPlaces(),function(b){return isSubstring(a.searchString(),b.name)?b.marker.setMap(a.map):(b.marker.setMap(null),b===a.selectedPlace()&&a.deselectPlace()),b}))},a.clearSearchString=function(){a.searchString(""),a.onSearchChange()},a.selectPlace=function(b){return a.selectedPlace()===b?void b.animateMarkerBounce():(b.yelpDataReceived||b.requestYelpData(),a.selectedPlace()&&a.deselectPlace(),a.selectedPlace(b),b.animateMarkerBounce(),void b.marker.infowindow.open(a.map,b.marker))},a.deselectPlace=function(){a.selectedPlace()&&a.selectedPlace().marker.infowindow.close(),a.selectedPlace(null)}}var MAP_CENTER={lat:34.027,lng:-118.401},MAP_ZOOM_LEVEL=selectZoomLevel(),YELP_URL="https://api.yelp.com/v2/business/",YELP_CONSUMER_KEY="GbivRhbPwg0gh-ti0WxOzw",YELP_CONSUMER_SECRET="Pd6KFyeX_hMAL2c5prD--cn--9Q",YELP_TOKEN="IUGGqvuWCnEZz4Fx12Fik9la9Wb17jgI",YELP_TOKEN_SECRET="XnxVSRkveoNhJp8jEjihFYo64h4",USER_ON_MOBILE=Boolean(navigator.userAgent.match(/Mobi/)),isSubstring=function(a,b){return b.toLowerCase().indexOf(a.toLowerCase())>-1},placesData=[{name:"Versailles",yelpID:"versailles-restaurant-los-angeles",location:{lat:34.0210938,lng:-118.4036178},address:{street:"10319 Venice Blvd",city:"Los Angeles, CA 90034"}},{name:"Ugly Roll Sushi",yelpID:"ugly-roll-sushi-los-angeles",location:{lat:34.0193032,lng:-118.421074},address:{street:"11128 Palms Blvd",city:"Los Angeles, CA 90034"}},{name:"Tara's Himalayan Cuisine",yelpID:"taras-himalayan-cuisine-los-angeles",location:{lat:34.0170293,lng:-118.4105646},address:{street:"10855 Venice Blvd",city:"Los Angeles, CA 90034"}},{name:"Father's Office",yelpID:"fathers-office-los-angeles",location:{lat:34.0303965,lng:-118.3847834},address:{street:"10319 Venice Blvd",city:"Los Angeles, CA 90034"}},{name:"Public School 310",yelpID:"public-school-310-culver-city-2",location:{lat:34.0243015,lng:-118.3944333},address:{street:"9411 Culver Blvd",city:"Culver City, CA 90232"}},{name:"S & W Country Diner",yelpID:"s-and-w-country-diner-culver-city",location:{lat:34.02201069999999,lng:-118.3965204},address:{street:"9748 Washington Blvd",city:"Culver City, CA 90232"}},{name:"Pinches Tacos",yelpID:"pinches-tacos-culver-city",location:{lat:34.0301895,lng:-118.3831161},address:{street:"8665 Washington Blvd",city:"Culver City, CA 90232"}},{name:"The Jerk Spot",yelpID:"the-jerk-spot-culver-city",location:{lat:34.0274507,lng:-118.3908833},address:{street:"9006 Venice Blvd",city:"Culver City, CA 90232"}},{name:"Campos Tacos",yelpID:"campos-tacos-los-angeles",location:{lat:34.0377103,lng:-118.388866},address:{street:"2639 S Robertson Blvd",city:"Los Angeles, CA 90034"}},{name:"Overland Cafe",yelpID:"the-overland-los-angeles",location:{lat:34.0222854,lng:-118.410024},address:{street:"3601 Overland Ave",city:"Los Angeles, CA 90034"}},{name:"K & A Canton Restaurant",yelpID:"k-and-a-canton-restaurant-los-angeles",location:{lat:34.0308305,lng:-118.4008722},address:{street:"9840 National Blvd",city:"Los Angeles, CA 90034"}}],Place=function(a,b){var c=this;c.name=a.name,c.yelpID=a.yelpID,c.location=a.location,c.marker={map:b},c.address=a.address,c.yelpDataRecieved=!1,c.getAddress=function(){return c.address.street+", "+c.address.city},c.makeInfoWindowHTML=function(){var a='       <div id="iw-{self.yelpID}" class="iw-container">         <div class="iw-header">           <h2 class="iw-title">             {self.name}           </h2>         </div>         <div class="iw-content">           <div class="sk-fading-circle">             <div class="sk-circle1 sk-circle"></div>             <div class="sk-circle2 sk-circle"></div>             <div class="sk-circle3 sk-circle"></div>             <div class="sk-circle4 sk-circle"></div>             <div class="sk-circle5 sk-circle"></div>             <div class="sk-circle6 sk-circle"></div>             <div class="sk-circle7 sk-circle"></div>             <div class="sk-circle8 sk-circle"></div>             <div class="sk-circle9 sk-circle"></div>             <div class="sk-circle10 sk-circle"></div>             <div class="sk-circle11 sk-circle"></div>             <div class="sk-circle12 sk-circle"></div>           </div>           <div class="yelp-info hidden">           </div>         </div>         <div class="iw-bottom-gradient">         </div>       </div>';return a.replace("{self.yelpID}",c.yelpID).replace("{self.name}",c.name)},c.requestYelpData=function(){var a={oauth_consumer_key:YELP_CONSUMER_KEY,oauth_token:YELP_TOKEN,oauth_nonce:Math.floor(1e12*Math.random()).toString(),oauth_signature_method:"HMAC-SHA1",oauth_timestamp:Math.floor(Date.now()/1e3),callback:"cb"},b=YELP_URL+c.yelpID,d=oauthSignature.generate("GET",b,a,YELP_CONSUMER_SECRET,YELP_TOKEN_SECRET);a.oauth_signature=d;var e={url:b,data:a,cache:!0,dataType:"jsonp",jsonpCallback:"cb",success:function(a){c.yelpDataReceived=!0,c.fillYelpInfoDiv(a)},error:function(a){console.log("Yelp Business API ajax request error:",a),c.fillYelpInfoDivErr(a)}};$.ajax(e)},c.fillYelpInfoDiv=function(a){var b=$("#iw-"+c.yelpID+" .yelp-info"),d=c.makeYelpHTML(a);b.append(d),$(d).find(".yelp-img").on("load",function(){c.fadeOutSpinner(300),b.delay(400).fadeIn("slow",function(){b.removeClass("hidden")})})},c.fillYelpInfoDivErr=function(a){var b=$("#iw-"+c.yelpID+" .yelp-info"),d='       <div class="yelp-error">           <p class="yelp-error-emoticon">: (</p>           <p class="yelp-error-message">             Unable to retrieve Yelp data. Please try again later.           </p>       </div>     ';b.append(d),c.fadeOutSpinner(300),b.delay(400).fadeIn("slow",function(){b.removeClass("hidden")})},c.makeYelpHTML=function(a){var b='       <div class="snippet-and-img-div">         <div class="yelp-snippet-div">           <p class="yelp-snippet">"{snippet_text}"</p>         </div>         <div class="yelp-img-div">           <img class="yelp-img" src="{image_url}" />         </div>       </div>       <table>         <tbody>           <tr>             <td><img class="yelp-rating-img" src="{rating_img_url}"></td>             <td class="review-count">{review_count} Reviews</td>           </tr>           <tr>             <td>{display_phone}</td>             <td><a href="{yelp_url}">View on Yelp</a></td>           </tr>         </tbody>       </table>     ',c=a.display_phone.substring(3),d={snippet_text:a.snippet_text,image_url:a.image_url,rating_img_url:a.rating_img_url,review_count:a.review_count,display_phone:c,yelp_url:USER_ON_MOBILE?a.mobile_url:a.url};return Object.keys(d).forEach(function(a){b=b.replace("{"+a+"}",d[a])}),b},c.fadeOutSpinner=function(a){var b=$("#iw-"+c.yelpID+" .sk-fading-circle");b.fadeOut(a,function(){b.addClass("hidden")})},c.animateMarkerBounce=function(){c.marker.getAnimation()||(c.marker.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){c.marker.setAnimation(null)},775))}},app={vm:new AppViewModel};ko.applyBindings(app.vm);