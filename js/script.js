/*
 * Description: Doux JS Script.
 * Version: 1.0.0
 * Last update: 01/01/2016
 * Author: Habaza <support@fobles.com>
 *
 * Table of Content:
 *      
 *  1. On Document Ready
 *      - 1.0. Fade In Content
 *      - 1.1. Fix Slider Content
 *      - 1.2. Slider Revolution
 *      - 1.3. Portfolio Isotop
 *      - 1.4. Video Background
 *      - 1.5. Owl Carousel
 *      - 1.6. Magnific Popup
 *      - 1.7. Smooth Scroll
 *      - 1.8. Counting Numbers
 *      - 1.9. Menu Collapse
 *      - 1.10. Play Video
 *      - 1.11. Play Audio
 *      - 1.12. Stick Header
 *      - 1.13. Fix Mobile Menu
        - 1.14. Contact Form Submit
 *  2. On Document Scroll
 *      - 2.1. Stick Header
 *      - 2.2. Parallax Background
 *  3. On Document Resize
 *      - 3.1. Fix Mobile Menu
 *      - 3.2. Fix Slider Content
 *  4. Functions
 */
'use strict';
/* ==========================================================================
   1. On Document Ready
   ========================================================================== */
jQuery(document).ready(function($) {

    jQuery(window).load(function() {
        /* - 1.0. Fade In Content
        ========================================================================== */
        jQuery(".loading-container").fadeOut().remove(), jQuery("#mainWrapper").addClass("loaded fadeIn");

    });
    /* - 1.1. Fix Slider Content
    ========================================================================== */
    slidesFix();

    /* - 1.2. Slider Revolution
    ========================================================================== */
    jQuery("#slider-full").revolution({
        sliderType:"standard",
        sliderLayout:"fullscreen",
        dottedOverlay:"none",
        delay:9000,
        navigation: {
            keyboardNavigation:"off",
            keyboard_direction: "horizontal",
            mouseScrollNavigation:"off",
            onHoverStop:"off",
            touch:{
                touchenabled:"on",
                swipe_threshold: 75,
                swipe_min_touches: 50,
                swipe_direction: "horizontal",
                drag_block_vertical: false
            }
            ,
            arrows: {
                style:"",
                enable:true,
                hide_onmobile:false,
                hide_onleave:true,
                hide_delay:200,
                hide_delay_mobile:1200,
                tmp:'',
                left: {
                    h_align:"left",
                    v_align:"center",
                    h_offset:20,
                    v_offset:0
                },
                right: {
                    h_align:"right",
                    v_align:"center",
                    h_offset:20,
                    v_offset:0
                }
            }
            ,
            bullets: {
                enable:true,
                hide_onmobile:true,
                hide_under:769,
                style:"",
                hide_onleave:false,
                direction:"horizontal",
                h_align:"right",
                v_align:"top",
                h_offset:60,
                v_offset:40,
                space:5,
                tmp:'<span class="tp-bullet-image"></span><span class="tp-bullet-title"></span>'
            }
        },
        responsiveLevels:[1240,1024,778,480],
        visibilityLevels:[1240,1024,778,480],
        gridwidth:[1240,1024,778,480],
        gridheight:[868,768,960,720],
        lazyType:"none",
        parallax: {
            type:"scroll",
            origo:"slidercenter",
            speed:400,
            levels:[5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,55],
            type:"scroll",
        },
        shadow:0,
        spinner:"spinner2",
        stopLoop:"off",
        stopAfterLoops:-1,
        stopAtSlide:-1,
        shuffle:"off",
        autoHeight:"off",
        fullScreenAutoWidth:"off",
        fullScreenAlignForce:"off",
        fullScreenOffsetContainer: "",
        fullScreenOffset: "",
        disableProgressBar:"on",
        hideThumbsOnMobile:"off",
        hideSliderAtLimit:0,
        hideCaptionAtLimit:0,
        hideAllCaptionAtLilmit:0,
        debugMode:false,
        fallbacks: {
            simplifyAll:"off",
            nextSlideOnWindowFocus:"off",
            disableFocusListener:false,
        }
    });

    jQuery("#slider-full-classic").revolution({
        sliderType:"standard",
        sliderLayout:"fullwidth",
        dottedOverlay:"none",
        delay:9000,
        navigation: {
            keyboardNavigation:"off",
            keyboard_direction: "horizontal",
            mouseScrollNavigation:"off",
            onHoverStop:"off",
            touch:{
                touchenabled:"on",
                swipe_threshold: 75,
                swipe_min_touches: 50,
                swipe_direction: "horizontal",
                drag_block_vertical: false
            }
            ,
            arrows: {
                style:"",
                enable:true,
                hide_onmobile:false,
                hide_onleave:true,
                hide_delay:200,
                hide_delay_mobile:1200,
                tmp:'',
                left: {
                    h_align:"left",
                    v_align:"center",
                    h_offset:20,
                    v_offset:0
                },
                right: {
                    h_align:"right",
                    v_align:"center",
                    h_offset:20,
                    v_offset:0
                }
            }
            ,
            bullets: {
                enable:true,
                hide_onmobile:true,
                hide_under:769,
                style:"",
                hide_onleave:false,
                direction:"horizontal",
                h_align:"right",
                v_align:"top",
                h_offset:60,
                v_offset:40,
                space:5,
                tmp:'<span class="tp-bullet-image"></span><span class="tp-bullet-title"></span>'
            }
        },
        responsiveLevels:[1240,1024,778,480],
        visibilityLevels:[1240,1024,778,480],
        gridwidth:[1240,1024,778,480],
        gridheight:[700,700,700,700],
        lazyType:"none",
        minHeight:700,
        parallax: {
            type:"scroll",
            origo:"slidercenter",
            speed:400,
            levels:[5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,55],
            type:"scroll",
        },
        shadow:0,
        spinner:"spinner2",
        stopLoop:"off",
        stopAfterLoops:-1,
        stopAtSlide:-1,
        shuffle:"off",
        autoHeight:"off",
        fullScreenAutoWidth:"off",
        fullScreenAlignForce:"off",
        fullScreenOffsetContainer: "",
        fullScreenOffset: "",
        disableProgressBar:"on",
        hideThumbsOnMobile:"off",
        hideSliderAtLimit:0,
        hideCaptionAtLimit:0,
        hideAllCaptionAtLilmit:0,
        debugMode:false,
        fallbacks: {
            simplifyAll:"off",
            nextSlideOnWindowFocus:"off",
            disableFocusListener:false,
        }
    });

    jQuery("#slider-hero").revolution({
        sliderType:"standard",
        sliderLayout:"fullscreen",
        dottedOverlay:"none",
        delay:9000,
        navigation: {
            keyboardNavigation:"off",
            keyboard_direction: "horizontal",
            mouseScrollNavigation:"off",
            onHoverStop:"off",
            touch:{
                touchenabled:"on",
                swipe_threshold: 75,
                swipe_min_touches: 50,
                swipe_direction: "horizontal",
                drag_block_vertical: false
            }
            ,
            bullets: {
                enable:true,
                hide_onmobile:true,
                hide_under:600,
                style:"hephaistos",
                hide_onleave:false,
                direction:"vertical",
                h_align:"right",
                v_align:"center",
                h_offset:30,
                v_offset:0,
                space:5,
                tmp:''
            }
        },
        responsiveLevels:[1240,1024,778,480],
        visibilityLevels:[1240,1024,778,480],
        gridwidth:[1240,1024,778,480],
        gridheight:[600,768,960,720],
        lazyType:"none",
        parallax: {
            type:"on"
        },
        shadow:0,
        spinner:"off",
        stopLoop:"off",
        stopAfterLoops:-1,
        stopAtSlide:-1,
        shuffle:"off",
        autoHeight:"off",
        fullScreenAutoWidth:"off",
        fullScreenAlignForce:"off",
        fullScreenOffsetContainer: "",
        fullScreenOffset: "",
        disableProgressBar:"on",
        hideThumbsOnMobile:"on",
        hideSliderAtLimit:0,
        hideCaptionAtLimit:0,
        hideAllCaptionAtLilmit:0,
        debugMode:false,
        fallbacks: {
            simplifyAll:"off",
            nextSlideOnWindowFocus:"off",
            disableFocusListener:false,
        }
    });

    jQuery("#slider-text-rotator").revolution({
        sliderType:"hero",
        sliderLayout:"fullscreen",
        dottedOverlay:"none",
        delay:9000,
        navigation: {
        },
        responsiveLevels:[1240,1024,778,480],
        visibilityLevels:[1240,1024,778,480],
        gridwidth:[1240,1024,778,480],
        gridheight:[600,768,960,720],
        lazyType:"none",
        parallax: {
            type:"scroll",
            origo:"slidercenter",
            speed:400,
            levels:[5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,55],
            type:"scroll",
        },
        shadow:0,
        spinner:"spinner2",
        autoHeight:"off",
        fullScreenAutoWidth:"off",
        fullScreenAlignForce:"off",
        fullScreenOffsetContainer: "",
        fullScreenOffset: "",
        disableProgressBar:"on",
        hideThumbsOnMobile:"off",
        hideSliderAtLimit:0,
        hideCaptionAtLimit:0,
        hideAllCaptionAtLilmit:0,
        debugMode:false,
        fallbacks: {
            simplifyAll:"off",
            disableFocusListener:false,
        }
    });

    jQuery("#slider-hero-image").revolution({
        sliderType:"hero",
        sliderLayout:"fullscreen",
        dottedOverlay:"none",
        delay:9000,
        navigation: {
            onHoverStop:"off",
        },
        responsiveLevels:[1240,1024,778,480],
        visibilityLevels:[1240,1024,778,480],
        gridwidth:[1240,1024,778,480],
        gridheight:[600,768,960,720],
        lazyType:"none",
        parallax: {
            type:"mouse",
            origo:"slidercenter",
            speed:2000,
            levels:[2,3,4,5,6,7,12,16,10,50,47,48,49,50,51,55],
            type:"mouse",
        },
        shadow:0,
        spinner:"spinner2",
        stopLoop:"on",
        stopAfterLoops:0,
        stopAtSlide:1,
        shuffle:"off",
        autoHeight:"off",
        fullScreenAutoWidth:"off",
        fullScreenAlignForce:"off",
        fullScreenOffsetContainer: "",
        fullScreenOffset: "",
        disableProgressBar:"on",
        hideThumbsOnMobile:"on",
        hideSliderAtLimit:0,
        hideCaptionAtLimit:0,
        hideAllCaptionAtLilmit:0,
        debugMode:false,
        fallbacks: {
            simplifyAll:"off",
            nextSlideOnWindowFocus:"off",
            disableFocusListener:false,
        }
    });

    jQuery("#slider-youtube").revolution({
        sliderType:"standard",
        sliderLayout:"fullscreen",
        delay:9000,
        navigation: {
            onHoverStop:"off",
        },
        responsiveLevels:[1240,1024,778,480],
        visibilityLevels:[1240,1024,778,480],
        gridwidth:[1240,1024,778,480],
        gridheight:[600,500,400,270],
        lazyType:"none",
        parallax: {
            type:"scroll",
            origo:"slidercenter",
            speed:2000,
            levels:[2,3,4,5,6,7,12,16,10,50,47,48,49,50,51,55],
            type:"scroll",
        },
        shadow:0,
        spinner:"spinner2",
        stopLoop:"on",
        stopAfterLoops:0,
        stopAtSlide:1,
        shuffle:"off",
        autoHeight:"off",
        disableProgressBar:"on",
        hideThumbsOnMobile:"on",
        hideSliderAtLimit:0,
        hideCaptionAtLimit:0,
        hideAllCaptionAtLilmit:0,
        debugMode:false,
        fallbacks: {
            simplifyAll:"off",
            nextSlideOnWindowFocus:"off",
            disableFocusListener:false,
        }
    });
    
    $("span.txt-rotator").Morphext({
        // The [in] animation type. Refer to Animate.css for a list of available animations.
        animation: "fadeInUp",
        // An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
        separator: ",",
        // The delay between the changing of each phrase in milliseconds.
        speed: 4000,
        complete: function () {
            // Called after the entrance animation is executed.
        }
    });

    /* - 1.3. Portfolio Isotop 
    ========================================================================== */
    var $portfolioGrid = $('.portfolio-grid').isotope({
        // options
        itemSelector: '.portfolio-project',
        percentPosition: true,
        masonry: {
            gutter: 0,
            isFitWidth: true,
            isFitHeight: true
        },
        hiddenStyle: {
            opacity: 0
        },
        visibleStyle: {
            opacity: 1
        }
    });

    jQuery(".p-filter").on('click', function(event) {
        event.preventDefault();
        var pFilter = $(this).attr('data-filter');
        $portfolioGrid.isotope({
            filter: pFilter
        });
        jQuery('.p-filter').removeClass('current'), jQuery(this).addClass('current')
    });

    var $portfolioGrid2 = $('.portfolio-grid2').isotope({
        // options
        itemSelector: '.portfolio-project',
        masonry: {
            gutter: 0,
            isFitWidth: true,
            isFitHeight: true
        },
        hiddenStyle: {
            opacity: 0
        },
        visibleStyle: {
            opacity: 1
        }
    });

    jQuery(".p-filter2").on('click', function(event) {
        event.preventDefault();
        var pFilter = $(this).attr('data-filter');
        $portfolioGrid2.isotope({
            filter: pFilter
        });
        jQuery('.p-filter2').removeClass('current'), jQuery(this).addClass('current')
    });

    $(".portfolio-project").hover(function() {
        var pH = $(this).innerHeight();
        var pW = $(this).width();
        $(this).children('.project-hover').css({
            height: pH,
            width: pW
        });;
    });

    jQuery('.filters-btn').on('click', function(event) {
        event.preventDefault();
        jQuery('.p-filters').toggle().toggleClass('showed');
    });

    /* - 1.4. Video Background
    ========================================================================== */
    $('.video-background').vide('video/Doux');

    /* - 1.5. Owl Carousel
    ========================================================================== */
    $(".testmonial-carousel").owlCarousel({
        autoPlay: 7000,
        items: 1,
        itemsDesktop: [1199, 1],
        itemsDesktopSmall: [979, 1],
        itemsTablet: [768, 1],

        transitionStyle: "fade"
    });
    $(".media-carousel").owlCarousel({
        navigation: true,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        pagination: false,
        items: 3,
        slideSpeed: 300,
        paginationSpeed: 400,
        singleItem: true,
        transitionStyle: "fade"
    });

    /* - 1.6. Magnific Popup
    ========================================================================== */
    $('.popup-video, .project-video').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-with-zoom',
        closeMarkup: '<button class="mfp-close mfp-close-video"><span class="mfp-close">CLOSE</span></button>',
        tLoading: '<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    });
    $('.project-open').magnificPopup({
        type: 'image',
        image: {
            markup: '<div class="mfp-figure hastitle">' +
                '<div class="mfp-close"></div>' +
                '<div class="mfp-img"></div>' +
                '<div class="mfp-bottom-bar">' +
                '<div class="mfp-title"></div>' +
                '<div class="mfp-counter"></div>' +
                '</div>' +
                '</div>', // Popup HTML markup. `.mfp-img` div will be replaced with img tag, `.mfp-close` by close button
            titleSrc: function(item) {
                var titleHTML = item.el.parents(".portfolio-project").children('.project-data').html();
                return titleHTML;
            }
        },
        gallery: {
            enabled: true
        },
        callbacks: {

            buildControls: function() {
                // re-appends controls inside the main container
                this.contentContainer.append(this.arrowLeft.add(this.arrowRight));
            }

        },
        mainClass: 'mfp-fade',
        removalDelay: 300,
        closeMarkup: '<button class="mfp-close"><span class="mfp-close">CLOSE</span></button>',
        tLoading: '<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    });


    /* - 1.7. Smooth Scroll
    ========================================================================== */
    $('.nav li a, a.navTo').smoothScroll({
        offset: 0,
        easing: 'easeInOutQuart',
        speed: 1400
    });

    $('.layout-2 .nav li a').smoothScroll({
        offset: -100,
        easing: 'easeInOutQuart',
        speed: 1400
    });

    /* - 1.8. Counting Numbers
    ========================================================================== */

    $('#stats').beacon({
        handler: function () {
            $(".state-count span").countTo({
                speed: 1800
            });
        },
        runOnce: true,
        range: -200
    });


    /* - 1.9. Menu Collapse
    ========================================================================== */
    $('#m-collapse').on('click', function(event) {
        event.preventDefault();
        $('.menu-holder').toggleClass('show').toggle();
        $('.navigation').toggle();
        $(this).children('i').toggleClass('fa-navicon');
        $(this).children('i').toggleClass('fa-close');
    });

    /* - 1.10. Play Video
    ========================================================================== */
    $(".em-video-play").on('click', function(event) {
        event.preventDefault();
        var $this = $(this);
        var vType = $this.attr('data-vidtype');
        var vID = $this.attr('data-vidid');
        var vTarget = $this.parents(".embed-video");
        var vWidth = vTarget.outerWidth();
        var vHeight = vTarget.outerHeight();

        if (vType == "vimoe") {
            var iframeHtml = '<iframe src="https://player.vimeo.com/video/' + vID + '?autoplay=1&color=ffffff&title=0&byline=0&portrait=0" width="' + vWidth + '" height="' + vHeight + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="Background:transparent"></iframe>';
            $this.parents(".embed-video").addClass('loading').html(iframeHtml);
        }

    });

    /* - 1.11. Play Audio
    ========================================================================== */
    $(".em-audio-play").on('click', function(event) {
        event.preventDefault();
        var $this = $(this);
        var aType = $this.attr('data-audtype');
        var aID = $this.attr('data-audid');
        var aTarget = $this.parents(".embed-audio");
        var aWidth = aTarget.outerWidth();
        var aHeight = aTarget.outerHeight();

        if (aType == "soundcloud") {
            var iframeHtml = '<iframe width="' + aWidth + '" height="' + aHeight + '" scrolling="no" style="Background:transparent;" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + aID + '&amp;auto_play=true&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;visual=true"></iframe>';
            $this.parents(".embed-audio").addClass('loading').html(iframeHtml);
        }

    });

    /* - 1.12. Stick Header
    ========================================================================== */
    stickHeader();

    /* - 1.13. Fix Mobile Menu
    ========================================================================== */
    mobileMenu();

    /* - 1.14. Contact Form Submit
    ========================================================================== */
    $(function() {
        $('#contact').validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                email: {
                    required: true,
                    email: true
                },
                message: {
                    required: true,
                    minlength: 20
                }
            },
            messages: {
                name: {
                    required: "Please enter Your Name",
                    minlength: "Name should be more then 2 chars."
                },
                email: {
                    required: "Please enter your E-mail",
                    email: "Incorrect E-mail"
                },
                message: {
                    required: "Please enter your Message",
                    minlength: "Message should be more than 20 chars."
                }
            },
            submitHandler: function(form) {
                $(form).ajaxSubmit({
                    type: "POST",
                    data: $(form).serialize(),
                    url: "php/sendMail.php",
                    beforeSend: function(){
                        $('#contact :input').html('Sending...');
                    },
                    success: function() {
                        $('#contact :input').attr('disabled', 'disabled');
                        $('#contact').fadeTo("slow", 1, function() {
                            $(this).find(':input').attr('disabled', 'disabled');
                            $(this).find('label').css('cursor', 'default');
                            $('#success').fadeIn();
                        });
                        $('#contact :input').html('Done!');
                    },
                    error: function() {
                        $('#contact').fadeTo("slow", 1, function() {
                            $('#error').fadeIn();
                            $('#contact :input').html('Submit');
                        });
                    }
                });
            }
        });
    });
});

