(function(){
	$(document).ready(function() {
		$(".youtube").each(function() {
			$(this).css({
				"width":$(this).attr("width"),
				"height":$(this).attr("height"),
				"background":"url("+$(this).data("bg")+")"
			});
			console.log($(this).data("bg"));
			$(this).append("<div class='playIcon' />");
			$(this).click(function() {
				var $el = $("<iframe frameborder='0' allowfullscreen></iframe>");
				$el.attr("width",$(this).attr("width"));
				$el.attr("height",$(this).attr("height"));
				$el.attr("src","https://www.youtube.com/embed/"+$(this).data("youtubeid")+"?autoplay=1");
				$(this).empty().append($el);
			});
		});
	});
})();
