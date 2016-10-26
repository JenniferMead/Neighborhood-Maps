//this creats a variable called map
var map;

//this is the model! Now its separate and NOW its easier
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

  //Now we are putting the markers on the initial map
  //This blank array will hold all of the markers info
  var markersArray = [];

  //Creates the infoWindow, keep outside of for loop becuase you only need to make it once
  var infowindow = new google.maps.InfoWindow({
  });

  //This for loop pushes all of the markers into the array
  for( i = 0; i<locationInfo.length; i++){
    //Creation of the markers
    var marker = new google.maps.Marker({
      position: locationInfo[i].latlong,
      map: map,
      title: locationInfo[i].name,
      address: locationInfo[i].address
    });

    //Pushes the markers into an array of objects called markers
    markersArray.push(marker);

    //This adds a click event to the markers that causes the infoWindow to open upon clicking. I think the marker is an object and we are adding properties to that object? Thats why we can do this after pushing it in the array
    marker.addListener('click', function(){
      //Why do you need the "this" again? I dont really understand this part or how "marker" in the later function can just replace this. I think "this" is just referring to the marker object. Its "self"
      populateInfoWindow(this, infowindow);
    });
  }
}

//I think the infoWindow and the marker are both objects
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



// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function appViewModel() {
  var self = this;
  //the list view should be populated with a KO array that pushes the above objects into the array. Then Here is where you allow for filtering and click events? Start with adding click events onto the code here
  var myObservableArray = new Array();
  self.myObservableArray = ko.observableArray();
  for(var i=0; i<locationInfo.length; i++){
    myObservableArray.push(locationInfo[i]);
  }

  console.log(myObservableArray[0]);
   }

// Activates knockout.js
ko.applyBindings(new appViewModel());




 //Next to do. Im done for NOW with googleMaps. Time to move on

//A list of the names of the markers should appear on the left side. This requires KO and it means I have to populate the DOM. Review the KO stuff briefly and read over the rules thouroughly!!

//Provide a filter option that uses an input field to filter both the list view and the map markers displayed by default on load, IE: if you filter by the word park, anything without that word should go away and only markers with that word should stay


//Add functionality using third-party APIs to provide information when a map marker or list view entry is clicked


//Add functionality to animate a map marker when either the list item associated with it or the map marker itself is selected.
//Add functionality to open an infoWindow with the information when either a location is selected from the list view or its map marker is selected directly.



//error handling
