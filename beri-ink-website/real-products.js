// Real Product Display for Beri Ink Etsy Shop
document.addEventListener('DOMContentLoaded', function() {
    // Realistic temporary tattoo products using actual tattoo images
    const products = [
        {
            id: 1,
            title: "Fine Line Flower Bouquet Temporary Tattoo",
            description: "Delicate fine line flower bouquet design. Perfect for wrist, ankle, or shoulder placement.",
            price: "$8.99",
            image: "images/temp-product-1.png",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 2,
            title: "Minimalist Script Quote Temporary Tattoo",
            description: "Beautiful script lettering design. Elegant and meaningful temporary tattoo.",
            price: "$7.99",
            image: "images/temp-product-2.png",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 3,
            title: "Delicate Botanical Leaf Set",
            description: "Set of fine line botanical designs. Includes 3 different leaf patterns.",
            price: "$9.99",
            image: "images/temp-product-3.png",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 4,
            title: "Fine Line Rose Stem Temporary Tattoo",
            description: "Single stem rose in delicate fine line style. Perfect for forearm or ankle.",
            price: "$8.99",
            image: "images/temp-product-4.png",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 5,
            title: "Minimalist Heart Line Art",
            description: "Simple continuous line heart design. Sweet and subtle temporary tattoo.",
            price: "$6.99",
            image: "images/temp-product-5.jpeg",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 6,
            title: "Fine Line Butterfly Collection",
            description: "Set of 3 delicate butterfly designs in fine line style. Various sizes included.",
            price: "$10.99",
            image: "images/temp-product-6.jpeg",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 7,
            title: "Constellation Map Temporary Tattoo",
            description: "Custom constellation design. Celestial fine line temporary tattoo.",
            price: "$9.99",
            image: "images/temp-product-1.png",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 8,
            title: "Delicate Feather Design",
            description: "Elegant feather in fine line style. Perfect for behind the ear or wrist.",
            price: "$7.99",
            image: "images/temp-product-2.png",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 9,
            title: "Minimalist Sun & Moon Set",
            description: "Celestial sun and moon designs. Matching pair temporary tattoos.",
            price: "$8.99",
            image: "images/temp-product-3.png",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 10,
            title: "Fine Line Mountain Range",
            description: "Minimalist mountain landscape design. Perfect for nature lovers.",
            price: "$9.99",
            image: "images/temp-product-4.png",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 11,
            title: "Script 'Breathe' Temporary Tattoo",
            description: "Calming script word design. Mindful and elegant temporary tattoo.",
            price: "$6.99",
            image: "images/temp-product-5.jpeg",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        },
        {
            id: 12,
            title: "Delicate Vine Border Design",
            description: "Elegant vine design perfect for wrist or ankle. Graceful and feminine.",
            price: "$11.99",
            image: "images/temp-product-6.jpeg",
            etsyUrl: "https://www.etsy.com/shop/BeriInk"
        }
    ];

    // Function to create product card HTML
    function createProductCard(product) {
        return `
            <div class="product-card" onclick="window.open('${product.etsyUrl}', '_blank')">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price}</div>
                    <a href="${product.etsyUrl}" target="_blank" class="product-button">Shop on Etsy</a>
                </div>
            </div>
        `;
    }

    // Load products into the grid
    function loadProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            const productsHTML = products.map(product => createProductCard(product)).join('');
            productsGrid.innerHTML = productsHTML;
        }
    }

    // Initialize products
    loadProducts();
});

