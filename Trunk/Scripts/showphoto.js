//////////// xml and xslt utils ////////////////////////

function loadXMLfromString(xml)
{
	//if (window.ActiveXObject) // for IE support
	if (window.ActiveXObject || "ActiveXObject" in window) // for IE 5-11 support
	{
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.validateOnParse=false;
		xmlDoc.loadXML(xml);
		return xmlDoc;
	} 
	else if (document.implementation && document.implementation.createDocument)
	{
		var objDOMParser = new DOMParser();
		return objDOMParser.parseFromString(xml, "text/xml");
	}
}

function loadXMLfromURL(xml)
{
	//if (window.ActiveXObject) // for IE support
	if (window.ActiveXObject || "ActiveXObject" in window) // for IE 5-11 support
	{
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.validateOnParse=false;
		xmlDoc.load(xml);
		return xmlDoc;
	} 
	else 
	{
		//doesn't work in Chrome, load method is undefined
		/*
		var xmlDoc = document.implementation.createDocument("","",null);
		xmlDoc.async=false;
		xmlDoc.validateOnParse=false;
		xmlDoc.load(xml);
		return xmlDoc;
		*/
	
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", xml, false);
		xmlhttp.setRequestHeader('Content-Type', 'text/xml');
		xmlhttp.overrideMimeType('text/xml');
		xmlhttp.send("");
		return xmlhttp.responseXML;
	}
}

function traceXML(xml)
{
	//if (window.ActiveXObject) // for IE support
	if (window.ActiveXObject || "ActiveXObject" in window) // for IE 5-11 support
	{
		alert(xml.xml)
	}
	else if (document.implementation && document.implementation.createDocument)
	{
		var oSerializer = new XMLSerializer();
		alert(oSerializer.serializeToString(xml.documentElement, "text/xml"));
	}
}

function transformXML(xml, xsl)
{
	//if (window.ActiveXObject) // for IE support
	if (window.ActiveXObject || "ActiveXObject" in window) // for IE 5-11 support
	{
		return xml.transformNode(xsl)
	} 
	else if (document.implementation && document.implementation.createDocument)
	{
		objXSLTProc = new XSLTProcessor();
		objXSLTProc.importStylesheet(xsl);
		var result = objXSLTProc.transformToDocument(xml);
		var oSerializer = new XMLSerializer();
		return oSerializer.serializeToString(result.documentElement, "text/xml");
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////////////


function showphoto(picname, xsltname, title) {
	var xml = loadXMLfromString("<?xml version='1.0' encoding='UTF-8'?><PageTemplate><PageHead/><PageBody><PageElement><MainMenu/></PageElement><PageElement><Photo Src='images/" + buildname(picname) + ".JPG' Title='" + title + "'/></PageElement></PageBody></PageTemplate>")
	var xsl = loadXMLfromURL(xsltname);
	var html = transformXML(xml, xsl);
	var picwin = window.open("", "TopFrame");
	picwin.document.write(html);
	picwin.document.close();
}

function makethumbs(count, xsltname, title) {

	//alert("makethumbs()");

	var xmltext = "<?xml version='1.0' encoding='UTF-8'?><ThumbnailPage>"
	for (i=1; i < count+1; i++)
		xmltext = xmltext + "<Thumbnail Url='" + buildname(i) + "' Title='" + title + "' />";
	xmltext = xmltext + "</ThumbnailPage>"
	
	var xml = loadXMLfromString(xmltext);
	var xsl = loadXMLfromURL(xsltname);
	var html = transformXML(xml, xsl);
	
	var picwin = window.open("", "BottomFrame");	
	picwin.document.write(html);
	picwin.document.close();

	showphoto(1, xsltname, title);
}

function buildname(name) {
	var len = name.toString(10).length;
	if (len == 2)
		name = "0" + name;
	if (len == 1)
		name = "00" + name; 
	return name;
}
