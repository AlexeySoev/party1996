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
			<title>
                <xsl:value-of select="@Title"/>
			</title>
		</head>
		
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="PageBody">
		<body>
		<table width="98%" border="0" cellpadding="0" cellspacing="0" align="center">
		<xsl:apply-templates />
		</table>
		</body>
	</xsl:template>
	
	<xsl:template match="PageElement">
		<tr><td>
			<xsl:apply-templates />
		</td></tr>
	</xsl:template>
	
	<xsl:template match="Title">
		<xsl:if test="@Epigraph">
				<P align="right"><FONT color="#ff0000" size="3"><STRONG><xsl:value-of select="@Epigraph"/></STRONG></FONT></P>
			</xsl:if>
		<P align="center"><FONT color="#000000" size="5"><STRONG><xsl:value-of select="@Text"/></STRONG></FONT></P>
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="Chapter">
		<xsl:if test="@Epigraph">
				<P align="right"><FONT color="#ff0000" size="3"><STRONG><xsl:value-of select="@Epigraph"/></STRONG></FONT></P>
			</xsl:if>
		<P align="justify"><FONT color="#003399" size="5"><STRONG><xsl:value-of select="@Title"/></STRONG></FONT></P>
		<xsl:apply-templates />
		<P align="justify"><FONT color="#003399" size="5"><STRONG>
		<BR />
		<BR />
		</STRONG></FONT></P>
	</xsl:template>
		
	<xsl:template match="Paragraph">
	    <P align="justify"><FONT color="#000000" size="3"><STRONG><xsl:value-of select="@Title"/></STRONG></FONT></P>
	    <P align="justify">
		<xsl:apply-templates />
		</P>
	</xsl:template>
	
	<xsl:template match="Line">
		<xsl:apply-templates />
		<BR /> 
	</xsl:template>

	<xsl:template match="EventTable">
			<table width="100%" cellspacing="0" align="center" border="1">
				<xsl:apply-templates />
			</table>
	</xsl:template>

	<xsl:template match="EventItem">
		<tr valign="top" align="left">
			<td width="360px" height="240px" align="left">
				<img src="{@Pic}" border="1" />
			</td>
			<td width="400px" align="left">
				<b><xsl:value-of select="@Title"/></b>
				<br />
				<br />
				<xsl:value-of select="@Desc"/>
			</td>
			<td width="200px" align="left">
				<br />
				<br />
				<a href="{@AlbumLocal}">Фотографии на компьютере</a>
				<br />
				<br />
				<a href="{@AlbumURL}">Фотографии в интернете</a>
				<xsl:apply-templates />
			</td>
			<td width="200px" align="left">
				<br />
				<br />
				<a href="{@TreckLocal}">Трек на компьютере</a>
				<br />
				<br />
				<a href="{@TrackURL}">Трек в интернете</a>
				<xsl:apply-templates />
			</td>
		</tr>
	</xsl:template>

   				
</xsl:stylesheet>
