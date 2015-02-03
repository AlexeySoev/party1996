<?xml version="1.0" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" /> 
	
	<xsl:template match="Page">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<script src="map.js" type="text/javascript"></script>
			</head>
			<body>
				<a href="javascript:showMap()" style="text-decoration:underline">show map!</a>
				<div id="map" style="width: 500px; height: 400px"></div>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet> 