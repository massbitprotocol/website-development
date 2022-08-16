$(function () {
    // if (!localStorage.getItem('showNotify')) {
    //     window.setTimeout(() => {
    //         $('.mb-fixed-notice button').trigger('click');
    //         localStorage.setItem('showNotify', 'true');
    //     }, 3000);
    // }

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

    $('#btnCreateNew').on('click', function () {
        $('#SectionNoData').hide();
        $('#SectionData').show();
    })
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