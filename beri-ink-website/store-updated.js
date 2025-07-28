// Store page functionality with realistic temporary tattoo products
document.addEventListener('DOMContentLoaded', function() {
    initializeStore();
});

// Realistic temporary tattoo products for Beri Ink Etsy shop
const tempTattooProducts = [
    {
        id: 1,
        title: "Fine Line Rose Temporary Tattoo",
        description: "Delicate single stem rose with thorns",
        price: "$8.99",
        image: "images/gallery/IMG_7021.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 2,
        title: "Minimalist Butterfly Set",
        description: "3 delicate butterfly designs",
        price: "$12.99",
        image: "images/gallery/IMG_7022.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 3,
        title: "Moon Phases Temporary Tattoo",
        description: "Complete lunar cycle in fine line style",
        price: "$10.99",
        image: "images/gallery/IMG_7023.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 4,
        title: "Botanical Leaf Collection",
        description: "Set of 5 different leaf designs",
        price: "$14.99",
        image: "images/gallery/IMG_7025.png",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 5,
        title: "Geometric Mountain Range",
        description: "Minimalist mountain silhouette",
        price: "$9.99",
        image: "images/gallery/IMG_7026.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 6,
        title: "Delicate Script Words",
        description: "\"Breathe\", \"Love\", \"Dream\" in elegant script",
        price: "$11.99",
        image: "images/gallery/IMG_7033.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 7,
        title: "Sun and Moon Duo",
        description: "Matching celestial pair",
        price: "$13.99",
        image: "images/gallery/IMG_2195.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 8,
        title: "Wildflower Bouquet",
        description: "Small wildflower arrangement",
        price: "$15.99",
        image: "images/gallery/IMG_2213.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 9,
        title: "Constellation Set",
        description: "Zodiac constellations in fine line",
        price: "$16.99",
        image: "images/gallery/IMG_2599.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 10,
        title: "Feather Collection",
        description: "3 different feather designs",
        price: "$12.99",
        image: "images/gallery/IMG_2652.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 11,
        title: "Abstract Line Art",
        description: "Modern flowing line designs",
        price: "$10.99",
        image: "images/gallery/IMG_2863.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 12,
        title: "Tiny Heart Collection",
        description: "Set of 8 small heart variations",
        price: "$8.99",
        image: "images/gallery/IMG_3065.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 13,
        title: "Vine and Leaves Border",
        description: "Delicate vine for wrist or ankle",
        price: "$11.99",
        image: "images/gallery/IMG_4161.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 14,
        title: "Minimalist Bird Set",
        description: "Flying birds in silhouette",
        price: "$9.99",
        image: "images/gallery/IMG_5201.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 15,
        title: "Mandala Circle",
        description: "Small intricate mandala design",
        price: "$13.99",
        image: "images/gallery/IMG_5210.jpeg",
        etsy_url: "https://www.etsy.com/shop/BeriInk"
    },
    {
        id: 16,
        title: "Arrow and Compass Set",
        description: "Travel-inspired temporary tattoos",
        price: "$14.99",
        image: "images/gallery/IMG_5338.jpeg",
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

