// Simple slide-out cart drawer demo
document.addEventListener('DOMContentLoaded', () => {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    const closeBtn = document.getElementById('cartClose');
    const itemsEl = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const checkoutBtn = document.getElementById('cartCheckout');
    const cartButton = document.getElementById('cartButton');
    const cartCount = document.getElementById('cartCount');

    const cart = {
        items: JSON.parse(localStorage.getItem('beri-ink-cart') || '[]'),
    };

    function formatPrice(cents) {
        return `$${(cents / 100).toFixed(2)}`;
    }

    function saveCart() {
        localStorage.setItem('beri-ink-cart', JSON.stringify(cart.items));
        updateCartCount();
    }

    function updateCartCount() {
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        console.log('Updating cart count:', totalItems, 'cartCount element:', cartCount);
        
        // Try to find the cart count element if it's not already found
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'flex'; // Always show the count, even when 0
            console.log('Cart count updated to:', totalItems);
        } else {
            console.error('Cart count element not found!');
        }
    }

    // Initialize cart on page load
    console.log('Cart initialized with items:', cart.items);
    console.log('Cart count element found:', cartCount);
    renderCart();
    updateCartCount();
    
    // Force update cart count after a short delay to ensure DOM is ready
    setTimeout(() => {
        console.log('Force updating cart count after delay');
        updateCartCount();
    }, 100);
    
    // Additional force update after longer delay
    setTimeout(() => {
        console.log('Second force update of cart count');
        updateCartCount();
    }, 500);
    
    // Update cart count when page becomes visible (in case of tab switching)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            console.log('Page became visible, updating cart count');
            updateCartCount();
        }
    });
    
    // Update cart count when window gains focus
    window.addEventListener('focus', () => {
        console.log('Window focused, updating cart count');
        updateCartCount();
    });

    // Cart button click handler
    if (cartButton) {
        cartButton.addEventListener('click', openCart);
    }

    function openCart() {
        drawer.classList.add('open');
        overlay.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function renderCart() {
        itemsEl.innerHTML = '';
        let subtotal = 0;

        cart.items.forEach((item, idx) => {
            subtotal += item.price * item.quantity;
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div>
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-qty">
                        <button class="qty-btn" data-idx="${idx}" data-op="dec">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-idx="${idx}" data-op="inc">+</button>
                    </div>
                </div>
                <div>${formatPrice(item.price * item.quantity)}</div>
            `;
            itemsEl.appendChild(row);
        });

        subtotalEl.textContent = formatPrice(subtotal);
    }

    function addToCart(payload) {
        const existing = cart.items.find(p => p.id === payload.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.items.push({ ...payload, quantity: 1 });
        }
        saveCart();
        renderCart();
        openCart();
    }

    function handleQuickViewOpen(card) {
        const overlay = document.getElementById('quickViewOverlay');
        const modal = document.getElementById('quickViewModal');
        const titleEl = card.querySelector('.product-title, h3');
        const priceEl = card.querySelector('.product-price, .price');
        const imgEl = card.querySelector('img');
        document.getElementById('qvTitle').textContent = titleEl ? titleEl.textContent.trim() : 'Item';
        document.getElementById('qvPrice').textContent = priceEl ? priceEl.textContent.trim() : '';
        document.getElementById('qvDescription').textContent = card.querySelector('.product-description')?.textContent || '';
        document.getElementById('qvImage').src = imgEl ? imgEl.src : 'images/placeholder-temp-tattoo.jpg';
        document.getElementById('qvQty').value = 1;
        overlay.classList.add('open');
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modal.dataset.pid = titleEl ? titleEl.textContent.trim() : String(Date.now());
    }

    function closeQuickView() {
        const overlay = document.getElementById('quickViewOverlay');
        const modal = document.getElementById('quickViewModal');
        overlay.classList.remove('open');
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.getElementById('quickViewClose')?.addEventListener('click', closeQuickView);
    document.getElementById('quickViewOverlay')?.addEventListener('click', closeQuickView);

    document.getElementById('qvAddToCart')?.addEventListener('click', () => {
        const modal = document.getElementById('quickViewModal');
        const pid = modal.dataset.pid;
        const qty = Math.max(1, parseInt(document.getElementById('qvQty').value, 10) || 1);
        const title = document.getElementById('qvTitle').textContent;
        const priceText = document.getElementById('qvPrice').textContent.replace(/[^0-9.]/g, '');
        const cents = Math.round(parseFloat(priceText || '0') * 100);
        const image = document.getElementById('qvImage').src;
        addToCart({ id: pid, title, price: cents, image });
        closeQuickView();
    });

    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart');
        if (btn) {
            e.preventDefault();
            // Infer product from DOM card
            const card = btn.closest('.product-card, .store-item');
            if (!card) return;
            const img = card.querySelector('img');
            const titleEl = card.querySelector('.product-title, h3');
            const priceEl = card.querySelector('.product-price, .price');
            const priceText = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, '') : '0';
            const cents = Math.round(parseFloat(priceText || '0') * 100);
            addToCart({
                id: titleEl ? titleEl.textContent.trim() : String(Date.now()),
                title: titleEl ? titleEl.textContent.trim() : 'Item',
                price: isNaN(cents) ? 0 : cents,
                image: img ? img.src : 'images/placeholder-temp-tattoo.jpg',
            });
        }

        const qv = e.target.closest('.quick-view, .product-image img');
        if (qv) {
            e.preventDefault();
            const card = qv.closest('.product-card, .store-item');
            if (card) handleQuickViewOpen(card);
        }

        if (e.target === overlay || e.target === closeBtn) {
            closeCart();
        }

        if (e.target.classList.contains('qty-btn')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            const op = e.target.getAttribute('data-op');
            if (op === 'inc') cart.items[idx].quantity += 1;
            if (op === 'dec') cart.items[idx].quantity = Math.max(1, cart.items[idx].quantity - 1);
            saveCart();
            renderCart();
        }
    });

    checkoutBtn.addEventListener('click', async () => {
        if (cart.items.length === 0) return;
        try {
            // For now, we'll use a default shipping address
            // In a real implementation, you'd collect this from the user
            const shippingAddress = {
                country: 'US' // This will be updated when user selects country
            };
            
            const res = await fetch('/.netlify/functions/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    items: cart.items,
                    shippingAddress: shippingAddress
                }),
            });
            if (!res.ok) throw new Error('Checkout failed');
            const data = await res.json();
            window.location.href = data.url;
        } catch (e) {
            console.error(e);
            alert('Unable to start checkout. Please try again.');
        }
    });
});

// Global function to force update cart count from anywhere
window.updateCartCountGlobal = function() {
    const cartItems = JSON.parse(localStorage.getItem('beri-ink-cart') || '[]');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = 'flex';
        console.log('Global cart count update:', totalItems);
    }
};

// Call global update on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.updateCartCountGlobal();
    }, 200);
});


