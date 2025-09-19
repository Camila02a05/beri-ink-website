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
            
            // First, get shop listings
            const listingsResponse = await fetch(
                `${this.baseUrl}/application/shops/${this.shopId}/listings/active?api_key=${this.apiKey}&limit=100`
            );
            
            if (!listingsResponse.ok) {
                throw new Error(`Etsy API error: ${listingsResponse.status}`);
            }
            
            const listingsData = await listingsResponse.json();
            console.log('Listings fetched:', listingsData.results.length);
            
            // Get detailed product information
            const products = await Promise.all(
                listingsData.results.map(async (listing) => {
                    try {
                        // Get listing images
                        const imagesResponse = await fetch(
                            `${this.baseUrl}/application/listings/${listing.listing_id}/images?api_key=${this.apiKey}`
                        );
                        const imagesData = await imagesResponse.json();
                        
                        // Get listing inventory
                        const inventoryResponse = await fetch(
                            `${this.baseUrl}/application/listings/${listing.listing_id}/inventory?api_key=${this.apiKey}`
                        );
                        const inventoryData = await inventoryResponse.json();
                        
                        return {
                            id: listing.listing_id,
                            title: listing.title,
                            description: listing.description,
                            price: parseFloat(listing.price.amount) / 100, // Convert from cents
                            currency: listing.price.currency_code,
                            images: imagesData.results.map(img => img.url_fullxfull),
                            url: listing.url,
                            quantity: inventoryData.results[0]?.products[0]?.offerings[0]?.quantity || 1,
                            tags: listing.tags,
                            materials: listing.materials,
                            shop_section_id: listing.shop_section_id,
                            state: listing.state,
                            views: listing.views,
                            num_favorers: listing.num_favorers,
                            etsy_shop_url: listing.url
                        };
                    } catch (error) {
                        console.error('Error fetching details for listing:', listing.listing_id, error);
                        return null;
                    }
                })
            );
            
            // Filter out null results
            this.products = products.filter(product => product !== null);
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
                        <button class="product-button add-to-cart" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                        <a href="${product.etsy_shop_url}" target="_blank" class="product-button etsy-button">
                            Buy on Etsy
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Add to cart functionality
    addToCart(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        const cartItem = {
            id: `etsy-${product.id}`,
            title: product.title,
            price: Math.round(product.price * 100), // Convert to cents
            image: product.images[0] || 'images/placeholder-temp-tattoo.jpg',
            sku: `ETSY-${product.id}`,
            source: 'etsy',
            etsy_url: product.etsy_shop_url
        };

        // Check if item already exists in cart
        const existingItem = this.cart.find(item => item.id === cartItem.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItem.quantity = 1;
            this.cart.push(cartItem);
        }

        // Save to localStorage
        localStorage.setItem('beri-ink-cart', JSON.stringify(this.cart));
        
        // Update cart count
        this.updateCartCount();
        
        // Show success message
        this.showCartMessage(`${product.title} added to cart!`);
    }

    // Update cart count display
    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'flex';
        }
    }

    // Add event listeners for cart functionality
    addCartEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                const productId = e.target.getAttribute('data-product-id');
                this.addToCart(productId);
            }
        });
    }

    // Show cart message
    showCartMessage(message) {
        // Create or update cart message element
        let messageEl = document.getElementById('cart-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'cart-message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #8b7355;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 10000;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }

    // Utility function to truncate text
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Initialize the integration
    async init() {
        try {
            console.log('Initializing Etsy shop integration...');
            await this.fetchProducts();
            this.displayProducts();
            this.updateCartCount();
            console.log('Etsy integration initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize Etsy integration:', error);
            // Show error message to user
            const container = document.getElementById('etsy-products-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h3>Unable to load products</h3>
                        <p>Please try again later or visit our <a href="https://www.etsy.com/shop/BeriInk" target="_blank">Etsy shop</a> directly.</p>
                    </div>
                `;
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.etsyIntegration = new EtsyShopIntegration();
    window.etsyIntegration.init();
});

// Make it globally available
window.EtsyShopIntegration = EtsyShopIntegration;