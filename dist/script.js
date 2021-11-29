var submitClicked = false;
let page = 0;
let totalPages = 0;
let numEvents = 0;
let globalJSON;
let myTMKey = "apikey=zPNTyXBzoiIlL8DqjRVpzG4gsAVl3EwR";
const TM_EVENTS_LINK = "https://app.ticketmaster.com/discovery/v2/events?" + myTMKey;
var queryLink = "";
let lat, lon, radius;

// Gets the user's location with their permission and updates that data in the application.
function locationSuccess1(position) {
   const latitude = position.coords.latitude;
   var lat = latitude;
   const longitude = position.coords.longitude;
   var lon = longitude;
   const altitude = position.coords.altitude;
   const accuracy = position.coords.accuracy;
   //accuracy is in meters 
   // 1 meter is 0.0062137 miles
   radius = Math.round(accuracy * 0.00062137);
   if(radius < 15) radius = 15;
   const altitudeAccuracy = position.coords.altitudeAccuracy;
   const heading = position.coords.height;
   const speed = position.coords.speed;
   const timestamp = position.timestamp;

  //Changing the radius in the query link
   var inputRad = $("#radius-entry").val();
   if(inputRad > 0){
      radius = inputRad;
   }
   console.log(lat,lon,radius);
   localStorage.setItem("lat",lat);
   localStorage.setItem("lon",lon);
   localStorage.setItem("radius",radius);
   //assembling the link
   var queryLink = "https://app.ticketmaster.com/discovery/v2/events?apikey=zPNTyXBzoiIlL8DqjRVpzG4gsAVl3EwR";
   queryLink += "&latlong=" + lat + "," + lon;
   queryLink += "&radius=" + radius;
   queryLink += "&unit=miles&locale=*";

   //Make query 
   makeTMQuery(queryLink);
}

function locationError(error) {
   const code = error.code;
   const message = error.message;

   // read the code and message and decide how you want to handle this!
}

// Adds the current Query's elements to the HTML page
function addTicketMasterPage(json){
   let s = "";
   for(var i = 0; i < json._embedded.events.length; i++){
      //add each event to a table in the results in HTML
      s += "<tr><td>" + json._embedded.events[i].name + "</td>";
      s += "<td><a href='" + json._embedded.events[i].url + "'>Ticketmaster Link</a></td></tr>";
   }
   let tab = document.getElementById('ticketmaster-results');
   tab.innerHTML = "" + s;
   updatePageCount();
}

// Updates in the HTML, which page of the total query'd pages the user is on and how many
// total elements their search reterived
function updatePageCount(){
   let pageCount = document.getElementById("page-count");
   pageCount.innerHTML = "" + (page + 1) + " of " + totalPages;
   let totalEvents = document.getElementById("total-count");
   totalEvents.innerHTML = "Total Events: " + numEvents; 
}

// Takes in a ticketmaset API query link and makes an API call with it
function makeTMQuery(queryLink){
   $.ajax({
      type:"GET",
      url:queryLink,
      async:true,
      dataType: "json",
      success: function(json) {
                  globalJSON = json;
                  totalPages = json.page.totalPages;
                  numEvents = json.page.totalElements;
                  addTicketMasterPage(json);
               },
      error: function(xhr, status, err) {
                  // This time, we do not end up here!
               }
    });
}

//What happens when the document loads
$( document ).ready(function() {
   $( '#submit' ).click(function( event ) {
      //reset results every click of submit
      let tab = document.getElementById('ticketmaster-results');
      tab.innerHTML = "";
      page=0;
      totalPages=0;
      navigator.geolocation.getCurrentPosition(locationSuccess1, locationError);
      event.preventDefault();
      //make results section visible
      document.getElementById('results').style.visibility='visible';
   });

    //Making sure that the radius input number is valid
    $(document).on('input', '#radius-entry', function(){
      var inputRad = $("#radius-entry").val();
      //Need to figure out how to check if its not a number?
      if(inputRad <= 0) {
         alert("Please enter a number greater than 0");
         $("#radius-entry").val(15);
      }
  })
   //prev and next used to be here
});

