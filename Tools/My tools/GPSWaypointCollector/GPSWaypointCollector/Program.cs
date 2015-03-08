using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Xml;

namespace GPSWaypointCollector
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 2)
                return;

            if (!Directory.Exists(args[0]))
                return;

            WaypointCollector collector = new WaypointCollector();

            ProcessDirectory(args[0], collector);

            File.Delete(args[1]);
            collector.Save(args[1]);
        }

        static void ProcessDirectory(string directoryName, WaypointCollector collector)
        {
            foreach (string filename in Directory.GetFiles(directoryName, "*.gpx"))
                ProcessFile(filename, collector);

            foreach (string dir in Directory.GetDirectories(directoryName))
                ProcessDirectory(dir, collector);
        }

        static void ProcessFile(string filename, WaypointCollector collector)
        {
            try
            {
                XmlDocument a_doc = new XmlDocument();
                a_doc.Load(filename);

                //XmlNamespaceManager nsmgr = new XmlNamespaceManager(a_doc.NameTable);
                //nsmgr.AddNamespace("1", a_doc.DocumentElement.NamespaceURI);

                XmlNodeList waypoints = a_doc.GetElementsByTagName("wpt");
                foreach (XmlElement waypoint in waypoints)
                    collector.AddWaypoint(waypoint);
            }
            catch(Exception ex)
            {
                Console.WriteLine(string.Format("{0}: (1)", filename, ex.Message));
            }
        }
    }

    class WaypointCollector
    {
        private readonly XmlDocument m_doc = new XmlDocument();

        public WaypointCollector()
        {

            m_doc.AppendChild(m_doc.CreateXmlDeclaration("1.0", "UTF-8", "no"));
            XmlElement a_root = m_doc.CreateElement("gpx", "http://www.topografix.com/GPX/1/1");
            m_doc.AppendChild(a_root);
            XmlAttribute attr = m_doc.CreateAttribute("version");
            attr.Value = "1.1";
            a_root.Attributes.Append(attr);
            attr = m_doc.CreateAttribute("creator");
            attr.Value = "MapSource 6.11.5";
            a_root.Attributes.Append(attr);
        }
        
        public void AddWaypoint(XmlElement waypoint)
        {
            m_doc.DocumentElement.AppendChild(m_doc.ImportNode(waypoint, true));
        }

        public void Save(string filename)
        {
            m_doc.Save(filename);
            /*using (StreamWriter sw = new StreamWriter(filename, false, Encoding.Default))
                m_doc.Save(sw);
             */ 
        }
    }
}
