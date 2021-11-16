/* Show and hide menu */

$(document).ready(function (){

  'use strict';

  $(window).scroll(function() {

    'use strict';

    if($(window).scrollTop() < 80 ) {
        $('.navbar').css ({
          'opacity': '.5'
        });

        $('.navbar-default').css({
          'background-color': 'rgba(59, 59, 59, .3)'
        });

    }

    else {
      $('.navbar').css ({
        'opacity': '1'
      });

      $('.navbar-default').css({
        'background-color': 'rgba(59, 59, 59, .7)',
        'border-color': '#444'
      });

      $('.navbar-brand img').css({
        'height': '35',
        'padding-top': '0px'
      });

      $('.navbar-nav > li > a').css({
        'padding-top': '15px'
      });

    }

  });

});



// Select all links with hashes
$('.nav-item, .scroll-to-top').click(function(event) {

    'use strict';

    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });


/* active menu item on click */
$(document).ready(function() {

  'use strict';

  $('.navbar-nav li a').click(function(){

    'use strict'

    $('navbar-nav li a').parent().removeClass("active");
    $(this).parent().addClass('active');

  });

});


//active menu item on scroll
$(document).ready(function(){

  'use strict';

  $(window).scroll(function(){

    'use strict';

    $("section").each(function(){

      'use strict';

      var bb = $(this).attr("id");
      var hei = $(this).outerHeight();
      var grttop = $(this).offset().top -70;

      if ($(window).scrollTop() > grttop && $(window).scrollTop() < grttop + hei) {
        $(".navbar-nav li a[href='#" + bb +"']").parent().addClass("active");
      } else {
        $(".navbar-nav li a[href='#" + bb +"']").parent().removeClass("active");
      }

    });
  });
});

//add auto padding to header
$(document).ready(function(){

  'use strict';

  setInterval(function(){
    'use strict';
    var windowHeight = $(window).height();
    var containerHeight = $('.header-container').height();
    var padTop = windowHeight - containerHeight;

    $(".header-container").css({
      'padding-top': Math.round(padTop/2) + 'px',
      'padding-bottom': Math.round(padTop/2) + 'px',
    });
  }, 10);

});

$(document).ready(function(){
  $('.counter-num').counterUp({
    delay: 10,
    time: 5000
  });
});

// Add animation from wow.js
$(document).ready(function(){

  'use strict';
  new WOW().init();
})
