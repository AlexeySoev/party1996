using System;

namespace GPSTrackConverter
{
    class MagelanReader : IReader
    {
        public void ParseFile(string p_inputFileName, IWriter p_writer)
        {
            p_writer.BeginBlock("firstAndOne");
            System.IO.StreamReader a_stream = System.IO.File.OpenText(p_inputFileName);
            String line;
            while ((line = a_stream.ReadLine()) != null)
            {
                if (line != String.Empty)
                {
                    decimal lat, lng;
                    int alt;
                    DateTime time;
                    if (!ParseLineMagellan(line, out lat, out lng, out alt, out time))
                        continue;
                    else
                        p_writer.AddTrackPoint(time, lat, lng, alt);
                }
            }
        }

        // $PMGNTRK, 4523.948, N, 00634.425, E, 01609, M, 093604.00, A , , 260206*71
        private static bool ParseLineMagellan(string line, out decimal lat, out decimal lng, out int alt, out DateTime time)
        {
            lat = 0;
            lng = 0;
            alt = 0;
            time = DateTime.Now;

            char[] a_separators = { ',' };
            string[] a_values = line.Split(a_separators);
            if (a_values.Length != 11)
                throw new Exception("Parse error!");

            lat = Decimal.Parse(a_values[1].TrimStart('0'), Utils.ms_formatProviderEn) / 100;
            if (a_values[2] == "S")
                lat = -lat;
            lat = NormalizeCoordinate(lat);

            lng = Decimal.Parse(a_values[3].TrimStart('0'), Utils.ms_formatProviderEn) / 100;
            if (a_values[4] == "W")
                lng = -lat;
            lng = NormalizeCoordinate(lng);

            alt = Int32.Parse(a_values[5], Utils.ms_formatProviderEn);

            int year = 2000 + Int32.Parse(a_values[10].Substring(4, 2), Utils.ms_formatProviderEn);
            int month = Int32.Parse(a_values[10].Substring(2, 2), Utils.ms_formatProviderEn);
            int day = Int32.Parse(a_values[10].Substring(0, 2), Utils.ms_formatProviderEn);
            int hour = Int32.Parse(a_values[7].Substring(0, 2), Utils.ms_formatProviderEn);
            int minute = Int32.Parse(a_values[7].Substring(2, 2), Utils.ms_formatProviderEn);
            int second = Int32.Parse(a_values[7].Substring(4, 2), Utils.ms_formatProviderEn);
            int millisecond = Int32.Parse(a_values[7].Substring(7, 2), Utils.ms_formatProviderEn) * 10;

            time = new DateTime(year, month, day, hour, minute, second, millisecond);

            return true;
        }

        private static decimal NormalizeCoordinate(decimal val)
        {
            decimal floor = Decimal.Floor(val);
            decimal fraction = val - floor;
            fraction = fraction * 100 / 60;
            return Decimal.Round(floor + fraction, 6);
        }
    }
}
