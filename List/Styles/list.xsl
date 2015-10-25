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
            <link href="Styles/list.css" rel="stylesheet" />
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
        <div class="chapter">
            <xsl:apply-templates />
        </div>
    </xsl:template>
        
    <xsl:template match="Paragraph">
        <p align="left" class="paragraph-title"><xsl:value-of select="@Title"/></p>
        <div class="paragraph">
            <xsl:apply-templates />
        </div>
    </xsl:template>

    <xsl:template match="EventTable">
        <div class="events-table">
            <xsl:apply-templates />
        </div>
    </xsl:template>
    
    <xsl:template match="EventItem">
        <div class="event-row">
            <div class="event-image">
                <!--<img src="{@Pic}" alt="{@Pic}"/>-->
                <xsl:text disable-output-escaping="yes">&lt;img src=</xsl:text>"<xsl:value-of select="@Pic"/>"<xsl:text disable-output-escaping="yes">/&gt;</xsl:text>
            </div>
            <div class="event-description">
                <div>
                    <div class="event-title"><xsl:value-of select="@Title"/></div>
                    <div class="event-dates"><xsl:value-of select="@Date"/></div>
                    <div class="event-text1"><xsl:value-of select="@Desc1"/></div>
                    <div class="event-text2"><xsl:value-of select="@Desc2"/></div>
                </div>
            </div>
            <div class="event-links">
                <div>
                    <xsl:if test="@AlbumLocal">
                        <p><a href="{@AlbumLocal}" target="_blank">Фотографии на компьютере</a></p>
                    </xsl:if>
                    <xsl:if test="@AlbumWeb">
                        <p><a href="{@AlbumWeb}" target="_blank">Фотографии в интернете</a></p>
                    </xsl:if>
                    <xsl:if test="@TreckLocal">
                        <p><a href="{@TreckLocal}" target="_blank">Трек на компьютере</a></p>
                    </xsl:if>
                    <xsl:if test="@TrackWeb">
                        <p><a href="{@TrackWeb}" target="_blank">Трек в интернете</a></p>
                    </xsl:if>
                </div>
            </div>
        </div>
        <xsl:apply-templates />
    </xsl:template>
                
</xsl:stylesheet>
