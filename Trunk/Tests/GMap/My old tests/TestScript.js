function  LoadGoogle()
{
	alert("LoadGoogle()");
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAA1cyBAHrOeSe9b0ZoaFAK3hT2yXp_ZAY8_ufC3CFXhHIE1NvwkxSyZva3bCOrJkD906auWtIUk_qBZw";
	document.getElementsByTagName("head")[0].appendChild(script);
	
	var script1 = document.createElement('script');
	script1.type = 'text/javascript';
	script1.src = "1.js";
	document.getElementsByTagName("head")[0].appendChild(script1);
}

function doit(m)
{
	alert(m);
}

alert ("!")
doit("Yo!");


