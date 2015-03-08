using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Xml;
using System.Globalization;

namespace GPSTrackConverter
{
	public interface IWriter
	{
		void BeginBlock(string blockName);
        Dictionary<string, XmlDocument> GetBlocks();

        void AddTrackPoint(DateTime time, decimal lat, decimal lon, int alt);
        void AddWayPoint(string name, decimal lat, decimal lon, int alt, string link);
	}

	public interface IReader
	{
		void ParseFile(string p_inputFileName, IWriter p_writer);
	}

	class Utils
	{
		public static CultureInfo ms_formatProviderEn = new CultureInfo("en-US");
		public static CultureInfo ms_formatProviderRu = new CultureInfo("ru-RU");
	}

	class MainClass
	{
		private enum GPSType
		{
			Ozi,
			Magellan,
			GPX
		}
		
		private static GPSType ms_gpsType = GPSType.Ozi;
		private static String ms_inputFileName;
		private static String ms_outputFileName;

		[STAThread]
		static void Main(string[] args)
		{
			try
			{
				DoWork(args);
			}
			catch(Exception ex)
			{
				Console.WriteLine(ex.Message);
			}
		}

		private static void DoWork(string[] args)
		{
			CheckInput(args);

			IReader a_reader = CreateReader();

            IWriter a_writer = CreateWriter();

            if (a_reader == null || a_writer == null)
                throw new Exception("Cannot recognize input or output format!");

			a_reader.ParseFile(ms_inputFileName, a_writer);

            Dictionary<string, XmlDocument> data = a_writer.GetBlocks();

            foreach (KeyValuePair<string, XmlDocument> element in data)
			{
				string filename;
				if (data.Count == 1)
					filename = ms_outputFileName;
				else
					filename = Path.Combine(Path.GetDirectoryName(ms_outputFileName), element.Key + Path.GetExtension(ms_outputFileName));
				
				if (File.Exists(filename))
					throw new Exception("Output file already exists!");

				using (StreamWriter sw = new StreamWriter(ReplaceIncorectSymbols(filename), false, Encoding.Default))
                    element.Value.Save(sw);
			}
		}

        private static void CheckInput(string[] args)
        {
            string invalidCommandLine = "Invalid command line! \nExample: GPSTrackConverter.exe type inputfile outputfile \ntype = GPX | O | M";
            if (args.Length != 3)
                throw new Exception(invalidCommandLine);

            if (args[0] == "M")
                ms_gpsType = GPSType.Magellan;
            else if (args[0] == "O")
                ms_gpsType = GPSType.Ozi;
            else if (args[0] == "GPX")
                ms_gpsType = GPSType.GPX;
            else
                throw new Exception(invalidCommandLine);

            ms_inputFileName = args[1];
            ms_outputFileName = ReplaceIncorectSymbols(args[2]);

            if (!File.Exists(ms_inputFileName))
                throw new Exception("Input file doesn't exist!");
            if (File.Exists(ms_outputFileName))
                throw new Exception("Output file already exists!");
        }

		private static IReader CreateReader()
		{
			if (ms_gpsType == GPSType.Ozi)
				return new OziReader();
			else if (GPSType.Magellan == ms_gpsType)
				return new MagelanReader();
			else if (GPSType.GPX == ms_gpsType)
				return new GPXReader();
			else
				return null;
		}

        private static IWriter CreateWriter()
        {
            return new WebSiteFormatWriter();
        }
        
	    private static string ReplaceIncorectSymbols(string filename)
		{
			string ret = filename.Replace(" ", ""); //ftp cannot upload such files
			ret = ret.Replace("(", ""); //ftp cannot upload such files
			ret = ret.Replace(")", ""); //ftp cannot upload such files
			ret = ret.Replace("'", ""); //I cannot pass such filename to the Jscript form XSLT
			return ret;
		}
	}
}
