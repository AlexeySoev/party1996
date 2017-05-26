var x,y
var step = 15
var delay = 30
var flag = 0
var xpos = new Array()
var ypos = new Array()
var message = new Array()

function createsnake(text)
{
    message = text.split("");
    
    if (message.length == 0)
        return;

    for (i=0; i <= message.length-1; i++)
        xpos[i]=-50

    for (i=0; i <= message.length-1; i++)
        ypos[i]=-50
        
    for (i=0; i <= message.length-1; i++)
    {
        document.write("<span id='span"+i+"' class='snake-symbol'>")
        document.write(message[i])
        document.write("</span>")
    }
     
    if (document.layers)
        document.captureEvents(Event.MOUSEMOVE);

    document.onmousemove = handlerMM;
    
    makesnake();
}
 
function makesnake()
{
    if (flag == 1)
    {
        for (i=message.length-1; i >= 1; i--)
        {
            xpos[i] = xpos[i-1]+step
            ypos[i] = ypos[i-1]
        }
        xpos[0] = x + (2*step)
        ypos[0] = y

        var thisspan;
        for (i=0; i <= message.length-1; i++)
        {
            if (document.getElementById)
                thisspan = eval("span"+(i)+".style")
            else if (document.layers)
                thisspan = eval("document.span"+i)
            else
                break;
            
            thisspan.left=xpos[i]
            thisspan.top=ypos[i]
        }
    }
    
    setTimeout("makesnake()", delay)
}

function handlerMM(e)
{
    x = (document.layers) ? e.pageX : document.body.scrollLeft + e.clientX
    y = (document.layers) ? e.pageY : document.body.scrollTop + e.clientY
    flag = 1
}