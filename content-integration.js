// Content Integration Script
document.addEventListener('DOMContentLoaded', function() {
    const content = JSON.parse(localStorage.getItem('beri-ink-content') || '{}');
    console.log('Content integration loaded:', content);
    
    // Load products from CMS
    const cmsProducts = JSON.parse(localStorage.getItem('beri-ink-products') || '[]');
    if (cmsProducts && cmsProducts.length > 0) {
        console.log('Loading products from CMS:', cmsProducts);
        window.enhancedProducts = cmsProducts;
    }
    
    // Update homepage content
    if (content.homepage) {
        updateHomepageContent(content.homepage);
    }
    
    // Load gallery photos from CMS
    const galleryPhotos = JSON.parse(localStorage.getItem('beri-ink-gallery-photos') || '[]');
    if (galleryPhotos && galleryPhotos.length > 0) {
        console.log('Loading gallery photos from CMS:', galleryPhotos);
        updateGalleryPhotos(galleryPhotos);
    }
    
    // Update artist page content
    if (content.artist) {
        updateArtistContent(content.artist);
    }
    
    // Load artist photos from CMS
    const artistPhotos = JSON.parse(localStorage.getItem('beri-ink-artist-photos') || '[]');
    if (artistPhotos && artistPhotos.length > 0) {
        console.log('Loading artist photos from CMS:', artistPhotos);
        updateArtistPhotos(artistPhotos);
    }
    
    // Update vegan page content
    if (content.vegan) {
        updateVeganContent(content.vegan);
    }
    
    // Update appointment page content
    if (content.appointment) {
        updateAppointmentContent(content.appointment);
    }
    
    // Update FAQ page content
    if (content.faq) {
        updateFAQContent(content.faq);
    }
    
    // Update store page content
    if (content.store) {
        updateStoreContent(content.store);
    }
    
    // Update footer content
    if (content.footer) {
        updateFooterContent(content.footer);
    }
    
    console.log('Content integration complete');
});

// Test function to manually trigger content updates
window.testContentIntegration = function() {
    console.log('Testing content integration...');
    const content = JSON.parse(localStorage.getItem('beri-ink-content') || '{}');
    console.log('Current content:', content);
    
    if (content.homepage && content.homepage.galleryPhotos) {
        console.log('Found gallery photos in content:', content.homepage.galleryPhotos);
        updateGalleryPhotos(content.homepage.galleryPhotos);
    } else {
        console.log('No gallery photos found in content');
    }
    
    return content;
};

function updateHomepageContent(homepage) {
    console.log('Updating homepage content');
    
    // Hero section
    if (homepage.hero) {
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle && homepage.hero.title) heroTitle.textContent = homepage.hero.title;
        
        const heroSubtitle = document.querySelector('.hero .subtitle');
        if (heroSubtitle && homepage.hero.subtitle) heroSubtitle.textContent = homepage.hero.subtitle;
        
        const heroDescription = document.querySelector('.hero .description');
        if (heroDescription && homepage.hero.description) heroDescription.textContent = homepage.hero.description;
    }
    
    // Gallery section
    if (homepage.gallery) {
        const galleryTitle = document.querySelector('.gallery h2');
        if (galleryTitle && homepage.gallery.title) galleryTitle.textContent = homepage.gallery.title;
        
        const gallerySubtitle = document.querySelector('.gallery .subtitle');
        if (gallerySubtitle && homepage.gallery.subtitle) gallerySubtitle.textContent = homepage.gallery.subtitle;
        
        const galleryDescription = document.querySelector('.gallery .description');
        if (galleryDescription && homepage.gallery.description) galleryDescription.textContent = homepage.gallery.description;
        
        // Update gallery photos
        if (homepage.gallery.photos && homepage.gallery.photos.length > 0) {
            updateGalleryPhotos(homepage.gallery.photos);
        }
    }
}

function updateArtistContent(artist) {
    console.log('Updating artist content');
    
    // Hero section
    const heroTitle = document.querySelector('.artist-hero h1');
    if (heroTitle && artist.hero && artist.hero.title) heroTitle.textContent = artist.hero.title;
    
    // Bio content
    const bioContent = document.querySelector('.artist-bio p');
    if (bioContent && artist.bio && artist.bio.content) {
        bioContent.innerHTML = artist.bio.content.replace(/\n/g, '<br>');
    }
    
    // Artist photos
    if (artist.photos && artist.photos.length > 0) {
        updateArtistPhotos(artist.photos);
    }
}

function updateVeganContent(vegan) {
    console.log('Updating vegan content');
    
    // Hero section
    const heroTitle = document.querySelector('.vegan-hero h1');
    if (heroTitle && vegan.hero && vegan.hero.title) heroTitle.textContent = vegan.hero.title;
    
    // Section content
    if (vegan.section) {
        const sectionTitle = document.querySelector('.vegan-section h2');
        if (sectionTitle && vegan.section.title) sectionTitle.textContent = vegan.section.title;
        
        const intro = document.querySelector('.vegan-intro');
        if (intro && vegan.section.intro) intro.textContent = vegan.section.intro;
        
        const explanation = document.querySelector('.vegan-explanation');
        if (explanation && vegan.section.explanation) {
            explanation.innerHTML = vegan.section.explanation.replace(/\n/g, '<br>');
        }
    }
}

