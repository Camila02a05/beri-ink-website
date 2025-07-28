// Etsy Shop Integration for Beri Ink
class EtsyIntegration {
    constructor(shopName) {
        this.shopName = shopName;
        this.apiKey = 'your-etsy-api-key'; // This would need to be configured
        this.baseUrl = 'https://openapi.etsy.com/v3';
    }

    // For now, we'll use a mock data approach since Etsy API requires authentication
    // In production, this would connect to a backend service that handles Etsy API calls
    async fetchProducts() {
        // Mock data representing Beri Ink products
        return [
            {
                id: 1,
                title: "Delicate Flower Temporary Tattoo",
                price: "$8.00",
                image: "images/placeholder-temp-tattoo.jpg",
                url: "https://www.etsy.com/shop/BeriInk"
            },
            {
                id: 2,
                title: "Minimalist Line Art Butterfly",
                price: "$6.00",
                image: "images/placeholder-temp-tattoo.jpg",
                url: "https://www.etsy.com/shop/BeriInk"
            },
            {
                id: 3,
                title: "Fine Line Moon Phases",
                price: "$10.00",
                image: "images/placeholder-temp-tattoo.jpg",
                url: "https://www.etsy.com/shop/BeriInk"
            },
            {
                id: 4,
                title: "Botanical Leaf Collection",
                price: "$12.00",
                image: "images/placeholder-temp-tattoo.jpg",
                url: "https://www.etsy.com/shop/BeriInk"
            },
            {
                id: 5,
                title: "Geometric Mountain Range",
                price: "$9.00",
                image: "images/placeholder-temp-tattoo.jpg",
                url: "https://www.etsy.com/shop/BeriInk"
            },
            {
                id: 6,
                title: "Delicate Script Words",
                price: "$7.00",
                image: "images/placeholder-temp-tattoo.jpg",
                url: "https://www.etsy.com/shop/BeriInk"
            },
            {
                id: 7,
                title: "Minimalist Sun Design",
                price: "$8.00",
                image: "images/placeholder-temp-tattoo.jpg",
                url: "https://www.etsy.com/shop/BeriInk"
            },
            {
                id: 8,
                title: "Fine Line Rose Stem",
                price: "$11.00",
                image: "images/placeholder-temp-tattoo.jpg",
                url: "https://www.etsy.com/shop/BeriInk"
            }
        ];
    }

    async displayProducts() {
        try {
            const products = await this.fetchProducts();
            const storeGrid = document.getElementById('storeGrid');
            
            if (!storeGrid) return;

            storeGrid.innerHTML = '';

            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'store-item';
                productElement.innerHTML = `
                    <a href="${product.url}" target="_blank" rel="noopener noreferrer">
                        <img src="${product.image}" alt="${product.title}" loading="lazy">
                        <div class="store-item-content">
                            <h3>${product.title}</h3>
                            <div class="price">${product.price}</div>
                            <div class="btn">View on Etsy</div>
                        </div>
                    </a>
                `;
                storeGrid.appendChild(productElement);
            });
        } catch (error) {
            console.error('Error loading Etsy products:', error);
            this.displayFallback();
        }
    }

    displayFallback() {
        const storeGrid = document.getElementById('storeGrid');
        if (!storeGrid) return;

        storeGrid.innerHTML = `
            <div class="store-message">
                <p>Visit our <a href="https://www.etsy.com/shop/BeriInk" target="_blank">Etsy shop</a> to see all available designs!</p>
            </div>
        `;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('storeGrid')) {
        const etsyIntegration = new EtsyIntegration('Beri Ink');
        etsyIntegration.displayProducts();
    }
});

