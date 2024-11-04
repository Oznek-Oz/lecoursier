export function swipperJS() {  
    var swiper = new Swiper(".slide-content", {
        slidesPerView: 1,
        spaceBetween: 30,
        slidesPerGroup: 1,
        loop: true,
        loopAdditionalSlides:1,
        loopFillGroupWithBlank: true,
        pagination: {
        el: ".swiper-pagination",
        clickable: true,
        },
        navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        },
        /*effect:'fade',
        fadeEffect:{
            crossFade:true,
        },*/
        /*autoplay:{
            delay:3000,
            pauseOnMouseEnter:true,
            disableOnInteraction:false,
        },*/
    });

}