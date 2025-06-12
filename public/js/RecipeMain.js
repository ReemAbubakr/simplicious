const images = document.getElementById('carouselImages');
const dots = document.querySelectorAll('.dot');
let index = 0;

function showSlide(i) {
  index = i;
  images.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => showSlide(i));
});

setInterval(() => {
  index = (index + 1) % dots.length;
  showSlide(index);
}, 4000);