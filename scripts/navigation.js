/**
 * Shared Navigation Component for Azael Montejo Jr. Website
 * This component provides a unified navigation bar that can be injected into any page
 */

class SharedNavigation {
    constructor() {
        this.navItems = [
            { href: '/', text: 'Home', id: 'home' },
            { href: '/EXOBOUND/', text: 'EXOBOUND', id: 'exobound' },
            { href: '/Portfolio/', text: 'Portfolio', id: 'portfolio' },
            { href: '/blog/', text: 'Blog', id: 'blog' },
            { href: '/connect/', text: 'Connect', id: 'connect' }
        ];
        
        // Initialize navigation when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.inject();
    }

    /**
     * Get the current page identifier based on the URL
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment.length > 0);
        const currentSegment = pathSegments[pathSegments.length - 1] || '';
        
        // Handle test page
        if (currentSegment === 'testpage.html') return 'connect';
        
        // Handle main pages
        if (path === '/' || path === '/index.html' || currentSegment === 'index.html' || currentSegment === '') return 'home';
        if (path.includes('/EXOBOUND') || currentSegment.includes('exobound')) return 'exobound';
        if (path.includes('/Portfolio') || currentSegment.includes('portfolio')) return 'portfolio';
        if (path.includes('/blog') || currentSegment.includes('blog')) return 'blog';
        if (path.includes('/connect') || currentSegment.includes('connect')) return 'connect';
        
        return 'home';
    }

    /**
     * Generate the navigation HTML
     */
    injectNavigation() {
        const currentPage = this.getCurrentPage();
        
        const navItemsHTML = this.navItems.map(item => {
            const isActive = item.id === currentPage;
            const activeClass = isActive ? 'text-orange-400 font-bold' : 'text-gray-300';
            return `<a href="${item.href}" class="${activeClass} hover:text-orange-400 transition-colors">${item.text}</a>`;
        }).join('');

        const mobileNavItemsHTML = this.navItems.map(item => {
            const isActive = item.id === currentPage;
            const activeClass = isActive ? 'text-orange-400 font-bold' : 'text-gray-300';
            return `<a href="${item.href}" class="block py-2 px-4 ${activeClass} hover:bg-gray-800">${item.text}</a>`;
        }).join('');

        return `
            <!-- Navigation Bar -->
            <nav class="w-full flex items-center justify-between px-6 py-4 bg-black/60 sticky top-0 z-50 border-b border-slate-800">
                <div>
                    <a href="/" class="text-xl font-bold text-white hover:text-orange-400 transition-colors">Azael Montejo</a>
                </div>
                <div class="hidden md:flex items-center space-x-6 text-sm">
                    ${navItemsHTML}
                </div>
                <div class="md:hidden">
                    <button id="menu-btn" class="text-white focus:outline-none">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
            </nav>
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden md:hidden px-6 pb-4 bg-black/90 border-b border-slate-800">
                ${mobileNavItemsHTML}
            </div>`;
    }

    /**
     * Inject the navigation into the page
     */
    inject() {
        try {
            const navContainer = document.getElementById('navigation-container');
            if (!navContainer) {
                console.error('Navigation container not found');
                return;
            }
            
            // Check if navigation already exists to prevent duplicate injection
            if (navContainer.querySelector('nav')) {
                console.log('Navigation already exists, skipping injection');
                return;
            }

            const navigationHTML = this.injectNavigation();
            navContainer.innerHTML = navigationHTML;
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('Navigation injected successfully');
        } catch (error) {
            console.error('Error injecting navigation:', error);
        }
    }
    
    setupEventListeners() {
        // Mobile menu toggle
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Close mobile menu when clicking on a link
        const mobileLinks = document.querySelectorAll('#mobile-menu a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Make SharedNavigation available globally
window.SharedNavigation = SharedNavigation;

// Initialize navigation when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SharedNavigation());
} else {
    // DOM already loaded, initialize immediately
    new SharedNavigation();
}
