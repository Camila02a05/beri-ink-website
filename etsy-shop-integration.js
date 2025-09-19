// Etsy Shop Integration for Beri Ink
class EtsyShopIntegration {
    constructor() {
        this.products = [];
    }

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
                        <a href="${product.etsy_shop_url}" target="_blank" class="product-button etsy-button">
                            Buy on Etsy - $${price}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }


    // Utility function to truncate text
    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text || '';
        return text.substring(0, maxLength) + '...';
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
            // Show error message to user
            const container = document.getElementById('etsy-products-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h3>Unable to load products from Etsy</h3>
                        <p>Please visit our <a href="https://www.etsy.com/shop/BeriInk" target="_blank" style="color: #8b7355; text-decoration: underline;">Etsy shop</a> directly.</p>
                        <p style="font-size: 0.9em; margin-top: 1rem;">Error: ${error.message}</p>
                    </div>
                `;
            }
        }
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