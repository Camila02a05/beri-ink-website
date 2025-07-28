// Store page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeStore();
});

// Sample temporary tattoo products representing Beri Ink Etsy shop
const tempTattooProducts = [
    {
        id: 1,
        title: "Fine Line Floral Set",
        description: "Delicate roses, peonies, and botanical elements",
        price: "$15.99",
        image: "images/gallery/IMG_7021.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 2,
        title: "Minimalist Script Collection",
        description: "Elegant handwritten words and phrases",
        price: "$12.99",
        image: "images/gallery/IMG_7022.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 3,
        title: "Geometric Lines Set",
        description: "Clean geometric shapes and abstract designs",
        price: "$11.99",
        image: "images/gallery/IMG_7023.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 4,
        title: "Botanical Branch Collection",
        description: "Delicate leaves, stems, and nature elements",
        price: "$13.99",
        image: "images/gallery/IMG_7025.png",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 5,
        title: "Fine Line Animals",
        description: "Minimalist animal silhouettes and portraits",
        price: "$14.99",
        image: "images/gallery/IMG_7026.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 6,
        title: "Delicate Symbols Set",
        description: "Small meaningful symbols and icons",
        price: "$10.99",
        image: "images/gallery/IMG_7033.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 7,
        title: "Floral Bouquet Collection",
        description: "Detailed flower arrangements and bouquets",
        price: "$16.99",
        image: "images/gallery/IMG_2195.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 8,
        title: "Abstract Line Art",
        description: "Modern abstract designs and flowing lines",
        price: "$12.99",
        image: "images/gallery/IMG_2213.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 9,
        title: "Celestial Collection",
        description: "Moon phases, stars, and cosmic elements",
        price: "$13.99",
        image: "images/gallery/IMG_2599.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 10,
        title: "Vintage Florals",
        description: "Classic vintage-inspired floral designs",
        price: "$15.99",
        image: "images/gallery/IMG_2652.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 11,
        title: "Minimalist Nature Set",
        description: "Simple nature elements and organic shapes",
        price: "$11.99",
        image: "images/gallery/IMG_2863.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 12,
        title: "Elegant Script Words",
        description: "Beautiful handlettered quotes and words",
        price: "$14.99",
        image: "images/gallery/IMG_3065.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    }
];

function initializeStore() {
    const storeGrid = document.getElementById('storeGrid');
    if (!storeGrid) return;
    
    // Clear existing content
    storeGrid.innerHTML = '';
    
    // Create product items
    tempTattooProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'store-item';
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" onerror="this.src='images/placeholder-temp-tattoo.jpg'">
            <div class="store-item-content">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <div class="price">${product.price}</div>
                <a href="${product.etsy_url}" target="_blank" class="btn">Shop on Etsy</a>
            </div>
        `;
        storeGrid.appendChild(productItem);
    });
}

// Function to fetch actual Etsy products (for future implementation)
async function fetchEtsyProducts() {
    // This would be implemented when Etsy API integration is added
    // For now, we're using the sample data above
    try {
        // Example of how Etsy API integration might work:
        // const response = await fetch('/api/etsy-products');
        // const products = await response.json();
        // return products;
        
        return tempTattooProducts;
    } catch (error) {
        console.error('Error fetching Etsy products:', error);
        return tempTattooProducts; // Fallback to sample data
    }
}

// Add smooth scrolling for internal links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

