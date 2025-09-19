// Etsy Shop Integration for Beri Ink
class EtsyShopIntegration {
    constructor() {
        this.apiKey = 'pxqb8kr9sivd7fyemn37vnru';
        this.shopId = 'BeriInk';
        this.baseUrl = 'https://openapi.etsy.com/v3';
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('beri-ink-cart') || '[]');
    }

    // Fetch products from Etsy shop
    async fetchProducts() {
        try {
            console.log('Fetching products from Etsy shop...');
            
            // First, get shop listings with a simple call
            const response = await fetch(
                `${this.baseUrl}/application/shops/${this.shopId}/listings/active?api_key=${this.apiKey}&limit=50&includes=Images`
            );
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Etsy API error:', response.status, errorText);
                throw new Error(`Etsy API error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Etsy API response:', data);
            
            if (!data.results || !Array.isArray(data.results)) {
                throw new Error('Invalid response format from Etsy API');
            }
            
            // Process the listings
            this.products = data.results.map(listing => {
                const images = listing.Images || [];
                const mainImage = images.length > 0 ? images[0].url_fullxfull : 'images/placeholder-temp-tattoo.jpg';
                
                return {
                    id: listing.listing_id,
                    title: listing.title,
                    description: this.stripHtml(listing.description),
                    price: parseFloat(listing.price.amount) / 100, // Convert from cents
                    currency: listing.price.currency_code,
                    images: images.map(img => img.url_fullxfull),
                    url: listing.url,
                    quantity: 1, // Default quantity
                    tags: listing.tags || [],
                    materials: listing.materials || [],
                    views: listing.views || 0,
                    num_favorers: listing.num_favorers || 0,
                    etsy_shop_url: listing.url
                };
            });
            
            console.log('Products processed:', this.products.length);
            return this.products;
            
        } catch (error) {
            console.error('Error fetching Etsy products:', error);
            throw error;
        }
    }

    // Strip HTML tags from description
    stripHtml(html) {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
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
        
        // Add event listeners for add to cart
        this.addCartEventListeners();
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
                            Buy on Etsy
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Add event listeners for cart functionality
    addCartEventListeners() {
        // No cart functionality for now, just Etsy links
        console.log('Etsy product event listeners added');
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