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
    
    var snakecontent = "";
    for (i=0; i <= message.length-1; i++)
    {
        snakecontent += "<span id='snakespan"+i+"' class='snake-symbol'>" + message[i] + "</span>"
    }
    
    var snakeholder = document.getElementById("snakeholder");
    snakeholder.innerHTML = snakecontent;
     
    document.onmousemove = handlerMM;
    
    makesnake();
}
 
function makesnake()
{
    if (flag == 1)
    {
        var needRedraw = false;
        for (i=message.length-1; i >= 1; i--)
        {
            if (xpos[i] != xpos[i-1]+step)
            {
                xpos[i] = xpos[i-1]+step;
                needRedraw = true;
            }
            
            if (ypos[i] != ypos[i-1])
            {
                ypos[i] = ypos[i-1];
                needRedraw = true;
            }
        }
        xpos[0] = x + (2*step);
        ypos[0] = y;
        
        if (needRedraw)
        {
            var thisspan;
            for (i=0; i <= message.length-1; i++)
            {
                thisspan = document.getElementById("snakespan"+i);
                thisspan.style.left = xpos[i] + "px";
                thisspan.style.top = ypos[i] + "px";
            }

            delay = delay + delay/20;
        }
        else
        {
            flag = 0;
        }
    }
    
    setTimeout("makesnake()", delay)
}

function handlerMM(e)
{
    x = (document.layers) ? e.pageX : document.body.scrollLeft + e.clientX
    y = (document.layers) ? e.pageY : document.body.scrollTop + e.clientY
    flag = 1;
    delay = 30;
}