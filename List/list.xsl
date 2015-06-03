<?xml version="1.0" encoding="UTF-8" ?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/> 

    <xsl:template match="PageTemplate">
	    <html xmlns="http://www.w3.org/1999/xhtml">
		    <xsl:apply-templates />
	    </html>
    </xsl:template>

	<xsl:template match="PageHead">
		<head>
			<title><xsl:value-of select="@Title"/></title>
			<link href="list.css" rel="stylesheet" />
		</head>
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="PageBody">
		<body>
			<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
				<xsl:apply-templates />
			</table>
		</body>
	</xsl:template>
	
	<xsl:template match="PageElement">
		<tr><td>
			<xsl:apply-templates />
		</td></tr>
	</xsl:template>
		
	<xsl:template match="Chapter">
		<p align="left" class="chapter-title"><xsl:value-of select="@Title"/></p>
		<xsl:apply-templates />
		<p><br/><br/></p>
	</xsl:template>
		
	<xsl:template match="Paragraph">
	    <P align="left" class="paragraph-title"><xsl:value-of select="@Title"/></P>
	    <P align="justify">
		<xsl:apply-templates />
		</P>
	</xsl:template>

	<xsl:template match="EventTable">
		<table width="100%" cellspacing="0" border="1" style="table-layout:fixed;">
			<xsl:apply-templates />
		</table>
	</xsl:template>

	<xsl:template match="EventItem">
		<tr valign="top" align="left">
			<td width="360" height="240">
				<img src="{@Pic}" border="1" height="240" width="auto"/>
			</td>
			<td>
				<b><xsl:value-of select="@Title"/></b>
				<br/>
				<p><xsl:value-of select="@Desc1"/></p>
				<p><xsl:value-of select="@Desc2"/></p>
				<p><xsl:value-of select="@Desc3"/></p>
			</td>
			<td width="200">
				<br/>
				<br/>
				<a href="{@AlbumLocal}">Фотографии на компьютере</a>
				<br/>
				<br/>
				<a href="{@AlbumWeb}">Фотографии в интернете</a>
			</td>
			<td width="200">
				<br/>
				<br/>
				<a href="{@TreckLocal}">Трек на компьютере</a>
				<br/>
				<br/>
				<a href="{@TrackWeb}">Трек в интернете</a>
			</td>
		</tr>
		<xsl:apply-templates />
	</xsl:template>
   				
</xsl:stylesheet>
