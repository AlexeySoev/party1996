	function loadMapAPI()
	{
		var script = document.createElement("script");
		
		//v.3
		script.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=AIzaSyDcQ9gkvF86w2Nz2nhOVyQ6h1ahMnD2hDA&libraries=geometry&callback=mapAPILoaded");

		script.setAttribute("type", "text/javascript");
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	function mapAPILoaded()
	{
		//the method itself IS necessary to get async load of Google Map API
		//alert("API loaded!");
		
		//but any logic inside is not necessary to get Google Map API working
		//it's for loading the first track in the list
		if (document.getElementById("GPSTrackLink"))
			document.getElementById("GPSTrackLink").children[0].click();
	}
	
	function resizeMap()
	{
		var GAP_ABOVE_BELOW_MAP = 250;
		var MAP_MIN_SIZE = 410;
		var bodyheight = document.body.clientHeight;
		document.getElementById("map").style.height = bodyheight > GAP_ABOVE_BELOW_MAP + MAP_MIN_SIZE ? bodyheight - GAP_ABOVE_BELOW_MAP : MAP_MIN_SIZE;
	}

	window.onload = function(event) { 
		loadMapAPI();
		resizeMap();
	}
	
	window.onresize = function(event) {
		resizeMap();
	};
	
	///////////////////////////////////////////////////////////////////////////////////////

    var g_map;

	//for analyse
	var g_trackPoints; 	// array of google.maps.LatLng objects - result of analysing track file
	var g_trackMarkers; // array of google.maps.Marker objects - result of analysing track file
	var g_pointTimes; // array of g_trackPoints's times - used in simulation
	var g_pointAlts; // array of g_trackPoints's altitudes - used in simulation
	
	var g_trackTitle;
	var g_trackZoomIndex = 1;
	var g_trackCenterPoint;
	
	var g_isMapCenterAndZoomRequired = true;
	
	//for simulation
	var g_index = 0;
	var g_timerID = 0;
	var g_trackDistanceTotal = 0;
	var g_trackStartTime;
	//var g_prevDateObj;
	var g_snakePolyline;
	var g_trackPolyline;
					
	var	e_start = 1;
	var	e_play = 2;
	var	e_pause = 3;
	
	//constants
	var gc_msPerMin = 1000 * 60;
	var	gc_msPerHour = gc_msPerMin * 60;
	//var gc_msPerDay = gc_msPerHour * 24;
			
	function renderMap(p_trackFile, p_title)
	{
		document.getElementById('trackName').innerHTML = "<i>...initializing</i>";
		
		g_trackTitle = p_title;
		g_isMapCenterAndZoomRequired = GetCenterAndZoomCheckBoxState();
					
		ShowTrackInfo("0.0","","","","0.0","0.0","0","0","0");
		HideSimulateInfo();
								
		window.clearTimeout(g_timerID);
		if (g_map == null)
		{
			g_map = new google.maps.Map(document.getElementById("map"), 
				 {
					mapTypeId: google.maps.MapTypeId.HYBRID,
					scaleControl: true,
					zoomControl: true,
					rotateControl: false,
					panControl: false
                });	
				
			// add OSM
			var mapTypeIds = [];
            for(var type in google.maps.MapTypeId) {
                mapTypeIds.push(google.maps.MapTypeId[type]);
            }
            mapTypeIds.push("OSM");
				
			g_map.mapTypes.set("OSM", new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                },
                tileSize: new google.maps.Size(256, 256),
                name: "OpenStreetMap",
                maxZoom: 18
            }));
		
			g_map.setOptions({
				 mapTypeControlOptions: {
					mapTypeIds: mapTypeIds,
		        }
			});
		}
				
		loadFile(p_trackFile);
	}
        
    function loadFile(p_trackFile)
    {
		document.getElementById('trackName').innerHTML = "<i>...loading</i>";
				
		var a_request = new XMLHttpRequest();
		a_request.open("GET", p_trackFile, true);
		a_request.onreadystatechange = function() {
		    if (a_request.readyState == 4) {
		        var xmlDoc = a_request.responseXML;
		        //alert(xmlDoc.documentElement.xml)
		        ProcessFile(xmlDoc);
		    }
		}
		a_request.send(null);
    }

    function ProcessFile(p_xmlDoc)
    {
		document.getElementById('trackName').innerHTML = "<i>...analyzing</i>";
		
        var a_xmlPoints = p_xmlDoc.documentElement.getElementsByTagName("m");
        var a_xmlMarkers = p_xmlDoc.documentElement.getElementsByTagName("p");

        analyzeTrack(a_xmlPoints);
        g_trackMarkers = parseMarkers(a_xmlMarkers);

        var a_bounds = calculateBounds(g_trackPoints, g_trackMarkers);
		g_trackCenterPoint = a_bounds.getCenter();
        
        if (g_isMapCenterAndZoomRequired)
		{
            g_map.setCenter(g_trackCenterPoint);
			g_map.fitBounds(a_bounds);
			g_trackZoomIndex = g_map.getZoom();
		}
        
        SetButtonsState(e_start);

        document.getElementById('trackName').innerHTML = "<b>" + g_trackTitle + "</b>";

        drawTrack();
    }
	   	
	function analyzeTrack(p_points)
	{
	    var a_trackStartTime;
	    var a_trackFinishTime;
		var a_trackTimeEnroute;
		var a_trackDistance = new Number(0);
		var a_trackMinAltitude = new Number(99999);
		var a_trackMaxAltitude = new Number(-1000);
		var a_trackMaxSpeed = new Number(0);
		var a_trackAverageSpeed = new Number(0);
				
		g_trackPoints = new Array();
		g_pointTimes = new Array();
		g_pointAlts = new Array();
			
		if (p_points.length == 0)
		{
			a_trackStartTime = "";
			a_trackFinishTime = "";
			a_trackMinAltitude = 0;
			a_trackMaxAltitude = 0;
			a_trackDistance = 0;
			a_trackMaxSpeed = 0;
		}
		else
		{
			var a_lat, a_lng, a_alt, a_time;
			var a_dateObj;
			var a_prevPoint, a_prevDateObj;

			a_trackStartTime = p_points[0].getAttribute("tm");
			a_trackFinishTime = p_points[p_points.length - 1].getAttribute("tm");
			
			for (var a_index=0; a_index < p_points.length ; a_index++)
			{
				var a_point = p_points[a_index];
			
				a_lat = new Number(a_point.getAttribute("lt"));
				a_lng = new Number(a_point.getAttribute("lg"));
				a_alt = new Number(a_point.getAttribute("al"));
				a_time = a_point.getAttribute("tm");
													
				var a_gpoint = new google.maps.LatLng(a_lat, a_lng);
				g_trackPoints.push(a_gpoint);
				g_pointTimes.push(a_time);
				g_pointAlts.push(a_alt);
				
				a_dateObj = ParseTimeString(a_time);
				
				if (a_alt < a_trackMinAltitude)
					a_trackMinAltitude = Math.round(a_alt)
				else if (a_alt > a_trackMaxAltitude)
					a_trackMaxAltitude = Math.round(a_alt)
							
				if (a_index != 0)
 				{
					var a_legDistance = google.maps.geometry.spherical.computeDistanceBetween(a_gpoint, a_prevPoint);
					a_trackDistance += a_legDistance;
					var interval = a_dateObj - a_prevDateObj
					if (interval > 0)
					{
						var a_currentSpeed = new Number(a_legDistance/(interval/3600));
						if (a_currentSpeed > a_trackMaxSpeed)
							a_trackMaxSpeed = a_currentSpeed;
					}
	 			}
		 		
	 			a_prevPoint = a_gpoint;
	 			a_prevDateObj = a_dateObj;
			}
        }
		
		var a_trackStartTimeObj = ParseTimeString(a_trackStartTime);
		var a_trackFinishTimeObj = ParseTimeString(a_trackFinishTime);
							
		a_trackTimeEnroute = new Number(a_trackFinishTimeObj - a_trackStartTimeObj);
		
		if (a_trackDistance != 0 && a_trackTimeEnroute != 0)
			a_trackAverageSpeed = a_trackDistance/(a_trackTimeEnroute/3600);
							
		ShowTrackInfo(Math.round(a_trackDistance)/1000, a_trackStartTime, a_trackFinishTime, GetTimeIntervalString(a_trackStartTimeObj, a_trackFinishTimeObj), Math.round(a_trackMaxSpeed*100)/100, Math.round(a_trackAverageSpeed*100)/100, a_trackMinAltitude, a_trackMaxAltitude, Math.round(a_trackMaxAltitude-a_trackMinAltitude) );						
    }

    function parseMarkers(p_markers)
	{
        var a_markers = new Array();
        for (var a_index = 0; a_index < p_markers.length; a_index++) {
            var a_marker = p_markers[a_index];
            a_lat = new Number(a_marker.getAttribute("lt"));
            a_lng = new Number(a_marker.getAttribute("lg"));
            a_text = a_marker.getAttribute("text");
            a_url = a_marker.getAttribute("url");
            a_urlname = a_marker.getAttribute("urlname");
            a_markers.push(createMarker(new google.maps.LatLng(a_lat, a_lng), a_text, a_url, a_urlname));
        }
        return a_markers;
    }

    function createMarker(point, text, url, urlname)
	{
		var marker = new google.maps.Marker( { position: point } );
		
        var message = text;
        if (url != null) {
            if (urlname != null)
                message = message + "<br><a target='_blank' href='" + url + "'>" + urlname + "</a>"
            else
                message = message + "<br><a target='_blank' href='" + url + "'>" + url + "</a>"
        }
		
		var infoWindow = new google.maps.InfoWindow();
        
        google.maps.event.addListener(marker, "click", function()
			{
				infoWindow.setContent(message);
				infoWindow.open(g_map, marker);
			} );
			
        return marker;
    }

	// calculate map bounds to fit all trek points and markers
    function calculateBounds(p_gpoints, p_gmarkers) {
        var a_trackBounds = new google.maps.LatLngBounds();

        if (p_gpoints.length == 0) {
            for (var a_index = 0; a_index < p_gmarkers.length; a_index++)
                a_trackBounds.extend(p_gmarkers[a_index].getPosition());
        }
        else {
            for (var a_index = 0; a_index < p_gpoints.length; a_index++)
                a_trackBounds.extend(p_gpoints[a_index]);
        }
        return a_trackBounds;
    }
	
	function drawTrack()
	{
		if (g_trackPolyline == null)
		{
			g_trackPolyline = new google.maps.Polyline();
			g_trackPolyline.setMap(g_map);
		}
		
		g_trackPolyline.setOptions( { path: g_trackPoints, strokeColor: "#ff4500", strokeWeight: 3 } );

		for (var i = 0; i < g_trackMarkers.length ; i++)
			g_trackMarkers[i].setMap(g_map);
	}
		
	////////////////////////////////////////////////////////////////////////////////////
	//simulate
	////////////////////////////////////////////////////////////////////////////////////
		
	function drawNextPoint()
	{
		if (g_index < g_trackPoints.length)
		{
			var a_alt = g_pointAlts[g_index];
			var a_time = g_pointTimes[g_index];
			var a_dateObj = ParseTimeString(a_time);
			var a_point = g_trackPoints[g_index];
			
			// Re-center map if requested
			if (g_isMapCenterAndZoomRequired)
			{
				// only if "snake" go outside of the map
				if (!g_map.getBounds().contains(a_point))
					g_map.panTo(a_point);
			}
			
			if (g_snakePolyline == null)
			{
				g_snakePolyline = new google.maps.Polyline( { path: [a_point], strokeColor: "#4682b4", strokeWeight: 7 } )
				g_snakePolyline.setMap(g_map);
			}
			
 			if (g_index > 0)
 			{
 				g_snakePolyline.getPath().push(a_point); 
				
				var a_snakeDistance = google.maps.geometry.spherical.computeLength(g_snakePolyline.getPath());
				// Limit "snake" length by 1/20 of the map width or by 100 points, but not less than 5 points
				if(g_snakePolyline.getPath().getLength() > 5)
				{
					var a_allMapDistance = google.maps.geometry.spherical.computeDistanceBetween(g_map.getBounds().getSouthWest(), g_map.getBounds().getNorthEast());
					while (a_snakeDistance !=0 && a_allMapDistance/a_snakeDistance < 20 || g_snakePolyline.getPath().getLength() > 100)
					{
						g_snakePolyline.getPath().removeAt(0);
						a_snakeDistance = google.maps.geometry.spherical.computeLength(g_snakePolyline.getPath());
					}
				}
 				
 				var a_prevPoint = g_trackPoints[g_index - 1];
				var a_legDistance = google.maps.geometry.spherical.computeDistanceBetween(a_point, a_prevPoint);
	 			g_trackDistanceTotal = g_trackDistanceTotal + a_legDistance;
				
				//instant speed is changing very fast and it's not convenient to see this
				//so show average speed of the snake instead of instant speed
				var a_currentSpeed = 0;
				/*
				if (a_legDistance != 0 && (a_dateObj - g_prevDateObj) != 0)
					a_currentSpeed = a_legDistance/((a_dateObj - g_prevDateObj)/3600);
				*/

				var a_timeOfFirstPointInSnake = g_pointTimes[g_index+1 - g_snakePolyline.getPath().getLength()];
				var a_dateObjOfFirstPointInSnake = ParseTimeString(a_timeOfFirstPointInSnake);
				
				if (a_snakeDistance != 0 && (a_dateObj - a_dateObjOfFirstPointInSnake) != 0)
					a_currentSpeed = a_snakeDistance/((a_dateObj - a_dateObjOfFirstPointInSnake)/3600);
			 
				ShowSimulateInfo(a_time, GetTimeIntervalString(g_trackStartTime, a_dateObj), Math.round(g_trackDistanceTotal)/1000, Math.round(a_currentSpeed), Math.round(a_alt));
			}
			else
			{
				g_trackDistanceTotal = 0;
				g_trackStartTime = a_dateObj;
			}
			
			//g_prevDateObj = a_dateObj;
			g_timerID = window.setTimeout(drawNextPoint, 50);
			g_index++;
		}
		else
		{
			window.clearTimeout(g_timerID);
			SetButtonsState(e_start);
		}
	}
	
	function playTrack()
	{
		g_index = 0;
		if (g_snakePolyline != null)
		{
			g_snakePolyline.getPath().clear();
		}
		
		SetButtonsState(e_play);
		drawNextPoint();
	}
		
	function pauseTrack()
	{
		window.clearTimeout(g_timerID);
		SetButtonsState(e_pause);
	}
		
	function resumeTrack()
	{
		SetButtonsState(e_play);
		drawNextPoint();
	}
		
	function stopTrack()
	{
		window.clearTimeout(g_timerID);
		SetButtonsState(e_start);
		
		if (g_snakePolyline != null)
		{
			g_snakePolyline.getPath().clear();
		}
		
		if (g_isMapCenterAndZoomRequired)
		{
			g_map.setCenter(g_trackCenterPoint);
			g_map.setZoom(g_trackZoomIndex);
		}
	}
			
	function SetButtonsState(p_state)
	{	
		switch (p_state)
		{
		case e_start:
			document.getElementById('simulateBtn').style.display = 'inline-block'
			document.getElementById('pauseBtn').style.display = 'none'
			document.getElementById('resumeBtn').style.display = 'none'
			document.getElementById('stopBtn').style.display = 'none'
			ShowSimulateInfo("", "", "0.0", "0", "0");
			break;
		case e_play:
			document.getElementById('simulateBtn').style.display = 'none'
			document.getElementById('pauseBtn').style.display = 'inline-block'
			document.getElementById('resumeBtn').style.display = 'none'
			document.getElementById('stopBtn').style.display = 'inline-block'
			break;
		case e_pause:
			document.getElementById('simulateBtn').style.display = 'none'
			document.getElementById('pauseBtn').style.display = 'none'
			document.getElementById('resumeBtn').style.display = 'inline-block'
			document.getElementById('stopBtn').style.display = 'inline-block'
			break;
		}
	}
		
	function ShowTrackInfo(p_trackDistance, p_trackStartTime, p_trackFinishTime, p_trackTimeEnroute, p_trackMaxSpeed, p_trackAverageSpeed, p_trackMinAltitude, p_trackMaxAltitude, p_trackDeltaAltitude)
	{
		document.getElementById('trackDistance').innerHTML = "<b>"+fix(p_trackDistance)+"</b>";
		document.getElementById('trackStartTime').innerHTML = "<b>"+fix(p_trackStartTime)+"</b>";
		document.getElementById('trackFinishTime').innerHTML = "<b>"+fix(p_trackFinishTime)+"</b>";
		document.getElementById('trackTimeEnroute').innerHTML = "<b>"+fix(p_trackTimeEnroute)+"</b>";
		document.getElementById('trackMaxSpeed').innerHTML = "<b>"+fix(p_trackMaxSpeed)+"</b>";
		document.getElementById('trackAverageSpeed').innerHTML = "<b>"+fix(p_trackAverageSpeed)+"</b>";
		document.getElementById('trackMinAltitude').innerHTML = "<b>"+fix(p_trackMinAltitude)+"</b>";
		document.getElementById('trackMaxAltitude').innerHTML = "<b>"+fix(p_trackMaxAltitude)+"</b>";
		document.getElementById('trackDeltaAltitude').innerHTML = "<b>"+fix(p_trackDeltaAltitude)+"</b>";
	}
		
	function ShowSimulateInfo(p_time, p_timeEnroute, p_distance, p_speed, p_elevation)
	{
		document.getElementById('divModulation').style.display = "block";
		document.getElementById('time').innerHTML = "<b>"+fix(p_time)+"</b>";
		document.getElementById('timeEnroute').innerHTML = "<b>"+fix(p_timeEnroute)+"</b>";
	 	document.getElementById('distance').innerHTML = "<b>"+fix(p_distance)+"</b>";
	 	document.getElementById('speed').innerHTML = "<b>"+fix(p_speed)+"</b>";
	 	document.getElementById('elevation').innerHTML = "<b>"+fix(p_elevation)+"</b>";
	}	
			
	function HideSimulateInfo()
	{
		document.getElementById('divModulation').style.display = 'none';
	}
	
	function GetCenterAndZoomCheckBoxState()
	{
		return document.getElementById('chkCenterAndZoomMap').checked
	}
	
	function CenterAndZoomMap()
	{
		if (g_isMapCenterAndZoomRequired)
			g_isMapCenterAndZoomRequired = false;
		else
		{
			g_map.setCenter(g_trackCenterPoint);
			g_map.setZoom(g_trackZoomIndex);
			g_isMapCenterAndZoomRequired = true;
		}
	}

	////////////////////////////////////////////////////////////////////////////////////
	//helpers
	////////////////////////////////////////////////////////////////////////////////////
		
	function ParseTimeString(p_time)
	{
		//doesn't work
		//var p_timeObj = new Date(p_time)
				
		//try this one
		a_hour = p_time.substr(0,2)
		a_minute = p_time.substr(3,2)
		a_second = p_time.substr(6,2)
		a_day = p_time.substr(9,2)
		a_month = p_time.substr(12,2)
		a_year = p_time.substr(15,4)
		return new Date(a_year, a_month, a_day, a_hour, a_minute, a_second);
	}
		
	function GetTimeIntervalString(p_startTime, p_finishTime)
	{
		var a_interval = new Number(p_finishTime - p_startTime)
		
		// Calculate how many days the interval contains, then subtract that
		// many days from the interval to come up with a remainder.
		//a_days = Math.floor( a_interval / gc_msPerDay );
		//a_interval -= (a_days * gc_msPerDay );

		// Repeat the previous calculation on the remainder using hours,
		// then subtract the hours from the remainder.
		a_hours = Math.floor( a_interval / gc_msPerHour );
		a_interval -= (a_hours * gc_msPerHour );

		a_minutes = Math.floor( a_interval / gc_msPerMin );
		a_interval -= (a_minutes * gc_msPerMin );

		a_seconds = Math.floor( a_interval / 1000 );
		
		if (a_hours < 10)
			a_hours = "0" + a_hours
			
		if (a_minutes < 10)
			a_minutes = "0" + a_minutes
			
		if (a_seconds < 10)
			a_seconds = "0" + a_seconds
			
		return a_hours + ":" + a_minutes + ":" + a_seconds;
	}
	
	function fix(str)
	{
		return str.toString().length == 0 ? "-" : str;
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	
	/*
	function toggle(nr)
	{
		if (document.layers){
  		var	vista = (document.layers[nr].visibility == 'hide') ? 'show' : 'hide'
  		document.layers[nr].visibility = vista;
  		}
		else if (document.all){
  		var	vista = (document.all[nr].style.visibility == 'hidden') ? 'visible'	: 'hidden';
  		document.all[nr].style.visibility = vista;
  		}
  		else if (document.getElementById){
		var	vista = (document.getElementById(nr).style.visibility == 'hidden') ? 'visible' : 'hidden';
		document.getElementById(nr).style.visibility = vista;
		}
	}
	*/
