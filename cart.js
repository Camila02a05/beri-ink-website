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
    
    // Immediate update to prevent 0 flash
    function immediateCartUpdate() {
        const cartItems = JSON.parse(localStorage.getItem('beri-ink-cart') || '[]');
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'flex';
        }
    }

    // Initialize cart on page load
    console.log('Cart initialized with items:', cart.items);
    console.log('Cart count element found:', cartCount);
    
    // Immediate update to prevent 0 flash
    immediateCartUpdate();
    
    // Update cart count immediately to prevent glitch
    updateCartCount();
    renderCart();
    
    // Multiple updates to ensure persistence
    setTimeout(() => {
        console.log('First delayed cart count update');
        updateCartCount();
    }, 10);
    
    setTimeout(() => {
        console.log('Second delayed cart count update');
        updateCartCount();
    }, 100);
    
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

    // Cart button click handler - ensure it's always attached
    function attachCartButtonHandler() {
        const cartButton = document.getElementById('cartButton');
        if (cartButton && !cartButton.hasAttribute('data-listener-attached')) {
            cartButton.addEventListener('click', openCart);
            cartButton.setAttribute('data-listener-attached', 'true');
            console.log('Cart button handler attached');
        }
    }
    
    // Attach handler immediately and on page load
    attachCartButtonHandler();
    
    // Also attach when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', attachCartButtonHandler);
    
    // Attach when page becomes visible (for navigation between pages)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            attachCartButtonHandler();
        }
    });

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
                <div class="cart-item-right">
                    <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
                    <button class="cart-item-delete" data-idx="${idx}" title="Remove item">×</button>
                </div>
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

        if (e.target.classList.contains('cart-item-delete')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            cart.items.splice(idx, 1);
            saveCart();
            renderCart();
        }
    });

    checkoutBtn.addEventListener('click', async () => {
        if (cart.items.length === 0) return;
        try {
            // Create checkout session - Stripe will collect shipping address
            const res = await fetch('/.netlify/functions/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    items: cart.items,
                    // Let Stripe collect the shipping address during checkout
                    shippingAddress: { country: 'US' } // Default, will be updated by Stripe
                }),
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                console.error('Checkout error:', errorData);
                throw new Error(errorData.error || 'Checkout failed');
            }
            
            const data = await res.json();
            console.log('Checkout session created:', data);
            window.location.href = data.url;
        } catch (e) {
            console.error('Checkout error:', e);
            alert('Unable to start checkout. Please try again. Error: ' + e.message);
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


