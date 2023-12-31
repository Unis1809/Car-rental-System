jQuery(document).ready(function($) {

    "use strict";

    // Page loading animation
    $(window).on('load', function() {
        $("#preloader").animate({
            'opacity': '0'
        }, 600, function() {
            setTimeout(function() {
                $("#preloader").css("visibility", "hidden").fadeOut();
            }, 300);
        });
    });

    // Header background modification based on scroll position
    $(window).on('resize', function() {
        var box = $('.header-text').height();
        var header = $('header').height();

        $(window).scroll(function() {
            var scroll = $(window).scrollTop();

            if (scroll >= box - header) {
                $("header").addClass("background-header");
            } else {
                $("header").removeClass("background-header");
            }
        });
    }).trigger('resize'); // Trigger the resize event on page load to set the correct background initially

    // Owl Carousel for clients
    if ($('.owl-clients').length) {
        $('.owl-clients').owlCarousel({
            loop: true,
            nav: false,
            dots: true,
            items: 1,
            margin: 30,
            autoplay: false,
            smartSpeed: 700,
            autoplayTimeout: 6000,
            responsive: {
                0: {
                    items: 1,
                    margin: 0
                },
                460: {
                    items: 1,
                    margin: 0
                },
                576: {
                    items: 2,
                    margin: 20
                },
                992: {
                    items: 3,
                    margin: 30
                }
            }
        });
    }

    // Owl Carousel for banners (assuming you have an owl-carousel with class 'owl-banner')
    if ($('.owl-banner').length) {
        $('.owl-banner').owlCarousel({
            loop: true,
            nav: false,
            dots: true,
            items: 1,
            margin: 0,
            autoplay: false,
            smartSpeed: 700,
            autoplayTimeout: 6000,
            responsive: {
                0: {
                    items: 1,
                    margin: 0
                },
                460: {
                    items: 1,
                    margin: 0
                },
                576: {
                    items: 1,
                    margin: 20
                },
                992: {
                    items: 1,
                    margin: 30
                }
            }
        });
    }

});
