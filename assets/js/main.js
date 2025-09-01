document.addEventListener('DOMContentLoaded', function() {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      console.log('Burger clicked, active class toggled'); 
    });
  } else {
    console.log('Burger or navLinks not found'); 
  }
});
  
