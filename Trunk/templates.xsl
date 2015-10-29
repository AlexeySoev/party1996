<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE MyPage [
<!ENTITY Root "file://localhost/D:/!Party1996/Trunk">
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
            <link href="&Root;/Libs/lightbox/css/lightbox.css" rel="stylesheet" />
            <script src="&Root;/Libs/jquery-2.1.4.min.js"></script>
        </head>
        <xsl:apply-templates />
    </xsl:template>

    <xsl:template match="PageBody">
        <body background="&PicsDir;/background.jpg">
        <div id="main">
            <xsl:apply-templates />
        </div>
        <script src="&Root;/Libs/lightbox/js/lightbox.min.js"></script>
        <script src="&ScriptsDir;/lb.js"></script>
        </body>
    </xsl:template>
    
    <xsl:template match="PageElement">
        <div class="page-element">
            <xsl:apply-templates />
        </div>
    </xsl:template>
    
    <xsl:template match="MainMenu">
        <div class="site-title">Первый сайт Партии Любителей</div>
        <div class="site-menu">
            <table width="100%" border="0" cellspacing="2" cellpadding="5" align="center">
                <tr class="menu-item">
                    <td><a href="&Root;/index.html" target="_top">На главную</a></td>
                    <td><a href="&Root;/Members/members.xml" target="_top">Наша гордость</a></td>
                    <td><a href="&Root;/History/history.xml" target="_top">Наша история</a></td>
                    <td><a href="&Root;/Album/album.xml" target="_top">Альбомы</a></td>
                    <td><a href="&Root;/Tracks/tracks.xml" target="_top">GPS Треки</a></td>
                    <td><a href="&Root;/Funs/funs.xml" target="_top">Приколись</a></td>
                    <td><a href="&Root;/Personal/Personal.xml" target="_top">Персональное</a></td>
                    <td><a href="&Root;/links.xml" target="_top">Линки</a></td>
                </tr>
            </table>
        </div>
        <xsl:apply-templates />
    </xsl:template>
    
    <xsl:template match="Title">
        <xsl:if test="@Epigraph">
            <div class="epigraph"><xsl:value-of select="@Epigraph"/></div>
        </xsl:if>
        <div class="title"><xsl:value-of select="@Text"/></div>
        <xsl:apply-templates />
    </xsl:template>

    <xsl:template match="Chapter">
        <div class="chapter-wrapper">
            <xsl:if test="@Epigraph">
                <div class="epigraph"><xsl:value-of select="@Epigraph"/></div>
            </xsl:if>
            <xsl:if test="@Title">
                <div class="chapter-title"><xsl:value-of select="@Title"/></div>
            </xsl:if>
            <div class="chapter-content">
                <xsl:apply-templates />
            </div>
        </div>
    </xsl:template>
        
    <xsl:template match="Paragraph">
        <div class="paragraph-wrapper">
            <xsl:if test="@Title">
                <div class="paragraph-title"><xsl:value-of select="@Title"/></div>
            </xsl:if>
            <div class="paragraph-content">
                <xsl:apply-templates />
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="Block">
        <div class="block-wrapper">
            <xsl:if test="@Title">
                <div class="block-title"><xsl:value-of select="@Title"/></div>
            </xsl:if>
            <div class="block-content">
                <div>
                    <xsl:if test="@Title">
                        <xsl:attribute name="class">left-margin</xsl:attribute>
                    </xsl:if>
                    <xsl:apply-templates />
                </div>
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="Emphasize">
        <span class="emphasize">
            <xsl:apply-templates />
        </span>
    </xsl:template>
    
    <xsl:template match="Line">
        <div class="line-content">
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
    
    <xsl:template match="LinkNText">
        <div class="link-with-text">
            <xsl:if test="not(@Target[.='child'])">
                <a href="{@Url}">
                    <xsl:if test="@Target[.='more']">
                        <xsl:attribute name="target">more</xsl:attribute>
                    </xsl:if>
                    <xsl:value-of select="@Title"/>
                </a>
            </xsl:if>
            <xsl:if test="@Target[.='child']">
                <script src="&ScriptsDir;/showwindow.js"></script>
                <a href="javascript:%20showwindow('{@Url}', '{@Name}')">
                    <xsl:value-of select="@Title"/>
                </a>
            </xsl:if>
            <div>
                <xsl:apply-templates />
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="LinkToImage">
        <!--<script src="&ScriptsDir;/showpic.js"></script>
        <a href="javascript:%20showpic('{@Url}','{@H}','{@V}')">OLD</a>-->
       
        <a href="{@Url}" data-lightbox="{@Url}" data-title="{@Title}">
            <xsl:choose>
                <xsl:when test="@Group">
                    <xsl:attribute name="data-lightbox"><xsl:value-of select="@Group"/></xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="data-lightbox"><xsl:value-of select="@Title"/></xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:value-of select="@Title"/>
        </a>
        <xsl:apply-templates />
    </xsl:template>
        
    <xsl:template match="Image">
        <table border="0" width="100%" cellspacing="3" cellpadding="3" align="center">
            <tr>
                <td width="1" valign="top">
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
        <div class="chapter-wrapper" align="center">
            <table border="0" cellpadding="2" cellspacing="2" width="100%">
                <tr>
                    <td style="width:150px;" align="left" valign="top">
                        <p class="chapter-title"><xsl:value-of select="@Title"/></p>
                    </td>
                    <td align="center">
                        <div align="center">
                            <table border="1" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="width:50px;" onclick="javascript:showphoto({@Prev}, {@Count}, '&Root;/templates.xsl', '{@Title}')" onmouseover="this.style.backgroundColor = 'rgba(0,0,0,0.1)';" onmouseout="this.style.backgroundColor = 'inherit';"></td>
                                    <td align="center"><img src="{@Src}" border="0" onclick="javascript:showphoto({@Next}, {@Count}, '&Root;/templates.xsl', '{@Title}')"/></td>
                                    <td style="width:50px;" onclick="javascript:showphoto({@Next}, {@Count}, '&Root;/templates.xsl', '{@Title}')" onmouseover="this.style.backgroundColor = 'rgba(0,0,0,0.1)';" onmouseout="this.style.backgroundColor = 'inherit';"></td>
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
        <script src="&Root;/Libs/jquery-2.1.4.min.js"></script>
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
                <div class="paragraph-title">Список треков</div>                      
                <xsl:apply-templates /> 
            </div>
            
            <div class="track-details">
            
                <div class="paragraph-title gps-column">
                    <span>Трек: </span>
                    <span id="trackName"></span>
                </div>
                
                <div class="gps-column">
                                                                
                    <div class="gps-label">Начало движения:</div>
                    <div id="trackStartTime">
                        <span style="text-align:right; margin-left:10px"></span>
                    </div>
                    <div class="gps-label">Oкончание движения:</div>
                    <div id="trackFinishTime">
                        <span style="text-align:right; margin-left:10px"></span>
                    </div>
                    <div class="gps-label">Время в пути:</div>
                    <div id="trackTimeEnroute">
                        <span style="text-align:right; margin-left:10px"></span>
                    </div>
                    <div class="gps-label">Общая дистанция:</div>
                    <div>
                        <span style="text-align:right" id="trackDistance"><B>0.0</B></span>
                        <span style="text-align:right; margin-left:10px"><B>км</B></span>
                    </div>
                    <div class="gps-label">Средняя скорость:</div>
                    <div>
                        <span style="text-align:right" id="trackAverageSpeed"><B>0.0</B></span>
                        <span style="text-align:right; margin-left:10px"><B>км/ч</B></span>
                    </div>
                    <div class="gps-label">Макс. скорость:</div>
                    <div>
                        <span style="text-align:right" id="trackMaxSpeed"><B>0.0</B></span>
                        <span style="text-align:right; margin-left:10px"><B>км/ч</B></span>
                    </div>
                    <div class="gps-label">Мин. высота:</div>
                    <div>
                        <span style="text-align:left" id="trackMinAltitude"><B>0</B></span>
                        <span style="text-align:left; margin-left:10px"><B>м</B></span>
                    </div>
                    <div class="gps-label">Макс. высота:</div>
                    <div>
                        <span style="text-align:left" id="trackMaxAltitude"><B>0</B></span>
                        <span style="text-align:left; margin-left:10px"><B>м</B></span>
                    </div>
                    <div class="gps-label">Перепад высоты:</div>
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
                    <div class="gps-column">
                        <div class="gps-label">Время:</div>
                        <div id="time" />
                        
                        <div class="gps-label">Время в пути:</div>
                        <div id="timeEnroute" />
                        
                        <div class="gps-label">Дистанция:</div>
                        <div>
                            <span id="distance"><B>0.0</B></span>
                            <span style="margin-left:10px"><B>км</B></span>
                        </div>
                        
                        <div class="gps-label">Скорость:</div>
                        <div>
                            <span id="speed"><B>0</B></span>
                            <span style="margin-left:10px"><B>км/ч</B></span>
                        </div>
                    
                        <div class="gps-label">Высота:</div>
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
