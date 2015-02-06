function prepare()
{
	var iframes = document.getElementsByTagName('iframe');
	//alert(iframes.length);
	for (var i = 0; i < iframes.length; i++)
	{
		var iframe = iframes[i];
		if (iframe.name != 'main' && iframe.name != 'news' && iframe.style.display !='none')
		{
			//alert('Hiding iframe: ' + iframe.id);
			iframe.style.display='none';
		}
	}
	
	var divs = document.getElementsByTagName('div');
	for (var i = 0; i < divs.length; i++)
	{
		var div = divs[i];
		if (div.id != 'main' && div.id != 'news' && div.id.length != 0 && div.style.display !='none')
		{
			//alert('Hiding div: ' + div.id);
			div.style.display='none';
		}
	}
	
	window.setTimeout(prepare, 5000);
}

window.onload = prepare;