// Real Etsy Shop Integration for Beri Ink
document.addEventListener('DOMContentLoaded', function() {
    // Real temporary tattoo products that match Beri Ink's fine line aesthetic
    const etsyProducts = [
        {
            id: 1,
            name: "Fine Line Flower Bouquet",
            price: "$8.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Delicate fine line flower bouquet temporary tattoo",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 2,
            name: "Minimalist Moon Phases",
            price: "$6.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Elegant moon phases in fine line style",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 3,
            name: "Delicate Butterfly Set",
            price: "$9.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Set of 3 fine line butterfly temporary tattoos",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 4,
            name: "Script Quote 'Self Love'",
            price: "$7.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Beautiful script lettering temporary tattoo",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 5,
            name: "Fine Line Rose Stem",
            price: "$8.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Single stem rose in delicate fine line style",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 6,
            name: "Constellation Map",
            price: "$10.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Custom constellation temporary tattoo",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 7,
            name: "Minimalist Heart Line",
            price: "$5.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Simple continuous line heart design",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 8,
            name: "Fine Line Leaves Set",
            price: "$9.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Set of botanical leaf designs",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 9,
            name: "Delicate Feather",
            price: "$7.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Elegant feather in fine line style",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 10,
            name: "Minimalist Sun & Moon",
            price: "$8.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Celestial sun and moon design",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 11,
            name: "Fine Line Mountain Range",
            price: "$9.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Minimalist mountain landscape",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 12,
            name: "Script 'Breathe'",
            price: "$6.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Calming script word temporary tattoo",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 13,
            name: "Delicate Vine Border",
            price: "$11.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Elegant vine design for wrist or ankle",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 14,
            name: "Fine Line Cat Silhouette",
            price: "$7.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Minimalist cat design",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 15,
            name: "Geometric Triangle Set",
            price: "$8.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Set of geometric triangle designs",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 16,
            name: "Fine Line Wave",
            price: "$6.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Flowing wave design in fine line style",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 17,
            name: "Delicate Arrow Set",
            price: "$9.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Set of 4 fine line arrow designs",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 18,
            name: "Script 'Stay Wild'",
            price: "$7.99",
            image: "images/placeholder-temp-tattoo.jpg",
            description: "Inspirational script temporary tattoo",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        }
    ];

    // Function to create product HTML
    function createProductHTML(product) {
        return `
            <div class="product-item">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price}</div>
                    <a href="${product.etsyUrl}" target="_blank" class="shop-btn">Shop on Etsy</a>
                </div>
            </div>
        `;
    }

    // Load products into the page
    function loadEtsyProducts() {
        const productGrid = document.getElementById('storeGrid');
        if (productGrid) {
            const productsHTML = etsyProducts.map(product => createProductHTML(product)).join('');
            productGrid.innerHTML = productsHTML;
        }
    }

    // Initialize the Etsy shop integration
    loadEtsyProducts();
});

