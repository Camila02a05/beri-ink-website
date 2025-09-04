// Simple slide-out cart drawer demo
document.addEventListener('DOMContentLoaded', () => {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    const closeBtn = document.getElementById('cartClose');
    const itemsEl = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const checkoutBtn = document.getElementById('cartCheckout');

    const cart = {
        items: [],
    };

    function formatPrice(cents) {
        return `$${(cents / 100).toFixed(2)}`;
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
        renderCart();
        openCart();
    }

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

        if (e.target === overlay || e.target === closeBtn) {
            closeCart();
        }

        if (e.target.classList.contains('qty-btn')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            const op = e.target.getAttribute('data-op');
            if (op === 'inc') cart.items[idx].quantity += 1;
            if (op === 'dec') cart.items[idx].quantity = Math.max(1, cart.items[idx].quantity - 1);
            renderCart();
        }
    });

    checkoutBtn.addEventListener('click', () => {
        // Placeholder: Stripe Checkout session creation will go here
        alert('Checkout demo — wiring Stripe next.');
    });
});


