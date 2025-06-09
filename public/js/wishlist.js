document.addEventListener('DOMContentLoaded', function() {
    // Initialize wishlist
    if (!localStorage.getItem('wishlist')) {
        localStorage.setItem('wishlist', JSON.stringify([]));
    }
    updateWishlistCount();
    
    // Set initial state for wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        const bookId = button.dataset.id;
        const wishlist = JSON.parse(localStorage.getItem('wishlist'));
        
        if (wishlist.includes(bookId)) {
            button.classList.add('in-wishlist');
            button.innerHTML = '<span class="wishlist-icon">♥</span> In Wishlist';
        }
    });
    
    // Add event listeners to wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.dataset.id;
            toggleWishlist(bookId, this);
        });
    });
});

function toggleWishlist(bookId, button) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist'));
    const index = wishlist.indexOf(bookId);
    
    if (index === -1) {
        // Add to wishlist
        wishlist.push(bookId);
        button.classList.add('in-wishlist');
        button.innerHTML = '<span class="wishlist-icon">♥</span> In Wishlist';
    } else {
        // Remove from wishlist
        wishlist.splice(index, 1);
        button.classList.remove('in-wishlist');
        button.innerHTML = '<span class="wishlist-icon">♡</span> Add to Wishlist';
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist'));
    const countElement = document.getElementById('wishlist-count');
    if (countElement) {
        countElement.textContent = wishlist.length;
    }
}