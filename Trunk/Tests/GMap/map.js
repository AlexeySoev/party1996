function showMap()
{
    alert("showMap()");
    var map = new GMap2(document.getElementById("Mymap"));
    map.setCenter(new GLatLng(37.4419, -122.1419), 13);
}