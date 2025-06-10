document.addEventListener('DOMContentLoaded', () => {
    // Cart buttons and notification
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const removeFromCartBtn = document.getElementById('remove-from-cart-btn');
    const gotoCartBtn = document.getElementById('goto-cart-btn');
    const cartNotification = document.getElementById('cart-notification');

    // Check initial cart status
    async function checkCartStatus() {
        try {
            const bookId = addToCartBtn?.dataset.id;
            if (!bookId) return;

            const response = await fetch(`/cart/status/${bookId}`);
            const data = await response.json();

            if (data.inCart) {
                addToCartBtn.style.display = 'none';
                removeFromCartBtn.style.display = 'inline-block';
                gotoCartBtn.style.display = 'inline-block';
            }
        } catch (err) {
            console.error('Error checking cart status:', err);
        }
    }

    // Show notification
    function showCartNotification(message) {
        if (cartNotification) {
            cartNotification.textContent = message;
            cartNotification.style.display = 'block';
            setTimeout(() => {
                cartNotification.style.display = 'none';
            }, 3000);
        }
    }

    // Add to cart handler
    if (addToCartBtn) {
        checkCartStatus(); // Initial check
        
        addToCartBtn.addEventListener('click', async () => {
            const bookId = addToCartBtn.dataset.id;
            try {
                const response = await fetch(`/cart/add/${bookId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: 1 })
                });
                
                const data = await response.json();
                if (data.success) {
                    showCartNotification('Added to cart!');
                    addToCartBtn.style.display = 'none';
                    removeFromCartBtn.style.display = 'inline-block';
                    gotoCartBtn.style.display = 'inline-block';
                }
            } catch (err) {
                console.error('Error adding to cart:', err);
                showCartNotification('Failed to add to cart');
            }
        });
    }

    // Remove from cart handler
    if (removeFromCartBtn) {
        removeFromCartBtn.addEventListener('click', async () => {
            const bookId = removeFromCartBtn.dataset.id;
            try {
                const response = await fetch(`/cart/remove/${bookId}`, {
                    method: 'POST'
                });
                
                const data = await response.json();
                if (data.success) {
                    showCartNotification('Removed from cart!');
                    addToCartBtn.style.display = 'inline-block';
                    removeFromCartBtn.style.display = 'none';
                    gotoCartBtn.style.display = 'none';
                }
            } catch (err) {
                console.error('Error removing from cart:', err);
                showCartNotification('Failed to remove from cart');
            }
        });
    }
    // === Wishlist Functionality ===
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const wishlistNotification = document.getElementById('wishlist-notification');

    const showWishlistNotification = (added) => {
        if (wishlistNotification) {
            wishlistNotification.textContent = added ? 'Added to wishlist!' : 'Removed from wishlist!';
            wishlistNotification.style.display = 'block';
            clearTimeout(showWishlistNotification.timeout);
            showWishlistNotification.timeout = setTimeout(() => {
                wishlistNotification.style.display = 'none';
            }, 3000);
        }
    };

    if (wishlistBtn) {
        const bookId = wishlistBtn.dataset.id;
        if (bookId) {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

            if (wishlist.includes(bookId)) {
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
                wishlistBtn.classList.add('active');
                wishlistBtn.setAttribute('aria-pressed', 'true');
            }

            wishlistBtn.addEventListener('click', function () {
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                const isInWishlist = wishlist.includes(bookId);

                if (isInWishlist) {
                    wishlist = wishlist.filter(id => id !== bookId);
                    this.innerHTML = '<i class="far fa-heart"></i> Wishlist';
                    this.classList.remove('active');
                    this.setAttribute('aria-pressed', 'false');
                    showWishlistNotification(false);
                } else {
                    wishlist.push(bookId);
                    this.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
                    this.classList.add('active');
                    this.setAttribute('aria-pressed', 'true');
                    showWishlistNotification(true);
                }

                localStorage.setItem('wishlist', JSON.stringify(wishlist));

                document.dispatchEvent(new CustomEvent('wishlistUpdated', {
                    detail: { bookId, added: !isInWishlist }
                }));
            });
        }
    }

    // === Review/Comment Functionality ===
    const commentForm = document.getElementById('comment-form');
    const commentText = document.getElementById('comment-text');
    const commentsList = document.getElementById('comments-list');
    const reviewCount = document.getElementById('review-count');
    const noComments = document.getElementById('no-comments');
    const commentError = document.getElementById('comment-error');

    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = commentText.value.trim();

            if (!text || text.length < 3) {
                commentError.textContent = 'Review must be at least 3 characters long.';
                commentError.style.display = 'block';
                return;
            }

            commentError.style.display = 'none';

            try {
                const bookId = document.querySelector('.add-to-cart')?.dataset.bookId;
                const response = await fetch(`/books/${bookId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ text })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    if (noComments) noComments.style.display = 'none';

                    const newComment = document.createElement('div');
                    newComment.classList.add('comment');
                    newComment.innerHTML = `
                        <div class="comment-header">
                            <span class="comment-user">Anonymous</span>
                            <span class="comment-date">${new Date(data.comment.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                        <p class="comment-text">"${data.comment.text}"</p>
                    `;
                    commentsList.appendChild(newComment);

                    if (reviewCount) {
                        const count = parseInt(reviewCount.textContent.match(/\d+/)) || 0;
                        reviewCount.textContent = `(${count + 1})`;
                    }

                    commentText.value = '';
                } else {
                    commentError.textContent = data.error || 'Failed to add review.';
                    commentError.style.display = 'block';
                }
            } catch (error) {
                commentError.textContent = 'Failed to add review.';
                commentError.style.display = 'block';
                console.error('Error adding review:', error);
            }
        });
    }

    // === Keyboard Accessibility ===
    const interactiveButtons = document.querySelectorAll('button, [role="button"], [tabindex="0"]');
    interactiveButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
});