//This creats a variable called map
var map;


//This is the model
//This array of objects holds the location info
var locationInfo = [
  {name: 'Ca Momi Osteria', latlong: {lat: 38.2985, lng: -122.2866}, address: '1141 1st St, Napa, CA 94559'},
  {name: 'La Taberna', latlong: {lat: 38.2980, lng: -122.2848}, address: '815 Main St, Napa, CA 94559'},
  {name: 'Graces Table', latlong: {lat: 38.2969, lng: -122.2883}, address: '1400 2nd St, Napa, CA 94559'},
  {name: 'Morimoto', latlong: {lat: 38.2969, lng: -122.2834}, address: '610 Main St, Napa, CA 94559'},
  {name: 'Oenotri', latlong: {lat: 38.2973, lng: -122.2888}, address: '1425 1st St, Napa, CA 94559'},
  {name: 'Melted', latlong: {lat: 38.3010, lng: -122.2862}, address: '966 Pearl St, Napa, CA 94559'},
  {name: 'Alexis Baking Company', latlong: {lat: 38.2955, lng: -122.2888}, address: '1517 3rd St, Napa, CA 94559'}
];

//this function initializes the map
function initMap() {
  // This constructor creates the new map at the chosen location
  map = new google.maps.Map(document.getElementById('map'), {
    //I don't think I need this line anymore if I am creating the center below and setting it to the center of the bounds
    //center: {lat: 38.2970, lng: -122.2876},
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
      //This is only doing the initial animation on load, the drop effect. Not bouncing
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

    //center the map to the geometric center of all markers. If I do this, aren't I just resetting the center I determined above when I made the map initially?
    map.setCenter(bounds.getCenter());
}
//I don't know if the lat long bounds isn't working or if its doing everything it can. It definietly adjusts and keeps everything within the bounds as LONG as I don't move the screen. If I move the screen though,
//it will not move it back to the marker. Also, it does not adjust the zoom based on how many markers are in the screen and how far apart they are
//Actualy Im pretty sure its not adjusting becuase its staying the center of the markers but it doesn't know when a marker is being filtered and thus removed from the list? So its not updating?

console.log(locationInfo);

function toggleBounce(marker) {
  //If the marker is already animated, stop animation
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    //Otherwise, set animation
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

//This function makes sure that the infowindow appears and sets the content to the correct title, it also clears the window content if the info window is closed
function populateInfoWindow(marker, infowindow) {
  // This just makes sure the window is not already open
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    //This sets the content ofthe info window
    infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + marker.address + '</div>');
    infowindow.open(map, marker);
    // Make sure the infoWindow is cleared if the close button is clicked
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      //Makes sure the animation of the marker is stopped if the infoWindow close button is clicked
      marker.setAnimation(null);
    });
  }
}


// This is a the viewmodel for the KO code
function appViewModel() {
  var self = this;
  //This is creating a reference to the filter data-bind in the HTML
  self.filter = ko.observable();

  //Adding as a property? a KO observable array
  self.myObservableArray = ko.observableArray();

  //This for loop is what actually pushes the locationInfo objects into the observable array
  for(var i=0; i<locationInfo.length; i++){
    self.myObservableArray.push(locationInfo[i]);
  }

//Here is where I connect the list to the markers. I've added a click event on the DOM element that connects to this. whenever a list item is clicked, this function is run
//It basically triggers all of the click events on the marker
//Shouldn't this actually be in the for loop since we are adding functionalitiy to each of the list items??
 self.listClicker = function(locationInfo){
   google.maps.event.trigger(locationInfo.marker, 'click')
 };

  //this is a method that is being added to the function. Its a KO computed observable
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
              } else {
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


var yelp_url = "http://api.yelp.com/v2/search";

var parameters = {
  oauth_consumer_key: consumer_key,
  oauth_token: token,
  oauth_nonce: nonce_generate(),
  oauth_timestamp: Math.floor(Date.now()/1000),
  oauth_signature_method: 'HMAC-SHA1',
  oauth_version : '1.0',
  callback: 'cb',              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
  location: 'California',
  term: 'restaurant',
  limit: 1
};

var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, secret_key, secret_token);
//Store the encoded signature as a property of the parameters object
parameters.oauth_signature = encodedSignature;

var settings = {
  url: yelp_url,
  data: parameters,
  cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
  dataType: 'jsonp',
  success: function(results) {
  // Do stuff with results
  console.log("success");
  },
  error: function() {
  // Do stuff on fail
    console.log("fail");
  }
  };

  // Send AJAX query via jQuery library.
  $.ajax(settings);

  // Activates knockout.js
  ko.applyBindings(new appViewModel());
