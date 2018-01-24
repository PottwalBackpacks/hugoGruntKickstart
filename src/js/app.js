import jQuery from 'jquery';
const $ = jQuery;



let ImagesLoaded = require('imagesloaded');
let jQueryBridget = require('jquery-bridget');
let Masonry = require('masonry-layout');

jQueryBridget( 'masonry', Masonry, $ );
jQueryBridget( 'imagesLoaded', ImagesLoaded, $ );



import './scrolloverflow';

import fullpage from 'fullpage.js/dist/jquery.fullpage.extensions.min';

import rb_image from "./responsive_background_images"

var loadedSlide;

$(document).ready(function() {
	$('#svgContainer').load('/assets/svg/svg/symbols.svg');

	//start loading the responsive_background_images
let elements = document.querySelectorAll('.responsive-background-image');
for (let i = 0; i < elements.length; i++) {
	new rb_image(elements[i]);
}

	$('#fullpage').fullpage({
		parallax: false,
		parallaxKey: 'cG90dHdhbC5pdF83OHZjR0Z5WVd4c1lYZz0wOHQ=',
		scrollOverflow: true,
		lazyLoading: true,


		//events
		onLeave: function(index, nextIndex, direction) {
			var currentSlide = $(this);


			var nextSlide;
			if (direction == 'up') {
				nextSlide = $(currentSlide).prev();
			} else {
				nextSlide = $(currentSlide).next();
			}

			var activeSlide = nextSlide.find('.fp-slide.active');
			if (activeSlide.length !== 0 && activeSlide.data('ui-color')) {
				nextSlide = activeSlide;
			}



			lazyLoad(nextSlide);


			if (index == 1) {
				$('#navigation').toggleClass('small', true);
				$('.navbar-brand-small').toggleClass('center', true);

			}
			if (nextIndex == 1) {
				$('#navigation').toggleClass('small', false);
				$('.navbar-brand-small').toggleClass('center', false);


			}
		},
		afterLoad: function(anchorLink, index) {
			loadedSlide = $(this);
			checkIfInverted();
		},
	});



	//  init Masonry
	let $grid = $('.grid');
	$grid.imagesLoaded(function () {
	    $grid.masonry({
	        itemSelector: '.grid-item',
					columnWidth: '.grid-sizer',
					gutter: '.gutter-sizer',
					itemSelector: '.grid-item',
					percentPosition: false

	    });
	 });


	 // // init Masonry
	 // var $grid = $('.grid').masonry({
	 // 	itemSelector: '.grid-item',
	 // 	// use element for option
	 // 	columnWidth: '.grid-sizer',
	 // 	percentPosition: true
	 // });
		//
	 // // layout Masonry after each image loads
	 // $grid.imagesLoaded().progress(function() {
	 // 	$grid.masonry('layout');
	 // });


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

function checkIfInverted() {
	if ($(loadedSlide).hasClass('inverted')) {
		$('body').toggleClass('inverted', true);
	} else {
		$('body').toggleClass('inverted', false);
	}
}


function lazyLoad(section) {
	//console.log(section);
	var element;

	section.find('img[data-src], img[data-srcset], source[data-src], video[data-src], audio[data-src], iframe[data-src]').each(function() {
		element = $(this);

		$.each(['src', 'srcset'], function(index, type) {
			var attribute = element.attr('data-' + type);
			if (typeof attribute !== 'undefined' && attribute) {
				setSrc(element, type);
			}
		});
	});
}


function setSrc(element, attribute) {
	element
		.attr(attribute, element.data(attribute))
		.removeAttr('data-' + attribute);
}
