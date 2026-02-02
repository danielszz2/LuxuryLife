document.addEventListener("DOMContentLoaded", () => {
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slideshow-container .slide");
  const dots = document.querySelectorAll(".slideshow-container .dot");
  const prev = document.querySelector(".slideshow-container .prev");
  const next = document.querySelector(".slideshow-container .next");

  if (!slides.length) return;

  function showSlide(n) {
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;

    slides.forEach(slide => slide.classList.remove("show"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[slideIndex].classList.add("show");
    if (dots[slideIndex]) dots[slideIndex].classList.add("active");
  }

  function changeSlide(n) {
    slideIndex += n;
    showSlide(slideIndex);
  }

  if(prev) prev.addEventListener("click", () => changeSlide(-1));
  if(next) next.addEventListener("click", () => changeSlide(1));

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      slideIndex = i;
      showSlide(slideIndex);
    });
  });

  function autoSlide() {
    slideIndex++;
    showSlide(slideIndex);
    setTimeout(autoSlide, 6000);
  }

  showSlide(slideIndex);
  autoSlide();
});