//Looks for the string "page=" and replaces the number with one smaller than before.
//Then makes an API call with the new link/page number
$('#prev').click(function(event){
   if(page > 0){
      page--;
      let pageWord = "page=";
      let thisLink = globalJSON._links.self.href;
      var nextLink;
      if(thisLink.indexOf(pageWord) != -1){
         var startOfPage = thisLink.indexOf(pageWord);
         nextLink = thisLink.substring(0,startOfPage) + "page=" + (page)
         //adjusting for string length when loosing a digit (was 10, now is 9)
         if(page ==9 | page ==99 | page == 999) {
            nextLink += thisLink.substring(startOfPage+7,thisLink.length);
         } else {
            nextLink += thisLink.substring(startOfPage+6,thisLink.length);
         }
      }
      nextLink = nextLink.substring(21,nextLink.length);
      nextLink = "https://app.ticketmaster.com/discovery/v2/events?" + myTMKey + "&"+ nextLink;
      makeTMQuery(nextLink);
   }
});

// Uses the API to get the next link, makes an API call with that link
$('#next').click(function(event){
   if(page < totalPages & globalJSON._links.self.href != globalJSON._links.last.href){
      page++;
      var nextHref = globalJSON._links.next.href.substring(21,globalJSON._links.next.href.length);
      var nextLink = "https://app.ticketmaster.com/discovery/v2/events?" + myTMKey + "&"+ nextHref;
      makeTMQuery(nextLink);
   }
});


//SPOTIFY BELOW 
var access_token = "";
let redirect_uri = 'http://127.0.0.1:5500/dist/index.html'
let mySID= "fcac4ddf40514e879f1de6bf02df567a";
var client_id = mySID;
let mySSec = "62b867a4f85e4724a6b05a376513d3a0";
let spotifyBaseLink = "https://api.spotify.com/";
const TOKEN_LINK = 'https://accounts.spotify.com/api/token';
let recLink = "https://api.spotify.com/v1/recommendations";
const INFO_LINK = spotifyBaseLink + "v1/me";
const SEARCH_TRACK_LINK = spotifyBaseLink + "v1/search?";
const SONG_LIMIT = 10;
const REC_LIMIT = 10;
const DEVICES =  spotifyBaseLink + "v1/me/player/devices";
const TOP_TRACK = spotifyBaseLink + "v1/me/top/track";
const NEW_RELEASE = spotifyBaseLink + "v1/browse/new-releases"
const MY_TRACKS = spotifyBaseLink + "v1/me/tracks";
const REC_LINK = spotifyBaseLink + "v1/recommendations?limit=" + REC_LIMIT;
const NOW_PLAYING_LINK = spotifyBaseLink + "v1/me/player/currently-playing";

//taken from https://developer.spotify.com/documentation/general/guides/authorization/implicit-grant/

$('#login').click(function(event){
   requestAuthorization();
   //I tried to do below so that there is separation of concerns with authorization and getting the user's
   //information. 
   // getInformation();
});

//Requests authorization for the application to access a user's data
function requestAuthorization(){
   var scopes = "user-read-playback-state playlist-read-private user-read-recently-played user-follow-read playlist-read-collaborative user-library-read user-top-read";
   // var state = generateRandomString(16);
   // localStorage.setItem("stateKey", state);
   // i dont think i need the two below lines because i have these as global variables.
   var url = 'https://accounts.spotify.com/authorize';
   url += '?response_type=code'; 
   url += '&client_id=' + encodeURIComponent(client_id);
   url += '&show_dialog=true';
   url += '&scope=' + encodeURIComponent(scopes);
   url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
   // url += '&state=' + encodeURIComponent(stateKey);
   window.location.href = url; // the redirect
}

//Happens each time the page reloads to see if it needs to authenticate for spotify
function onPageLoad(){
   console.log("onPageLoad", window.location.search.length);
   if(window.location.search.length > 0) {
      handleRedirect();
   }
}

function handleRedirect(){
   let code = getCode();
   fetchAccessToken(code);
   window.history.pushState("", "", redirect_uri); // removes extra stuff from URL
   //This (below) turned on was able to get information at this time but also messed up the KEY
   // getInformation();
}

// returns the 'code=' from the URL to complete authorization back to spotify
function getCode(){
   let code = null;
   const queryString = window.location.search;
   if ( queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code');
   }
   return code;
}

