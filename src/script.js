
$.ajax({
  type:"GET",
  url:"https://app.ticketmaster.com/discovery/v2/events.json?postalCode=98105&apikey=zPNTyXBzoiIlL8DqjRVpzG4gsAVl3EwR",
  async:true,
  dataType: "json",
  success: function(json) {
              console.log(json);
              // Parse the response.
              // Do other things.
           },
  error: function(xhr, status, err) {
              // This time, we do not end up here!
           }
});