// Beri Ink Temporary Tattoo Products Catalog
// All 36 products with real data and Etsy links

const BERI_INK_PRODUCTS = [
    {
        id: 'product-1',
        title: 'Hummingbird Fine Line Temporary Tattoo (Set of 2)',
        description: 'These temporary tattoos are water resistant and last between 1-7 days on your skin depending on where it is applied and care of the tattoo. WHAT\'S INCLUDED: 1 sheet with 2 Temporary Tattoos with instructions on how to apply APPROXIMATELY SIZE: 3" & 2.5" (8cm & 6.5cm)',
        price: 9.30,
        images: ['images/products/product-1/1.jpg', 'images/products/product-1/2.jpg', 'images/products/product-1/3.jpg', 'images/products/product-1/4.jpg', 'images/products/product-1/5.jpg'],
        etsy_url: 'https://www.etsy.com/listing/1399087286/hummingbird-fine-line-temporary-tattoo?ref=shop_home_active_1&crt=1&logging_key=cacc68e8330bdc84cb6f0bcfaadd4cd4c0824f68%3A1399087286',
        category: 'Animals'
    },
    {
        id: 'product-2',
        title: 'Lily Bouquet Temporary Tattoo (Set of 2)',
        description: 'These temporary tattoos are water resistant and last between 1-7 days on your skin depending on where it is applied and care of the tattoo. WHAT\'S INCLUDED: 2 temporary tattoos with instructions on how to apply SIZE: 3" x 1.5" (6.5cm x 2.5cm) 2.5" x 1.2" (6.5cm x 3.2cm)',
        price: 9.30,
        images: ['images/products/product-2/1.jpg', 'images/products/product-2/2.jpg', 'images/products/product-2/3.jpg', 'images/products/product-2/4.jpg', 'images/products/product-2/5.jpg'],
        etsy_url: 'https://www.etsy.com/listing/1757187717/lily-bouquet-temporary-tattoo-set-of-2?ref=shop_home_feat_2&logging_key=3fbff89560dfcfbcee3507f16da721a7ec8626af%3A1757187717',
        category: 'Floral'
    },
    {
        id: 'product-3',
        title: 'Small Ornamental Temporary Tattoo (Set of 4)',
        description: 'These temporary tattoos are water resistant and last between 1-7 days on your skin depending on where it is applied and care of the tattoo. WHAT\'S INCLUDED: 1 sheet of 4 Ornamental Tattoos & instructions on how to apply SIZE: 2.2" (5.5cm)',
        price: 8.90,
        images: ['images/products/product-3/1.jpg', 'images/products/product-3/2.jpg', 'images/products/product-3/3.jpg', 'images/products/product-3/4.jpg', 'images/products/product-3/5.jpg'],
        etsy_url: 'https://www.etsy.com/listing/1866211363/small-ornamental-temporary-tattoo-set-of?ref=shop_home_active_26&logging_key=e16ed37e3c21f353cf8692b7a3641078d8fa2591%3A1866211363',
        category: 'Geometric'
    },
    {
        id: 'product-4',
        title: 'Lily flower Temporary Tattoo (1 Small or 1 Large)',
        description: 'These temporary tattoos are water resistant and last between 2-7 days on your skin depending on where it is applied and care of the tattoo. WHAT\'S INCLUDED: 1 Small Lily flower temporary tattoo OR 1 Large Lily flower temporary tattoo Instructions on how to apply SIZE: Small 4.5" x 3.5" ( 9cm x 11.5cm) Large 7" x 5.5" ( 18cm x 14cm)',
        price: 12.99,
        images: ['images/products/product-4/1.jpg', 'images/products/product-4/2.jpg', 'images/products/product-4/3.jpg', 'images/products/product-4/4.jpg', 'images/products/product-4/5.jpg'],
        etsy_url: 'https://www.etsy.com/listing/1540382084/lily-flower-temporary-tattoo-1-small-or?ref=shop_home_active_31&crt=1&logging_key=b0ae62cc5e04f39126ad9de59abfce43850faae2%3A1540382084',
        category: 'Floral'
    },
    {
        id: 'product-5',
        title: 'Poppy Bouquet Temporary Tattoo (Set of 2)',
        description: 'These temporary tattoos are water resistant and last between 1-7 days on your skin depending on where it is applied and care of the tattoo. WHAT\'S INCLUDED: 2 temporary tattoos with instructions on how to apply SIZE: 3" x 1.5" (6.5cm x 2.5cm) 2.5" x 1.2" (6.5cm x 3.2cm)',
        price: 9.30,
        images: ['images/products/product-5/1.jpg', 'images/products/product-5/2.jpg', 'images/products/product-5/3.jpg', 'images/products/product-5/4.jpg', 'images/products/product-5/5.jpg'],
        etsy_url: 'https://www.etsy.com/listing/1757183579/poppy-bouquet-temporary-tattoo-set-of-2?ref=shop_home_feat_3&logging_key=c2a1e4378b8f7ce463525e2a2fe7dc188637e591%3A1757183579',
        category: 'Floral'
    },
    {
        id: 'product-6',
        title: 'Aster flower Temporary Tattoo (Set of 2)',
        description: 'These temporary tattoos are water resistant and last between 1-7 days on your skin depending on where it is applied and care of the tattoo. WHAT\'S INCLUDED: 1 sheet with 2 Temporary Tattoos with instructions on how to apply SIZE: 2" (5cm)',
        price: 8.50,
        images: ['images/products/product-6/1.jpg', 'images/products/product-6/2.jpg', 'images/products/product-6/3.jpg', 'images/products/product-6/4.jpg', 'images/products/product-6/5.jpg'],
        etsy_url: 'https://www.etsy.com/listing/1887764970/aster-flower-temporary-tattoo-set-of-2?ref=shop_home_active_5&logging_key=5cdc65c69d835b945c83e5dbe7de76771b42c78d%3A1887764970',
        category: 'Floral'
    },
    {
        id: 'product-7',
        title: 'Sword Eye Temporary Tattoo (Set of 2)',
        description: 'These temporary tattoos are water resistant and last between 1-7 days on your skin depending on where it is applied and care of the tattoo. WHAT\'S INCLUDED: 1 sheet with 2 Temporary Tattoos with instructions on how to apply APPROXIMATELY SIZE: 3" & 2.5" (8cm & 6.5cm)',
        price: 9.50,
        images: ['images/products/product-7/1.jpg', 'images/products/product-7/2.jpg', 'images/products/product-7/3.jpg', 'images/products/product-7/4.jpg', 'images/products/product-7/5.jpg'],
        etsy_url: 'https://www.etsy.com/listing/4340471403/sword-eye-temporary-tattoo-set-of-2?ref=shop_home_active_21&logging_key=48852ca12a0eed18ae203f280519db4cdebe5422%3A4340471403',
        category: 'Geometric'
    },
    {
        id: 'product-8',
        title: 'Single line Roses Temporary Tattoo (Set of 3)',
        description: 'These temporary tattoos are water resistant and last between 1-7 days on your skin depending on where it is applied and care of the tattoo. WHAT\'S INCLUDED: 3 temporary tattoos with instructions on how to apply SIZE: 2.5" (6.5cm) *each flower Or 2" (5cm) *each flower',
        price: 8.90,
        images: ['images/products/product-8/1.jpg', 'images/products/product-8/2.jpg', 'images/products/product-8/3.jpg', 'images/products/product-8/4.jpg', 'images/products/product-8/5.jpg'],
        etsy_url: 'https://www.etsy.com/listing/1757203351/single-line-roses-temporary-tattoo-set?ref=shop_home_active_3&logging_key=b8ff9f9161161b13775484ac5759a9ac04c5b048%3A1757203351',
        category: 'Floral'
    },
    {
        id: 'product-9',
        title: 'Swallow Birds Temporary Tattoo (Set of 2)',
        description: 'These temporary tattoos are water resistant and last between 1-7 days on your skin depending on where it is applied and care of the tattoo. WHAT\'S INCLUDED: 1 sheet with 2 Swallow birds & instructions on how to apply SIZE: 2" x 2.5" (5.3cmx5.5cm) *both birds together',
        price: 9.30,
        images: ['images/products/product-9/1.jpg', 'images/products/product-9/2.jpg', 'images/products/product-9/3.jpg', 'images/products/product-9/4.jpg', 'images/products/product-9/5.jpg'],
        etsy_url: 'https://www.etsy.com/listing/1851856396/swallow-birds-temporary-tattoo-set-of-2?ref=shop_home_active_4&crt=1&logging_key=71984bb11148c033c1f09d26679a9f296d22c3a0%3A1851856396',
        category: 'Animals'
    },
    {
        id: 'product-10',
        title: 'Japanese Temporary Tattoo Set Sakura, Crane, Lucky Cat & More',
        description: 'These temporary tattoos are water resistant and last between 1-7 days on your skin depending on where it is applied and care of the tattoo. WHAT\'S INCLUDED: 1 sheet of 7 Temporary Tattoos & instructions on how to apply APPROXIMATELY SIZE: Umbrella 1.2" x 1.2" (3.2cm x 3.2cm) Sakura Glass Chime 1" x 2.3" (2.54cm x 6cm) Lotus 1" x 1.2" ( 2.54cm x 3.2cm) Paper Crane 1" x 1" (2.54cm x 2.54cm) Mountain Fuji 0.6" x 2" (1.4cm x 5cm) Lucky Cat 1" x 0.7" (2.54cm x 2cm) Fan 2" x 1.5" (5cm x 3.2cm)',
        price: 12.99,
        images: ['images/products/product-10/1.jpg', 'images/products/product-10/2.jpg', 'images/products/product-10/3.jpg', 'images/products/product-10/4.jpg', 'images/products/product-10/5.jpg'],
        etsy_url: 'https://www.etsy.com/listing/1852043564/japanese-temporary-tattoo-set-sakura?ref=shop_home_active_15&logging_key=0fc4e515f8b0be5d75267670248bd7f946da266b%3A1852043564',
        category: 'Japanese'
    }
    // Note: I'll add the remaining 26 products in the next part due to length limits
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BERI_INK_PRODUCTS;
} else {
    window.BERI_INK_PRODUCTS = BERI_INK_PRODUCTS;
}
