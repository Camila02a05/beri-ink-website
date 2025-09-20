// Etsy Shop Integration for Beri Ink
class EtsyShopIntegration {
    constructor() {
        this.products = [];
        // Cart functionality is now handled by cart.js
    }

    // Cart functionality removed - now handled by cart.js

    // Fetch products from Etsy shop via Netlify function
    async fetchProducts() {
        try {
            console.log('Fetching products from Etsy via Netlify function...');
            
            const response = await fetch('/.netlify/functions/etsy-products');
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Netlify function error:', response.status, errorData);
                throw new Error(`Failed to fetch products: ${errorData.message || 'Unknown error'}`);
            }
            
            const data = await response.json();
            console.log('Products fetched successfully:', data);
            
            if (!data.success || !data.products) {
                throw new Error('Invalid response from server');
            }
            
            this.products = data.products;
            console.log('Products processed:', this.products.length);
            return this.products;
            
        } catch (error) {
            console.error('Error fetching Etsy products:', error);
            throw error;
        }
    }

    // Display products on the page
    displayProducts(containerId = 'etsy-products-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        if (this.products.length === 0) {
            container.innerHTML = '<p>No products available at the moment.</p>';
            return;
        }

        const productsHTML = this.products.map(product => this.createProductCard(product)).join('');
        container.innerHTML = productsHTML;
        
        console.log('Products displayed successfully');
    }

    // Create product card HTML
    createProductCard(product) {
        const mainImage = product.images[0] || 'images/placeholder-temp-tattoo.jpg';
        const price = product.price.toFixed(2);
        
        return `
            <div class="product-card etsy-product" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${mainImage}" alt="${product.title}" class="product-image" loading="lazy">
                    ${product.images.length > 1 ? `
                        <div class="image-thumbnails desktop-only">
                            ${product.images.slice(1, 5).map((img, index) => `
                                <img src="${img}" alt="${product.title}" class="thumbnail" loading="lazy">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${this.truncateText(product.description, 100)}</p>
                    <div class="product-price-container">
                        <div class="product-price">$${price}</div>
                    </div>
                    <div class="product-actions">
                        <button class="product-button add-to-cart-btn" data-product-id="${product.id}">
                            Add to Cart - $${price}
                        </button>
                        <a href="${product.etsy_shop_url}" target="_blank" class="product-link etsy-link">
                            View on Etsy
                        </a>
                    </div>
                </div>
            </div>
        `;
    }


    // Cart event listeners removed - now handled by cart.js

    // Utility function to truncate text
    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text || '';
        return text.substring(0, maxLength) + '...';
    }

    // Initialize cart drawer functionality - REMOVED to avoid conflicts with cart.js
    initCartDrawer() {
        // Cart functionality is now handled by cart.js
        // This function is kept empty to avoid conflicts
    }

    // Initialize the integration
    async init() {
        try {
            console.log('Initializing Etsy shop integration...');
            
            // Show loading state
            const container = document.getElementById('etsy-products-container');
            if (container) {
                container.innerHTML = '<div class="loading">Loading products from Etsy...</div>';
            }
            
            await this.fetchProducts();
            this.displayProducts();
            console.log('Etsy integration initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize Etsy integration:', error);
            // Show fallback with sample products
            this.showFallbackProducts();
        }
        
        // Always show fallback products for now (until Etsy API is approved)
        this.showFallbackProducts();
    }

    // Show fallback products when Etsy API fails
    showFallbackProducts() {
        const container = document.getElementById('etsy-products-container');
        if (!container) return;

        // Sample products as fallback
        const fallbackProducts = [
            {
                id: 'fallback-1',
                title: 'Delicate Floral Temporary Tattoo',
                description: 'Beautiful fine line floral design perfect for trying out tattoo placement',
                price: 8.99,
                images: ['images/placeholder-temp-tattoo.jpg'],
                etsy_shop_url: 'https://www.etsy.com/shop/BeriInk'
            },
            {
                id: 'fallback-2',
                title: 'Minimalist Line Art Tattoo',
                description: 'Clean, simple line work that matches your aesthetic',
                price: 7.99,
                images: ['images/placeholder-temp-tattoo.jpg'],
                etsy_shop_url: 'https://www.etsy.com/shop/BeriInk'
            },
            {
                id: 'fallback-3',
                title: 'Geometric Temporary Tattoo',
                description: 'Modern geometric design for the contemporary tattoo lover',
                price: 9.99,
                images: ['images/placeholder-temp-tattoo.jpg'],
                etsy_shop_url: 'https://www.etsy.com/shop/BeriInk'
            },
            {
                id: 'fallback-4',
                title: 'Botanical Temporary Tattoo',
                description: 'Nature-inspired design with delicate details',
                price: 8.50,
                images: ['images/placeholder-temp-tattoo.jpg'],
                etsy_shop_url: 'https://www.etsy.com/shop/BeriInk'
            }
        ];

        this.products = fallbackProducts;
        this.displayProducts();

        // Add a notice about the fallback
        const notice = document.createElement('div');
        notice.style.cssText = `
            text-align: center; 
            padding: 20px; 
            background: #f8f9fa; 
            border-radius: 8px; 
            margin: 20px 0;
            color: #666;
        `;
        notice.innerHTML = `
            <p><strong>Note:</strong> Showing sample products. <a href="https://www.etsy.com/shop/BeriInk" target="_blank" style="color: #8b7355; text-decoration: underline;">Visit our Etsy shop</a> to see all available designs and make a purchase.</p>
        `;
        container.parentNode.insertBefore(notice, container.nextSibling);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Etsy integration...');
    window.etsyIntegration = new EtsyShopIntegration();
    window.etsyIntegration.init();
});

// Make it globally available
window.EtsyShopIntegration = EtsyShopIntegration;