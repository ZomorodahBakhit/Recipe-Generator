// Swiper
var swiper = new Swiper(".home", {
  spaceBetween: 30,
  centeredSlides: true,
  
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

const categoryButtons = document.querySelectorAll('.category-btn');
const categoryCarousel = document.querySelector('#categoryCarousel');
const ingredientCarousel = document.querySelector('#ingredientCarousel');

let isSyncing = false;

// Synchronize carousels when a category button is clicked
categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetCategory = button.getAttribute('data-target');
    const items = ingredientCarousel.querySelectorAll('.carousel-item');

    items.forEach((item, index) => {
      if (item.getAttribute('data-category') === targetCategory) {
        const bsCarousel = bootstrap.Carousel.getOrCreateInstance(ingredientCarousel);
        bsCarousel.to(index);
      }
    });
  });
});

// Synchronize category and ingredient carousels during manual sliding
categoryCarousel.addEventListener('slide.bs.carousel', (event) => {
  if (isSyncing) return;
  isSyncing = true;

  const targetIndex = event.to;
  const targetCategory = categoryCarousel.querySelectorAll('.carousel-item')[targetIndex]
    .querySelector('.category-btn').getAttribute('data-target');

  const items = ingredientCarousel.querySelectorAll('.carousel-item');
  items.forEach((item, index) => {
    if (item.getAttribute('data-category') === targetCategory) {
      const bsCarousel = bootstrap.Carousel.getOrCreateInstance(ingredientCarousel);
      bsCarousel.to(index);
    }
  });

  isSyncing = false;
});

ingredientCarousel.addEventListener('slide.bs.carousel', (event) => {
  if (isSyncing) return;
  isSyncing = true;

  const targetIndex = event.to;
  const targetCategory = ingredientCarousel.querySelectorAll('.carousel-item')[targetIndex].getAttribute('data-category');

  const items = categoryCarousel.querySelectorAll('.carousel-item');
  items.forEach((item, index) => {
    if (item.querySelector('.category-btn').getAttribute('data-target') === targetCategory) {
      const bsCarousel = bootstrap.Carousel.getOrCreateInstance(categoryCarousel);
      bsCarousel.to(index);
    }
  });

  isSyncing = false;
});

// Array to store selected ingredients
let selectedIngredients = [];

// Handle ingredient button click
document.querySelectorAll('.ingredient-btn').forEach(button => {
  button.addEventListener('click', function () {
    const ingredient = this.getAttribute('data-ingredient');

    // Add ingredient to the array if not already present
    if (!selectedIngredients.includes(ingredient)) {
      selectedIngredients.push(ingredient);

      // Update the selected ingredient list (optional)
      const ingredientList = document.getElementById('ingredientList');
      const listItem = document.createElement('li');
      listItem.textContent = ingredient;
      listItem.classList.add('list-group-item');
      ingredientList.appendChild(listItem);
    }
  });
});

// Handle form submission
document.getElementById('submitButton').addEventListener('click', function () {
  // Update the hidden input with selected ingredients as a comma-separated string
  document.getElementById('selectedIngredients').value = selectedIngredients.join(',');

  // Submit the form
  document.getElementById('ingredientForm').submit();
});
