// Selects the element with the id 'menu-icon' and stores it in the variable 'menu'
let menu = document.querySelector('#menu-icon');

// Selects the element with the class 'navbar' and stores it in the variable 'navbar'
let navbar = document.querySelector('.navbar');

// Adds an event listener to the 'menu' element that toggles classes when clicked
menu.onclick = () => {
  // Toggles the 'bx-x' class on the 'menu' element, which may change the icon
  menu.classList.toggle('bx-x');
  // Toggles the 'active' class on the 'navbar' element, which may display or hide the navbar
  navbar.classList.toggle('active');
}

// Adds an event listener for the scroll event on the window
window.onscroll = () => {
  // Removes the 'bx-x' class from the 'menu' element when the user scrolls
  menu.classList.remove('bx-x');
  // Removes the 'active' class from the 'navbar' element when the user scrolls
  navbar.classList.remove('active');
}