/* ==========================================================================
   2. On Document Scroll
   ========================================================================== */
$(window).scroll(function(event) {

    /* - 2.1. Stick Header
    ========================================================================== */
    stickHeader();

    /* - 2.2. Parallax Background
    ========================================================================== */
    parallaxBGImg();
});

/* ==========================================================================
   3. On Document Resize
   ========================================================================== */
$(window).resize(function(event) {

    /* - 3.1. Fix Mobile Menu
    ========================================================================== */
    mobileMenu();

    /* - 3.2. Fix Slider Content
    ========================================================================== */
    slidesFix();

});

/* ==========================================================================
   4. Functions
   ========================================================================== */
function slidesFix() {
    var docWidth = jQuery(document).width();
    var docHeight = jQuery(document).height();
    if (docWidth < 767 || docWidth == 767) {
        jQuery(".s-caption").width(docWidth - 80);
    } else {
        jQuery(".s-caption").width(docWidth - 300);
    }
}

function stickHeader() {
    var scrollPos = $("body").scrollTop();
    var headerC = $(".mainHeader");
    var headerH = headerC.height();
    var transparentH ;
    if (headerC.attr('data-transparent') == "yes") {
        transparentH = "transparent";
    }
    if (scrollPos > headerH) {
        headerC.addClass('isStuck');
        headerC.removeClass(transparentH);
    } else {
        headerC.removeClass('isStuck');
        headerC.addClass(transparentH);
    }
}

function parallaxBGImg() {
    $('.parallax').each(function() {
        var i = $(this).position().top,
            t = ($(this).data("parallax-speed"), i - $(window).scrollTop()),
            n = -(t / 2),
            e = n + "px";
        $(this).css({
            backgroundPosition: "50% " + e
        });
    });
}

function mobileMenu() {
    var windowSize = $(window).width();
    if (windowSize < 480 || windowSize == 480) {
        $("li.parent > a").on('click', function(event) {
            event.preventDefault();
            $(this).parents("li").children('ul').slideToggle(200);
        });
    } else {
        $("li.parent > a").on('click', function(event) {
            event.preventDefault();
        });
    }
}
