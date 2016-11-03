//This creats a variable called map
var map;


//This is the model
//This array of objects holds the location info
var locationInfo = [
  {name: 'Ca Momi Osteria', latlong: {lat: 38.2985, lng: -122.2866}, address: '1141 1st St, Napa, CA 94559'},
  {name: 'La Taberna', latlong: {lat: 38.2980, lng: -122.2848}, address: '815 Main St, Napa, CA 94559'},
  {name: 'Graces Table', latlong: {lat: 38.2969, lng: -122.2883}, address: '1400 2nd St, Napa, CA 94559'},
  {name: 'Morimoto', latlong: {lat: 38.2969, lng: -122.2834}, address: '610 Main St, Napa, CA 94559'},
  {name: 'Oenotri', latlong: {lat: 38.2973, lng: -122.2888}, address: '1425 1st St, Napa, CA 94559'}
];


//this function initializes the map
function initMap() {
  // This constructor creates the new map at the chosen location
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.2970, lng: -122.2876},
    zoom: 17
  });

  //The creates the info window
  var infowindow = new google.maps.InfoWindow({
  });

  //This for loop is used to create new marker properties and push them into each object in the locationInfo array, making them properties of all of the location objects
  for( i = 0; i<locationInfo.length; i++){
    //Creates each marker as a property of an object in the locationInfo array
    locationInfo[i].marker = new google.maps.Marker({
      position: locationInfo[i].latlong,
      map: map,
      title: locationInfo[i].name,
      address: locationInfo[i].address
    });

    //This adds a click event to the marker properties that causes the infoWindow to open upon clicking. It doesn't contain the content yet though.
    locationInfo[i].marker.addListener('click', function(){
      //Now we are calling the populateInfoWindow function that we set up later
      populateInfoWindow(this, infowindow);
    });
  }
}

console.log(locationInfo);

//This function makes sure that the infowindow appears and sets the content to the correct title, it also clears the window content if the info window is closed
function populateInfoWindow(marker, infowindow) {
  // This just makes sure the window is not already open
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    //This sets the content ofthe info window
    infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + marker.address + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
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

  //this is a method that is being added to the function. Its a KO computed observable
  self.filteredItems = ko.computed(function() { console.log(self);

    //if no value has been entered, just return the observable array and set the marker to visable
    if (!self.filter()) {
        self.myObservableArray().marker.setVisible(true);
        return self.myObservableArray();
    } else {
         //the variable filter is holding the results of the user input into filter and then converting it to all lower case
         var filter = self.filter().toLowerCase();
         //returns an array that contains only those items in the array that is being filtered that pass the true/false test inside the filter
         return ko.utils.arrayFilter(self.myObservableArray(), function(item) {
           //return either true or false
            //indexOf returns the index of the first occurance of a query value. If there is no query value in the string, indexOf returns a -1.
            //Thus, if you have a match at all, the result must be 0 or greater becuase 0 is the lowest index number. So if you have any result, it will be greater than -1 and so returns true. Otherwise it returns false
            //do we need to do toLowerCase twice?
            var result = item.name.toLowerCase().indexOf(filter);

              if (result !== 0) {
                item.marker.setVisible(false);
              } else {
                 item.marker.setVisible(true);
              }

            return item.name.toLowerCase().indexOf(filter) > -1;
        });
    }
  //do we still need appViewModel here?
  });

  };

  // Activates knockout.js
  ko.applyBindings(new appViewModel());

  //we need two different functions, one that returns the list basede on the filter and once that returns the markers based on the filter
  //they both initially load if there is nothing in the filter, but as sooon as their is something in the filter, things are only returned to the list if they are true and markers are only
  //shown if they are true

  //error handling
  //I think the problem is that myObservableArray is not connected to the other function?
