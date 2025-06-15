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
   
    const gotoCartBtn = document.getElementById('goto-cart-btn');
    
 

document.querySelectorAll('.add-to-cart-btn').forEach(addToCartBtn => {
    const bookId = addToCartBtn.getAttribute('data-id');
    const bookItem = addToCartBtn.closest('.book-item');
    const gotoCartBtn = bookItem.querySelector('.goto-cart-btn');

    // Function to switch button views for this book
    const switchCartButtons = async () => {
        try {
            const res = await fetch(`/cart/api/status/${bookId}`);
            const data = await res.json();
            const inCart = data.inCart;
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

    // Set initial state
    switchCartButtons();

    // Add to Cart event
    addToCartBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('/cart/api/add', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({ 
                    bookId,
                    price: addToCartBtn.dataset.price,
                    imagePath: addToCartBtn.dataset.image
                })
            });
            if (res.ok) {
                await switchCartButtons();
            } else {
                const err = await res.json();
                throw new Error(err.error || 'Failed to add to cart');
            }
        } catch (err) {
            console.error('Add to cart error:', err);
        }
           });
    });
});