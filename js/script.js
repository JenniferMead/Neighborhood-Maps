//This creates a variable called map
var map;

//This is the model
//This array of objects holds the location info
var locationInfo = [
  {name: 'Ca Momi Osteria', latlong: {lat: 38.2985, lng: -122.2866}, address: '1141 1st St, Napa, CA 94559', businessId: 'ca-momi-osteria-napa-2'},
  {name: 'La Taberna', latlong: {lat: 38.2980, lng: -122.2848}, address: '815 Main St, Napa, CA 94559', businessId: 'la-taberna-napa'},
  {name: 'Graces Table', latlong: {lat: 38.2969, lng: -122.2883}, address: '1400 2nd St, Napa, CA 94559', businessId: 'graces-table-napa'},
  {name: 'Morimoto Napa', latlong: {lat: 38.2969, lng: -122.2834}, address: '610 Main St, Napa, CA 94559', businessId: 'morimoto-napa-napa'},
  {name: 'Oenotri', latlong: {lat: 38.2973, lng: -122.2888}, address: '1425 1st St, Napa, CA 94559', businessId: 'oenotri-napa'},
  {name: 'Melted', latlong: {lat: 38.3010, lng: -122.2862}, address: '966 Pearl St, Napa, CA 94559', businessId: 'melted-napa'},
  {name: 'Alexis Baking Company', latlong: {lat: 38.2955, lng: -122.2888}, address: '1517 3rd St, Napa, CA 94559', businessId: 'alexis-baking-company-napa'}
];

//this function initializes the map
function initMap() {
    // This constructor creates the new map at the chosen location
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17
    });
    //The creates the info window
    var infowindow = new google.maps.InfoWindow({
    });
    //This creates the lat long boundries
    var bounds = new google.maps.LatLngBounds();
    //This for loop is used to create new marker properties and push them into each object in the locationInfo array, making them properties of all of the location objects
    for( i = 0; i<locationInfo.length; i++){
      //Creates each marker as a property of an object in the locationInfo array
      locationInfo[i].marker = new google.maps.Marker({
      position: locationInfo[i].latlong,
      map: map,
      title: locationInfo[i].name,
      address: locationInfo[i].address,
      animation: google.maps.Animation.DROP
    });
    //This adds a click event to the marker properties that causes the infoWindow to open upon clicking. It doesn't contain the content yet though.
    locationInfo[i].marker.addListener('click', function(){
      //Now we are calling the populateInfoWindow function that we set up later
      populateInfoWindow(this, infowindow);
    });
    //This adds the click event that calls the function in control of the animation of the marker
    locationInfo[i].marker.addListener('click', function(){
      toggleBounce(this);
    });
    bounds.extend(locationInfo[i].marker.position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
    //center the map to the geometric center of all markers.
    map.setCenter(bounds.getCenter());
}

//This function toggles the marker between bouncing and not bouncing
function toggleBounce(marker) {
  //This makes sure that all markers have stopped bouncing first
  for(var i=0; i<locationInfo.length; i++){
      locationInfo[i].marker.setAnimation(null);
  };
  //If the marker is already animated, stop animation
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    //Otherwise, set animation on this marker
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

//This function makes sure that the infowindow appears and sets the content to the correct information, it also clears the window content if the info window is closed
function populateInfoWindow(marker, infowindow) {
  // This just makes sure the window is not already open
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    //This sets the content ofthe info window
    infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + marker.address + '</div>' + '<div>' + marker.phone + '</div>' + '<img id ="yelpLogo" src = "yelpLogo.jpg">');
    infowindow.open(map, marker);
    // Make sure the infoWindow is cleared if the close button is clicked
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      //Makes sure the animation of the marker is stopped if the infoWindow close button is clicked
      marker.setAnimation(null);
    });
  }
}

