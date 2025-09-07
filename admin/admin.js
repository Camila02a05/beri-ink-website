// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

let currentProduct = null;
let uploadedImages = [];
let currentContent = {};

function initializeAdmin() {
    setupNavigation();
    loadProducts();
    setupImageUpload();
    setupForm();
    setupContentManagement();
    loadContentFromStorage();
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.admin-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

function setupImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    
    imageInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        if (files.length > 5) {
            alert('You can only upload up to 5 images');
            return;
        }
        
        uploadedImages = [];
        imagePreview.innerHTML = '';
        
        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImages.push({
                        name: file.name,
                        data: e.target.result,
                        index: index
                    });
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    img.onclick = () => removeImage(index);
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

function removeImage(index) {
    uploadedImages = uploadedImages.filter(img => img.index !== index);
    updateImagePreview();
}

function updateImagePreview() {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';
    
    uploadedImages.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = img.data;
        imgElement.alt = img.name;
        imgElement.onclick = () => removeImage(img.index);
        imagePreview.appendChild(imgElement);
    });
}

function addVariation() {
    const container = document.getElementById('variationsContainer');
    const variationRow = document.createElement('div');
    variationRow.className = 'variation-row';
    variationRow.innerHTML = `
        <input type="text" placeholder="Label (e.g., '1', '2', '3')" class="variation-label">
        <input type="number" placeholder="Quantity" class="variation-quantity" min="1">
        <input type="number" placeholder="Price in cents" class="variation-price" min="0" step="1">
        <button type="button" onclick="removeVariation(this)">Remove</button>
    `;
    container.appendChild(variationRow);
}

function removeVariation(button) {
    button.parentElement.remove();
}

function setupForm() {
    const form = document.getElementById('productForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
}

function saveProduct() {
    const formData = {
        title: document.getElementById('productTitle').value,
        description: document.getElementById('productDescription').value,
        sku: document.getElementById('productSku').value,
        category: document.getElementById('productCategory').value,
        visible: document.getElementById('productVisible').checked,
        images: uploadedImages.map(img => img.data),
        variations: getVariationsData()
    };
    
    if (currentProduct) {
        // Update existing product
        formData.id = currentProduct.id;
        formData.order = currentProduct.order;
        updateProduct(formData);
    } else {
        // Create new product
        formData.id = Date.now(); // Simple ID generation
        formData.order = enhancedProducts.length + 1;
        createProduct(formData);
    }
    
    resetForm();
    loadProducts();
}

function getVariationsData() {
    const variationRows = document.querySelectorAll('.variation-row');
    const variations = [];
    
    variationRows.forEach(row => {
        const label = row.querySelector('.variation-label').value;
        const quantity = parseInt(row.querySelector('.variation-quantity').value);
        const price = parseInt(row.querySelector('.variation-price').value);
        
        if (label && quantity && price) {
            variations.push({
                label: label,
                quantity: quantity,
                price: price
            });
        }
    });
    
    return {
        type: 'quantity',
        options: variations
    };
}

function createProduct(productData) {
    enhancedProducts.push(productData);
    saveProductsToStorage();
    alert('Product created successfully!');
}

function updateProduct(productData) {
    const index = enhancedProducts.findIndex(p => p.id === productData.id);
    if (index !== -1) {
        enhancedProducts[index] = productData;
        saveProductsToStorage();
        alert('Product updated successfully!');
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        enhancedProducts = enhancedProducts.filter(p => p.id !== productId);
        saveProductsToStorage();
        loadProducts();
        alert('Product deleted successfully!');
    }
}

function editProduct(productId) {
    const product = enhancedProducts.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    // Fill form with product data
    document.getElementById('productTitle').value = product.title;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productSku').value = product.sku;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productVisible').checked = product.visible;
    
    // Load existing images
    uploadedImages = product.images.map((img, index) => ({
        name: `image-${index}`,
        data: img,
        index: index
    }));
    updateImagePreview();
    
    // Load variations
    const container = document.getElementById('variationsContainer');
    container.innerHTML = '';
    
    if (product.variations && product.variations.options) {
        product.variations.options.forEach(variation => {
            const variationRow = document.createElement('div');
            variationRow.className = 'variation-row';
            variationRow.innerHTML = `
                <input type="text" placeholder="Label" class="variation-label" value="${variation.label}">
                <input type="number" placeholder="Quantity" class="variation-quantity" value="${variation.quantity}" min="1">
                <input type="number" placeholder="Price in cents" class="variation-price" value="${variation.price}" min="0" step="1">
                <button type="button" onclick="removeVariation(this)">Remove</button>
            `;
            container.appendChild(variationRow);
        });
    }
    
    // Scroll to form
    document.querySelector('.product-form').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('productForm').reset();
    currentProduct = null;
    uploadedImages = [];
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('variationsContainer').innerHTML = '';
}

