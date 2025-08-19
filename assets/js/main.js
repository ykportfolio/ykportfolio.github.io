document.addEventListener('DOMContentLoaded', function() {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      console.log('Burger clicked, active class toggled'); // Для відладки
    });
  } else {
    console.log('Burger or navLinks not found'); // Перевірка DOM
  }
});

document.querySelector("#myForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Зупиняє стандартну відправку
  const form = e.target;
  console.log("Form submitted, redirect URL:", form.dataset.next); // Дебаг

  fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: { "Accept": "application/json" },
    redirect: "follow" // Дозволяє слідувати за перенаправленнями
  })
  .then(response => {
    console.log("Response status:", response.status); // Дебаг
    if (response.redirected) {
      console.log("Redirected to:", response.url);
      window.location.href = form.dataset.next; // Ігноруємо перенаправлення Formspree
    } else if (response.ok) {
      window.location.href = form.dataset.next; // Редирект на вашу сторінку
    } else {
      alert("There was a problem submitting the form.");
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred while submitting the form.");
  });
});
  