//This is a the viewmodel for the KO code
function appViewModel() {
  var self = this;
  //This is creating a reference to the filter data-bind in the HTML
  self.filter = ko.observable();
  //Adding as a property a KO observable array
  self.myObservableArray = ko.observableArray();
  //This for loop is what actually pushes the locationInfo objects into the observable array
  for(var i=0; i<locationInfo.length; i++){
    self.myObservableArray.push(locationInfo[i]);
  }
  //Here is where I connect the list to the markers. I've added a click event on the DOM element that connects to this. whenever a list item is clicked, this function is run
  //It basically triggers all of the click events on the marker
  self.listClicker = function(locationInfo){
    google.maps.event.trigger(locationInfo.marker, 'click')
  };
  //This is a method that is being added to the function. Its a KO computed observable
  self.filteredItems = ko.computed(function() { console.log(self);
  //if no value has been entered, just return the observable array and set the marker to visable
  if (!self.filter()) {
    // loop through locations
    self.myObservableArray().forEach( function (location) {
    // if marker poperty exists its sets the visibility to true. It won't exist on load, but it WILL exist after the page has loaded and you have typed in the filter box and then cleared it
      if (location.marker) {
        location.marker.setVisible(true);
      }
    });
      return self.myObservableArray();
  }
  else {
    //the variable filter is holding the results of the user input into filter and then converting it to all lower case
    var filter = self.filter().toLowerCase();
      //returns an array that contains only those items in the array that is being filtered that pass the true/false test inside the filter
      return ko.utils.arrayFilter(self.myObservableArray(), function(item) {
      //Holds the result of the filter in a variable that is converted to a number based on how .indexOf works
      //indexOf returns the index of the first occurance of a query value. If there is no query value in the string, indexOf returns a -1.
      var result = item.name.toLowerCase().indexOf(filter);
      //If there were no matches between the filter and the list, hide the marker
        if (result < 0) {
          item.marker.setVisible(false);
          //If there were matches, show the marker
        }
        else {
          item.marker.setVisible(true);
        }
        //Based on how indexOf works, if you have a match at all, the result must be 0 or greater becuase 0 is the lowest index number.
        //So if you have any result, it will be greater than -1 and so returns true. Otherwise it returns false
        return item.name.toLowerCase().indexOf(filter) > -1;
      });
    }
  });
};

//Authentication for YELP API
//Generates a random number and returns it as a string for OAuthentication
function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

//Information given to me from yelp
var consumer_key = "X7VNY65vm-GvicRE02oSTg";
var token = "rv11cD_G4XtSoJM2MnvLy1vdA32lXb8w";
var secret_key = "MUurURfv82G-0QGpjQImc04gi8A";
var secret_token = "IlHuDvpCNL183-nePGIDH4Tb69g";

//This is the function that contains the actual ajax request, but it isn't called until later
var yelpCaller = function(place){
  //Url variable
  var yelp_url = "https://api.yelp.com/v2/business/" + place.businessId;
  //Search parameters for my YELP search
  var parameters = {
    oauth_consumer_key: consumer_key,
    oauth_token: token,
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now()/1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version : '1.0',
    // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    callback: 'cb',
    location: '94559',
    term: 'restaurant',
    limit: 10
  };
  var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, secret_key, secret_token);
  //Store the encoded signature as a property of the parameters object
  parameters.oauth_signature = encodedSignature;
  var settings = {
    url: yelp_url,
    data: parameters,
    // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    cache: true,
    dataType: 'jsonp',
    success: function(results) {
    // Do stuff with results
    console.log(results);
    //If YELP doesn't return any phone number data (so the result is undefined), an error message is displayed
    if(results.display_phone == undefined){
      place.marker.phone = "No phone number provided by Yelp API";
    }
    else{
      //This creates a property called phone on the marker and makes it equal to the phone number from the results
      place.marker.phone =  results.display_phone;
    }
    },
    error: function() {
    place.marker.phone = 'Yelp API data could not be retrieved';
      console.log("fail");
    }
  };

  // Send AJAX query via jQuery library. This is what is actually sending the request
  $.ajax(settings);
}

//This loops through all of the objects in the location array and calls the function that retrieves the phone numbers from the restuarants and stores the data in the appropriate locationInfo object
for(var i=0; i<locationInfo.length; i++){
  yelpCaller(locationInfo[i]);
};

// Activates knockout.js
ko.applyBindings(new appViewModel());

$( '.menuButton' ).click(function(){
  $('.responsive-menu').toggleClass('expand');
});

function googleError(){
  alert("Google maps is not loading. Please check your internet connection");
}
