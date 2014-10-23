var xsl = new ActiveXObject("Microsoft.XMLDOM");
xsl.async = false;

WScript.Echo(xsl.loadXML("<?xml version='1.0' encoding='windows-1251' ?><PageTemplate><PageHead/><PageBody><PageElement><MainMenu/></PageElement><PageElement><Photo Src='picname'/></PageElement></PageBody></PageTemplate>"));
WScript.Echo(xsl.xml);
//xsl.validateOnParse=false;
//xsl.load("F:\\My Storage\\My Projects\\WEB Site\\Party1996\\templates.xsl");
xsl.load("F:\\My Storage\\My Projects\\WEB Site\\Party1996\\photopage.xsl");
WScript.Echo(xsl.xml);
WScript.Echo(xsl.parseError.reason);


