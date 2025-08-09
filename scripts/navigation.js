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
            { href: '/connect', text: 'Connect', id: 'connect' }
        ];
    }

    /**
     * Get the current page identifier based on the URL
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = window.location.pathname.split('/').pop();
        
        // Handle test page
        if (filename === 'testpage.html') return 'connect';
        
        // Handle main pages
        if (path === '/' || path === '/index.html' || filename === 'index.html') return 'home';
        if (path.includes('/EXOBOUND') || filename.includes('exobound')) return 'exobound';
        if (path.includes('/Portfolio') || filename.includes('portfolio')) return 'portfolio';
        if (path.includes('/blog') || filename.includes('blog')) return 'blog';
        if (path.includes('/connect') || filename.includes('connect')) return 'connect';
        
        return 'home';
    }

    /**
     * Generate the navigation HTML
     */
    generateNavigationHTML() {
        const currentPage = this.getCurrentPage();
        const basePath = this.getBasePath();
        
        const navItemsHTML = this.navItems.map(item => {
            const isActive = item.id === currentPage;
            const activeClass = isActive ? 'text-orange-400 font-bold' : 'text-gray-300';
            const href = item.href.startsWith('/') ? basePath + item.href : item.href;
            
            return `<a href="${href}" class="${activeClass} link-hover">${item.text}</a>`;
        }).join('');

        const mobileNavItemsHTML = this.navItems.map(item => {
            const isActive = item.id === currentPage;
            const activeClass = isActive ? 'text-orange-400 font-bold' : 'text-gray-300';
            const href = item.href.startsWith('/') ? basePath + item.href : item.href;
            
            return `<a href="${href}" class="block py-2 ${activeClass} link-hover">${item.text}</a>`;
        }).join('');

        return `
            <!-- Navigation Bar -->
            <nav class="w-full flex items-center justify-between px-6 py-4 bg-black/60 sticky top-0 z-50 border-b border-slate-800">
                <div>
                    <a href="${basePath}/" class="text-xl font-bold text-white link-hover">Azael Montejo</a>
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
            </div>
        `;
    }

    /**
     * Get the base path for relative links
     */
    getBasePath() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        // If we're in a subdirectory, we need to go up
        if (segments.length > 1) {
            return '../'.repeat(segments.length - 1);
        }
        
        return './';
    }

    /**
     * Inject the navigation into the page
     */
    inject() {
        const navigationHTML = this.generateNavigationHTML();
        
        // Find the body element
        const body = document.body;
        
        // Insert navigation at the beginning of the body
        body.insertAdjacentHTML('afterbegin', navigationHTML);
        
        // Add mobile menu functionality
        this.setupMobileMenu();
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
}

// Global function to inject navigation
function injectSharedNavigation() {
    const navigation = new SharedNavigation();
    navigation.inject();
}

// Auto-inject if this script is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSharedNavigation);
} else {
    injectSharedNavigation();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SharedNavigation, injectSharedNavigation };
}
