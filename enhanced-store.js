// Enhanced Store with Variations, Multiple Photos, and Categories
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromCMS();
    initializeEnhancedStore();
});

let currentProducts = [];
let currentCategory = 'all';

function loadProductsFromCMS() {
    // Always use default products for now (CMS integration disabled)
    console.log('Using default products');
    currentProducts = [...enhancedProducts];
    window.enhancedProducts = enhancedProducts;
}

function initializeEnhancedStore() {
    createCategoryFilter();
    renderProducts();
    initializeDragAndDrop();
}

function createCategoryFilter() {
    const productsSection = document.querySelector('.products-section');
    if (!productsSection) return;

    // Define categories if not already defined
    const categories = window.categories || [
        { id: "all", name: "All Products" },
        { id: "animals", name: "Animals" },
        { id: "botanical", name: "Botanicals" },
        { id: "ornamental", name: "Ornamentals" },
        { id: "others", name: "Others" }
    ];

    // Create category filter
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filter';
    filterContainer.innerHTML = `
        <div class="filter-title">Filter by Category:</div>
        <div class="filter-buttons">
            ${categories.map(cat => `
                <button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
                    ${cat.name}
                </button>
            `).join('')}
        </div>
    `;

    // Insert before products grid
    const productsGrid = document.getElementById('productsGrid');
    productsSection.insertBefore(filterContainer, productsGrid);

    // Add event listeners for filter buttons
    filterContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter products
            currentCategory = e.target.dataset.category;
            filterProducts();
        }
    });
}

function filterProducts() {
    const products = window.enhancedProducts || enhancedProducts;
    if (currentCategory === 'all') {
        currentProducts = [...products];
    } else {
        currentProducts = products.filter(product => 
            product.category.toLowerCase() === currentCategory
        );
    }
    renderProducts();
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Sort by order
    const sortedProducts = currentProducts.sort((a, b) => a.order - b.order);

    productsGrid.innerHTML = sortedProducts.map(product => createProductCard(product)).join('');
    
    // Add drag and drop functionality
    initializeProductDragAndDrop();
}

