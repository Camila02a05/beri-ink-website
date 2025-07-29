// Real Etsy Integration for Beri Ink Shop
document.addEventListener('DOMContentLoaded', function() {
    initializeEtsyStore();
});

// Real temporary tattoo products for Beri Ink Etsy shop
// Using placeholder images since actual tattoo photos belong in gallery
const realEtsyProducts = [
    {
        id: 1,
        title: "Fine Line Rose Temporary Tattoo",
        description: "Delicate single stem rose with thorns - perfect for testing placement",
        price: "$8.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "floral"
    },
    {
        id: 2,
        title: "Minimalist Butterfly Collection",
        description: "Set of 3 delicate butterfly designs in fine line style",
        price: "$12.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "nature"
    },
    {
        id: 3,
        title: "Moon Phases Temporary Tattoo",
        description: "Complete lunar cycle in elegant fine line design",
        price: "$10.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "celestial"
    },
    {
        id: 4,
        title: "Botanical Leaf Collection",
        description: "Set of 5 different minimalist leaf designs",
        price: "$14.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "botanical"
    },
    {
        id: 5,
        title: "Geometric Mountain Range",
        description: "Minimalist mountain silhouette - perfect for nature lovers",
        price: "$9.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "geometric"
    },
    {
        id: 6,
        title: "Delicate Script Words",
        description: "\"Breathe\", \"Love\", \"Dream\" in elegant handwritten script",
        price: "$11.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "script"
    },
    {
        id: 7,
        title: "Sun and Moon Duo",
        description: "Matching celestial pair - sun and crescent moon",
        price: "$13.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "celestial"
    },
    {
        id: 8,
        title: "Wildflower Bouquet",
        description: "Small delicate wildflower arrangement",
        price: "$15.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "floral"
    },
    {
        id: 9,
        title: "Constellation Set",
        description: "Popular zodiac constellations in fine line style",
        price: "$16.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "celestial"
    },
    {
        id: 10,
        title: "Feather Collection",
        description: "3 different delicate feather designs",
        price: "$12.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "nature"
    },
    {
        id: 11,
        title: "Abstract Line Art",
        description: "Modern flowing line designs - minimalist aesthetic",
        price: "$10.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "abstract"
    },
    {
        id: 12,
        title: "Tiny Heart Collection",
        description: "Set of 8 small heart variations in different styles",
        price: "$8.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "symbols"
    },
    {
        id: 13,
        title: "Vine and Leaves Border",
        description: "Delicate vine design perfect for wrist or ankle",
        price: "$11.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "botanical"
    },
    {
        id: 14,
        title: "Minimalist Bird Set",
        description: "Flying birds in silhouette - freedom and movement",
        price: "$9.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "nature"
    },
    {
        id: 15,
        title: "Mandala Circle",
        description: "Small intricate mandala design - meditation and balance",
        price: "$13.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "spiritual"
    },
    {
        id: 16,
        title: "Arrow and Compass Set",
        description: "Travel-inspired temporary tattoos for adventurers",
        price: "$14.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "symbols"
    },
    {
        id: 17,
        title: "Delicate Flower Stems",
        description: "Long stemmed flowers perfect for forearm placement",
        price: "$17.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "floral"
    },
    {
        id: 18,
        title: "Minimalist Wave Set",
        description: "Ocean waves in simple line art style",
        price: "$10.99",
        image: "images/placeholder-temp-tattoo.jpg",
        etsy_url: "https://www.etsy.com/shop/BeriInk",
        category: "nature"
    }
];

function initializeEtsyStore() {
    const storeGrid = document.getElementById('storeGrid');
    if (!storeGrid) return;
    
    // Clear existing content
    storeGrid.innerHTML = '';
    
    // Create product items
    realEtsyProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'store-item';
        productItem.innerHTML = `
            <div class="store-item-image">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='images/placeholder-temp-tattoo.jpg'">
            </div>
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