function loadProducts() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;
    
    // Sort products by order
    const sortedProducts = enhancedProducts.sort((a, b) => a.order - b.order);
    
    productsList.innerHTML = sortedProducts.map(product => `
        <div class="product-item">
            <img src="${product.images[0] || 'images/placeholder-temp-tattoo.jpg'}" alt="${product.title}">
            <div class="product-info">
                <h3>${product.title}</h3>
                <p><strong>SKU:</strong> ${product.sku} | <strong>Category:</strong> ${product.category}</p>
                <p><strong>Variations:</strong> ${product.variations.options.length} options</p>
                <p><strong>Status:</strong> ${product.visible ? 'Visible' : 'Hidden'}</p>
            </div>
            <div class="product-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function saveProductsToStorage() {
    // In a real implementation, this would save to a database
    // For now, we'll use localStorage as a demo
    localStorage.setItem('beri-ink-products', JSON.stringify(enhancedProducts));
}

function loadProductsFromStorage() {
    const saved = localStorage.getItem('beri-ink-products');
    if (saved) {
        const savedProducts = JSON.parse(saved);
        // Merge with default products, keeping any new ones
        savedProducts.forEach(savedProduct => {
            const existingIndex = enhancedProducts.findIndex(p => p.id === savedProduct.id);
            if (existingIndex !== -1) {
                enhancedProducts[existingIndex] = savedProduct;
            } else {
                enhancedProducts.push(savedProduct);
            }
        });
    }
}

function saveSettings() {
    const settings = {
        stripeKey: document.getElementById('stripeKey').value,
        pitneyBowesKey: document.getElementById('pitneyBowesKey').value
    };
    
    localStorage.setItem('beri-ink-settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
}

function loadSettings() {
    const saved = localStorage.getItem('beri-ink-settings');
    if (saved) {
        const settings = JSON.parse(saved);
        document.getElementById('stripeKey').value = settings.stripeKey || '';
        document.getElementById('pitneyBowesKey').value = settings.pitneyBowesKey || '';
    }
}

// Initialize on page load
loadProductsFromStorage();
loadSettings();

// Content Management Functions
function setupContentManagement() {
    // Setup content tabs
    const contentTabs = document.querySelectorAll('.content-tab');
    const contentPanels = document.querySelectorAll('.content-panel');
    
    contentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Update active tab
            contentTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show target panel
            contentPanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });
    
    // Setup promotions tabs
    setupPromotionsTabs();
    
    // Load FAQ questions
    loadFAQQuestions();
}

function setupPromotionsTabs() {
    // Add a small delay to ensure DOM is fully ready
    setTimeout(() => {
        const promoTabs = document.querySelectorAll('.promo-tab');
        const promoPanels = document.querySelectorAll('.promo-panel');
        
        if (promoTabs.length === 0) {
            console.error('No promo tabs found');
            return;
        }
        
        promoTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.dataset.tab;
                
                // Update active tab
                promoTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show target panel
                promoPanels.forEach(panel => panel.classList.remove('active'));
                const targetPanel = document.getElementById(`${targetTab}-content`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
                
                // Load content for specific tabs
                if (targetTab === 'sales') {
                    loadActiveSales();
                } else if (targetTab === 'promo-codes') {
                    loadPromoCodes();
                } else if (targetTab === 'stats') {
                    loadPromotionStats();
                }
            });
        });
    }, 100);
}

function loadFAQQuestions() {
    const faqContainer = document.getElementById('faq-questions');
    if (!faqContainer) return;
    
    const savedContent = localStorage.getItem('beri-ink-content');
    let faqData = [];
    
    if (savedContent) {
        const content = JSON.parse(savedContent);
        faqData = content.faq?.questions || [];
    } else {
        // Default FAQ questions from your actual website
        faqData = [
            {
                question: "Do you take walk-ins?",
                answer: "Not at the moment. I like to take my time with each client and plan designs in advance."
            },
            {
                question: "Where are you located?",
                answer: "I'm based in Downtown Los Angeles *Since we don't take walk-ins the exact location will be shared once the appointment is made"
            },
            {
                question: "Is there parking available?",
                answer: "Yes — there is plenty of parking available"
            },
            {
                question: "Can I bring someone with me?",
                answer: "Yes! You're welcome to bring up to two people. Please note that the studio can get crowded at times, so seating may not always be guaranteed for friends and family."
            },
            {
                question: "Can I see the design before booking?",
                answer: "I only work with custom designs after the appointment is confirmed. The drawing process is part of the appointment and it's important to me that you're happy with your design, so I don't mind adjusting it as much as needed."
            },
            {
                question: "Do you use numbing cream?",
                answer: "Numbing creams can affect the texture of the skin and may interfere with the tattoo process, so I personally prefer not to use them."
            },
            {
                question: "Do you do cover-ups?",
                answer: "Yes — depending on the tattoo you'd like to cover. Keep in mind that cover-up designs usually need to be larger and darker than the original."
            },
            {
                question: "Do you tattoo over scars or stretch marks?",
                answer: "Often yes, but it depends on the type, size, and how old the scars or stretch marks are."
            },
            {
                question: "Do you tattoo in color?",
                answer: "It depends on the tattoo style. I use color very minimally and it depends on the design"
            }
        ];
    }
    
    faqContainer.innerHTML = '';
    faqData.forEach((faq, index) => {
        const faqElement = document.createElement('div');
        faqElement.className = 'faq-question';
        faqElement.innerHTML = `
            <h4>Question ${index + 1}</h4>
            <input type="text" placeholder="Question" value="${faq.question}" class="faq-question-input">
            <textarea placeholder="Answer" class="faq-answer-input">${faq.answer}</textarea>
            <button type="button" class="remove-faq-btn" onclick="removeFAQQuestion(this)">Remove Question</button>
        `;
        faqContainer.appendChild(faqElement);
    });
}

function addFAQQuestion() {
    const faqContainer = document.getElementById('faq-questions');
    const faqElement = document.createElement('div');
    faqElement.className = 'faq-question';
    faqElement.innerHTML = `
        <h4>New Question</h4>
        <input type="text" placeholder="Question" class="faq-question-input">
        <textarea placeholder="Answer" class="faq-answer-input"></textarea>
        <button type="button" class="remove-faq-btn" onclick="removeFAQQuestion(this)">Remove Question</button>
    `;
    faqContainer.appendChild(faqElement);
}

function removeFAQQuestion(button) {
    button.parentElement.remove();
}

function saveContent(page) {
    const contentData = {};
    
    if (page === 'homepage') {
        contentData.homepage = {
            hero: {
                title: document.getElementById('homepage-hero-title').value,
                subtitle: document.getElementById('homepage-hero-subtitle').value,
                description: document.getElementById('homepage-hero-description').value
            },
            gallery: {
                title: document.getElementById('homepage-gallery-title').value,
                subtitle: document.getElementById('homepage-gallery-subtitle').value,
                description: document.getElementById('homepage-gallery-description').value
            },
            tempTattoo: {
                title: document.getElementById('homepage-temp-title').value,
                subtitle: document.getElementById('homepage-temp-subtitle').value
            }
        };
    } else if (page === 'artist') {
        contentData.artist = {
            hero: {
                title: document.getElementById('artist-hero-title').value
            },
            bio: {
                content: document.getElementById('artist-bio-content').value
            }
        };
    } else if (page === 'vegan') {
        contentData.vegan = {
            hero: {
                title: document.getElementById('vegan-hero-title').value
            },
            section: {
                title: document.getElementById('vegan-section-title').value,
                intro: document.getElementById('vegan-intro').value,
                explanation: document.getElementById('vegan-explanation').value
            },
            ecoFriendly: {
                title: document.getElementById('eco-friendly-title').value,
                products: document.getElementById('eco-friendly-products').value
            },
            whyMatters: {
                title: document.getElementById('why-matters-title').value,
                content: document.getElementById('why-matters-content').value
            },
            signature: document.getElementById('vegan-signature').value
        };
    } else if (page === 'appointment') {
        contentData.appointment = {
            hero: {
                title: document.getElementById('appointment-hero-title').value
            },
            pricing: {
                title: document.getElementById('appointment-pricing-title').value,
                content: document.getElementById('appointment-pricing-content').value
            },
            quote: {
                title: document.getElementById('appointment-quote-title').value,
                intro: document.getElementById('appointment-quote-intro').value,
                customRequirements: document.getElementById('appointment-custom-requirements').value,
                flashRequirements: document.getElementById('appointment-flash-requirements').value
            },
            deposits: {
                title: document.getElementById('appointment-deposits-title').value,
                content: document.getElementById('appointment-deposits-content').value
            }
        };
    } else if (page === 'faq') {
        const faqQuestions = [];
        document.querySelectorAll('.faq-question').forEach(faq => {
            const question = faq.querySelector('.faq-question-input').value;
            const answer = faq.querySelector('.faq-answer-input').value;
            if (question && answer) {
                faqQuestions.push({ question, answer });
            }
        });
        
        contentData.faq = {
            hero: {
                title: document.getElementById('faq-hero-title').value,
                subtitle: document.getElementById('faq-hero-subtitle').value
            },
            questions: faqQuestions
        };
    } else if (page === 'store') {
        contentData.store = {
            hero: {
                title: document.getElementById('store-hero-title').value,
                subtitle: document.getElementById('store-hero-subtitle').value
            },
            about: {
                title: document.getElementById('store-about-title').value,
                content: document.getElementById('store-about-content').value
            }
        };
    } else if (page === 'footer') {
        contentData.footer = {
            newsletter: {
                title: document.getElementById('footer-newsletter-title').value,
                placeholder_name: document.getElementById('footer-newsletter-name-placeholder').value,
                placeholder_email: document.getElementById('footer-newsletter-email-placeholder').value,
                button_text: document.getElementById('footer-newsletter-button').value
            },
            copyright: document.getElementById('footer-copyright').value
        };
        
        contentData.contact = {
            email: document.getElementById('contact-email').value,
            instagram: document.getElementById('contact-instagram').value,
            facebook: document.getElementById('contact-facebook').value,
            tiktok: document.getElementById('contact-tiktok').value,
            youtube: document.getElementById('contact-youtube').value
        };
    }
    
    // Save to localStorage
    const existingContent = JSON.parse(localStorage.getItem('beri-ink-content') || '{}');
    const updatedContent = { ...existingContent, ...contentData };
    localStorage.setItem('beri-ink-content', JSON.stringify(updatedContent));
    
    alert(`${page.charAt(0).toUpperCase() + page.slice(1)} content saved successfully!`);
}

function loadContentFromStorage() {
    const savedContent = localStorage.getItem('beri-ink-content');
    if (!savedContent) return;
    
    const content = JSON.parse(savedContent);
    
    // Load homepage content
    if (content.homepage) {
        if (content.homepage.hero) {
            document.getElementById('homepage-hero-title').value = content.homepage.hero.title || '';
            document.getElementById('homepage-hero-subtitle').value = content.homepage.hero.subtitle || '';
            document.getElementById('homepage-hero-description').value = content.homepage.hero.description || '';
        }
        if (content.homepage.gallery) {
            document.getElementById('homepage-gallery-title').value = content.homepage.gallery.title || '';
            document.getElementById('homepage-gallery-subtitle').value = content.homepage.gallery.subtitle || '';
            document.getElementById('homepage-gallery-description').value = content.homepage.gallery.description || '';
        }
    }
    
    // Load artist content
    if (content.artist) {
        if (content.artist.hero) {
            document.getElementById('artist-hero-title').value = content.artist.hero.title || '';
            document.getElementById('artist-hero-subtitle').value = content.artist.hero.subtitle || '';
        }
        if (content.artist.bio) {
            document.getElementById('artist-bio-title').value = content.artist.bio.title || '';
            document.getElementById('artist-bio-content').value = content.artist.bio.content || '';
        }
        if (content.artist.philosophy) {
            document.getElementById('artist-philosophy-title').value = content.artist.philosophy.title || '';
            document.getElementById('artist-philosophy-content').value = content.artist.philosophy.content || '';
        }
    }
    
    // Load other content sections similarly...
    // (I'll add the rest of the loading logic for other pages)
}

// Promotions Management Functions
function loadActiveSales() {
    const activeSalesContainer = document.getElementById('activeSales');
    if (!activeSalesContainer) return;
    
    // Load sales from localStorage or server
    const savedPromotions = localStorage.getItem('beri-ink-promotions');
    const promotions = savedPromotions ? JSON.parse(savedPromotions) : { sales: [], promoCodes: [] };
    
    if (promotions.sales.length === 0) {
        activeSalesContainer.innerHTML = `
            <div class="no-sales">
                <p>No active sales found. Create your first sale to get started!</p>
            </div>
        `;
        return;
    }
    
    activeSalesContainer.innerHTML = promotions.sales.map(sale => `
        <div class="sale-card">
            <h4>${sale.name}</h4>
            <div class="sale-details">
                <span class="sale-discount">${sale.discountValue}${sale.discountType === 'percentage' ? '%' : '$'} off</span>
                <span class="sale-dates">${new Date(sale.startDate).toLocaleDateString()} - ${new Date(sale.endDate).toLocaleDateString()}</span>
            </div>
            <div class="sale-actions">
                <button class="edit-sale-btn" onclick="editSale('${sale.id}')">Edit</button>
                <button class="delete-sale-btn" onclick="deleteSale('${sale.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadPromoCodes() {
    const promoCodesContainer = document.getElementById('promoCodesList');
    if (!promoCodesContainer) return;
    
    // Load promo codes from localStorage or server
    const savedPromotions = localStorage.getItem('beri-ink-promotions');
    const promotions = savedPromotions ? JSON.parse(savedPromotions) : { sales: [], promoCodes: [] };
    
    if (promotions.promoCodes.length === 0) {
        promoCodesContainer.innerHTML = `
            <div class="no-promos">
                <p>No promo codes found. Create your first promo code to get started!</p>
            </div>
        `;
        return;
    }
    
    promoCodesContainer.innerHTML = promotions.promoCodes.map(promo => `
        <div class="promo-card">
            <div class="promo-header">
                <h4>${promo.code}</h4>
                <span class="promo-status ${promo.status}">${promo.status}</span>
            </div>
            <div class="promo-details">
                <span class="promo-discount">${promo.discountValue}${promo.discountType === 'percentage' ? '%' : '$'} off</span>
                <span class="promo-usage">Used ${promo.usedCount} times</span>
                <span class="promo-dates">${new Date(promo.startDate).toLocaleDateString()} - ${promo.noEndDate ? 'No end date' : new Date(promo.endDate).toLocaleDateString()}</span>
            </div>
            <div class="promo-actions">
                <button class="edit-promo-btn" onclick="editPromoCode('${promo.id}')">Edit</button>
                <button class="delete-promo-btn" onclick="deletePromoCode('${promo.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadPromotionStats() {
    // Load stats from localStorage or server
    const stats = {
        totalSalesGenerated: '$0',
        activePromotions: 0,
        recoveryRate: '0%',
        promoUsage: 0
    };
    
    // Update stats display
    document.getElementById('totalSalesGenerated').textContent = stats.totalSalesGenerated;
    document.getElementById('activePromotions').textContent = stats.activePromotions;
    document.getElementById('recoveryRate').textContent = stats.recoveryRate;
    document.getElementById('promoUsage').textContent = stats.promoUsage;
}

// Promotion action functions
function openSaleCreator() {
    alert('Sale creator will be implemented. This will open a modal to create new sales.');
}

function openPromoCodeCreator() {
    alert('Promo code creator will be implemented. This will open a modal to create new promo codes.');
}

function openAbandonedCartSettings() {
    alert('Abandoned cart settings will be implemented. This will open settings for cart recovery emails.');
}

function openThankYouSettings() {
    alert('Thank you offer settings will be implemented.');
}


function viewAllSales() {
    alert('View all sales will be implemented. This will show a detailed list of all sales.');
}

function editSale(saleId) {
    alert(`Edit sale ${saleId} will be implemented.`);
}

function deleteSale(saleId) {
    if (confirm('Are you sure you want to delete this sale?')) {
        alert(`Delete sale ${saleId} will be implemented.`);
    }
}

function editPromoCode(promoId) {
    alert(`Edit promo code ${promoId} will be implemented.`);
}

function deletePromoCode(promoId) {
    if (confirm('Are you sure you want to delete this promo code?')) {
        alert(`Delete promo code ${promoId} will be implemented.`);
    }
}

// Tab switching function
function switchPromoTab(targetTab) {
    console.log('Switching to tab:', targetTab);
    
    // Update active tab
    const promoTabs = document.querySelectorAll('.promo-tab');
    promoTabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');
    
    // Show target panel
    const promoPanels = document.querySelectorAll('.promo-panel');
    promoPanels.forEach(panel => panel.classList.remove('active'));
    const targetPanel = document.getElementById(`${targetTab}-content`);
    if (targetPanel) {
        targetPanel.classList.add('active');
        console.log('Panel activated:', targetTab);
    } else {
        console.error('Panel not found:', `${targetTab}-content`);
    }
    
    // Load content for specific tabs
    if (targetTab === 'sales') {
        loadActiveSales();
    } else if (targetTab === 'promo-codes') {
        loadPromoCodes();
    } else if (targetTab === 'stats') {
        loadPromotionStats();
    }
}

// Global functions for HTML onclick handlers
window.addVariation = addVariation;
window.removeVariation = removeVariation;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.saveSettings = saveSettings;
window.saveContent = saveContent;
window.addFAQQuestion = addFAQQuestion;
window.removeFAQQuestion = removeFAQQuestion;
window.openSaleCreator = openSaleCreator;
window.openPromoCodeCreator = openPromoCodeCreator;
window.openAbandonedCartSettings = openAbandonedCartSettings;
window.openThankYouSettings = openThankYouSettings;
window.viewAllSales = viewAllSales;
window.editSale = editSale;
window.deleteSale = deleteSale;
window.editPromoCode = editPromoCode;
window.deletePromoCode = deletePromoCode;
window.switchPromoTab = switchPromoTab;
