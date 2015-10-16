<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE MyPage [
<!ENTITY Root "file://localhost/D:/!Party/Trunk">
<!ENTITY TestRoot1 "http://localhost/party1996">
<!ENTITY TestRoot2 "http://party1996.narod.ru">
<!ENTITY ScriptsDir "&Root;/Scripts">
<!ENTITY PicsDir "&Root;/Images">
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
			<title>Первый сайт Партии Любителей - <xsl:value-of select="@Title"/></title>
			<link href="&Root;/styles.css" rel="stylesheet" />
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
				<td colspan="9"><span class="site-title">Первый сайт Партии Любителей</span></td>
			</tr>
			<tr bgcolor="#ccffff" align="center">
				<td><a href="&Root;/index.html" target="_top">На главную</a></td>
				<td><a href="http://party1996.narod.ru/gb" target="_top">Гостевая книга</a></td>
				<td><a href="&Root;/History/history.xml" target="_top">Фрагменты нашей истории</a></td>
				<td><a href="&Root;/Members/members.xml" target="_top">Наша гордость</a></td>
				<td><a href="&Root;/Album/album.xml" target="_top">Альбом</a></td>
				<td><a href="&Root;/Tracks/tracks.xml" target="_top">GPS Треки</a></td>
				<td><a href="&Root;/Funs/funs.xml" target="_top">Приколись</a></td>
				<td><a href="&Root;/Personal/Personal.xml" target="_top">Персональное</a></td>
				<td><a href="&Root;/links.xml" target="_top">Линки</a></td>
			</tr>
		</table>
		<br/>
		<xsl:apply-templates />
	</xsl:template>
	
	<xsl:template match="Title">
		<xsl:if test="@Epigraph">
			<p class="epigraph"><xsl:value-of select="@Epigraph"/></p>
		</xsl:if>
		<p class="title"><xsl:value-of select="@Text"/></p>
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="Chapter">
		<xsl:if test="@Epigraph">
			<p class="epigraph"><xsl:value-of select="@Epigraph"/></p>
		</xsl:if>
		<p class="chapter-title"><xsl:value-of select="@Title"/></p>
		<xsl:apply-templates />
	</xsl:template>
		
	<xsl:template match="Paragraph">
	    <p class="paragraph-title"><xsl:value-of select="@Title"/></p>
	    <p align="justify">
            <xsl:apply-templates />
		</p>
	</xsl:template>
	
	<xsl:template match="Emphasize">
		<font size="+1"><i><b>
            <xsl:apply-templates />
		</b></i></font>
	</xsl:template>
	
	<xsl:template match="Line">
        <div>
            <xsl:apply-templates />
        </div>
	</xsl:template>

	<xsl:template match="List">
		<ul>
			<xsl:apply-templates />
		</ul>
	</xsl:template>

	<xsl:template match="ListItem">
		<li>
			<xsl:apply-templates />
		</li>
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
			<a href="{@Url}">
				<xsl:if test="@Target[.='more']">
					<xsl:attribute name="target">more</xsl:attribute>
				</xsl:if>
				<xsl:apply-templates />
			</a>
		</xsl:if>
		<xsl:if test="@Target[.='child']">
			<script src="&ScriptsDir;/showwindow.js"></script>
			<a href="javascript:%20showwindow('{@Url}', '{@Name}')">
				<xsl:apply-templates />
			</a>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="LinkWithDescription">
		<xsl:if test="not(@Target[.='child'])">
			<a href="{@Url}">
				<xsl:if test="@Target[.='more']">
					<xsl:attribute name="target">more</xsl:attribute>
				</xsl:if>
				<xsl:value-of select="@Text"/>
			</a>
		</xsl:if>
		<xsl:if test="@Target[.='child']">
			<script src="&ScriptsDir;/showwindow.js"></script>
			<a href="javascript:%20showwindow('{@Url}', '{@Name}')">
				<xsl:value-of select="@Text"/>
			</a>
		</xsl:if>
		<BR /> 
		<xsl:apply-templates />
		<BR /> 
		<BR /> 
	</xsl:template>
	
	<xsl:template match="LinkToImage">
		<script src="&ScriptsDir;/showpic.js"></script>
		<a href="javascript:%20showpic('{@Url}','{@H}','{@V}')">
		<xsl:apply-templates />
		</a>
	</xsl:template>
		
	<xsl:template match="Image">
		<table border="0" width="100%" cellspacing="3" cellpadding="3" align="center">
		<tr>
		<td width="1">
		<center>
		<img src="{@Src}" border="0" HSPACE="0" VSPACE="0">
		
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
		</img>
		</center>
		</td>
		<td valign="top" align="left">
		<xsl:apply-templates />
		</td>
		</tr>
		</table>
	</xsl:template>

	
	<!-- *** Photo Album support -->
		
	
	<xsl:template match="Photo">
		<script src="&ScriptsDir;/showphoto.js"></script>
		<div align="center">
			<table border="0" cellpadding="2" cellspacing="2" width="100%">
				<tr>
					<td style="width:150px;" align="left" valign="top">
						<p class="chapter-title"><xsl:value-of select="@Title"/></p>
					</td>
					<td align="center">
						<div align="center">
							<table border="2" cellpadding="2" cellspacing="2">
								<tr>
									<td style="width:50px;" onclick="javascript:showphoto({@Prev}, {@Count}, '&Root;/templates.xsl', '{@Title}')" onmouseover="this.style.backgroundColor = '#eeeeff';" onmouseout="this.style.backgroundColor = 'inherit';"></td>
									<td align="center"><img src="{@Src}" border="0" onclick="javascript:showphoto({@Next}, {@Count}, '&Root;/templates.xsl', '{@Title}')"/></td>
									<td style="width:50px;" onclick="javascript:showphoto({@Next}, {@Count}, '&Root;/templates.xsl', '{@Title}')" onmouseover="this.style.backgroundColor = '#eeeeff';" onmouseout="this.style.backgroundColor = 'inherit';"></td>
								</tr>
							</table>
						</div>
					</td>
					<td style="width:150px;"></td>
				</tr>
			</table>
		</div>
		
		<xsl:apply-templates />
	</xsl:template>
	
	<xsl:template match="Thumbnail">
		<td align="center">
		<a href="javascript:showphoto({@PhotoNumber}, {@Count}, '&Root;/templates.xsl', '{@Title}')"><img src="thumbnails/{@FormattedPhotoNumber}.JPG" border="0" height="60"/></a>
		</td>
		<xsl:apply-templates />	
	</xsl:template>
	
	<!-- not used - BEGIN -->
	
	<xsl:template name="ThumbnailFunction">
		<xsl:param name="Url"/>
		<td align="center">
		<a href="javascript:showphoto('{$Url}', '&Root;/templates.xsl')"><img src="thumbnails/{$Url}.JPG" border="0" height="60"/></a>
		</td>
		<xsl:apply-templates />	
	</xsl:template>
	
	<xsl:template name="For">
		<xsl:param name="i" select="0"/>
		<xsl:param name="n"/>
		<xsl:if test="$i &lt; $n">
			<xsl:call-template name="ThumbnailFunction">
				<xsl:with-param name="Url" select="$i + 1"/>
			</xsl:call-template>
			<xsl:call-template name="For">
				<xsl:with-param name="i" select="$i + 1"/>
				<xsl:with-param name="n" select="$n"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	
	<!-- not used - END -->

    <xsl:template match="ThumbnailPage">
	    <html>
			<head><meta http-equiv="Content-Type" content="text/html;" charset="UTF-8" /></head>
			<script src="&ScriptsDir;/showphoto.js">error_preventing_string_for_FireFox3.0</script>
			<body background="&PicsDir;/background.jpg">
			<div align="center">
			<table border="0" cellpadding="6" cellspacing="0">
				<tr valign="bottom" align="center">				
					
					<xsl:choose>
						<xsl:when test="@Auto[.='true']">
					 		<xsl:call-template name="For">
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
				<script src="&ScriptsDir;/showphoto.js"></script>
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
    
    
    <xsl:template match="VKAlbum">
        <!--<script src="http://vk.com/js/api/openapi.js"></script>-->
        <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
        <script src="&ScriptsDir;/vk.js"></script>
        
        <script type="text/javascript">
            $(function(){ 
                var albumID = <xsl:value-of select="@Id"/>; 
                getAlbum(albumID);
            });
        </script>
        
		<div id="VKAlbum">
		</div>
		
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
					<a href="{@GoogleUrl}">
						<img src="&PicsDir;/earth_16_16.gif" border="0" />
					</a>
				</xsl:if>
			</td>
			<td width="400px" align="left">
				<a href="{@PageUrl}">
					<xsl:value-of select="@Name"/>
				</a>
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
			
			<div class="track-list">
				<div class="paragraph-title">
					<span>Список треков</span>
				</div>			    		
			
				<xsl:apply-templates />	
			</div>
			
			<div class="track-details">
			
				<div class="paragraph-title gpslabel">
					<span>Трек: </span>
					<span id="trackName"></span>
				</div>
				
				<div class="gpslabel">
																
					<div class="gpsvalue">
						Начало движения:
					</div>
					<div id="trackStartTime">
						<span style="text-align:right; margin-left:10px"></span>
					</div>
				
					<div class="gpsvalue">
						Oкончание движения:
					</div>
					<div id="trackFinishTime">
						<span style="text-align:right; margin-left:10px"></span>
					</div>
				
					<div class="gpsvalue">
						Время в пути:
					</div>
					<div id="trackTimeEnroute">
						<span style="text-align:right; margin-left:10px"></span>
					</div>
				
					<div class="gpsvalue">
						Общая дистанция:
					</div>
					<div>
						<span style="text-align:right" id="trackDistance"><B>0.0</B></span>
						<span style="text-align:right; margin-left:10px"><B>км</B></span>
					</div>
				
					<div class="gpsvalue">
						Средняя скорость:
					</div>
					<div>
						<span style="text-align:right" id="trackAverageSpeed"><B>0.0</B></span>
						<span style="text-align:right; margin-left:10px"><B>км/ч</B></span>
					</div>
				
					<div class="gpsvalue">
						Максимальная скорость:
					</div>
					<div>
						<span style="text-align:right" id="trackMaxSpeed"><B>0.0</B></span>
						<span style="text-align:right; margin-left:10px"><B>км/ч</B></span>
					</div>
				
					<div class="gpsvalue">
						Минимальная высота:
					</div>
					<div>
						<span style="text-align:left" id="trackMinAltitude"><B>0</B></span>
						<span style="text-align:left; margin-left:10px"><B>м</B></span>
					</div>
				
					<div class="gpsvalue">
						Максимальная высота:
					</div>
					<div>
						<span style="text-align:left" id="trackMaxAltitude"><B>0</B></span>
						<span style="text-align:left; margin-left:10px"><B>м</B></span>
					</div>
				
					<div class="gpsvalue">
						Перепад высоты:
					</div>
					<div>
						<span style="text-align:left" id="trackDeltaAltitude"><B>0</B></span>
						<span style="text-align:left; margin-left:10px"><B>м</B></span>
					</div>
					</div>
				
				<div id="divModulation" class="modulation">
					<div class="modulation-buttons">
						<span id="simulateBtn" class="button" onclick="playTrack()">Старт</span>
						<span id="stopBtn" class="button" onclick="stopTrack()">Стоп</span>
						<span id="pauseBtn" class="button" onclick="pauseTrack()">Пауза</span>
						<span id="resumeBtn" class="button" onclick="resumeTrack()">Продолжить</span>
					</div>
					<div class="gpslabel">
						<div class="gpsvalue">
							Время:
						</div>
						<div id="time" />
					
						<div class="gpsvalue">
							Время в пути:
						</div>
						<div id="timeEnroute" />
					
						<div class="gpsvalue">
							Дистанция:
						</div>
						<div>
							<span id="distance"><B>0.0</B></span>
							<span style="margin-left:10px"><B>км</B></span>
						</div>
					
						<div class="gpsvalue">
							Скорость:
						</div>
						<div>
							<span id="speed"><B>0</B></span>
							<span style="margin-left:10px"><B>км/ч</B></span>
						</div>
					
						<div class="gpsvalue">
							Высота:
						</div>
						<div>
							<span id="elevation"><B>0</B></span>
							<span style="margin-left:10px"><B>м</B></span>
						</div>
					</div>
				</div>
				
				<div class="comments">
					<div>Время по Гринвичу (UTC)</div>
					<div>Париж, Стокгольм +1 (+2), Хельсинки +2 (+3),</div>
					<div>Москва,Петербург +3 (+4), Красноярск,Абакан +7 (+8)</div>
				</div>
				
			</div>
			
			<div class="right-pane">
				<div id="map" class="map" />
				<div>
					<div><input id="chkCenterAndZoomMap" type="checkbox" checked="checked" onclick="CenterAndZoomMap()"></input>Центрировать и масштабировать карту при смене трека</div>
					<span>(Рекомендуется отключить при просмотре последовательных треков)</span>
				</div>
			</div>
		
    </xsl:template>
        
    <xsl:template match="GPSTrackLink">
			<div id="GPSTrackLink" style="text-indent:-10px; padding-left:10px">
				<a href="javascript:renderMap('{@TrackFile}', '{@Title}')" style="text-decoration:underline">
					<xsl:value-of select="@Title"/>
				</a>
			</div>
		<xsl:apply-templates />	
    </xsl:template>

	
	<!-- *** End of GPS Tracks support -->
        
   				
</xsl:stylesheet>
