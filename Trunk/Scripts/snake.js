var x,y
var step=15
var flag=0
var xpos=new Array()
var ypos=new Array()
 
var message = "PREVED !!!!!!!"
message=message.split("")

for (i=0;i<=message.length-1;i++)
	xpos[i]=-50

for (i=0;i<=message.length-1;i++)
	ypos[i]=-50
	
for (i=0;i<=message.length-1;i++)
{
	document.write("<span id='span"+i+"' class='spanstyle'>")
	document.write(message[i])
    document.write("</span>")
}
 
if (document.layers)
	document.captureEvents(Event.MOUSEMOVE);

document.onmousemove = handlerMM;
 
function makesnake() {
	if (flag==1 && document.all)
	{
		for (i=message.length-1; i>=1; i--)
		{
			xpos[i]=xpos[i-1]+step
			ypos[i]=ypos[i-1]
		}
		xpos[0]=x+step
		ypos[0]=y

		for (i=0; i<message.length-1; i++)
		{
			var thisspan = eval("span"+(i)+".style")
			thisspan.posLeft=xpos[i]
			thisspan.posTop=ypos[i]
		}
	}
	else if (flag==1 && document.layers)
	{
		for (i=message.length-1; i>=1; i--)
		{
			xpos[i]=xpos[i-1]+step
			ypos[i]=ypos[i-1]
		}
		xpos[0]=x+step
		ypos[0]=y
 
		for (i=0; i<message.length-1; i++)
		{
			var thisspan = eval("document.span"+i)
			thisspan.left=xpos[i]
			thisspan.top=ypos[i]
		}
	}
	var timer=setTimeout("makesnake()",30)
}

function handlerMM(e)
{
	x = (document.layers) ? e.pageX : document.body.scrollLeft+event.clientX
	y = (document.layers) ? e.pageY : document.body.scrollTop+event.clientY
	flag=1
}