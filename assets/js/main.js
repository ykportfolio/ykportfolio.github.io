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
  
const hero = document.querySelector('.main-hero');
const left = document.querySelector('.left-side');
const right = document.querySelector('.right-side');

hero.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const width = window.innerWidth;

  if (x < width / 2) {
    // HOVER LEFT
    left.style.transform = "translateX(-15%)";
    right.style.transform = "translateX(10%)";
  } else {
    // HOVER RIGHT
    left.style.transform = "translateX(-10%)";
    right.style.transform = "translateX(15%)";
  }
});

hero.addEventListener('mouseleave', () => {
  left.style.transform = "translateX(0)";
  right.style.transform = "translateX(0)";
});

