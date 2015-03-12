using System;
using System.Collections.Generic;
using System.Xml;

namespace GPSTrackConverter
{
    class WebSiteFormatWriter : IWriter
    {
        private readonly Dictionary<string, XmlDocument> m_data = new Dictionary<string, XmlDocument>();
        private XmlDocument m_currentBlock;

        public void BeginBlock(string blockName)
        {
            m_currentBlock = new XmlDocument();
            m_currentBlock.CreateXmlDeclaration("1.0", "UTF-8", "");
            m_data.Add(blockName, m_currentBlock);
            XmlElement a_root = m_currentBlock.CreateElement("markers");
            m_currentBlock.AppendChild(a_root);
        }

        public Dictionary<string, XmlDocument> GetBlocks()
        {
            return m_data;
        }

        public void AddTrackPoint(DateTime time, decimal lat, decimal lon, int alt)
        {
            XmlElement a_element = m_currentBlock.CreateElement("m");
            m_currentBlock.DocumentElement.AppendChild(a_element);
            if (time != DateTime.MinValue)
                a_element.SetAttribute("tm", time.ToString("HH\\:mm\\:ss dd\\/MM\\/yyyy"));
            else
                a_element.SetAttribute("tm", "");
            a_element.SetAttribute("al", alt.ToString());
            
            // this produce a lot of digits after coma which is unwanted
            //a_element.SetAttribute("lg", Convert.ToString(lon, Utils.ms_formatProviderEn));
            //a_element.SetAttribute("lt", Convert.ToString(lat, Utils.ms_formatProviderEn));
            //replace by following
            a_element.SetAttribute("lg", String.Format(Utils.ms_formatProviderEn, "{0:0.00000}", lon));
            a_element.SetAttribute("lt", String.Format(Utils.ms_formatProviderEn, "{0:0.00000}", lat));
        }

        public void AddWayPoint(string name, decimal lat, decimal lon, int alt, string link)
        {
            XmlElement a_element = m_currentBlock.CreateElement("p");
            m_currentBlock.DocumentElement.AppendChild(a_element);
            // this produce a lot of digits after coma which is unwanted
            //a_element.SetAttribute("lg", Convert.ToString(lon, Utils.ms_formatProviderEn));
            //a_element.SetAttribute("lt", Convert.ToString(lat, Utils.ms_formatProviderEn));
            //replace by following
            a_element.SetAttribute("lg", String.Format(Utils.ms_formatProviderEn, "{0:0.00000}", lon));
            a_element.SetAttribute("lt", String.Format(Utils.ms_formatProviderEn, "{0:0.00000}", lat));
            a_element.SetAttribute("text", name);
            if (!string.IsNullOrEmpty(link))
            {
                a_element.SetAttribute("url", link);
                a_element.SetAttribute("urlname", "link name");
            }
        }
    }
}
