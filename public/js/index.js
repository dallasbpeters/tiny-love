$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 10) {
        $(".scroll-instructions").addClass("scroll-instructions--hidden");
    } else {
        $(".scroll-instructions").removeClass("scroll-instructions--hidden");
    }
});
