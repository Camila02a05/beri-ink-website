// Simple cart functionality for Beri Ink
document.addEventListener('DOMContentLoaded', function() {
    const cartButton = document.getElementById('cartButton');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartCheckout = document.getElementById('cartCheckout');

    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('beri-ink-cart') || '[]');
    
    // Update cart UI
    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update cart count
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        // Update cart items display
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)}</p>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Open cart drawer
    function openCart() {
        console.log('Opening cart...');
        console.log('Cart drawer element:', cartDrawer);
        console.log('Cart overlay element:', cartOverlay);
        
        if (cartDrawer) {
            cartDrawer.classList.add('open');
            cartDrawer.setAttribute('aria-hidden', 'false');
            console.log('Cart drawer opened');
        } else {
            console.log('Cart drawer not found!');
        }
        
        if (cartOverlay) {
            cartOverlay.style.display = 'block';
            console.log('Cart overlay shown');
        } else {
            console.log('Cart overlay not found!');
        }
    }
    
    // Close cart drawer
    function closeCart() {
        if (cartDrawer) {
            cartDrawer.classList.remove('open');
            cartDrawer.setAttribute('aria-hidden', 'true');
        }
        if (cartOverlay) {
            cartOverlay.style.display = 'none';
        }
    }
    
    // Add to cart function (called from product pages)
    window.addToCart = function(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('beri-ink-cart', JSON.stringify(cart));
        updateCartUI();
        showCartNotification();
    };
    
    // Update quantity function
    window.updateQuantity = function(productId, quantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = quantity;
                localStorage.setItem('beri-ink-cart', JSON.stringify(cart));
                updateCartUI();
            }
        }
    };
    
    // Remove from cart function
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('beri-ink-cart', JSON.stringify(cart));
        updateCartUI();
    };
    
    // Show cart notification
    function showCartNotification() {
        let notification = document.getElementById('cart-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'cart-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #8b7355;
                color: white;
                padding: 12px 20px;
                border-radius: 5px;
                z-index: 1001;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(notification);
        }
        
        notification.textContent = 'Added to cart!';
        notification.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
        }, 3000);
    }
    
    // Event listeners
    if (cartButton) {
        console.log('Cart button found, adding event listener');
        cartButton.addEventListener('click', function() {
            console.log('Cart button clicked!');
            openCart();
        });
    } else {
        console.log('Cart button not found!');
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    if (cartCheckout) {
        cartCheckout.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            
            // Redirect to Etsy shop for checkout
            window.open('https://www.etsy.com/shop/BeriInk', '_blank');
        });
    }
    
    // Initialize cart UI
    updateCartUI();
    
    // Ensure cart is hidden on page load
    if (cartDrawer) {
        cartDrawer.classList.remove('open');
        cartDrawer.setAttribute('aria-hidden', 'true');
    }
    if (cartOverlay) {
        cartOverlay.style.display = 'none';
    }
});