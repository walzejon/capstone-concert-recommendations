# Concert Recommendation Application
*Designed and built by Jonathan Walzer* <br>
This application recommends concerts to a user by integrating Spotify's and Ticketmaster's APIs. The user logs into Spotify,
and selects a track from Spotify. The application then gets track recommendations from that input track from Spotify's recommendation
system. The application parses through the artists listed in each of these tracks (including featured artists) and searches Ticketmaster
for any events matching that artists' keyword.

This project is currently set up to run on a local machine and set to run with my personal Spotify developer account.

Important design updates TODO:
- allow user to search by zipcode 
- improve security
- improve CSS/visuals
- obtain consistency with Spotify's recommendation algorithm (searching the same song twice doesn't always yeild the same results)
- -> possibbly use cookies for this
- 
