`use strict`;

window.addEventListener(`DOMContentLoaded`, () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0];
    const header = document.getElementsByTagName("header")[0];
    const body = document.getElementsByTagName("body")[0];

    function mobileMenu() {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        header.classList.toggle("active");
        body.classList.toggle('scroll-lock');          
    }

    function closeMenu() {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        header.classList.remove("active");
        body.classList.remove('scroll-lock');
    }

    const navLink = document.querySelectorAll(".nav-link");
    navLink.forEach(n => n.addEventListener("click", closeMenu));
    hamburger.addEventListener("click", mobileMenu);
});