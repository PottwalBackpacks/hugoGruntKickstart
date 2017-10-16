var loadedSlide;

$(document).ready(function() {
	$('#fullpage').fullpage({
		parallax: true,
		parallaxKey: 'bmV0bGlmeS5jb21fOTFDY0dGeVlXeHNZWGc9U3hw',
		scrollOverflow: true,

		//events
		onLeave: function(index, nextIndex, direction) {
			if (index == 1) {
				$('#navigation').toggleClass('small', true);
			}
			if (nextIndex == 1) {
				$('#navigation').toggleClass('small', false);
			}
		},
		afterLoad: function( anchorLink, index){
        loadedSlide = $(this);
				checkIfInverted();
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

function checkIfInverted(){
	if($(loadedSlide).hasClass('inverted')){
		$('body').toggleClass('inverted',true);
	}else{
		$('body').toggleClass('inverted',false);
	}
}
