// Beri Ink Product Catalog Integration
// Combines all 36 products and creates a beautiful catalog

document.addEventListener('DOMContentLoaded', function() {
    // Combine all products
    const allProducts = [
        ...BERI_INK_PRODUCTS,
        ...BERI_INK_PRODUCTS_PART2,
        ...BERI_INK_PRODUCTS_PART3
    ];

    // Create product categories
    const categories = {
        'All': allProducts,
        'Floral': allProducts.filter(p => p.category === 'Floral'),
        'Animals': allProducts.filter(p => p.category === 'Animals'),
        'Nature': allProducts.filter(p => p.category === 'Nature'),
        'Geometric': allProducts.filter(p => p.category === 'Geometric'),
        'Japanese': allProducts.filter(p => p.category === 'Japanese'),
        'Abstract': allProducts.filter(p => p.category === 'Abstract'),
        'Mixed': allProducts.filter(p => p.category === 'Mixed')
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
            <div class="product-card etsy-product" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${mainImage}" alt="${product.title}" class="product-image" loading="lazy">
                    ${additionalImages.length > 0 ? `
                        <div class="image-thumbnails desktop-only">
                            ${additionalImages.map((img, index) => `
                                <img src="${img}" alt="${product.title}" class="thumbnail" loading="lazy">
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="product-category">${product.category}</div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${truncateText(product.description, 120)}</p>
                    <div class="product-price-container">
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                    </div>
                    <div class="product-actions">
                        <a href="${product.etsy_url}" target="_blank" class="product-button etsy-link">
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
        padding: 0.5rem 1rem;
        border: 2px solid #8b7355;
        background: white;
        color: #8b7355;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .filter-btn:hover,
    .filter-btn.active {
        background: #8b7355;
        color: white;
    }
    
    .product-category {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(139, 115, 85, 0.9);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
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
        border-color: #8b7355;
    }
    
    .etsy-link {
        background: #8b7355 !important;
        color: white !important;
        text-decoration: none !important;
        display: inline-block;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-weight: 500;
        transition: all 0.3s ease;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
    }
    
    .etsy-link:hover {
        background: #6d5a42 !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 115, 85, 0.3);
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = catalogCSS;
document.head.appendChild(style);
