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
            
            const functionUrl = '/.netlify/functions/etsy-products';
            console.log('Function URL:', functionUrl);
            
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(functionUrl, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);
            
            if (!response.ok) {
                let errorData;
                try {
                    const text = await response.text();
                    console.log('Error response text:', text);
                    errorData = JSON.parse(text);
                } catch (e) {
                    errorData = { 
                        message: `HTTP ${response.status}: ${response.statusText}`,
                        error: 'Could not parse error response'
                    };
                }
                console.error('Netlify function error:', response.status, errorData);
                throw new Error(`Failed to fetch products: ${errorData.message || errorData.error || 'Unknown error'}`);
            }
            
            const data = await response.json();
            console.log('Products fetched successfully:', data);
            console.log('Response structure:', {
                success: data.success,
                hasProducts: !!data.products,
                productsLength: data.products ? data.products.length : 0,
                count: data.count,
                message: data.message,
                fullData: data
            });
            
            if (!data.success) {
                console.error('API returned success: false', data);
                throw new Error(data.message || 'API returned unsuccessful response');
            }
            
            if (!data.products) {
                console.error('No products array in response:', data);
                throw new Error('No products array in response');
            }
            
            this.products = data.products;
            console.log('Products processed:', this.products.length);
            
            if (this.products.length === 0) {
                console.warn('No products returned from API. Response:', data);
            }
            
            return this.products;
            
        } catch (error) {
            console.error('Error fetching Etsy products:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            
            // Provide more specific error messages
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. The function may not be deployed or is taking too long to respond.');
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error('Network error: Could not reach the function. Please check if the function is deployed.');
            } else {
                throw error;
            }
        }
    }

    // Display products on the page
    displayProducts(containerId = 'etsy-products-container', filterCategory = 'All') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        if (this.products.length === 0) {
            container.innerHTML = '<p>No products available at the moment.</p>';
            return;
        }

        // Filter products by category
        const filteredProducts = filterCategory === 'All' 
            ? this.products 
            : this.products.filter(p => p.category === filterCategory);

        if (filteredProducts.length === 0) {
            container.innerHTML = '<p>No products found in this category.</p>';
            return;
        }

        const productsHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
        container.innerHTML = productsHTML;
        
        // Add event listeners for add to cart buttons and product clicks
        this.addCartEventListeners();
        this.addProductClickListeners();
        
        console.log('Products displayed successfully:', filteredProducts.length);
    }

    // Create product card HTML
    createProductCard(product) {
        const mainImage = product.images[0] || 'images/placeholder-temp-tattoo.jpg';
        const price = product.price.toFixed(2);
        const additionalImages = product.images.slice(1, 5);
        
        return `
            <div class="product-card etsy-product" data-product-id="${product.id}" onclick="window.openProductModal && window.openProductModal('${product.id}')">
                <div class="product-image-container">
                    <div class="product-image-wrapper">
                        <img src="${mainImage}" alt="${product.title}" class="product-image" loading="lazy">
                    </div>
                    ${additionalImages.length > 0 ? `
                        <div class="image-thumbnails">
                            ${additionalImages.map((img, index) => `
                                <img src="${img}" alt="${product.title}" class="thumbnail" loading="lazy">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-actions">
                        <a href="${product.etsy_url || product.url}" target="_blank" class="product-button etsy-link" onclick="event.stopPropagation()">
                            Shop - $${price}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }


    // Add event listeners for cart buttons
    addCartEventListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = e.target.getAttribute('data-product-id');
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    // Call the global addToCart function from cart.js
                    if (window.addToCart) {
                        window.addToCart({
                            id: product.id,
                            name: product.title,
                            price: parseFloat(product.price),
                            image: product.images ? product.images[0] : 'images/placeholder-temp-tattoo.jpg',
                            quantity: 1
                        });
                    } else {
                        console.error('addToCart function not found');
                    }
                }
            });
        });
    }

    // Add product click listeners for modal
    addProductClickListeners() {
        // Product cards are clickable via onclick attribute
        // Thumbnail hover effects
        document.querySelectorAll('.product-card .thumbnail').forEach(thumbnail => {
            thumbnail.addEventListener('mouseover', function(e) {
                e.stopPropagation();
                const mainImageElement = this.closest('.product-image-container').querySelector('.product-image');
                if (mainImageElement) {
                    const originalSrc = mainImageElement.dataset.originalSrc || mainImageElement.src;
                    mainImageElement.dataset.originalSrc = originalSrc;
                    mainImageElement.src = this.src;
                }
            });
            thumbnail.addEventListener('mouseout', function(e) {
                e.stopPropagation();
                const mainImageElement = this.closest('.product-image-container').querySelector('.product-image');
                if (mainImageElement && mainImageElement.dataset.originalSrc) {
                    mainImageElement.src = mainImageElement.dataset.originalSrc;
                }
            });
        });
    }

    // Create category filter UI
    createCategoryFilter() {
        // Use Etsy's actual categories in the correct order
        const etsyCategories = ['All', 'Animals', 'Botanical', 'Halloween', 'Ornamental', 'Others'];
        
        // Get unique categories from products
        const productCategories = new Set(this.products.map(p => p.category).filter(c => c));
        
        // Filter to only show categories that have products
        const availableCategories = etsyCategories.filter(cat => 
            cat === 'All' || productCategories.has(cat)
        );
        
        const container = document.getElementById('etsy-products-container');
        if (!container || availableCategories.length <= 1) return;

        // Check if filter already exists
        if (document.getElementById('category-filter')) return;

        const filterDiv = document.createElement('div');
        filterDiv.id = 'category-filter';
        filterDiv.className = 'product-filter';
        filterDiv.innerHTML = `
            <div class="filter-buttons">
                ${availableCategories.map(cat => `
                    <button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">
                        ${cat}
                    </button>
                `).join('')}
            </div>
        `;

        container.parentNode.insertBefore(filterDiv, container);

        // Add click listeners
        filterDiv.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                filterDiv.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.displayProducts('etsy-products-container', category);
            });
        });
    }

    // Product modal functionality
    setupProductModal() {
        window.openProductModal = (productId) => {
            const product = this.products.find(p => p.id === productId);
            if (!product) return;
            
            let currentImageIndex = 0;
            const images = product.images || [product.images[0] || 'images/placeholder-temp-tattoo.jpg'];
            
            const modal = document.createElement('div');
            modal.className = 'product-modal-overlay';
            
            const updateModalImage = () => {
                const imgElement = modal.querySelector('.product-modal-main-image img');
                if (imgElement && images[currentImageIndex]) {
                    imgElement.src = images[currentImageIndex];
                }
                // Update thumbnail active state
                modal.querySelectorAll('.product-modal-thumbnail').forEach((thumb, idx) => {
                    thumb.classList.toggle('active', idx === currentImageIndex);
                });
            };
            
            modal.innerHTML = `
                <div class="product-modal">
                    <div class="product-modal-header">
                        <h2>${product.title}</h2>
                        <button class="product-modal-close">&times;</button>
                    </div>
                    <div class="product-modal-content">
                        <div class="product-modal-image-section">
                            <div class="product-modal-main-image">
                                ${images.length > 1 ? '<button class="product-modal-nav product-modal-prev">&lt;</button>' : ''}
                                <img src="${images[0] || 'images/placeholder-temp-tattoo.jpg'}" alt="${product.title}">
                                ${images.length > 1 ? '<button class="product-modal-nav product-modal-next">&gt;</button>' : ''}
                            </div>
                            ${images.length > 1 ? `
                                <div class="product-modal-thumbnails">
                                    ${images.map((img, index) => `
                                        <img src="${img}" alt="${product.title} image ${index + 1}" 
                                             class="product-modal-thumbnail ${index === 0 ? 'active' : ''}" 
                                             data-index="${index}">
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                        <div class="product-modal-info">
                            <div class="product-modal-price">$${product.price.toFixed(2)}</div>
                            <div class="product-modal-description">
                                ${product.description.replace(/\n/g, '<br>')}
                            </div>
                            <div class="product-modal-actions">
                                <a href="${product.etsy_url || product.url}" target="_blank" class="product-modal-etsy-btn">
                                    Shop - $${product.price.toFixed(2)}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Image navigation
            if (images.length > 1) {
                const prevBtn = modal.querySelector('.product-modal-prev');
                const nextBtn = modal.querySelector('.product-modal-next');
                const thumbnails = modal.querySelectorAll('.product-modal-thumbnail');
                
                if (prevBtn) {
                    prevBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                        updateModalImage();
                    });
                }
                
                if (nextBtn) {
                    nextBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        currentImageIndex = (currentImageIndex + 1) % images.length;
                        updateModalImage();
                    });
                }
                
                thumbnails.forEach((thumb, index) => {
                    thumb.addEventListener('click', (e) => {
                        e.stopPropagation();
                        currentImageIndex = index;
                        updateModalImage();
                    });
                });
            }
            
            // Close modal events
            modal.querySelector('.product-modal-close').addEventListener('click', () => {
                modal.remove();
                document.body.style.overflow = 'auto';
            });
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                    document.body.style.overflow = 'auto';
                }
            });
            
            document.addEventListener('keydown', function closeOnEscape(e) {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.body.style.overflow = 'auto';
                    document.removeEventListener('keydown', closeOnEscape);
                } else if (e.key === 'ArrowLeft' && images.length > 1) {
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                    updateModalImage();
                } else if (e.key === 'ArrowRight' && images.length > 1) {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    updateModalImage();
                }
            });
        };
    }

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

    // Initialize mobile menu (ensure it works on store page)
    initMobileMenu() {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileBtn && mobileMenu) {
            // Remove any existing listeners
            const newBtn = mobileBtn.cloneNode(true);
            mobileBtn.parentNode.replaceChild(newBtn, mobileBtn);
            
            // Add click listener
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenu.classList.toggle('active');
                newBtn.classList.toggle('active');
            });
            
            // Close menu when clicking links
            document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    newBtn.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !newBtn.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    newBtn.classList.remove('active');
                }
            });
            
            console.log('Mobile menu initialized on store page');
        }
    }

    // Initialize the integration
    async init() {
        try {
            console.log('Initializing Etsy shop integration...');
            
            // Initialize mobile menu first
            this.initMobileMenu();
            
            // Inject CSS styles
            this.injectStyles();
            
            // Show loading state
            const container = document.getElementById('etsy-products-container');
            if (container) {
                container.innerHTML = '<div class="loading">Loading products from Etsy...</div>';
            }
            
            await this.fetchProducts();
            
            // Setup modal functionality
            this.setupProductModal();
            
            // Create category filter
            this.createCategoryFilter();
            
            // Display products
            this.displayProducts();
            
            console.log('Etsy integration initialized successfully!', this.products.length, 'products loaded');
        } catch (error) {
            console.error('Failed to initialize Etsy integration:', error);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            const container = document.getElementById('etsy-products-container');
            if (container) {
                const errorMessage = error.message || 'Unknown error occurred';
                const errorDetails = error.stack ? error.stack.substring(0, 200) : '';
                
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; max-width: 600px; margin: 0 auto;">
                        <p style="color: #666; margin-bottom: 10px; font-size: 1.1rem;">Unable to load products from Etsy at the moment.</p>
                        <p style="color: #d32f2f; font-size: 0.9rem; margin-bottom: 20px; padding: 10px; background: #ffebee; border-radius: 4px;">
                            <strong>Error:</strong> ${errorMessage}
                        </p>
                        <details style="text-align: left; margin: 20px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                            <summary style="cursor: pointer; color: #666; font-size: 0.85rem;">Technical Details (click to expand)</summary>
                            <pre style="font-size: 0.75rem; color: #666; margin-top: 10px; overflow-x: auto;">${errorDetails}</pre>
                        </details>
                        <a href="https://www.etsy.com/shop/BeriInk" target="_blank" 
                           style="color: #c4a484; text-decoration: underline; font-weight: 500; display: inline-block; margin-top: 10px;">
                            Visit our Etsy shop directly
                        </a>
                        <p style="color: #999; font-size: 0.85rem; margin-top: 20px;">
                            Test the function: <a href="/.netlify/functions/etsy-products" target="_blank" style="color: #c4a484;">/.netlify/functions/etsy-products</a>
                        </p>
                    </div>
                `;
            }
        }
    }

    // Inject CSS styles for modal and filters
    injectStyles() {
        if (document.getElementById('etsy-integration-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'etsy-integration-styles';
        style.textContent = `
            .product-filter {
                margin-bottom: 2rem;
                text-align: center;
            }
            
            .filter-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
                margin-bottom: 2rem;
            }
            
            .filter-btn {
                padding: 0.4rem 0.8rem;
                border: 1px solid #c4a484;
                background: white;
                color: #c4a484;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.85rem;
                font-weight: 300;
                letter-spacing: 0.5px;
            }
            
            .filter-btn:hover,
            .filter-btn.active {
                background: #c4a484;
                color: white;
                border-color: #c4a484;
            }
            
            .product-card {
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            
            .product-card:hover {
                transform: translateY(-5px);
            }
            
            .etsy-link {
                background: #c4a484 !important;
                color: white !important;
                text-decoration: none !important;
                display: inline-block;
                padding: 0.75rem 1.5rem;
                border-radius: 25px;
                font-weight: 400;
                transition: all 0.3s ease;
                text-align: center;
                width: 100%;
                box-sizing: border-box;
            }
            
            .etsy-link:hover {
                background: #b8956b !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(196, 164, 132, 0.3);
            }
            
            /* Product Modal Styles */
            .product-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                box-sizing: border-box;
            }
            
            .product-modal {
                background: white;
                border-radius: 12px;
                max-width: 900px;
                width: 100%;
                max-height: 95vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .product-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
            }
            
            .product-modal-header h2 {
                margin: 0;
                font-size: 1.5rem;
                color: #333;
                font-weight: 400;
            }
            
            .product-modal-close {
                background: none;
                border: none;
                font-size: 2rem;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .product-modal-close:hover {
                color: #333;
            }
            
            .product-modal-content {
                display: flex;
                gap: 2rem;
                padding: 1.5rem;
                min-height: 0;
            }
            
            .product-modal-image-section {
                flex: 1;
                min-width: 300px;
            }
            
            .product-modal-main-image {
                position: relative;
                width: 100%;
                aspect-ratio: 1 / 1;
                overflow: hidden;
                border-radius: 8px;
                background: #f8f8f8;
            }
            
            .product-modal-main-image img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
            }
            
            .product-modal-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.9);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 1.5rem;
                color: #333;
                cursor: pointer;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            
            .product-modal-nav:hover {
                background: white;
                transform: translateY(-50%) scale(1.1);
            }
            
            .product-modal-prev {
                left: 10px;
            }
            
            .product-modal-next {
                right: 10px;
            }
            
            .product-modal-thumbnails {
                display: flex;
                gap: 0.5rem;
                margin-top: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .product-modal-thumbnail {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 4px;
                cursor: pointer;
                border: 2px solid transparent;
                transition: all 0.3s ease;
                opacity: 0.7;
            }
            
            .product-modal-thumbnail:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            
            .product-modal-thumbnail.active {
                border-color: #c4a484;
                opacity: 1;
            }
            
            .product-modal-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }
            
            .product-modal-price {
                font-size: 1.8rem;
                font-weight: 600;
                color: #c4a484;
                margin-bottom: 1rem;
                flex-shrink: 0;
            }
            
            .product-modal-description {
                line-height: 1.6;
                color: #666;
                margin-bottom: 2rem;
                font-size: 0.95rem;
                flex: 1;
                overflow-y: auto;
                max-height: 400px;
                padding-right: 10px;
            }
            
            .product-modal-description::-webkit-scrollbar {
                width: 6px;
            }
            
            .product-modal-description::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }
            
            .product-modal-description::-webkit-scrollbar-thumb {
                background: #c4a484;
                border-radius: 3px;
            }
            
            .product-modal-description::-webkit-scrollbar-thumb:hover {
                background: #b8956b;
            }
            
            .product-modal-etsy-btn {
                background: #c4a484;
                color: white;
                text-decoration: none;
                padding: 1rem 2rem;
                border-radius: 25px;
                font-weight: 500;
                display: inline-block;
                transition: all 0.3s ease;
                text-align: center;
                flex-shrink: 0;
                margin-top: auto;
            }
            
            .product-modal-etsy-btn:hover {
                background: #b8956b;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(196, 164, 132, 0.3);
            }
            
            @media (max-width: 768px) {
                .product-modal-content {
                    flex-direction: column;
                }
                
                .product-modal-image-section {
                    min-width: auto;
                }
                
                .product-modal-overlay {
                    padding: 1rem;
                }
                
                .product-modal-description {
                    max-height: 300px;
                }
                
                .product-modal {
                    max-height: 90vh;
                }
                
                .product-modal-nav {
                    width: 35px;
                    height: 35px;
                    font-size: 1.2rem;
                }
                
                .product-modal-thumbnail {
                    width: 50px;
                    height: 50px;
                }
            }
        `;
        document.head.appendChild(style);
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