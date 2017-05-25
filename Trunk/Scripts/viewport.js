/*dynamically calculate scale to disable wrong scaling by browser */
/*https://stackoverflow.com/questions/11592015/support-for-target-densitydpi-is-removed-from-webkit*/
var viewPortScale = 1 / window.devicePixelRatio;
$('#viewport').attr('content', 'user-scalable=yes, initial-scale='+viewPortScale+', width=device-width');