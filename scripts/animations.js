// Animations module: fade-in-up elements appear on scroll
export function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing after the element becomes visible
        observer.unobserve(entry.target);
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