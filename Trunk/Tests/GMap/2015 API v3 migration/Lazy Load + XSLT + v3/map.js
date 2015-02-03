function loadMapAPI()
{
	alert("loadMapAPI()");

      var script = document.createElement("script");
      script.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=AIzaSyDcQ9gkvF86w2Nz2nhOVyQ6h1ahMnD2hDA&callback=mapAPILoaded");
      script.setAttribute("type", "text/javascript");
      document.documentElement.firstChild.appendChild(script);
	
	alert("loadMapAPI() - DONE");
}

function showMap()
{
    alert("showMap()");

       var mapOptions = {
          center: { lat: 37.4419, lng: -122.1419},
          zoom: 4
        };
        var map = new google.maps.Map(document.getElementById('map'),
            mapOptions);
}

function mapAPILoaded()
{
    alert("API loaded!");
}

window.onload = loadMapAPI;