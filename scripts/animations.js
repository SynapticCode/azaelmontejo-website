// Animations module: fade-in-up elements appear/disappear on scroll
export function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  const elementsToAnimate = document.querySelectorAll('.fade-in-up');
  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });
} 