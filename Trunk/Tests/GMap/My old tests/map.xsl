<?xml version="1.0" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" /> 
	
	<xsl:template match="Page">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAA1cyBAHrOeSe9b0ZoaFAK3hT2yXp_ZAY8_ufC3CFXhHIE1NvwkxSyZva3bCOrJkD906auWtIUk_qBZw" type="text/javascript"></script>
				<script src="map.js" type="text/javascript"></script>
			</head>
			<body>
				<a href="javascript:showMap()" style="text-decoration:underline">show map!</a>
				<div id="Mymap" style="width: 500px; height: 400px"></div>
			</body>
		</html>
	</xsl:template>

	<xsl:template match="PageNew">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<script type="text/javascript" src="http://www.google.com/jsapi?key=ABQIAAAA1cyBAHrOeSe9b0ZoaFAK3hQ5KJAQZ1aEere3O5mYNzZjpvVp7RTej85BgqxjIIkYGag3FP5briAZLg"></script>
				<script src="map.new.js" type="text/javascript"></script>
			</head>
			<body>
				<a href="javascript:showMap()" style="text-decoration:underline">show map!</a>
				<div id="Mymap" style="width: 500px; height: 400px"></div>
			</body>
		</html>

	</xsl:template>

</xsl:stylesheet> 