using System;

namespace GPSTrackConverter
{
    class OziReader : IReader
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
                    if (!ParseLineOzi(line, out lat, out lng, out alt, out time))
                        continue;
                    else
                        p_writer.AddTrackPoint(time, lat, lng, alt);
                }
            }
        }

        // 60.291890,  29.498590,1,   21.0,38871.2968287, 03-θών-06, 7:07:26
        private static bool ParseLineOzi(string line, out decimal lat, out decimal lng, out int alt, out DateTime time)
        {
            lat = 0;
            lng = 0;
            alt = 0;
            time = DateTime.Now;

            char[] a_separators = { ',' };
            string[] a_values = line.Split(a_separators);
            if (a_values.Length != 7)
                return false;

            lat = Decimal.Parse(a_values[0], Utils.ms_formatProviderEn);
            lng = Decimal.Parse(a_values[1], Utils.ms_formatProviderEn);
            alt = Decimal.ToInt32((Decimal.Parse(a_values[3], Utils.ms_formatProviderEn) * new Decimal(0.3048)));

            DateTime raw_date = DateTime.Parse(a_values[5], Utils.ms_formatProviderRu);
            DateTime raw_time = DateTime.Parse(a_values[6], Utils.ms_formatProviderRu);

            int year = raw_date.Year;
            int month = raw_date.Month;
            int day = raw_date.Day;
            int hour = raw_time.Hour;
            int minute = raw_time.Minute;
            int second = raw_time.Second;

            time = new DateTime(year, month, day, hour, minute, second, 0);

            return true;
        }
    }
}
