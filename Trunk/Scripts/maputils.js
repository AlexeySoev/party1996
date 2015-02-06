	function loadMapAPI()
	{
		var script = document.createElement("script");
		
		//v.2
		script.setAttribute("src", "http://maps.google.com/maps?file=api&amp;v=2.88&amp;key=ABQIAAAA1cyBAHrOeSe9b0ZoaFAK3hT2yXp_ZAY8_ufC3CFXhHIE1vwkxSyZva3bCOrJkD906auWtIUk_qBZw&callback=mapAPILoaded");
		//v.3
		//script.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=AIzaSyDcQ9gkvF86w2Nz2nhOVyQ6h1ahMnD2hDA&callback=mapAPILoaded");

		script.setAttribute("type", "text/javascript");
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	function mapAPILoaded()
	{
		//the method itself IS necessary to get async load of Google Map API
		//alert("API loaded!");
		
		//but this is not necessary to get Google Map API working
		//it's for loading the first track in the list
		if (document.getElementById("GPSTrackLink"))
			document.getElementById("GPSTrackLink").children[0].click();
	}

	window.onload = loadMapAPI;
	
	///////////////////////////////////////////////////////////////////////////////////////

    var g_map;

	//for analyse
	var g_trackPoints; 	// array of GLatLng objects - result of analysing track file
	var g_trackMarkers; // array of GMarker objects - result of analysing track file
	
	var g_trackTitle;
	var g_trackZoomIndex = 1;
	var g_trackCenterPoint;
	
	var g_isMapCenteredAndZoomed = true;
	
	//for simulation
	var g_index = 0;
	var g_timerID = 0;
	var g_trackDistanceTotal = 0;
	var g_trackStartTime;
	//var g_prevDateObj;
	var g_snakePolyline;
	var g_xmlPoints; // used in simulation to get altitude and time for the corresponding GLatLng point
						
	var	e_start = 1;
	var	e_play = 2;
	var	e_pause = 3;
	
	//constants
	var gc_msPerMin = 1000 * 60;
	var	gc_msPerHour = gc_msPerMin * 60;
	//var gc_msPerDay = gc_msPerHour * 24;
			
	function renderMap(p_trackFile, p_title)
	{
		if (GBrowserIsCompatible()) {
		
			document.getElementById('trackName').innerHTML = "<i>...initializing</i>";
			
			g_trackTitle = p_title;
			g_isMapCenteredAndZoomed = GetCenterAndZoomCheckBoxState();
						
			ShowTrackInfo("0.0","","","","0.0","0.0","0","0","0");
			HideSimulateInfo();
									
			window.clearTimeout(g_timerID);
			if (g_map == null)
			{
				g_map = new GMap2(document.getElementById("map"));	
				// not supported by v2 any more
				//g_map.addControl(new GSmallMapControl());
				//g_map.addControl(new GMapTypeControl());
				//g_map.addControl(new GScaleControl());
			}
			g_map.clearOverlays();
						
			loadFile(p_trackFile);
		}
	}
        
    function loadFile(p_trackFile)
    {
		document.getElementById('trackName').innerHTML = "<i>...loading</i>";
				
		var a_request = GXmlHttp.create();
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
		
        g_xmlPoints = p_xmlDoc.documentElement.getElementsByTagName("m");
        var a_xmlMarkers = p_xmlDoc.documentElement.getElementsByTagName("p");

        g_trackPoints = analyzeTrack(g_xmlPoints);
        g_trackMarkers = parseMarkers(a_xmlMarkers);

        var a_bounds = getBounds(g_trackPoints, g_trackMarkers);
        g_trackZoomIndex = g_map.getBoundsZoomLevel(a_bounds);
        g_trackCenterPoint = a_bounds.getCenter();
        if (g_isMapCenteredAndZoomed)
            g_map.setCenter(g_trackCenterPoint, g_trackZoomIndex, G_HYBRID_MAP);
        
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
				
		var a_trackPoints = new Array();
			
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
													
				var a_gpoint = new GLatLng(a_lat, a_lng);
				a_trackPoints.push(a_gpoint);
				
				a_dateObj = ParseTimeString(a_time);
				
				if (a_alt < a_trackMinAltitude)
					a_trackMinAltitude = Math.round(a_alt)
				else if (a_alt > a_trackMaxAltitude)
					a_trackMaxAltitude = Math.round(a_alt)
							
				if (a_index != 0)
 				{
					var a_legDistance = a_gpoint.distanceFrom(a_prevPoint);
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
		
        return a_trackPoints;
    }

    function parseMarkers(p_markers) {
        var a_markers = new Array();
        for (var a_index = 0; a_index < p_markers.length; a_index++) {
            var a_marker = p_markers[a_index];
            a_lat = new Number(a_marker.getAttribute("lt"));
            a_lng = new Number(a_marker.getAttribute("lg"));
            a_text = a_marker.getAttribute("text");
            a_url = a_marker.getAttribute("url");
            a_urlname = a_marker.getAttribute("urlname");
            a_markers.push(createMarker(new GLatLng(a_lat, a_lng), a_text, a_url, a_urlname));
        }
        return a_markers;
    }

    function createMarker(point, text, url, urlname) {
        /*
        var icon = new GIcon();
        icon.image = "http://labs.google.com/ridefinder/images/mm_20_orange.png";
        icon.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
        icon.iconSize = new GSize(12, 20);
        icon.shadowSize = new GSize(22, 20);
        icon.iconAnchor = new GPoint(6, 20);
        icon.infoWindowAnchor = new GPoint(5, 1);*/

        //var marker = new GMarker(point, icon);

        var message = text;
        if (url != null) {
            if (urlname != null)
                message = message + "<br><a target='_blank' href='" + url + "'>" + urlname + "</a>"
            else
                message = message + "<br><a target='_blank' href='" + url + "'>" + url + "</a>"
        }

        var marker = new GMarker(point);
        GEvent.addListener(marker, "click", function()
        { marker.openInfoWindowHtml(message); });
        return marker;
    }

    function getBounds(p_gpoints, p_gmarkers) {
        var a_trackBounds = new GLatLngBounds();

        if (p_gpoints.length == 0) {
            for (var a_index = 0; a_index < p_gmarkers.length; a_index++)
                a_trackBounds.extend(p_gmarkers[a_index].getPoint());
        }
        else {
            for (var a_index = 0; a_index < p_gpoints.length; a_index++)
                a_trackBounds.extend(p_gpoints[a_index]);
        }
        return a_trackBounds;
    }
	
	function drawTrack()
	{
	    g_map.clearOverlays();
		g_map.addOverlay(new GPolyline(g_trackPoints, "#ff4500", 3, 1));
		for (var i = 0; i < g_trackMarkers.length ; i++)
			g_map.addOverlay(g_trackMarkers[i]);
	}
		
	function drawNextPoint()
	{
		if (g_index < g_xmlPoints.length)
		{
			var a_data = g_xmlPoints[g_index];
			var a_alt = a_data.getAttribute("al");
			var a_time = a_data.getAttribute("tm");
			var a_dateObj = ParseTimeString(a_time);
			var a_point = g_trackPoints[g_index];
			
			// Re-center map 
			if (g_isMapCenteredAndZoomed)
			{
				// only if "snake" go outside of the map
				if (!g_map.getBounds().containsLatLng(a_point))
					g_map.panTo(a_point);
			}
			
			if (g_snakePolyline == null)
			{
				var a_array = [];
				a_array.push(a_point);
				g_snakePolyline = new GPolyline(a_array, "#4682b4", 7, 1)
				g_map.addOverlay(g_snakePolyline);
			}
			
 			if (g_index > 0)
 			{
 				g_snakePolyline.insertVertex(g_snakePolyline.getVertexCount(), a_point); 

				var a_snakeDistance = g_snakePolyline.getLength();
				// Limit "snake" length by 1/20 of the map width or by 100 points, but not less than 5 points
				if(g_snakePolyline.getVertexCount() > 5)
				{
					var a_allMapDistance = g_map.getBounds().getSouthWest().distanceFrom(g_map.getBounds().getNorthEast());
					while (a_snakeDistance !=0 && a_allMapDistance/a_snakeDistance < 20 || g_snakePolyline.getVertexCount() > 100)
					{
						g_snakePolyline.deleteVertex(0);
						a_snakeDistance = g_snakePolyline.getLength();
					}
				}
 				
 				var a_prevPoint = g_trackPoints[g_index - 1];
				var a_legDistance = a_point.distanceFrom(a_prevPoint);
	 			g_trackDistanceTotal = g_trackDistanceTotal + a_legDistance;
				
				var a_currentSpeed = 0;
				//current speed is changing very fast and it's not convenient to see this
				//so show average speed of the snake instead
				/*
				if (a_legDistance != 0 && (a_dateObj - g_prevDateObj) != 0)
					a_currentSpeed = a_legDistance/((a_dateObj - g_prevDateObj)/3600);
				*/
				var a_firstPointInSnake = g_xmlPoints[g_index+1 - g_snakePolyline.getVertexCount()];
				var a_timeOfFirstPointInSnake = a_firstPointInSnake.getAttribute("tm");
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
		g_index=0;
		if (g_snakePolyline != null)
		{
			g_map.removeOverlay(g_snakePolyline);
			g_snakePolyline = null;
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
			g_map.removeOverlay(g_snakePolyline);
			g_snakePolyline = null;
		}
		
		if (g_isMapCenteredAndZoomed)
			g_map.setCenter(g_trackCenterPoint, g_trackZoomIndex, G_HYBRID_MAP);
	}
			
	function SetButtonsState(p_state)
	{	
		switch (p_state)
		{
		case e_start:
			document.getElementById('simulateBtn').style.visibility = 'visible'
			document.getElementById('pauseBtn').style.visibility = 'hidden'
			document.getElementById('resumeBtn').style.visibility = 'hidden'
			document.getElementById('stopBtn').style.visibility = 'hidden'
			ShowSimulateInfo("", "", "0.0", "0", "0");
			break;
		case e_play:
			document.getElementById('simulateBtn').style.visibility = 'hidden'
			document.getElementById('pauseBtn').style.visibility = 'visible'
			document.getElementById('resumeBtn').style.visibility = 'hidden'
			document.getElementById('stopBtn').style.visibility = 'visible'
			break;
		case e_pause:
			document.getElementById('simulateBtn').style.visibility = 'hidden'
			document.getElementById('pauseBtn').style.visibility = 'hidden'
			document.getElementById('resumeBtn').style.visibility = 'visible'
			document.getElementById('stopBtn').style.visibility = 'visible'
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
		document.getElementById('divModulation').style.visibility = "visible";
		document.getElementById('time').innerHTML = "<b>"+fix(p_time)+"</b>";
		document.getElementById('timeEnroute').innerHTML = "<b>"+fix(p_timeEnroute)+"</b>";
	 	document.getElementById('distance').innerHTML = "<b>"+fix(p_distance)+"</b>";
	 	document.getElementById('speed').innerHTML = "<b>"+fix(p_speed)+"</b>";
	 	document.getElementById('elevation').innerHTML = "<b>"+fix(p_elevation)+"</b>";
	}	
			
	function HideSimulateInfo()
	{
		document.getElementById('divModulation').style.visibility = 'hidden';
		// is this hiding really useful?
		//document.getElementById('simulateBtn').style.visibility = 'hidden'
		//document.getElementById('pauseBtn').style.visibility = 'hidden'
		//document.getElementById('resumeBtn').style.visibility = 'hidden'
		//document.getElementById('stopBtn').style.visibility = 'hidden'
	}
			
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
	
	function CenterAndZoomMap()
	{
		if (g_isMapCenteredAndZoomed)
			g_isMapCenteredAndZoomed = false;
		else
		{
			g_map.setCenter(g_trackCenterPoint, g_trackZoomIndex, G_HYBRID_MAP);
			g_isMapCenteredAndZoomed = true;
		}
	}
	
	function GetCenterAndZoomCheckBoxState()
	{
		return document.getElementById('chkCenterAndZoomMap').checked
	}
	
	function fix(str)
	{
		return str.toString().length == 0 ? "-" : str;
	}
	
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
