//////////// xml and xslt utils ////////////////////////

function loadXML(xml)
{
	if (document.implementation && document.implementation.createDocument)
	{
		var objDOMParser = new DOMParser();
		return objDOMParser.parseFromString(xml, "text/xml");
	}
	else if (window.ActiveXObject)
	{
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.validateOnParse=false;
		xmlDoc.loadXML(xml);
		return xmlDoc;
	}
}

function loadXMLfile(xml)
{
	if (document.implementation && document.implementation.createDocument)
	{
		var xmlDoc = document.implementation.createDocument("","",null);
		xmlDoc.async=false;
		xmlDoc.validateOnParse=false;
		xmlDoc.load(xml);
		return xmlDoc;
	}
	else if (window.ActiveXObject)
	{
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.validateOnParse=false;
		xmlDoc.load(xml);
		return xmlDoc;
	}
}

function traceXML(xml)
{
	if (document.implementation && document.implementation.createDocument)
	{
		var oSerializer = new XMLSerializer();
		alert(oSerializer.serializeToString(xml.documentElement, "text/xml"));
	}
	else if (window.ActiveXObject)
	{
		alert(xml.xml)
	}
}

function transformXML(xml, xsl)
{
	if (document.implementation && document.implementation.createDocument)
	{
		objXSLTProc = new XSLTProcessor();
		objXSLTProc.importStylesheet(xsl);
		var result = objXSLTProc.transformToDocument(xml);
		var oSerializer = new XMLSerializer();
		return oSerializer.serializeToString(result.documentElement, "text/xml");
	}
	else if (window.ActiveXObject)
	{
		return xml.transformNode(xsl)
	}
}

///////////////////////////////////////////////////////

function showphoto(picname, xsltname, title) {
	var xml = loadXML("<?xml version='1.0' encoding='windows-1251' ?><PageTemplate><PageHead/><PageBody><PageElement><MainMenu/></PageElement><PageElement><Photo Src='images/" + buildname(picname) + ".JPG' Title='" + title + "'/></PageElement></PageBody></PageTemplate>")
	var xsl = loadXMLfile(xsltname);
	var html = transformXML(xml, xsl);
	var picwin = window.open("", "TopFrame");
	picwin.document.write(html);
	picwin.document.close();
}

function makethumbs(count, xsltname, title) {

	//alert("makethumbs()");

	var xmltext = "<?xml version='1.0' encoding='windows-1251' ?><ThumbnailPage>"
	for (i=1; i < count+1; i++)
		xmltext = xmltext + "<Thumbnail Url='" + buildname(i) + "' Title='" + title + "' />";
	xmltext = xmltext + "</ThumbnailPage>"
	
	var xml = loadXML(xmltext);
	var xsl = loadXMLfile(xsltname);
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