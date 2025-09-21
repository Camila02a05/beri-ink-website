// Beri Ink Product Catalog Integration
// Combines all 36 products and creates a beautiful catalog

document.addEventListener('DOMContentLoaded', function() {
    // Combine all products
    const allProducts = [
        ...BERI_INK_PRODUCTS,
        ...BERI_INK_PRODUCTS_PART2,
        ...BERI_INK_PRODUCTS_PART3
    ];

    // Create product categories matching Etsy
    const categories = {
        'All': allProducts,
        'Animals': allProducts.filter(p => p.category === 'Animals'),
        'Botanical': allProducts.filter(p => p.category === 'Botanical'),
        'Ornamental': allProducts.filter(p => p.category === 'Ornamental'),
        'Others': allProducts.filter(p => p.category === 'Others')
    };

    // Initialize the catalog
    function initCatalog() {
        const container = document.getElementById('etsy-products-container');
        if (!container) return;

        // Create category filter
        createCategoryFilter(container);
        
        // Display all products initially
        displayProducts(allProducts, container);
    }

    // Create category filter buttons
    function createCategoryFilter(container) {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'product-filter';
        filterContainer.innerHTML = `
            <div class="filter-buttons">
                ${Object.keys(categories).map(category => 
                    `<button class="filter-btn ${category === 'All' ? 'active' : ''}" data-category="${category}">
                        ${category} (${categories[category].length})
                    </button>`
                ).join('')}
            </div>
        `;
        
        container.parentNode.insertBefore(filterContainer, container);
        
        // Add filter event listeners
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.dataset.category;
                
                // Update active button
                filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Display filtered products
                displayProducts(categories[category], container);
            });
        });
    }

    // Display products in a beautiful grid
    function displayProducts(products, container) {
        container.innerHTML = products.map(product => createProductCard(product)).join('');
        
        // Add event listeners for product interactions
        addProductEventListeners(container);
    }

    // Create individual product card
    function createProductCard(product) {
        const mainImage = product.images[0] || 'images/placeholder-temp-tattoo.jpg';
        const additionalImages = product.images.slice(1, 5);
        
        return `
            <div class="product-card etsy-product" data-product-id="${product.id}" onclick="openProductModal('${product.id}')">
                <div class="product-image-container">
                    <img src="${mainImage}" alt="${product.title}" class="product-image" loading="lazy">
                    ${additionalImages.length > 0 ? `
                        <div class="image-thumbnails desktop-only">
                            ${additionalImages.map((img, index) => `
                                <img src="${img}" alt="${product.title}" class="thumbnail" loading="lazy">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${truncateText(product.description, 120)}</p>
                    <div class="product-price-container">
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                    </div>
                    <div class="product-actions">
                        <a href="${product.etsy_url}" target="_blank" class="product-button etsy-link" onclick="event.stopPropagation()">
                            View on Etsy - $${product.price.toFixed(2)}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Add event listeners for product interactions
    function addProductEventListeners(container) {
        // Image hover effects
        container.querySelectorAll('.product-image').forEach(img => {
            img.addEventListener('mouseenter', function() {
                const thumbnails = this.parentNode.querySelector('.image-thumbnails');
                if (thumbnails) {
                    thumbnails.style.display = 'flex';
                }
            });
            
            img.addEventListener('mouseleave', function() {
                const thumbnails = this.parentNode.querySelector('.image-thumbnails');
                if (thumbnails) {
                    thumbnails.style.display = 'none';
                }
            });
        });

        // Thumbnail click to change main image
        container.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const mainImg = this.parentNode.parentNode.querySelector('.product-image');
                const tempSrc = mainImg.src;
                mainImg.src = this.src;
                this.src = tempSrc;
            });
        });
    }

    // Utility function to truncate text
    function truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text || '';
        return text.substring(0, maxLength) + '...';
    }

    // Product modal functionality
    window.openProductModal = function(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.createElement('div');
        modal.className = 'product-modal-overlay';
        modal.innerHTML = `
            <div class="product-modal">
                <div class="product-modal-header">
                    <h2>${product.title}</h2>
                    <button class="product-modal-close">&times;</button>
                </div>
                <div class="product-modal-content">
                    <div class="product-modal-image">
                        <img src="${product.images[0] || 'images/placeholder-temp-tattoo.jpg'}" alt="${product.title}">
                    </div>
                    <div class="product-modal-info">
                        <div class="product-modal-price">$${product.price.toFixed(2)}</div>
                        <div class="product-modal-description">
                            ${product.description.replace(/\n/g, '<br>')}
                        </div>
                        <div class="product-modal-actions">
                            <a href="${product.etsy_url}" target="_blank" class="product-modal-etsy-btn">
                                View on Etsy - $${product.price.toFixed(2)}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal events
        modal.querySelector('.product-modal-close').addEventListener('click', closeProductModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeProductModal();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeProductModal();
        });
    };
    
    window.closeProductModal = function() {
        const modal = document.querySelector('.product-modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    };

    // Initialize the catalog
    initCatalog();
});

// Add CSS for the product catalog
const catalogCSS = `
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
    
    .image-thumbnails {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
        display: none;
        gap: 0.25rem;
    }
    
    .thumbnail {
        width: 30px;
        height: 30px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.3s ease;
    }
    
    .thumbnail:hover {
        border-color: #c4a484;
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
    
    .product-card {
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .product-card:hover {
        transform: translateY(-5px);
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
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
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
    }
    
    .product-modal-image {
        flex: 1;
        min-width: 300px;
    }
    
    .product-modal-image img {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }
    
    .product-modal-info {
        flex: 1;
    }
    
    .product-modal-price {
        font-size: 1.8rem;
        font-weight: 600;
        color: #c4a484;
        margin-bottom: 1rem;
    }
    
    .product-modal-description {
        line-height: 1.6;
        color: #666;
        margin-bottom: 2rem;
        font-size: 0.95rem;
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
        
        .product-modal-image {
            min-width: auto;
        }
        
        .product-modal-overlay {
            padding: 1rem;
        }
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = catalogCSS;
document.head.appendChild(style);
