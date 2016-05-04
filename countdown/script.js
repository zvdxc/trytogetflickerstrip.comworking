var launchDateString = "2016-05-04 12:30-0700"; //pacific daylight time
var launchDate = moment(launchDateString);

$(document).ready(function() {
	
	$(".launch").text(launchDate.format("MMMM Do YYYY, h:mm a"));

	var updateInterval;
	var update = function() {
		var seconds = launchDate.diff(moment(),"seconds");

        if (seconds == 0) {
            clearTimeout(updateInterval);
            window.location.href = "https://www.kickstarter.com/projects/hohmbody/flickerstrip-create-your-own-personal-light-show?utm_source=flickerstrip&utm_medium=site&utm_campaign=countdown_link";
        }

        if (seconds <= 60) $(".countdown").addClass("final");

        if (seconds < 0) {
            $("body").addClass("past");
            $(".countdown").removeClass("final").addClass("past");
            clearTimeout(updateInterval);
        }

		var duration = moment.duration(seconds,"seconds");
	    $(".countdown .days").text(pad(Math.floor(duration.asDays()),2));
	    $(".countdown .hours").text(pad(duration.hours(),2));
	    $(".countdown .minutes").text(pad(duration.minutes(),2));
	    $(".countdown .seconds").text(pad(duration.seconds(),2));
	};
	
	$(".youtubelink").jqueryVideoLightning({ id: "SN5VDPl2nCE", autoplay: true, color: "white" });
	
	update();
	updateInterval = setInterval(update,1000);
	
    var $sidebar   = $(".floatdown"), 
        $window    = $(window),
        topPadding = 15;
    
    var $marker = $("<a style='width:0 !important; height:0 !important'></a>"); //mark where we should base our position on
    $sidebar.before($marker);
    
    var animateOptions = {
		duration: 200,
    };

    var t = null;
    $window.scroll(function() {
    	if (t != null) clearTimeout(t);
    	if ($(window).width() <= 765) return;
    	t = setTimeout(function() {
	        var offset = $marker.offset();
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
