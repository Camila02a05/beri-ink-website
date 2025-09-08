// Optimized cart.js with better error handling and debugging
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
        console.log('Updating cart count:', totalItems);
        
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'flex';
            console.log('Cart count updated to:', totalItems);
        } else {
            console.error('Cart count element not found!');
        }
    }

    // Initialize cart
    updateCartCount();
    renderCart();

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

    // Event listeners
    cartButton?.addEventListener('click', openCart);
    closeBtn?.addEventListener('click', closeCart);
    overlay?.addEventListener('click', closeCart);

    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart');
        if (btn) {
            e.preventDefault();
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
                sku: 'CARD-' + (titleEl ? titleEl.textContent.trim().replace(/\s+/g, '-') : 'ITEM')
            });
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

    // Optimized checkout function with better error handling
    checkoutBtn.addEventListener('click', async () => {
        if (cart.items.length === 0) {
            alert('Your cart is empty. Please add some items before checking out.');
            return;
        }

        // Disable checkout button to prevent double-clicks
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';

        try {
            console.log('=== CHECKOUT INITIATED ===');
            console.log('Cart items:', JSON.stringify(cart.items, null, 2));
            console.log('Timestamp:', new Date().toISOString());

            // Validate cart items before sending
            const validItems = cart.items.filter(item => {
                const isValid = item.title && item.price > 0 && item.quantity > 0;
                if (!isValid) {
                    console.warn('Invalid item filtered out:', item);
                }
                return isValid;
            });

            if (validItems.length === 0) {
                throw new Error('No valid items in cart');
            }

            console.log('Sending', validItems.length, 'valid items to checkout');

            // Make the request to the Netlify function
            const response = await fetch('/.netlify/functions/create-checkout-optimized', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    items: validItems,
                    timestamp: new Date().toISOString()
                }),
            });

            console.log('Checkout response received:');
            console.log('- Status:', response.status);
            console.log('- Status text:', response.statusText);
            console.log('- Headers:', Object.fromEntries(response.headers.entries()));

            // Get response text first to handle both JSON and non-JSON responses
            const responseText = await response.text();
            console.log('Raw response text:', responseText);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                throw new Error(`Server returned invalid response: ${responseText.substring(0, 200)}`);
            }

            console.log('Parsed response data:', responseData);

            if (!response.ok) {
                const errorMessage = responseData.error || responseData.message || `HTTP ${response.status}: ${response.statusText}`;
                console.error('Checkout failed with error:', errorMessage);
                console.error('Full error response:', responseData);
                throw new Error(errorMessage);
            }

            if (!responseData.url) {
                console.error('No checkout URL in response:', responseData);
                throw new Error('No checkout URL received from server');
            }

            console.log('Redirecting to Stripe checkout:', responseData.url);
            
            // Clear cart on successful checkout initiation
            cart.items = [];
            saveCart();
            renderCart();
            closeCart();

            // Redirect to Stripe checkout
            window.location.href = responseData.url;

        } catch (error) {
            console.error('=== CHECKOUT ERROR ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

            // Show user-friendly error message
            let userMessage = 'Unable to start checkout. Please try again.';
            
            if (error.message.includes('Network')) {
                userMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message.includes('timeout')) {
                userMessage = 'Request timed out. Please try again.';
            } else if (error.message.includes('Invalid')) {
                userMessage = 'Invalid cart data. Please refresh the page and try again.';
            }

            alert(`${userMessage}\n\nError details: ${error.message}`);
        } finally {
            // Re-enable checkout button
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Checkout';
        }
    });
});

// Global function to update cart count
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

