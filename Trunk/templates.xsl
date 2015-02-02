<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE MyPage [
<!ENTITY Root "file://localhost/D:/!Party/Trunk">
<!ENTITY TestRoot1 "http://localhost/party1996">
<!ENTITY TestRoot2 "http://party1996.narod.ru">
<!ENTITY ScriptsDir "&Root;/Scripts">
<!ENTITY PicsDir "&Root;/Pics">
]>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/> 

    <xsl:template match="PageTemplate">
	    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
		    <xsl:apply-templates />
	    </html>
    </xsl:template>

	<xsl:template match="PageHead">
		<head>
			<title>
                Первый сайт Партии Любителей - <xsl:value-of select="@Title"/>
			</title>

			<STYLE>.spanstyle {
				COLOR: #ff0000; FONT-FAMILY: Verdana; FONT-SIZE: 10pt; FONT-WEIGHT: bold; POSITION: absolute; TOP: -50px; VISIBILITY: visible
			}
			</STYLE>
			
			<style type="text/css">
				v\:* {
					behavior:url(#default#VML);
				}
			</style>
			
			<STYLE>.gpslabel {
				width:330px
			}
			</STYLE>
			
			<STYLE>.gpsvalue {
				width:190px
			}
			</STYLE>
		
		</head>
		
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="PageBody">
		<body background="&PicsDir;/background.jpg">
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
	
	<xsl:template match="MainMenu">
		<table width="100%" border="0" cellspacing="2" cellpadding="5" align="center">
		<tr>
			<td colspan="9">
				<font color="Black" style="font-size: 24pt">
				<b>Первый сайт Партии Любителей</b>
				</font>
			</td>
		</tr>
		<tr bgcolor="#ccffff" align="center">
		<td><a href="&Root;/index.html" target="_top">На главную</a></td>
		<td><a href="http://party1996.narod.ru/gb" target="_top">Гостевая книга</a></td>
		<td><a href="&Root;/History/history.xml" target="_top">Фрагменты нашей истории</a></td>
		<td><a href="&Root;/Members/members.xml" target="_top">Наша гордость</a></td>
		<td><a href="&Root;/Album/album.xml" target="_top">Альбом</a></td>
		<td><a href="&Root;/Tracks/Tracks.xml" target="_top">GPS Треки</a></td>
		<td><a href="&Root;/Funs/funs.xml" target="_top">Приколись</a></td>
		<td><a href="&Root;/Personal/Personal.xml" target="_top">Персональное</a></td>
		<td><a href="&Root;/links.xml" target="_top">Линки</a></td>
		</tr>
		</table>
		<br />
		<xsl:apply-templates />
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
	
	<xsl:template match="Emphasize">
		<FONT size="+1"><I><B>
		<xsl:apply-templates />
		</B></I></FONT>
	</xsl:template>
	
	<xsl:template match="Line">
		<xsl:apply-templates />
		<BR /> 
	</xsl:template>

	<xsl:template match="List">
		<UL>
			<xsl:apply-templates />
		</UL>
	</xsl:template>

	<xsl:template match="ListItem">
		<LI>
			<xsl:apply-templates />
		</LI>
	</xsl:template>

	<!--
	<xsl:template name="LinkResolver">
		<xsl:param name="RelativeSrc" />
		<xsl:param name="Src" />
		<xsl:choose>
			<xsl:when test="$RelativeSrc[.!='']">
				<xsl:attribute name="Src">/&Root;/<xsl:value-of select="$RelativeSrc"/></xsl:attribute>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$Src[.!='']">
						<xsl:attribute name="Src"><xsl:value-of select="$Src"/></xsl:attribute>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:apply-templates />
	</xsl:template>
	-->
	
	<xsl:template match="Link">
		<xsl:if test="not(@Target[.='child'])">
			<A href="{@Url}">
				<xsl:if test="@Target[.='more']">
					<xsl:attribute name="target">more</xsl:attribute>
				</xsl:if>
				<xsl:apply-templates />
			</A>
		</xsl:if>
		<xsl:if test="@Target[.='child']">
			<SCRIPT language="JavaScript" src="&ScriptsDir;/showwindow.js"></SCRIPT>
			<A href="javascript:%20showwindow('{@Url}', '{@Name}')">
				<xsl:apply-templates />
			</A>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="LinkWithDescription">
		<xsl:if test="not(@Target[.='child'])">
			<A href="{@Url}">
				<xsl:if test="@Target[.='more']">
					<xsl:attribute name="target">more</xsl:attribute>
				</xsl:if>
				<xsl:value-of select="@Text"/>
			</A>
		</xsl:if>
		<xsl:if test="@Target[.='child']">
			<SCRIPT language="JavaScript" src="&ScriptsDir;/showwindow.js"></SCRIPT>
			<A href="javascript:%20showwindow('{@Url}', '{@Name}')">
				<xsl:value-of select="@Text"/>
			</A>
		</xsl:if>
		<BR /> 
		<xsl:apply-templates />
		<BR /> 
		<BR /> 
	</xsl:template>
	
	<xsl:template match="LinkToImage">
		<SCRIPT language="JavaScript" src="&ScriptsDir;/showpic.js"></SCRIPT>
		<A href="javascript:%20showpic('{@Url}','{@H}','{@V}')">
		<xsl:apply-templates />
		</A>
	</xsl:template>
		
	<xsl:template match="Image">
		<table border="0" width="100%" cellspacing="3" cellpadding="3" align="center">
		<tr>
		<td width="1">
		<center>
		<IMG SRC="{@Src}" border="0" HSPACE="0" VSPACE="0">
		
		<!--
		<xsl:call-template name="LinkResolver"> 
			<xsl:with-param name="RelativeSrc" select="@RelativeSrc" />
			<xsl:with-param name="Src" select="@Src" />
		</xsl:call-template>
		-->
										
		<xsl:if test="@H">
				<xsl:attribute name="HEIGHT"><xsl:value-of select="@H"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="@V">
				<xsl:attribute name="WIDTH"><xsl:value-of select="@V"/></xsl:attribute>
		</xsl:if>
		</IMG>
		</center>
		</td>
		<td valign="top" align="left">
		<xsl:apply-templates />
		</td>
		</tr>
		</table>
	</xsl:template>
	
	<xsl:template match="Counter">
			<p align="center"><a href="http://narod.yandex.ru" target="_top"><img src="http://narod.yandex.ru/images/u_templ/narod.gif" border="0" /></a></p>
			<xsl:apply-templates />
	</xsl:template>
	
			
	<!-- *** Photo Album support -->
		
	
	<xsl:template match="Photo">
		<div align="center">
			<table border="0" cellpadding="2" cellspacing="2" width="100%">
				<tr>
					<td width="30%" align="left" valign="top">
						<P><FONT color="#003399" size="5"><STRONG><xsl:value-of select="@Title"/></STRONG></FONT></P>
					</td>
					
					<td>
						<div align="center">
							<table border="2" cellpadding="2" cellspacing="2">
								<tr>
									<td width="30"></td>
									<td rowspan="4" align="center"><img src="{@Src}" border="0"/></td>
									<td width="30"></td>
								</tr>
							</table>
						</div>
					</td>
					<td width="30%"></td>
				</tr>
			</table>
		</div>
		
		<xsl:apply-templates />
	</xsl:template>
	
	<xsl:template match="Thumbnail">
		<td align="center">
		<a href="javascript:%20showphoto('{@Url}', '&Root;/templates.xsl', '{@Title}')"><img src="thumbnails/{@Url}.JPG" border="0" HEIGHT="60"/></a>
		</td>
		<xsl:apply-templates />	
	</xsl:template>
	
	<xsl:template name="ThumbnailFunction">
		<xsl:param name="Url"/>
		<td align="center">
		<a href="javascript:%20showphoto('{$Url}', '&Root;/templates.xsl')"><img src="thumbnails/{$Url}.JPG" border="0" HEIGHT="75"/></a>
		</td>
		<xsl:apply-templates />	
	</xsl:template>
	
	<xsl:template name="for">
		<xsl:param name="i" select="0"/>
		<xsl:param name="n"/>
		<xsl:if test="$i &lt; $n">
			<xsl:call-template name="ThumbnailFunction">
				<xsl:with-param name="Url" select="$i + 1"/>
			</xsl:call-template>
			<xsl:call-template name="for">
				<xsl:with-param name="i" select="$i + 1"/>
				<xsl:with-param name="n" select="$n"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

    <xsl:template match="ThumbnailPage">
	    <html>
			<head><meta http-equiv="Content-Type" content="text/html;" charset="UTF-8" /></head>
			<SCRIPT src="&ScriptsDir;/showphoto.js">error_preventing_string_for_FireFox3.0</SCRIPT>
			<body background="&PicsDir;/background.jpg">
			<div align="center">
			<table border="0" cellpadding="6" cellspacing="0">
				<tr valign="bottom" align="center">				
					
					<xsl:choose>
						<xsl:when test="@Auto[.='true']">
					 		<xsl:call-template name="for">
								<xsl:with-param name="n" select="@Count"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:apply-templates />	
						</xsl:otherwise>
					</xsl:choose>
					
				</tr>
			</table>
			</div>
			</body>
		</html>
    </xsl:template>
    
    <xsl:template match="AlbumPage">
	    <html>
			<head>
				<title>
					Первый сайт Партии Любителей - Альбом - <xsl:value-of select="@Title"/>
				</title>
				<meta http-equiv="Content-Type" content="text/html;" charset="UTF-8" />
				<SCRIPT src="&ScriptsDir;/showphoto.js"></SCRIPT>
			</head>
			<FRAMESET frameborder="no" border="0" rows="*,120">
				<xsl:attribute name="onload">
					makethumbs(
						<xsl:value-of select="@Count"/>,
						"&Root;/templates.xsl",
						"<xsl:value-of select="@Title"/>"
					)
				</xsl:attribute>
				<FRAME NAME="TopFrame" scrolling="YES" />
				<FRAME NAME="BottomFrame" scrolling="YES" />
			</FRAMESET>
		</html>
		<xsl:apply-templates />	
    </xsl:template>
    
    
    <!-- *** End of Photo Album support -->


	<!-- *** GPS Track List support -->


	<xsl:template match="TrackTable">
		<div style="padding-left:32px">
			<table width="100%" cellspacing="0" align="center">
				<xsl:apply-templates />
			</table>
		</div>
	</xsl:template>

	<xsl:template match="TrackItem">
		<tr valign="top" align="left">
			<td width="24px" align="left">
				<xsl:if test="@GoogleUrl[.!='']">
					<A href="{@GoogleUrl}">
						<img src="&PicsDir;/earth_16_16.gif" border="0" />
					</A>
				</xsl:if>
			</td>
			<td width="400px" align="left">
				<A href="{@PageUrl}">
					<xsl:value-of select="@Name"/>
				</A>
			</td>
			<td width="500px" align="left">
				<xsl:apply-templates />
			</td>
		</tr>
	</xsl:template>


	<!-- *** End of GPS Track List support -->
        
    
    <!-- *** GPS Tracks support -->
        
        
    <xsl:template match="GPSTrackFrame">
		
			<script src="&ScriptsDir;/maputils.js" type="text/javascript"></script>
			    		
			<div style="width:150px; float:left; margin-left:1%;">
			
				<div style="height:30px" >
					<FONT color="#000000" size="3"><STRONG>
						<span style="text-align:left">Список треков</span>
					</STRONG></FONT>
				</div>			    		
			
			
				<xsl:apply-templates />	
			</div>
					
			<div style=" float:left; margin-left:1%;">
			
				<div class="gpslabel" style="height:30px" >
					<FONT color="#000000" size="3"><STRONG>
						<span style="text-align:left">Трек: </span></STRONG></FONT>
						<span style="text-align:left" id="trackName"></span>
				</div>
				
				<div style="padding:5px;">
												
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Начало движения:*
						</div>
						<div id="trackStartTime">
							<span style="text-align:right; margin-left:10px"></span>
						</div>
					</div>
					
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Oкончание движения:*
						</div>
						<div id="trackFinishTime">
							<span style="text-align:right; margin-left:10px"></span>
						</div>
					</div>
					
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Время в пути:
						</div>
						<div id="trackTimeEnroute">
							<span style="text-align:right; margin-left:10px"></span>
						</div>
					</div>
									
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Общая дистанция:
						</div>
						<div>
							<span style="text-align:right" id="trackDistance"><B>0.0</B></span>
							<span style="text-align:right; margin-left:10px"><B>км</B></span>
						</div>
					</div>
									
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Средняя скорость:
						</div>
						<div>
							<span style="text-align:right" id="trackAverageSpeed"><B>0.0</B></span>
							<span style="text-align:right; margin-left:10px"><B>км/ч</B></span>
						</div>
					</div>
					
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Максимальная скорость:**
						</div>
						<div>
							<span style="text-align:right" id="trackMaxSpeed"><B>0.0</B></span>
							<span style="text-align:right; margin-left:10px"><B>км/ч</B></span>
						</div>
					</div>
								
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Минимальная высота:
						</div>
						<div>
							<span style="text-align:left" id="trackMinAltitude"><B>0</B></span>
							<span style="text-align:left; margin-left:10px"><B>м</B></span>
						</div>
					</div>
					
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Максимальная высота:
						</div>
						<div>
							<span style="text-align:left" id="trackMaxAltitude"><B>0</B></span>
							<span style="text-align:left; margin-left:10px"><B>м</B></span>
						</div>
					</div>
				
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Перепад высоты:
						</div>
						<div>
							<span style="text-align:left" id="trackDeltaAltitude"><B>0</B></span>
							<span style="text-align:left; margin-left:10px"><B>м</B></span>
						</div>
					</div>
				
				</div>
				
				<br/>
				<br/>
				
				<div id="divModulation" style="background-color:#eeeeee; background-image: none; border:1px solid grey; padding:5px; visibility:hidden;">
				
					<div style="background-color:#dddddd; padding:5px">
						<span><a href="javascript:simulateTrack()" style="text-decoration:underline; visibility:hidden; padding:3px" id="simulateBtn">Старт</a></span>
						<span><a href="javascript:pauseTrack()" style="text-decoration:underline; visibility:hidden; padding:3px" id="pauseBtn">Пауза</a></span>
						<span><a href="javascript:resumeTrack()" style="text-decoration:underline; visibility:hidden; padding:3px" id="resumeBtn">Продолжить</a></span>
						<span><a href="javascript:stopTrack()" style="text-decoration:underline; visibility:hidden; padding:3px" id="stopBtn">Стоп</a></span>
					</div>
					
					<br/>
					
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Время:*
						</div>
						<div id="time" />
					</div>
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Время в пути:
						</div>
						<div id="timeEnroute" />
					</div>
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Дистанция:
						</div>
						<div>
							<span style="text-align:left" id="distance"><B>0.0</B></span>
							<span style="text-align:left; margin-left:10px"><B>км</B></span>
						</div>
					</div>
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Скорость:
						</div>
						<div>
							<span style="text-align:left" id="speed"><B>0</B></span>
							<span style="text-align:left; margin-left:10px"><B>км/ч</B></span>
						</div>
					</div>
					<div class="gpslabel">
						<div style="float:left" class="gpsvalue">
							Высота:
						</div>
						<div>
							<span style="text-align:left" id="elevation"><B>0</B></span>
							<span style="text-align:left; margin-left:10px"><B>м</B></span>
						</div>
					</div>
				
				</div>
				
				<br/>
				
				<div class="gpslabel" style="padding:5px;">
					<FONT size="2">
						<span style="text-align:left; color:gray">* Время по Гринвичу.</span>
						<br/>
						<span style="text-align:left; color:gray">Париж, Стокгольм +1 (+2), Хельсинки +2 (+3),</span>
						<br/>
						<span style="text-align:left; color:gray">Москва,Петербург +3 (+4), Красноярск,Абакан +7 (+8)</span>
						<br/>
						<br/>
						<span style="text-align:left; color:gray">** Может глючить по страшному :)</span>
					</FONT>
				</div>
				
			</div>
			
			<div style="height:65%; width:50%; float:right; padding-right:2%; padding-left:2%; text-align:left;">
				<div id="map" style="height:500px; width:100%; border:1px solid grey;">
				</div>
				<br></br>
				<div>
					<input id="chkCenterAndZoomMap" type="checkbox" checked="checked" onclick="CenterAndZoomMap()">Центрировать и масштабировать карту при смене трека</input>
					<br/>
					<span style="text-align:left">(Рекомендуется отключить при просмотре последовательных треков)</span>
				</div>
			</div>
		
    </xsl:template>
        
    <xsl:template match="GPSTrackLink">
			<div style="TEXT-INDENT:-10px; PADDING-LEFT: 10px">
				<a href="javascript:renderMap('{@TrackFile}', '{@Title}')" style="text-decoration:underline">
					<xsl:value-of select="@Title"/>
				</a>
			</div>
		<xsl:apply-templates />	
    </xsl:template>

	
	<!-- *** End of GPS Tracks support -->
        
   				
</xsl:stylesheet>