//API call to get AccessToken with code from getCode()
function fetchAccessToken( code ){
   console.log("fetchAccessToken");
   let body = "grant_type=authorization_code";
   body += "&code=" + code;
   body += "&redirect_uri=" + encodeURI(redirect_uri);
   body += "&client_id=" + client_id;
   body += "&client_secret=" + mySSec;
   callAuthorizationApi(body);
}

//Refresh Access token and save to local storage
function refreshAccessToken(){
   refresh_token = localStorage.getItem("refresh_token");
   let body = "grant_type=refresh_token";
   body += "&refresh_token=" + refresh_token;
   body += "&client_id=" + client_id;
   callRefreshApi(body);
}

function callRefreshApi(body){
   console.log("callRefreshAPI");
   let xhr = new XMLHttpRequest();
   xhr.open("POST", TOKEN_LINK, true);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + mySSec));
   xhr.send(body);
   xhr.onload = handleRefresh;
}

function handleRefresh(){
   if(this.status == 200){
      var data = JSON.parse(this.responseText);
      console.log(data);
      var data = JSON.parse(this.responseText);
      if (data.access_token != undefined){
         access_token = data.access_token;
         console.log("Setting Access Token to: ",access_token);
         localStorage.setItem("access_token", access_token);
      }
      if (data.refresh_token != undefined){
         refresh_token = data.refresh_token;
         console.log("Setting Refresh Token");
         localStorage.setItem("refresh_token", refresh_token);
      }
      //tutoril has this: onPageLoad();
   } else {
      console.log(this.responseText);
      alert(this.responseText);
   }
}

function callAuthorizationApi(body){
   let xhr = new XMLHttpRequest();
   xhr.open("POST", TOKEN_LINK, true);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + mySSec));
   xhr.send(body);
   xhr.onload = handleAuthorizationResponse;
   
}

function handleAuthorizationResponse(){
   if(this.status == 200){
      var data = JSON.parse(this.responseText);
      var data = JSON.parse(this.responseText);
      if (data.access_token != undefined){
         access_token = data.access_token;
         console.log("Setting Access Token");
         localStorage.setItem("access_token", access_token);
      }
      if (data.refresh_token != undefined){
         refresh_token = data.refresh_token;
         console.log("Setting Refresh Token to:", refresh_token);
         localStorage.setItem("refresh_token", refresh_token);
      }
      //tutoril has this: onPageLoad();
      onPageLoad();
      getInformation();
   } else {
      console.log(this.responseText);
      alert(this.responseText);
   }
}

//Get's user information and manipulates it to place onto web page.
function getInformation(){
   callAPI("GET", INFO_LINK, null, handleInfoResponses);
}

//Generic API call method to get data and make a callback
function callAPI(method, url, body, callback){
   console.log("Calling API on ", url );
   let xhr = new XMLHttpRequest();
   xhr.open(method, url, true);
   xhr.setRequestHeader('Accept', 'application/json');
   xhr.setRequestHeader('Content-Type', 'application/json');
   xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("access_token"));
   xhr.send(body);
   xhr.onload = callback;
//    xhr.onreadystatechange = function () {
//       if(xhr.readyState == 1) {
//           console.log('Request started.');
//       }
      
//       if(xhr.readyState == 2) {
//           console.log('Headers received.');
//       }
      
//       if (xhr.readyState == 3) {
//           console.log('Data loading..!');
//       }
//       if (xhr.readyState == 4) {
//           console.log('Request ended.');
//       }
//   }
//    xhr.onerror = () => {
//       console.error('Request failed.');
//   }
//   xhr.onprogress = (event) => {
//    // event.loaded returns how many bytes are downloaded
//    // event.total returns the total number of bytes
//    // event.total is only available if server sends `Content-Length` header
//    console.log(`Downloaded ${event.loaded} of ${event.total}`);
//    }
//    xhr.onabort = () => console.log("abort");
//    xhr.ontimeout = () => console.log('Request timeout.', xhr.responseURL);
}

//Set's image and name on application
function handleInfoResponses(){
   if(this.status == 200) {
      var data = JSON.parse(this.responseText);
      console.log(data);
      if(data.images[0] != null){
         var stringHTML = "";
         stringHTML = "<p>Name: " + data.display_name + "</p>";
         stringHTML += "<img id='user-image' src='"+ data.images[0].url + "' alt='user profile image'>";
         $("#spotify-info").html(stringHTML);
         $('#user-image').css("width","40px");
         $('#user-image').css("height","40px");
         //Make API call to get currently playing here if you want to do that. 
         callAPI("GET", NOW_PLAYING_LINK, null, displayPlaying);
      }
   } else if(this.status == 401){
      console.log("401 Error, need to refesh Token");
      refreshAccessToken();
   } else {
      console.log(this.status);
      alert(this.status);
   }
}

