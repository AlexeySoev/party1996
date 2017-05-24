function prepare()
{
    var count = 0;
    
    var allowed_frames = ['main', 'news', /*main page*/
                          'title', 'members', 'stories' /*may99 page*/];
    
    var iframes = document.getElementsByTagName('iframe');
    //alert(iframes.length);
    for (var i = 0; i < iframes.length; i++)
    {
        var iframe = iframes[i];
        if (allowed_frames.indexOf(iframe.name) == -1 && iframe.style.display !='none')
        {
            //alert('Hiding iframe: ' + iframe.id);
            iframe.style.display='none';
            count++;
        }
    }
    
    var allowed_divs = ['main', 'news', /*home page*/
                          'title', 'frame', 'row', 'members', 'stories' /*may99 page*/];
    
    var divs = document.getElementsByTagName('div');
    for (var i = 0; i < divs.length; i++)
    {
        var div = divs[i];
        if (div.id.length != 0 && allowed_divs.indexOf(div.id) == -1 && div.style.display !='none')
        {
            //alert('Hiding div: ' + div.id);
            div.style.display='none';
            count++;
        }
    }
    
    if (count > 0) {
        var msg = count + " ads blocks hidded";
        //alert(msg);
        console.log(msg);
    }
    
    window.setTimeout(prepare, 3000);
}

window.onload = prepare;