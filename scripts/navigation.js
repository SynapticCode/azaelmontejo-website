/**
 * Shared Navigation Component for Azael Montejo Jr. Website
 * This component provides a unified navigation bar that can be injected into any page
 */

class SharedNavigation {
    constructor() {
        // Get the base path for the current page
        this.basePath = this.getBasePath();
        
        this.navItems = [
            { href: this.basePath + 'index.html', text: 'Home', id: 'home' },
            { href: this.basePath + 'EXOBOUND/', text: 'EXOBOUND', id: 'exobound' },
            { href: this.basePath + 'Portfolio/', text: 'Portfolio', id: 'portfolio' },
            { href: this.basePath + 'blog/', text: 'Blog', id: 'blog' },
            { href: this.basePath + 'connect/', text: 'Connect', id: 'connect' }
        ];
    }

    /**
     * Get the base path for the current page
     */
    getBasePath() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment.length > 0);
        
        // If we're in a subdirectory, we need to go up
        if (pathSegments.length > 1) {
            // Remove the current page/directory from the path
            pathSegments.pop();
            return '/' + pathSegments.join('/') + '/';
        } else if (pathSegments.length === 1) {
            // We're in a subdirectory, need to go up one level
            return '/';
        } else {
            // We're at the root
            return '/';
        }
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
    generateNavigationHTML() {
        const currentPage = this.getCurrentPage();
        
        const navItemsHTML = this.navItems.map(item => {
            const isActive = item.id === currentPage;
            const activeClass = isActive ? 'text-orange-400 font-bold' : 'text-gray-300';
            
            return `<a href="${item.href}" class="${activeClass} link-hover">${item.text}</a>`;
        }).join('');

        const mobileNavItemsHTML = this.navItems.map(item => {
            const isActive = item.id === currentPage;
            const activeClass = isActive ? 'text-orange-400 font-bold' : 'text-gray-300';
            
            return `<a href="${item.href}" class="block py-2 ${activeClass} link-hover">${item.text}</a>`;
        }).join('');

        return `
            <!-- Navigation Bar -->
            <nav class="w-full flex items-center justify-between px-6 py-4 bg-black/60 sticky top-0 z-50 border-b border-slate-800">
                <div>
                    <a href="${this.basePath}index.html" class="text-xl font-bold text-white link-hover">Azael Montejo</a>
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
     * Inject the navigation into the page
     */
    inject() {
        try {
            // Check if navigation already exists to prevent duplicate injection
            if (document.querySelector('nav')) {
                console.log('Navigation already exists, skipping injection');
                return;
            }

            const navigationHTML = this.generateNavigationHTML();
            
            // Find the body element
            const body = document.body;
            
            if (!body) {
                console.error('Body element not found');
                return;
            }
            
            // Insert navigation at the beginning of the body
            body.insertAdjacentHTML('afterbegin', navigationHTML);
            
            // Add mobile menu functionality
            this.setupMobileMenu();
            
            console.log('Navigation injected successfully');
        } catch (error) {
            console.error('Error injecting navigation:', error);
        }
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
    try {
        const navigation = new SharedNavigation();
        navigation.inject();
    } catch (error) {
        console.error('Error in injectSharedNavigation:', error);
    }
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
