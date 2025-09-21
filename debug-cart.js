// Debug script to fix cart issues
console.log('=== CART DEBUG SCRIPT ===');

// Clear corrupted cart data
localStorage.removeItem('beri-ink-cart');
console.log('Cleared cart data from localStorage');

// Force cart to be hidden
document.addEventListener('DOMContentLoaded', function() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartDrawer) {
        cartDrawer.classList.remove('open');
        cartDrawer.style.display = 'none';
        cartDrawer.style.visibility = 'hidden';
        cartDrawer.style.right = '-400px';
        console.log('Cart drawer hidden');
    }
    
    if (cartOverlay) {
        cartOverlay.style.display = 'none';
        console.log('Cart overlay hidden');
    }
    
    console.log('Cart debug complete');
});
