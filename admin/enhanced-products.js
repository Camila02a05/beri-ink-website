// Enhanced Product Data with Variations and Multiple Photos
const enhancedProducts = [
    {
        id: 1,
        title: "Fine Line Flower Bouquet Temporary Tattoo",
        description: "Delicate fine line flower bouquet design. Perfect for wrist, ankle, or shoulder placement.",
        sku: "FLB-001",
        category: "Floral",
        images: [
            "images/temp-product-1.png",
            "images/temp-product-1-2.png",
            "images/temp-product-1-3.png",
            "images/temp-product-1-4.png",
            "images/temp-product-1-5.png"
        ],
        variations: {
            type: "quantity",
            options: [
                { quantity: 1, price: 820, label: "1" },
                { quantity: 2, price: 1420, label: "2" },
                { quantity: 3, price: 1820, label: "3" },
                { quantity: 4, price: 2220, label: "4 (get 1 more free)" }
            ]
        },
        visible: true,
        order: 1
    },
    {
        id: 2,
        title: "Minimalist Script Quote Temporary Tattoo",
        description: "Beautiful script lettering design. Elegant and meaningful temporary tattoo.",
        sku: "MSQ-002",
        category: "Script",
        images: [
            "images/temp-product-2.png",
            "images/temp-product-2-2.png",
            "images/temp-product-2-3.png"
        ],
        variations: {
            type: "quantity",
            options: [
                { quantity: 1, price: 799, label: "1" },
                { quantity: 2, price: 1399, label: "2" },
                { quantity: 3, price: 1799, label: "3" },
                { quantity: 4, price: 2199, label: "4 (get 1 more free)" }
            ]
        },
        visible: true,
        order: 2
    },
    {
        id: 3,
        title: "Delicate Botanical Leaf Set",
        description: "Set of fine line botanical designs. Includes 3 different leaf patterns.",
        sku: "DBS-003",
        category: "Botanical",
        images: [
            "images/temp-product-3.png",
            "images/temp-product-3-2.png",
            "images/temp-product-3-3.png",
            "images/temp-product-3-4.png"
        ],
        variations: {
            type: "quantity",
            options: [
                { quantity: 1, price: 999, label: "1" },
                { quantity: 2, price: 1799, label: "2" },
                { quantity: 3, price: 2299, label: "3" },
                { quantity: 4, price: 2799, label: "4 (get 1 more free)" }
            ]
        },
        visible: true,
        order: 3
    },
    {
        id: 4,
        title: "Fine Line Rose Stem Temporary Tattoo",
        description: "Single stem rose in delicate fine line style. Perfect for forearm or ankle.",
        sku: "FRS-004",
        category: "Floral",
        images: [
            "images/temp-product-4.png",
            "images/temp-product-4-2.png",
            "images/temp-product-4-3.png"
        ],
        variations: {
            type: "quantity",
            options: [
                { quantity: 1, price: 899, label: "1" },
                { quantity: 2, price: 1599, label: "2" },
                { quantity: 3, price: 2099, label: "3" },
                { quantity: 4, price: 2599, label: "4 (get 1 more free)" }
            ]
        },
        visible: true,
        order: 4
    },
    {
        id: 5,
        title: "Minimalist Heart Line Art",
        description: "Simple continuous line heart design. Sweet and subtle temporary tattoo.",
        sku: "MHA-005",
        category: "Symbols",
        images: [
            "images/temp-product-5.jpeg",
            "images/temp-product-5-2.jpeg"
        ],
        variations: {
            type: "quantity",
            options: [
                { quantity: 1, price: 699, label: "1" },
                { quantity: 2, price: 1299, label: "2" },
                { quantity: 3, price: 1699, label: "3" },
                { quantity: 4, price: 2099, label: "4 (get 1 more free)" }
            ]
        },
        visible: true,
        order: 5
    },
    {
        id: 6,
        title: "Fine Line Butterfly Collection",
        description: "Set of 3 delicate butterfly designs in fine line style. Various sizes included.",
        sku: "FBC-006",
        category: "Animals",
        images: [
            "images/temp-product-6.jpeg",
            "images/temp-product-6-2.jpeg",
            "images/temp-product-6-3.jpeg",
            "images/temp-product-6-4.jpeg",
            "images/temp-product-6-5.jpeg"
        ],
        variations: {
            type: "quantity",
            options: [
                { quantity: 1, price: 1099, label: "1" },
                { quantity: 2, price: 1999, label: "2" },
                { quantity: 3, price: 2599, label: "3" },
                { quantity: 4, price: 3199, label: "4 (get 1 more free)" }
            ]
        },
        visible: true,
        order: 6
    }
];

// Categories for filtering
const categories = [
    { id: "all", name: "All Products" },
    { id: "floral", name: "Floral" },
    { id: "script", name: "Script" },
    { id: "botanical", name: "Botanical" },
    { id: "symbols", name: "Symbols" },
    { id: "animals", name: "Animals" }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { enhancedProducts, categories };
}