function displayPlaying(){
   if(this.status == 200) {
      var data = JSON.parse(this.responseText);
      var nowPlayingText = "";
      if(data != null && data.item != null) {
         var artist = "";
         for(var j = 0; j < data.item.artists.length; j++){
            artist += data.item.artists[j].name;
            if(j < data.item.artists.length-1){
               artist += ", ";
            }
         }
         nowPlayingText = "<p>Now Playing: " + data.item.name + " by " + artist + "</p>";
      }
      var infoHTMl = $("#spotify-info").html() + nowPlayingText;
      $("#spotify-info").html(infoHTMl);
   } else if(this.status == 401){
      console.log("401 Error, need to refesh Token");
      refreshAccessToken();
   } else {
      console.log(this.status, "Nothing Playing right now.");
   }
}

//Searches for every Key entered.
$('#track-entry').keyup(function (e) { 
   //Might want to check if the user is logged in first becasuse when they are not an alert is shown. If typing fast then the user gets a lot of alerts.
   searchTracks();
   return false; //return false so the page doesnt refresh when the button is clicked. 
});

function searchTracks(){
   var input = $("#track-entry").val();  
   if (input != ""){
      var url = SEARCH_TRACK_LINK;
      url += "q=" + encodeURI(input);
      url += "&type=track";
      url += "&limit=" + SONG_LIMIT;
      console.log(url);
      callAPI("GET", url, null, handleSearchInfo);
   } else {
      //probably want to turn off the search suggestions here.
      $('#spotify-search-options').html("");
   }
}

function handleSearchInfo(){
   console.log(this.status);
   if(this.status == 200) {
      var data = JSON.parse(this.responseText);
      console.log(data);
      if(data.tracks.total == 0){ //If spotify returns no matching content
         // alert("No tracks found in Spotify under that name. Please enter the valid name of a track to get recommendations.");
         var resultHTML = "<p><b>Unfortunately there are no Spotify search results for this input. Try entering the name of a song!</b></p>";
         $('#spotify-search-options').html(resultHTML);
      } else { 
         addSearchResultsToHTML(data);
      }
   } else if(this.status == 401){
      refreshAccessToken();
   } else {
      console.log(this.responseText);
      alert(this.status);
   }
}


// Gets string for each of the tracks + artist and adds to the HTML
function addSearchResultsToHTML(data){
   var resultHTML = "<ul id='search-results-list'>";
   for(var i = 0; i < data.tracks.limit; i++){
      resultHTML += "<li><a id='trackno-" + i +  "'>"
      var trackName = data.tracks.items[i].name;
      var artist = "";
      for(var j = 0; j < data.tracks.items[i].artists.length; j++){
         artist += data.tracks.items[i].artists[j].name;
         if(j < data.tracks.items[i].artists.length-1){
            artist += ", ";
         }
      }
      resultHTML += trackName + " - " + artist + "</a></li>";
   }
   resultHTML += "</ul>";
   $('#spotify-search-options').html(resultHTML);
   makeClickable(data);
}


function makeClickable(data){
   //IF the number of suggested search results is changed this will have to be changed
   //when click, pass index and data
   //Banking on always having 10 tracks returned.
   //This cannot be in a loop because the result will change before the event fires every time the loop goes
   document.getElementById("trackno-0").addEventListener("click", function() {clickedOnTrack(0, data)});
   document.getElementById("trackno-1").addEventListener("click", function() {clickedOnTrack(1, data)});
   document.getElementById("trackno-2").addEventListener("click", function() {clickedOnTrack(2, data)});
   document.getElementById("trackno-3").addEventListener("click", function() {clickedOnTrack(3, data)});
   document.getElementById("trackno-4").addEventListener("click", function() {clickedOnTrack(4, data)});
   document.getElementById("trackno-5").addEventListener("click", function() {clickedOnTrack(5, data)});
   document.getElementById("trackno-6").addEventListener("click", function() {clickedOnTrack(6, data)});
   document.getElementById("trackno-7").addEventListener("click", function() {clickedOnTrack(7, data)});
   document.getElementById("trackno-8").addEventListener("click", function() {clickedOnTrack(8, data)});
   document.getElementById("trackno-9").addEventListener("click", function() {clickedOnTrack(9, data)});
}

