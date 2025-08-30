// Handle both module and non-module usage
const init = async () => {
  try {
    // If this is a module environment, use dynamic import
    if (typeof module !== 'undefined' && module.hot) {
      const { initAnimations } = await import('./animations.js');
      initAnimations();
    } else {
      // Otherwise, assume animations.js is loaded globally
      if (typeof initAnimations === 'function') {
        initAnimations();
      }
    }
  } catch (error) {
    console.error('Error initializing animations:', error);
  }
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}