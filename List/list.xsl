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
			<div class="page">
				<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
					<xsl:apply-templates />
				</table>
			</div>
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
	    <p align="left" class="paragraph-title"><xsl:value-of select="@Title"/></p>
	    <p align="justify">
		<xsl:apply-templates />
		</p>
	</xsl:template>

	<xsl:template match="EventTable">
		<div class="events-table">
		<xsl:apply-templates />
		</div>
	</xsl:template>
	
	<xsl:template match="EventItem">
		<div class="event-row">
			<div class="event-image">
				<img src="{@Pic}" border="1" height="240" width="auto"/>
			</div>
			<div class="event-description">
				<div>
					<p class="event-title"><xsl:value-of select="@Title"/></p>
					<p class="event-dates"><xsl:value-of select="@Desc1"/></p>
					<p class="event-members"><xsl:value-of select="@Desc2"/></p>
					<p class="event-text"><xsl:value-of select="@Desc3"/></p>
				</div>
			</div>
			<div class="event-links">
				<div>
					<p><a href="{@AlbumLocal}">Фотографии на компьютере</a></p>
					<p><a href="{@AlbumWeb}">Фотографии в интернете</a></p>
					<p><a href="{@TreckLocal}">Трек на компьютере</a></p>
					<p><a href="{@TrackWeb}">Трек в интернете</a></p>
				</div>
			</div>
		</div>
		<xsl:apply-templates />
	</xsl:template>
   				
</xsl:stylesheet>