function clickedOnTrack(index, data){
   var title = data.tracks.items[index].name;
   var artist = "";
   var masterArtists = [];
   for(var i = 0; i < data.tracks.items[index].artists.length; i++){
      if(!masterArtists.includes(data.tracks.items[index].artists[i].name)) masterArtists.push(data.tracks.items[index].artists[i].name);
      artist += data.tracks.items[index].artists[i].name;
      if(i < data.tracks.items[index].artists.length-1){
         artist += ", ";
      }
   }
   //Display title as feedback for user.
   var trackID = data.tracks.items[index].id;
   var link = REC_LINK + "&seed_tracks=" + trackID;
   $('#spotify-search-options').html("");
   //Feedback for which is chosen.
   $('#track-entry').val(title + " - " +  artist);
   // var chosenText = "You have selected " + title + " by " + artist;
   // var chosenHTML = "<h3>" + chosenText + "</h3>";

   //Need to pass masterArtists to handleRec....
   //Recomendation API call
   callAPI("GET", link, null, handleRec);
   return false;
}

function handleRec(){
   console.log(this.status);
   if(this.status == 200) {
      var data = JSON.parse(this.responseText);
      console.log(data);
      displayRecArtists(data);
      var links = getRecArtistLinks(data);
      console.log(links);
      queryEachLink(links);
   } else if(this.status == 401){
      refreshAccessToken();
   } else {
      console.log(this.responseText);
      alert(this.status);
   }
}

function queryEachLink(links){
   var listHTML = "<table><tr>";
   listHTML += "<th>Event Name</th>";
   listHTML += "<th>Date</th>";
   listHTML += "<th>Venue Name</th>";
   listHTML += "<th>Address</th>";
   listHTML += "<th>Distance</th>";
   listHTML += "<th>Special Notes</th>";
   listHTML += "<th>Link</th></tr>";
   links.forEach(link => {
      listHTML = recTMQuery(link, listHTML);
   });
   listHTML += "</table>";
   $('#ticketmaster-rec-results').html(listHTML);
}

function recTMQuery(link, listHTML){
   $.ajax({
      type:"GET",
      url:link,
      async:false,
      dataType: "json",
      success: function(json) {
                  console.log("TM Data", json);
                  //see if there is an event, then make table with event
                  if(json.page.totalElements != 0) {
                     for(var i = 0 ;i < json._embedded.events.length; i++){
                        //Event Name
                        listHTML += "<tr><td>" + json._embedded.events[i].name + "</td>";

                        //Event Date                        
                        if(json._embedded.events[i].dates.start.dateTBD == true || json._embedded.events[i].dates.start.dateTBA == true){
                           listHTML += "<td>TBA</td>";
                        } else if(json._embedded.events[i].dates.spanMultipleDays == true) {
                           //idk what to do
                        } else {
                           var date = new Date(json._embedded.events[i].dates.start.dateTime);
                           var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
                           var am_pm = date.getHours() >= 12 ? "PM" : "AM";
                           hours = hours < 10 ? "0" + hours : hours;
                           var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                           time = hours + ":" + minutes + " " + am_pm;
                           var mmddyy = date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear()%100;
                           //console.log(mmddyy);
                           // used to be json._embedded.events[i].dates.start.localDate
                           var timeDate = mmddyy + " at " + time
                           listHTML += "<td>" + timeDate+ "</td>";
                        }
                        //Event Venu Name
                        console.log( json._embedded.events[i]._embedded.venues[0].name);
                        console.log(json._embedded.events[i]._embedded.venues[0].city.name, ", ",json._embedded.events[i]._embedded.venues[0].state.stateCode);
                        listHTML += "<td>" + json._embedded.events[i]._embedded.venues[0].name + "</td>";
                        
                        //Event Venu Address
                        listHTML += "<td>" + json._embedded.events[i]._embedded.venues[0].address.line1 +"\n" + json._embedded.events[i]._embedded.venues[0].city.name 
                                           +  ", " + json._embedded.events[i]._embedded.venues[0].state.stateCode + "</td>";

                        //Event Distance 
                        if(json._embedded.events[i].distance != null) {
                           listHTML += "<td>" + json._embedded.events[i].distance + " miles</td>";
                        } else {
                           listHTML += "<td>No distance data</td>";
                        }

                        //Event Special Note
                        if (json._embedded.events[i].pleaseNote != null) {
                           listHTML += "<td>" + json._embedded.events[i].pleaseNote + "</td>";
                        } else {
                           listHTML += "<td>N/A</td>";
                        }

                        // //Event Link
                        if(json._embedded.events[i].url != null) {
                           listHTML += "<td><a href='" + json._embedded.events[i].url + "' >Link to tickets </a></td>";
                        } else {
                           listHTML += "<td>No link available</td>";
                        }
                        listHTML += "</tr>";
                     }
                  } else {
                     listHTML+= "<tr><td id='no-concerts-for' colspan ='7'>No listed concerts in your area for "+ getKeyword(link)  +"</td></tr>";
                  }
               },
      error: function(xhr, status, err) {
                  console.log("error on", link);
                  console.log(xhr.status);
                  console.log(err);
                  // console.log(status.code);
               }
   });
   return listHTML;
}