function createProductCard(product) {
    const mainImage = product.images[0];
    const variationOptions = product.variations.options.map(option => 
        `<option value="${option.quantity}" data-price="${option.price}">${option.label} - $${(option.price / 100).toFixed(2)}</option>`
    ).join('');

    return `
        <div class="product-card enhanced-card" data-product-id="${product.id}" data-order="${product.order}">
            <div class="product-image-container">
                <div class="product-image-gallery">
                    <img src="${mainImage}" alt="${product.title}" class="main-image clickable-image" 
                         onclick="openQuickView('${product.id}')" loading="lazy" style="cursor: pointer;">
                    <div class="image-thumbnails">
                        ${product.images.slice(0, 5).map((img, index) => `
                            <img src="${img}" alt="${product.title}" class="thumbnail ${index === 0 ? 'active' : ''}" 
                                 onclick="changeMainImage(this, '${product.id}')" loading="lazy">
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-sku">SKU: ${product.sku}</div>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-variations">
                    <label for="variation-${product.id}">Quantity:</label>
                    <select id="variation-${product.id}" class="variation-select" onchange="updatePrice(this, '${product.id}')">
                        ${variationOptions}
                    </select>
                </div>
                <div class="product-price-container">
                    <div class="product-price" id="price-${product.id}">$${(product.variations.options[0].price / 100).toFixed(2)}</div>
                </div>
                <button class="product-button add-to-cart" 
                        data-product-id="${product.id}" 
                        data-sku="${product.sku}"
                        onclick="addToCartWithVariation('${product.id}')">
                    Add to cart
                </button>
            </div>
        </div>
    `;
}

function changeMainImage(thumbnail, productId) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    const mainImage = card.querySelector('.main-image');
    const thumbnails = card.querySelectorAll('.thumbnail');
    
    // Update main image
    mainImage.src = thumbnail.src;
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

function updatePrice(selectElement, productId) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const price = selectedOption.dataset.price;
    const priceElement = document.getElementById(`price-${productId}`);
    
    if (priceElement) {
        priceElement.textContent = `$${(parseInt(price) / 100).toFixed(2)}`;
    }
}

function addToCartWithVariation(productId) {
    const product = enhancedProducts.find(p => p.id == productId);
    if (!product) return;

    const card = document.querySelector(`[data-product-id="${productId}"]`);
    const variationSelect = card.querySelector('.variation-select');
    const selectedOption = variationSelect.options[variationSelect.selectedIndex];
    
    const cartItem = {
        id: productId,
        title: product.title,
        sku: product.sku,
        price: parseInt(selectedOption.dataset.price),
        quantity: parseInt(selectedOption.value),
        image: product.images[0],
        variation: selectedOption.textContent
    };

    // Use existing cart functionality
    if (typeof addToCart === 'function') {
        addToCart(cartItem);
    } else {
        console.error('Cart functionality not available');
    }
}

function openQuickView(productId) {
    const product = enhancedProducts.find(p => p.id == productId);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    const overlay = document.getElementById('quickViewOverlay');
    
    // Populate modal with product data
    document.getElementById('qvImage').src = product.images[0];
    document.getElementById('qvTitle').textContent = product.title;
    document.getElementById('qvPrice').textContent = `$${(product.variations.options[0].price / 100).toFixed(2)}`;
    document.getElementById('qvDescription').textContent = product.description;
    document.getElementById('qvQty').value = 1;
    
    // Add image gallery to modal if it doesn't exist
    let imageGallery = modal.querySelector('.qv-image-gallery');
    if (!imageGallery) {
        imageGallery = document.createElement('div');
        imageGallery.className = 'qv-image-gallery';
        imageGallery.innerHTML = `
            <div class="qv-main-image-container">
                <img id="qvMainImage" src="${product.images[0]}" alt="${product.title}" class="qv-main-image">
            </div>
            <div class="qv-thumbnails">
                ${product.images.map((img, index) => `
                    <img src="${img}" alt="${product.title}" class="qv-thumbnail ${index === 0 ? 'active' : ''}" 
                         onclick="changeQvMainImage('${img}', this)" loading="lazy">
                `).join('')}
            </div>
        `;
        
        // Insert image gallery before the existing image
        const existingImage = document.getElementById('qvImage');
        existingImage.parentNode.insertBefore(imageGallery, existingImage);
        existingImage.style.display = 'none'; // Hide the old single image
    } else {
        // Update existing gallery
        imageGallery.querySelector('#qvMainImage').src = product.images[0];
        const thumbnails = imageGallery.querySelectorAll('.qv-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.src = product.images[index] || product.images[0];
            thumb.classList.toggle('active', index === 0);
        });
    }
    
    // Create variation options for modal
    const variationSelect = document.createElement('select');
    variationSelect.className = 'modal-variation-select';
    variationSelect.innerHTML = product.variations.options.map(option => 
        `<option value="${option.quantity}" data-price="${option.price}">${option.label} - $${(option.price / 100).toFixed(2)}</option>`
    ).join('');
    
    // Insert variation select before quantity input
    const qtyLabel = document.querySelector('#qvQty').parentElement;
    qtyLabel.parentElement.insertBefore(variationSelect, qtyLabel);
    
    // Show modal
    overlay.classList.add('open');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.dataset.pid = productId;
}

// Function to change main image in quick view
function changeQvMainImage(imageSrc, thumbnail) {
    const mainImage = document.getElementById('qvMainImage');
    const thumbnails = document.querySelectorAll('.qv-thumbnail');
    
    // Update main image
    mainImage.src = imageSrc;
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

function initializeDragAndDrop() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    let draggedElement = null;

    productsGrid.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('product-card')) {
            draggedElement = e.target;
            e.target.style.opacity = '0.5';
        }
    });

    productsGrid.addEventListener('dragend', function(e) {
        if (e.target.classList.contains('product-card')) {
            e.target.style.opacity = '1';
            draggedElement = null;
        }
    });

    productsGrid.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    productsGrid.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedElement && e.target.classList.contains('product-card')) {
            const targetOrder = parseInt(e.target.dataset.order);
            const draggedOrder = parseInt(draggedElement.dataset.order);
            
            // Update order in data
            const draggedProduct = enhancedProducts.find(p => p.id == draggedElement.dataset.productId);
            const targetProduct = enhancedProducts.find(p => p.id == e.target.dataset.productId);
            
            if (draggedProduct && targetProduct) {
                draggedProduct.order = targetOrder;
                targetProduct.order = draggedOrder;
                
                // Re-render products
                renderProducts();
            }
        }
    });
}

function initializeProductDragAndDrop() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.draggable = true;
        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.effectAllowed = 'move';
        });
    });
}

// Global functions for use in HTML
window.changeMainImage = changeMainImage;
window.updatePrice = updatePrice;
window.addToCartWithVariation = addToCartWithVariation;
window.openQuickView = openQuickView;
window.changeQvMainImage = changeQvMainImage;
