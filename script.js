// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery images - using actual tattoo photos
    const galleryImages = [
        'images/gallery/80D7E5BB-99E1-484E-A632-8CB9E8A83E15.jpeg',
        'images/gallery/IMG_0154.jpeg',
        'images/gallery/IMG_0324.jpeg',
        'images/gallery/IMG_0343.jpeg',
        'images/gallery/IMG_2195.jpeg',
        'images/gallery/IMG_2213.jpeg',
        'images/gallery/IMG_2599.jpeg',
        'images/gallery/IMG_2652.jpeg',
        'images/gallery/IMG_2863.jpeg',
        'images/gallery/IMG_3065.jpeg',
        'images/gallery/IMG_4161.jpeg',
        'images/gallery/IMG_5201.jpeg',
        'images/gallery/IMG_5210.jpeg',
        'images/gallery/IMG_5338.jpeg',
        'images/gallery/IMG_5350.png',
        'images/gallery/IMG_5712.jpeg',
        'images/gallery/IMG_5910.jpeg',
        'images/gallery/IMG_6950.jpeg',
        'images/gallery/IMG_6969.jpeg',
        'images/gallery/IMG_7005.png',
        'images/gallery/IMG_7018.jpeg',
        'images/gallery/IMG_7021.jpeg',
        'images/gallery/IMG_7022.jpeg',
        'images/gallery/IMG_7023.jpeg',
        // Adding new uploaded images to reach 24+ photos
        'images/gallery/IMG_1017.png',
        'images/gallery/IMG_1018.png',
        'images/gallery/IMG_1019.png',
        'images/gallery/IMG_1022.png',
        'images/gallery/IMG_1023.jpeg',
        'images/gallery/IMG_1025.jpeg',
        'images/gallery/IMG_1029.jpeg',
        'images/gallery/IMG_1030.jpeg',
        'images/gallery/IMG_1031.jpeg',
        'images/gallery/IMG_8728.jpg',
        'images/gallery/IMG_7025.png',
        'images/gallery/IMG_7026.jpeg',
        'images/gallery/IMG_7033.jpeg',
        'images/gallery/IMG_7040.jpeg',
        'images/gallery/IMG_7042.jpeg',
        'images/gallery/IMG_7044.jpeg',
        'images/gallery/IMG_7046.jpeg',
        'images/gallery/IMG_7049.jpeg',
        'images/gallery/IMG_7051.jpeg',
        'images/gallery/IMG_7052.jpeg',
        'images/gallery/IMG_7093.jpeg',
        'images/gallery/IMG_7150.jpeg',
        'images/gallery/IMG_7380.jpeg',
        'images/gallery/IMG_7484.jpeg',
        'images/gallery/IMG_7727.jpeg',
        'images/gallery/IMG_8285.jpeg',
        'images/gallery/IMG_8493.jpeg',
        'images/gallery/IMG_8550.jpeg',
        'images/gallery/IMG_8650.jpeg',
        'images/gallery/IMG_8719.jpeg',
        'images/gallery/IMG_9103.jpeg',
        'images/gallery/script_tattoo_1.jpeg'
    ];
    
    const galleryGrid = document.getElementById('galleryGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let currentImageIndex = 0;
    const imagesPerLoad = 25; // Show exactly 25 photos initially (5 rows of 5)

    function loadGalleryImages(count) {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < count && currentImageIndex < galleryImages.length; i++) {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-src', galleryImages[currentImageIndex]);
            
            const img = document.createElement('img');
            img.src = galleryImages[currentImageIndex];
            img.alt = 'Fine line tattoo work by Beri Ink';
            img.loading = 'lazy';
            
            galleryItem.appendChild(img);
            fragment.appendChild(galleryItem);
            
            currentImageIndex++;
        }
        
        return fragment;
    }

    // Clear existing placeholder content
    if (galleryGrid) {
        galleryGrid.innerHTML = '';
        
        // Load initial images
        const initialImages = loadGalleryImages(imagesPerLoad);
        galleryGrid.appendChild(initialImages);
    }

    // Load more button functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const moreImages = loadGalleryImages(imagesPerLoad);
            galleryGrid.appendChild(moreImages);
            
            // Hide button if all images loaded
            if (currentImageIndex >= galleryImages.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
        
        // Hide button if all images already loaded
        if (currentImageIndex >= galleryImages.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Gallery lightbox functionality
    if (galleryGrid) {
        galleryGrid.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG') {
                openLightbox(e.target.src);
            }
        });
    }

    function openLightbox(imageSrc) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${imageSrc}" alt="Tattoo work">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Close lightbox
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.className === 'lightbox-close') {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Carousel functionality
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    
    if (carouselTrack && carouselPrev && carouselNext) {
        let currentSlide = 0;
        const slides = carouselTrack.children;
        const totalSlides = slides.length;
        
        function updateCarousel() {
            const translateX = -currentSlide * 100;
            carouselTrack.style.transform = `translateX(${translateX}%)`;
        }
        
        carouselNext.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        });
        
        carouselPrev.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
        
        // Remove auto-play; navigate only on arrow click
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// FIXED MOBILE MENU FUNCTIONALITY
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
    }
}

// Artist Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const artistCarouselTrack = document.getElementById('artistCarouselTrack');
    const artistCarouselPrev = document.getElementById('artistCarouselPrev');
    const artistCarouselNext = document.getElementById('artistCarouselNext');
    const artistDots = document.querySelectorAll('.artist-carousel .dot');
    
    if (artistCarouselTrack) {
        let currentSlide = 0;
        const totalSlides = artistCarouselTrack.children.length;
        let autoSlideInterval;
        
        function updateCarousel() {
            const translateX = -currentSlide * 100;
            artistCarouselTrack.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            artistDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateCarousel();
        }
        
        // Auto-slide functionality (like Jane Lee's website)
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Event listeners
        if (artistCarouselNext) {
            artistCarouselNext.addEventListener('click', () => {
                stopAutoSlide();
                nextSlide();
                startAutoSlide(); // Restart auto-slide after manual interaction
            });
        }
        
        if (artistCarouselPrev) {
            artistCarouselPrev.addEventListener('click', () => {
                stopAutoSlide();
                prevSlide();
                startAutoSlide(); // Restart auto-slide after manual interaction
            });
        }
        
        // Dot navigation
        artistDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                goToSlide(index);
                startAutoSlide(); // Restart auto-slide after manual interaction
            });
        });
        
        // Pause auto-slide on hover
        const artistCarousel = document.querySelector('.artist-carousel');
        if (artistCarousel) {
            artistCarousel.addEventListener('mouseenter', stopAutoSlide);
            artistCarousel.addEventListener('mouseleave', startAutoSlide);
        }
        
        // Start auto-slide
        startAutoSlide();
        updateCarousel();
    }
});

// Instagram Carousel Functionality
function initializeInstagramCarousel() {
    const carousel = document.getElementById('instagramCarousel');
    const prevBtn = document.getElementById('instagramPrev');
    const nextBtn = document.getElementById('instagramNext');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const itemWidth = 165; // 150px + 15px gap
    const visibleItems = Math.floor(carousel.parentElement.offsetWidth / itemWidth);
    const totalItems = carousel.children.length;
    const maxIndex = Math.max(0, totalItems - visibleItems);
    
    function updateCarousel() {
        const translateX = -currentIndex * itemWidth;
        carousel.style.transform = `translateX(${translateX}px)`;
        
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    updateCarousel();
}

// Initialize Instagram carousel when page loads
document.addEventListener('DOMContentLoaded', initializeInstagramCarousel);

