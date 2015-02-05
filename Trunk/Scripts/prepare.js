function prepare()
{
	var iframes = document.getElementsByTagName('iframe');
	//alert(iframes.length);
	for (var i = 0; i < iframes.length; i++)
	{
		var iframe = iframes[i];
		if (iframe.name != 'main' && iframe.name != 'news')
			iframe.style.display='none';
	}
}

window.onload = prepare;