function updateAppointmentContent(appointment) {
    console.log('Updating appointment content');
    
    // Hero section
    const heroTitle = document.querySelector('.appointment-hero h1');
    if (heroTitle && appointment.hero && appointment.hero.title) heroTitle.textContent = appointment.hero.title;
    
    // Process section
    if (appointment.process) {
        const processTitle = document.querySelector('.process-section h2');
        if (processTitle && appointment.process.title) processTitle.textContent = appointment.process.title;
        
        const processContent = document.querySelector('.process-content');
        if (processContent && appointment.process.content) {
            processContent.innerHTML = appointment.process.content.replace(/\n/g, '<br>');
        }
    }
}

function updateFAQContent(faq) {
    console.log('Updating FAQ content');
    
    if (faq.questions && faq.questions.length > 0) {
        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer) {
            faqContainer.innerHTML = faq.questions.map(q => `
                <div class="faq-item">
                    <h3 class="faq-question">${q.question}</h3>
                    <div class="faq-answer">${q.answer.replace(/\n/g, '<br>')}</div>
                </div>
            `).join('');
        }
    }
}

function updateStoreContent(store) {
    console.log('Updating store content');
    
    // How to apply section
    if (store.howToApply) {
        const howToApplyTitle = document.querySelector('.application-instructions h2');
        if (howToApplyTitle && store.howToApply.title) howToApplyTitle.textContent = store.howToApply.title;
        
        const howToApplyContent = document.querySelector('.application-steps');
        if (howToApplyContent && store.howToApply.content) {
            howToApplyContent.innerHTML = store.howToApply.content.replace(/\n/g, '<br>');
        }
    }
    
    // Carousel products
    if (store.carouselProducts && store.carouselProducts.length > 0) {
        updateCarouselProducts(store.carouselProducts);
    }
    
    // Store products
    if (store.products && store.products.length > 0) {
        updateStoreProducts(store.products);
    }
}

function updateFooterContent(footer) {
    console.log('Updating footer content');
    
    // Newsletter
    if (footer.newsletter) {
        const newsletterText = document.querySelector('.footer-newsletter p');
        if (newsletterText && footer.newsletter.title) newsletterText.textContent = footer.newsletter.title;
        
        const namePlaceholder = document.querySelector('.newsletter-form input[type="text"]');
        if (namePlaceholder && footer.newsletter.namePlaceholder) namePlaceholder.placeholder = footer.newsletter.namePlaceholder;
        
        const emailPlaceholder = document.querySelector('.newsletter-form input[type="email"]');
        if (emailPlaceholder && footer.newsletter.emailPlaceholder) emailPlaceholder.placeholder = footer.newsletter.emailPlaceholder;
        
        const button = document.querySelector('.newsletter-form button');
        if (button && footer.newsletter.button) button.textContent = footer.newsletter.button;
    }
    
    // Copyright
    if (footer.copyright) {
        const copyright = document.querySelector('.footer-bottom p');
        if (copyright) copyright.textContent = footer.copyright;
    }
}

function updateGalleryPhotos(photos) {
    console.log('updateGalleryPhotos called with:', photos);
    const galleryContainer = document.getElementById('galleryGrid');
    console.log('Gallery container found:', galleryContainer);
    
    if (galleryContainer && photos && photos.length > 0) {
        console.log('Updating gallery with', photos.length, 'photos');
        galleryContainer.innerHTML = photos.map(photo => `
            <div class="gallery-item" data-src="${photo.src}">
                <img src="${photo.src}" alt="${photo.name}" loading="lazy">
            </div>
        `).join('');
        console.log('Gallery updated successfully');
    } else {
        console.log('Gallery update failed - container:', galleryContainer, 'photos:', photos);
    }
}

function updateArtistPhotos(photos) {
    const artistCarousel = document.getElementById('artistCarouselTrack');
    if (artistCarousel) {
        artistCarousel.innerHTML = photos.map(photo => `
            <div class="carousel-slide">
                <img src="${photo.src}" alt="${photo.name}" class="artist-img" loading="lazy">
            </div>
        `).join('');
    }
}

function updateCarouselProducts(products) {
    const carouselContainer = document.querySelector('.shop-carousel');
    if (carouselContainer) {
        carouselContainer.innerHTML = products.map(product => `
            <div class="carousel-product-item">
                <img src="${product.images[0]}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="price">$${product.price}</p>
            </div>
        `).join('');
    }
}

function updateStoreProducts(products) {
    console.log('Updating store products with:', products);
    
    // Update the global products array
    if (window.enhancedProducts) {
        window.enhancedProducts = products;
    }
    
    // If the store is already initialized, re-render
    if (typeof renderProducts === 'function') {
        renderProducts();
    }
    
    // Also update the products grid directly
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid && products.length > 0) {
        // This will be handled by the store script, but we can trigger a refresh
        if (typeof initializeEnhancedStore === 'function') {
            initializeEnhancedStore();
        }
    }
}