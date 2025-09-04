// Product pagination functionality
document.addEventListener('DOMContentLoaded', function() {
    const productsPerPage = 24; // 6 rows of 4 cards
    let currentPage = 1;
    const totalProducts = 36; // Total number of designs
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    // Generate all 36 product cards
    function generateProductCards() {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';
        
        for (let i = 1; i <= totalProducts; i++) {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class=\"product-image\">
                    <img src=\"images/placeholder-temp-tattoo.jpg\" alt=\"Design ${i}\" loading=\"lazy\">
                </div>
                <div class=\"product-info\">
                    <h3 class=\"product-title\">Design ${i} - Edit This Title</h3>
                    <p class=\"product-description\">Add your product description here for design ${i}...</p>
                    <div class=\"product-price\">$0.00</div>
                    <div class=\"product-actions\">
                        <a href=\"#\" class=\"product-button quick-view\">Quick view</a>
                        <a href=\"#\" class=\"product-button add-to-cart\">Add to cart</a>
                    </div>
                </div>
            `;
            productsGrid.appendChild(productCard);
        }
    }
    
    // Show products for current page
    function showPage(page) {
        const allCards = document.querySelectorAll('.product-card');
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        
        allCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update pagination info
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Page ${page} of ${totalPages}`;
        }
        
        // Update arrow states
        const prevArrow = document.getElementById('prevPage');
        const nextArrow = document.getElementById('nextPage');
        
        if (prevArrow) {
            prevArrow.disabled = page === 1;
        }
        if (nextArrow) {
            nextArrow.disabled = page === totalPages;
        }
    }
    
    // Initialize
    generateProductCards();
    showPage(currentPage);
    
    // Add pagination controls
    const productsSection = document.querySelector('.products-section');
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    paginationContainer.innerHTML = `
        <button id="prevPage" class="pagination-arrow">‹</button>
        <span class="pagination-info">Page 1 of ${totalPages}</span>
        <button id="nextPage" class="pagination-arrow">›</button>
    `;
    
    // Insert pagination after products grid
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.parentNode.insertBefore(paginationContainer, productsGrid.nextSibling);
    
    // Add event listeners
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });
});

