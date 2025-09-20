// Etsy Shop Integration for Beri Ink
class EtsyShopIntegration {
    constructor() {
        this.products = [];
        this.cart = [];
        this.initCart();
    }

    // Initialize cart from localStorage
    initCart() {
        const savedCart = localStorage.getItem('beri-ink-cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
        this.updateCartUI();
    }

    // Add item to cart
    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showCartNotification();
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('beri-ink-cart', JSON.stringify(this.cart));
    }

    // Update cart UI
    updateCartUI() {
        const cartCount = document.getElementById('cartCount') || document.getElementById('cart-count');
        const cartTotal = document.getElementById('cartTotal') || document.getElementById('cart-total');
        const cartItems = document.getElementById('cartItems');
        
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }

        // Update cart items display
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.images[0]}" alt="${item.title}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4>${item.title}</h4>
                            <p>$${item.price.toFixed(2)}</p>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" onclick="window.etsyIntegration.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="window.etsyIntegration.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                <button class="remove-btn" onclick="window.etsyIntegration.removeFromCart('${item.id}')">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Show cart notification
    showCartNotification() {
        let notification = document.getElementById('cart-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'cart-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #8b7355;
                color: white;
                padding: 12px 20px;
                border-radius: 5px;
                z-index: 1000;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(notification);
        }
        
        notification.textContent = 'Added to cart!';
        notification.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
        }, 3000);
    }

    // Checkout
    async checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        try {
            const response = await fetch('/.netlify/functions/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: this.cart,
                    customerInfo: {
                        email: ''
                    }
                })
            });

            const data = await response.json();
            
            if (data.success) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Checkout failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
        }
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
        
        // Add event listeners for add to cart buttons
        this.addCartEventListeners();
        
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


    // Add event listeners for cart functionality
    addCartEventListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    this.addToCart(product, 1);
                }
            });
        });
    }

    // Utility function to truncate text
    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text || '';
        return text.substring(0, maxLength) + '...';
    }

    // Initialize cart drawer functionality
    initCartDrawer() {
        const cartButton = document.getElementById('cartButton');
        const cartDrawer = document.getElementById('cartDrawer');
        const cartClose = document.getElementById('cartClose');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (cartButton) {
            cartButton.addEventListener('click', () => {
                cartDrawer.style.display = 'block';
                cartDrawer.style.right = '0';
                document.body.style.overflow = 'hidden';
            });
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartDrawer.style.right = '-400px';
                document.body.style.overflow = 'auto';
                setTimeout(() => {
                    cartDrawer.style.display = 'none';
                }, 300);
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }

        // Close cart when clicking outside
        if (cartDrawer) {
            cartDrawer.addEventListener('click', (e) => {
                if (e.target === cartDrawer) {
                    cartDrawer.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }

    // Initialize the integration
    async init() {
        try {
            console.log('Initializing Etsy shop integration...');
            
            // Initialize cart drawer
            this.initCartDrawer();
            
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