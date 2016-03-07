var launchDateString = "2016-05-04 12:30-0700"; //pacific daylight time
var launchDate = moment(launchDateString);

$(document).ready(function() {
	
	$(".launch").text(launchDate.format("MMMM Do YYYY, h:mm a"));
	
	var update = function() {
		var seconds = launchDate.diff(moment(),"seconds");
		var duration = moment.duration(seconds,"seconds");
	    $(".countdown .days").text(pad(Math.floor(duration.asDays()),2));
	    $(".countdown .hours").text(pad(duration.hours(),2));
	    $(".countdown .minutes").text(pad(duration.minutes(),2));
	    $(".countdown .seconds").text(pad(duration.seconds(),2));
	};
	
	$(".youtubelink").jqueryVideoLightning({ id: "SN5VDPl2nCE", autoplay: true, color: "white" });
	
	update();
	setInterval(update,1000);
	
    var $sidebar   = $(".floatdown"), 
        $window    = $(window),
        offset     = $sidebar.offset(),
        topPadding = 15;
    
    var animateOptions = {
		duration: 200,
    };

    var t = null;
    $window.scroll(function() {
    	if (t != null) clearTimeout(t);
    	t = setTimeout(function() {
	        if ($window.scrollTop() > offset.top) {
	            $sidebar.stop().animate({
	                marginTop: $window.scrollTop() - offset.top + topPadding
	            },animateOptions);
	        } else {
	            $sidebar.stop().animate({
	                marginTop: 0
	            },animateOptions);
	        }
    	},50);
    });
});

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
