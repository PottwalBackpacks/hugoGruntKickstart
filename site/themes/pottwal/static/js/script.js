$(document).ready(function() {
	$('#fullpage').fullpage({
		parallax: true,
		parallaxKey: 'bmV0bGlmeS5jb21fOTFDY0dGeVlXeHNZWGc9U3hw',
		//events
		onLeave: function(index, nextIndex, direction) {
			slideLeave(index, nextIndex, direction);
		},
	});
	// init Masonry
	var $grid = $('.grid').masonry({
		itemSelector: '.grid-item',
		// use element for option
		columnWidth: '.grid-sizer',
		percentPosition: true
	});

	// layout Masonry after each image loads
	$grid.imagesLoaded().progress(function() {
		$grid.masonry('layout');
	});
});

//handle netlify redirect after auth
if (window.netlifyIdentity) {
	window.netlifyIdentity.on("init", user => {
		if (!user) {
			window.netlifyIdentity.on("login", () => {
				document.location.href = "/admin/";
			});
		}
	});
}

function slideLeave(index, nextIndex, direction) {
	if (index == 1) {
		$('#navigation').toggleClass('small', true);
	}
	if (nextIndex == 1) {
		$('#navigation').toggleClass('small', false);
	}
}
