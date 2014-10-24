  function shpic(picname,w,h) {
    nw = 22 + parseInt(w,10);
	nh = 20 + parseInt(h,10);
    var picwin = window.open("", "picname", "width="+nw+",height="+nh+",toolbar=0,directories=0,menubar=0,status=0,resizable=1,location=0,scrollbars=1,copyhistory=0");
    picwin.document.write("<body bgcolor='#000000' leftmargin=3 topmargin=9><img src='Photos/" + picname + ".jpg'></body>");
    picwin.document.close();
}
