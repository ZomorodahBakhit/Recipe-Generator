// Swiper
var swiper = new Swiper(".home", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 4000, // Time between slides in milliseconds (e.g., 3000ms = 3 seconds)
    disableOnInteraction: false, // Keeps autoplay running even after user interaction
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
// Swiper for ingredients Section
var ingredientsSwiper = new Swiper(".ingredients", {
  spaceBetween: 10,
  slidesPerView: 5, // Show 5 slides at the same time
  centeredSlides: true,
  loop: true, // Loop through the slides
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 5,
    },
  },
});

let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
  menu.classList.toggle('bx-x');
  navbar.classList.toggle('active');
}

window.onscroll = () => {
  menu.classList.remove('bx-x');
  navbar.classList.remove('active');
}

// Ingredient Carousel section - its not working 

