document.addEventListener('DOMContentLoaded', () => {
    // Initialize buttons based on cart
   

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
  
    updateWishlistButtons();

 

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


document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const removeFromCartBtn = document.getElementById('remove-from-cart-btn');
    const gotoCartBtn = document.getElementById('goto-cart-btn');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const bookId = addToCartBtn?.getAttribute('data-id');

    const switchToViewCart = async () => {
        if (!bookId) return;

        try {
            const res = await fetch(`/cart/api/status/${bookId}`);
            const data = await res.json();
            const inCart = data.inCart;
            console.log('Cart status:', inCart);

            if (inCart) {
                addToCartBtn.style.display = 'none';
                gotoCartBtn.style.display = 'inline-block';
            } else {
                addToCartBtn.style.display = 'inline-block';
                gotoCartBtn.style.display = 'none';
            }
        } catch (err) {
            console.error('Failed to update cart buttons', err);
        }
    };

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async () => {
            console.log(addToCartBtn.dataset.image);
            try {
                const res = await fetch('/cart/api/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        bookId,
                        price: addToCartBtn.dataset.price,
                        imagePath: addToCartBtn.dataset.image
                    })
                });

                if (res.ok) {
                    const cartData = await res.json();
                    // showNotification('Added to cart!');
                    console.log('ana dakhel');
                    await switchToViewCart();

                    // Dispatch event with full cart data
                    document.dispatchEvent(new CustomEvent('cartUpdated', { 
                        detail: { 
                            bookId,
                            cart: cartData  // Pass the updated cart data
                        } 
                    }));
                } else {
                    const err = await res.json();
                    showNotification(err.error || 'Error adding to cart');
                    throw new Error(err.error || 'Failed to add to cart');
                }
            } catch (err) {
                console.error('Add to cart error:', err);
                showNotification('Failed to add to cart');
            }
        });
    }

}); 