function getKeyword (str) {
   const url = new URL(str);
   return decodeURI(url.searchParams.get('keyword'));
}

function getRecArtistLinks(data){
   var links = [];
   var url = "";
   if( localStorage.getItem("lat") == undefined || localStorage.getItem("lon") ==undefined || localStorage.getItem("radius") == undefined) {
      console.log("shiz undefined", localStorage.getItem("lat"), localStorage.getItem("lon"), localStorage.getItem("radius"));
      // localStorage.setItem("radius", 15);
      // localStorage.setItem("lat",47.65477);
      // localStorage.setItem("lon",-122.31273);
      navigator.geolocation.getCurrentPosition(locationSuccess2, locationError);
      event.preventDefault();
      
   } 
   //go through all tracks for artists
   for(var i = 0; i < data.tracks.length; i++){
         //go through all artists in a track and make new link
         for(var k = 0; k < data.tracks[i].artists.length; k++){
            url = TM_EVENTS_LINK;
            url += "&keyword=" + encodeURI(data.tracks[i].artists[k].name);
            url += "&latlong=" + localStorage.getItem("lat") + "," + localStorage.getItem("lon");
            url += "&radius=" + $("#radius-entry").val();
            url += "&unit=miles&locale=*";
            if(!links.includes(url)) links.push(url);
         }
   }
   //this does compile links. Storage of lat and lon is a problem.
   return links;
}



// navigator.geolocation.getCurrentPosition(locationSuccess2, locationError);
// event.preventDefault();

//makeLink & send query.
function locationSuccess2(position) {
   const latitude = position.coords.latitude;
   var lat = latitude;
   const longitude = position.coords.longitude;
   var lon = longitude;
   const accuracy = position.coords.accuracy;
   //accuracy is in meters 
   // 1 meter is 0.0062137 miles
   var radius = Math.round(accuracy * 0.00062137);
   if(radius < 15) radius = 15;

  //Changing the radius in the query link
   var inputRad = $("#radius-entry").val();
   if(inputRad > radius){
      radius = inputRad;
   }

   localStorage.setItem("radius", radius);
   localStorage.setItem("lat",lat);
   localStorage.setItem("lon",lon);
}


function displayRecArtists(data){
   var recArtistsHTML = "<h3>Recommended Artists</h3><ul>";
   var artists = "";
   var artistObject = [];
   //loop through suggestions
   for(var i = 0; i < data.tracks.length; i++) {
      artists = data.tracks[i].artists[0].name;
      if(!artistObject.includes(artists)) artistObject.push(artists);
      recArtistsHTML += "<li>" + artists + "</li>";
      for(var art = 1; art < data.tracks[i].artists.length; art++){
         if(!artistObject.includes(data.tracks[i].artists[art].name)) artistObject.push(data.tracks[i].artists[art].name);
         artists += ", " + data.tracks[i].artists[art].name;
         recArtistsHTML += "<li>" + data.tracks[i].artists[art].name + "</li>";
      }
   }
   recArtistsHTML +="</ul>";
   $('#spotify-rec-results').html(recArtistsHTML);
}