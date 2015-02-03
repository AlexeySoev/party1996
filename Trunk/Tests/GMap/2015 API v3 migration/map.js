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