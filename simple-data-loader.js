// Simple Data Loader - Reads from static JSON files instead of localStorage
// This ensures the live website works reliably without localStorage issues

let cmsData = {
    products: [],
    content: {},
    galleryPhotos: [],
    artistPhotos: []
};

// Load data from static JSON files
async function loadCMSData() {
    try {
        // Try to load products
        const productsResponse = await fetch('cms-products.json');
        if (productsResponse.ok) {
            cmsData.products = await productsResponse.json();
            console.log('Loaded products from CMS:', cmsData.products);
        }
        
        // Try to load content
        const contentResponse = await fetch('cms-content.json');
        if (contentResponse.ok) {
            cmsData.content = await contentResponse.json();
            console.log('Loaded content from CMS:', cmsData.content);
        }
        
        // Try to load gallery photos
        const galleryResponse = await fetch('cms-gallery.json');
        if (galleryResponse.ok) {
            cmsData.galleryPhotos = await galleryResponse.json();
            console.log('Loaded gallery photos from CMS:', cmsData.galleryPhotos);
        }
        
        // Try to load artist photos
        const artistResponse = await fetch('cms-artist.json');
        if (artistResponse.ok) {
            cmsData.artistPhotos = await artistResponse.json();
            console.log('Loaded artist photos from CMS:', cmsData.artistPhotos);
        }
        
        // Update the website with loaded data
        updateWebsiteWithCMSData();
        
    } catch (error) {
        console.log('No CMS data files found, using default data');
        // Fallback to default data if CMS files don't exist
        loadDefaultData();
    }
}

// Update website with CMS data
function updateWebsiteWithCMSData() {
    // Update products
    if (cmsData.products && cmsData.products.length > 0) {
        window.enhancedProducts = cmsData.products;
        console.log('Updated products from CMS');
        
        // Trigger store re-render if on store page
        if (typeof renderProducts === 'function') {
            renderProducts();
        }
    }
    
    // Update gallery photos
    if (cmsData.galleryPhotos && cmsData.galleryPhotos.length > 0) {
        updateGalleryPhotos(cmsData.galleryPhotos);
    }
    
    // Update artist photos
    if (cmsData.artistPhotos && cmsData.artistPhotos.length > 0) {
        updateArtistPhotos(cmsData.artistPhotos);
    }
    
    // Update content
    if (cmsData.content) {
        updateContentFromCMS(cmsData.content);
    }
}

// Update gallery photos
function updateGalleryPhotos(photos) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid && photos.length > 0) {
        galleryGrid.innerHTML = photos.map(photo => `
            <div class="gallery-item">
                <img src="${photo.src}" alt="${photo.name}" loading="lazy">
            </div>
        `).join('');
    }
}

// Update artist photos
function updateArtistPhotos(photos) {
    const artistCarousel = document.getElementById('artistCarouselTrack');
    if (artistCarousel && photos.length > 0) {
        artistCarousel.innerHTML = photos.map(photo => `
            <div class="carousel-slide">
                <img src="${photo.src}" alt="${photo.name}" loading="lazy" class="artist-img">
            </div>
        `).join('');
    }
}

// Update content from CMS
function updateContentFromCMS(content) {
    // Homepage content
    if (content.homepage) {
        if (content.homepage.hero) {
            const heroTitle = document.querySelector('.hero h1');
            if (heroTitle && content.homepage.hero.title) heroTitle.textContent = content.homepage.hero.title;
            
            const heroSubtitle = document.querySelector('.hero h2');
            if (heroSubtitle && content.homepage.hero.subtitle) heroSubtitle.textContent = content.homepage.hero.subtitle;
        }
    }
    
    // Artist page content
    if (content.artist) {
        if (content.artist.hero) {
            const artistTitle = document.querySelector('.artist-hero h1');
            if (artistTitle && content.artist.hero.title) artistTitle.textContent = content.artist.hero.title;
        }
    }
    
    // Add more content updates as needed
}

// Load default data if CMS files don't exist
function loadDefaultData() {
    console.log('Loading default data');
    // This will use the existing default data from enhanced-products.js
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadCMSData();
});

// Make data available globally
window.cmsData = cmsData;
window.loadCMSData = loadCMSData;
