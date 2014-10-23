google.load("maps", "2");
google.setOnLoadCallback(initialize);


function initialize()
{
    alert("initialize()");
    var map = new google.maps.Map2(document.getElementById("Mymap"));
    map.setCenter(new google.maps.LatLng(37.4419, -122.1419), 13);
}

function showMap()
{
    alert("showMap()");
    google.load("maps", "2");
    alert("google loaded!");
    alert("finish");
}



