using System;
using System.IO;
using System.Xml;

namespace GPSWaypointCollector
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 2)
            {
                Console.WriteLine("Wrong parameters list");
                return;
            }

            if (!Directory.Exists(args[0]))
            {
                Console.WriteLine("Directory doesnt exist");
                return;
            }

            WaypointCollector collector = new WaypointCollector();

            ProcessDirectory(args[0], collector);

            File.Delete(args[1]);
            collector.Save(args[1]);
        }

        static void ProcessDirectory(string directoryName, WaypointCollector collector)
        {
            if (Directory.GetFiles(directoryName, "*.noimport").Length > 0 || Directory.GetFiles(directoryName, "*.noscan").Length > 0)
            {
                Console.WriteLine("Skipped: {0}", directoryName);
                return;
            }

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

                var waypoints = a_doc.GetElementsByTagName("wpt");
                foreach (XmlElement waypoint in waypoints)
                    collector.AddWaypoint(waypoint, filename);
            }
            catch(Exception ex)
            {
                Console.WriteLine(string.Format("{0}: {1}", filename, ex.Message));
            }
        }
    }

    class WaypointCollector
    {
        private readonly XmlDocument m_doc = new XmlDocument();

        public WaypointCollector()
        {
            m_doc.AppendChild(m_doc.CreateXmlDeclaration("1.0", "UTF-8", "no"));
            var  root = m_doc.CreateElement("gpx", "http://www.topografix.com/GPX/1/1");
            m_doc.AppendChild(root);
            var attr = m_doc.CreateAttribute("version");
            attr.Value = "1.1";
            root.Attributes.Append(attr);
            attr = m_doc.CreateAttribute("creator");
            attr.Value = "MapSource 6.16.3";
            root.Attributes.Append(attr);
        }
        
        public void AddWaypoint(XmlElement waypoint, string filename)
        {
            var importedNode = (XmlElement)m_doc.ImportNode(waypoint, true);
            UpdateWaypointWithFileName(importedNode, Path.GetFileName(filename));
            m_doc.DocumentElement.AppendChild(importedNode);
        }

        private void UpdateWaypointWithFileName(XmlElement waypoint, string filename)
        {
            AppendElement(waypoint, filename, "desc");
            AppendElement(waypoint, filename, "cmt");
        }

        private void AppendElement(XmlElement waypoint, string filename, string elementName)
        {
            var comment = SelectSingleElement(waypoint, elementName);
            if (comment == null)
            {
                comment = m_doc.CreateElement(elementName, m_doc.DocumentElement.NamespaceURI);
                waypoint.InsertAfter(comment, SelectSingleElement(waypoint, ("name")));
            }

            if (string.IsNullOrEmpty(comment.InnerText))
                comment.InnerText = string.Format("Source: {0}", filename);
            else
                comment.InnerText = string.Format("{0} (Source: {1})", comment.InnerText, filename);
        }

        private XmlElement SelectSingleElement(XmlElement element, string name)
        {
            var results = element.GetElementsByTagName(name);
            if (results.Count == 0)
            {
                return null;
            }
            else
            {
                return (XmlElement)results[0];
            }
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