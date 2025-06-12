document.addEventListener('DOMContentLoaded', () => {
    // Initialize buttons based on cart
    const updateCartButtons = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            const bookId = btn.getAttribute('data-id');
            const cartActionContainer = btn.closest('.cart-actions') || btn.parentNode;
            const gotoCartBtn = cartActionContainer.querySelector('.goto-cart-btn');
            const removeFromCartBtn = cartActionContainer.querySelector('.remove-from-cart-btn');
            
            if (cart.includes(bookId)) {
                btn.style.display = 'none';
                if (gotoCartBtn) gotoCartBtn.style.display = 'inline-flex';
                if (removeFromCartBtn) removeFromCartBtn.style.display = 'inline-flex';
            } else {
                btn.style.display = 'inline-flex';
                if (gotoCartBtn) gotoCartBtn.style.display = 'none';
                if (removeFromCartBtn) removeFromCartBtn.style.display = 'none';
            }
        });
    };

    // Initialize wishlist buttons
    const updateWishlistButtons = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const bookId = btn.getAttribute('data-id');
            if (wishlist.includes(bookId)) {
                btn.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
                btn.classList.add('active');
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i> Wishlist';
                btn.classList.remove('active');
            }
        });
    };

    // Initialize buttons on load
    updateCartButtons();
    updateWishlistButtons();

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (!cart.includes(bookId)) {
                cart.push(bookId);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartButtons();
            }
        });
    });

    // Remove from cart functionality
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            cart = cart.filter(id => id !== bookId);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartButtons();
        });
    });

    // Wishlist functionality
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-id');
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            
            if (wishlist.includes(bookId)) {
                wishlist = wishlist.filter(id => id !== bookId);
            } else {
                wishlist.push(bookId);
            }
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistButtons();
        });
    });
});