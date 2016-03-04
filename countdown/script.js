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
	
	update();
	setInterval(update,1000);
});

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
