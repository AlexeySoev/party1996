using System;
using System.Xml;

namespace GPSTrackConverter
{
    class GPXReader : IReader
    {
        private const string ms_defaultNamespace = "MyDefaultNameSpace";
        private const string ms_gpx_wpt = "wpt";
        private const string ms_gpx_name = "name";
        private const string ms_gpx_lat = "lat";
        private const string ms_gpx_lon = "lon";
        private const string ms_gpx_ele = "ele";
        
        public void ParseFile(string p_inputFileName, IWriter p_writer)
        {
            XmlDocument a_doc = new XmlDocument();
            a_doc.Load(p_inputFileName);
            XmlNamespaceManager nsmgr = new XmlNamespaceManager(a_doc.NameTable);
            nsmgr.AddNamespace(ms_defaultNamespace, a_doc.DocumentElement.NamespaceURI);
            
            XmlNodeList trackList = a_doc.GetElementsByTagName("trk");
            if (trackList.Count > 0)
            {
                foreach (XmlNode track in trackList)
                {
                    string trackName;
                    if (track.SelectNodes(GetFullName(ms_gpx_name), nsmgr).Count != 0)
                        trackName = track.SelectNodes(GetFullName(ms_gpx_name), nsmgr).Item(0).InnerText;
                    else
                        trackName = Guid.NewGuid().ToString();

                    p_writer.BeginBlock(trackName);

                    //parse points
                    XmlNodeList logList = track.SelectNodes(GetFullName("trkseg"), nsmgr);
                    foreach (XmlNode log in logList)
                    {
                        foreach (XmlNode point in log.ChildNodes)
                        {
                            decimal lat = Decimal.Parse(point.Attributes.GetNamedItem(ms_gpx_lat).Value, Utils.ms_formatProviderEn);
                            decimal lng = Decimal.Parse(point.Attributes.GetNamedItem(ms_gpx_lon).Value, Utils.ms_formatProviderEn);

                            XmlNode elevationtNode = point.SelectSingleNode(GetFullName(ms_gpx_ele), nsmgr);
                            int elevation = elevationtNode != null ? Decimal.ToInt32(Decimal.Parse(elevationtNode.InnerText, Utils.ms_formatProviderEn)) : 0;

                            XmlNode dateTimeNode = point.SelectSingleNode(GetFullName("time"), nsmgr);
                            DateTime time = dateTimeNode != null ? DateTime.Parse(dateTimeNode.InnerText, Utils.ms_formatProviderEn) : DateTime.MinValue;

                            p_writer.AddTrackPoint(time.ToUniversalTime(), lat, lng, elevation);
                        }
                    }

                    //parse waypoints
                    ProcessWaypoints(a_doc.GetElementsByTagName(ms_gpx_wpt), p_writer);
                }
            }
            else
            {
                //parse waypoints
                XmlNodeList markList = a_doc.GetElementsByTagName(ms_gpx_wpt);
                if (markList.Count > 0)
                {
                    p_writer.BeginBlock(Guid.NewGuid().ToString());
                    ProcessWaypoints(markList, p_writer);
                }
            }
        }

        private static void ProcessWaypoints(XmlNodeList waypoints, IWriter p_writer)
        {
            if (waypoints.Count != 0)
            {
                XmlNamespaceManager nsmgr = new XmlNamespaceManager(waypoints.Item(0).OwnerDocument.NameTable);
                nsmgr.AddNamespace(ms_defaultNamespace, waypoints.Item(0).OwnerDocument.DocumentElement.NamespaceURI);

                foreach (XmlNode mark in waypoints)
                {
                    decimal lat = Decimal.Parse(mark.Attributes.GetNamedItem(ms_gpx_lat).Value, Utils.ms_formatProviderEn);
                    decimal lng = Decimal.Parse(mark.Attributes.GetNamedItem(ms_gpx_lon).Value, Utils.ms_formatProviderEn);
                    String name = mark.SelectSingleNode(GetFullName(ms_gpx_name), nsmgr).InnerText;

                    XmlNode elevationtNode = mark.SelectSingleNode(GetFullName(ms_gpx_ele), nsmgr);
                    int elevation = elevationtNode != null ? Decimal.ToInt32(Decimal.Parse(elevationtNode.InnerText, Utils.ms_formatProviderEn)) : 0;
                    
                    XmlNode linkNode = mark.SelectSingleNode(GetFullName("link"), nsmgr);
                    String link = linkNode != null ? linkNode.Attributes.GetNamedItem("href").Value : String.Empty;
                    
                    p_writer.AddWayPoint(name, lat, lng, elevation, link);
                }
            }
        }

        private static string GetFullName(string name)
        {
            return ms_defaultNamespace + ":" + name;
        }
    }
}
