// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery images - using actual 35 photos in folder order
    const galleryImages = [
        'images/gallery/7353CA5B-01FC-4DFD-8928-C80CC28F5CF7.JPG',
        'images/gallery/IMG_0154.jpeg',
        'images/gallery/IMG_0174.jpg',
        'images/gallery/IMG_0324.jpeg',
        'images/gallery/IMG_0343.jpeg',
        'images/gallery/IMG_2195.jpeg',
        'images/gallery/IMG_2213.jpeg',
        'images/gallery/IMG_2381.png',
        'images/gallery/IMG_2599.jpeg',
        'images/gallery/IMG_2863.jpeg',
        'images/gallery/IMG_3065.jpeg',
        'images/gallery/IMG_4161.jpeg',
        'images/gallery/IMG_5201.jpeg',
        'images/gallery/IMG_5338.jpeg',
        'images/gallery/IMG_5350.png',
        'images/gallery/IMG_5712.jpeg',
        'images/gallery/IMG_6950.jpeg',
        'images/gallery/IMG_6969.jpeg',
        'images/gallery/IMG_7005.png',
        'images/gallery/IMG_7021.jpeg',
        'images/gallery/IMG_7022.jpeg',
        'images/gallery/IMG_7023.jpeg',
        'images/gallery/IMG_7025.png',
        'images/gallery/IMG_7026.jpeg',
        'images/gallery/IMG_7040.jpeg',
        'images/gallery/IMG_7042.jpeg',
        'images/gallery/IMG_7044.jpeg',
        'images/gallery/IMG_7049.jpeg',
        'images/gallery/IMG_7150.jpeg',
        'images/gallery/IMG_7380.jpeg',
        'images/gallery/IMG_7727.jpeg',
        'images/gallery/IMG_8285.jpeg',
        'images/gallery/IMG_8550.jpeg',
        'images/gallery/IMG_8885.PNG',
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
        // Ensure visible per CSS (which shows .lightbox.active)
        requestAnimationFrame(() => lightbox.classList.add('active'));
        
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
        const gap = () => parseInt(getComputedStyle(carouselTrack).gap) || 0;
        const step = () => (carouselTrack.children[0]?.getBoundingClientRect().width || 250) + gap();

        function goNext() {
            const distance = step();
            carouselTrack.style.transition = 'transform 0.3s ease';
            carouselTrack.style.transform = `translateX(-${distance}px)`;
            const onEnd = () => {
                carouselTrack.style.transition = 'none';
                // move first slide to end
                if (carouselTrack.children.length > 0) {
                    carouselTrack.appendChild(carouselTrack.children[0]);
                }
                carouselTrack.style.transform = 'translateX(0)';
                // force reflow to apply none -> next transitions correctly
                void carouselTrack.offsetWidth;
                carouselTrack.removeEventListener('transitionend', onEnd);
            };
            carouselTrack.addEventListener('transitionend', onEnd);
        }

        function goPrev() {
            const distance = step();
            // move last to front first
            if (carouselTrack.children.length > 0) {
                carouselTrack.insertBefore(carouselTrack.lastElementChild, carouselTrack.firstElementChild);
            }
            carouselTrack.style.transition = 'none';
            carouselTrack.style.transform = `translateX(-${distance}px)`;
            void carouselTrack.offsetWidth;
            carouselTrack.style.transition = 'transform 0.3s ease';
            carouselTrack.style.transform = 'translateX(0)';
        }

        carouselNext.addEventListener('click', goNext);
        carouselPrev.addEventListener('click', goPrev);

        // Tag children with stable indices so click -> product mapping survives DOM reordering
        Array.from(carouselTrack.children).forEach((child, idx) => child.setAttribute('data-index', String(idx + 1)));

        // Navigate to store product when clicking an item
        Array.from(carouselTrack.children).forEach((item, index) => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                // Normalize index across infinite loop by reading a data-index if present
                const childIndex = item.getAttribute('data-index') ? parseInt(item.getAttribute('data-index')) : (index + 1);
                const productIndex = Math.max(1, childIndex);
                const url = new URL('store.html', window.location.href);
                url.searchParams.set('p', String(productIndex));
                url.hash = `product-${productIndex}`;
                window.location.href = url.toString();
            });
        });
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

    // Mobile navigation: open/close
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMobileMenu);
    }
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
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
        
        // Event listeners (no auto-advance)
        if (artistCarouselNext) {
            artistCarouselNext.addEventListener('click', nextSlide);
        }
        
        if (artistCarouselPrev) {
            artistCarouselPrev.addEventListener('click', prevSlide);
        }
        
        // Dot navigation
        artistDots.forEach((dot, index) => {
            dot.addEventListener('click', () => { goToSlide(index); });
        });

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

