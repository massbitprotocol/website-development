$(function () {
    if (!localStorage.getItem('showNotify')) {
        window.setTimeout(() => {
            $('.mb-fixed-notice button').trigger('click');
            localStorage.setItem('showNotify', 'true');
        }, 3000);
    }
})
$(window).scroll(function () {
    var wScroll = $(this).scrollTop();
    if (wScroll >= 80) {
        $('.mb-auth-header').addClass('mb-fixed');
        $('.mb-dashboard-header').addClass('mb-fixed');
    } else {
        $('.mb-auth-header').removeClass('mb-fixed');
        $('.mb-dashboard-header').removeClass('mb-fixed');
    }
});

if ($(window).scrollTop() >= 80) {
    $('.mb-auth-header').addClass('mb-fixed');
    $('.mb-dashboard-header').addClass('mb-fixed');
} else {
    $('.mb-auth-header').removeClass('mb-fixed');
    $('.mb-dashboard-header').removeClass('mb-fixed');
}