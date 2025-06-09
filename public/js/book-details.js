document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const removeFromCartBtn = document.getElementById('remove-from-cart-btn');
    const gotoCartBtn = document.getElementById('goto-cart-btn');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');
    const noCommentsDiv = document.getElementById('no-comments');
    const reviewCountSpan = document.getElementById('review-count');
    
    // Create and insert notification container
    let notification = document.createElement('div');
    notification.id = 'cart-notification';
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.right = '10px';
    notification.style.padding = '10px 20px';
    notification.style.backgroundColor = '#333';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.display = 'none';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);

    // Show notification helper
    const showNotification = (message) => {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    };

    // Get bookId from data attribute (try addToCart or removeFromCart)
    const bookId = addToCartBtn?.getAttribute('data-id') || removeFromCartBtn?.getAttribute('data-id');

    // Update cart buttons visibility based on localStorage cart contents
    const updateCartButtons = () => {
        if (!bookId) return;
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            cart = [];
        }

        if (cart.includes(bookId)) {
            addToCartBtn.style.display = 'none';
            removeFromCartBtn.style.display = 'inline-block';
            gotoCartBtn.style.display = 'inline-block';
        } else {
            addToCartBtn.style.display = 'inline-block';
            removeFromCartBtn.style.display = 'none';
            gotoCartBtn.style.display = 'none';
        }
    };

    // Add to cart handler
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (!bookId) return;

            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem('cart')) || [];
            } catch {
                cart = [];
            }
            if (!cart.includes(bookId)) {
                cart.push(bookId);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartButtons();
                showNotification('Added to cart!');
                document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { bookId } }));
            }
        });
    }

    // Remove from cart handler
    if (removeFromCartBtn) {
        removeFromCartBtn.addEventListener('click', () => {
            if (!bookId) return;

            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem('cart')) || [];
            } catch {
                cart = [];
            }
            if (cart.includes(bookId)) {
                cart = cart.filter(id => id !== bookId);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartButtons();
                showNotification('Removed from cart!');
                document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { bookId } }));
            }
        });
    }

    // Wishlist toggle button handler
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            // Toggle aria-pressed attribute and icon style
            const pressed = wishlistBtn.getAttribute('aria-pressed') === 'true';
            wishlistBtn.setAttribute('aria-pressed', !pressed);

            const icon = wishlistBtn.querySelector('i');
            if (!pressed) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                wishlistBtn.setAttribute('aria-label', 'Remove from wishlist');
                showNotification('Added to wishlist!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                wishlistBtn.setAttribute('aria-label', 'Add to wishlist');
                showNotification('Removed from wishlist!');
            }
        });
    }

    // Handle comment form submission with AJAX
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userInput = commentForm.querySelector('input[name="user"]');
            const textInput = commentForm.querySelector('textarea[name="text"]');
            const errorDiv = document.getElementById('comment-error');
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';

            const user = userInput.value.trim() || 'Anonymous';
            const text = textInput.value.trim();

            if (!text) {
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'Review text cannot be empty.';
                return;
            }

            try {
                const response = await fetch(commentForm.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ user, text }),
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.statusText}`);
                }

                const newComment = await response.json();

                // Add new comment to the comments list
                const commentHTML = `
                    <div class="comment">
                        <div class="comment-header">
                            <span class="comment-user">${escapeHTML(newComment.user || 'Anonymous')}</span>
                            <span class="comment-date">${new Date(newComment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <p class="comment-text">"${escapeHTML(newComment.text)}"</p>
                    </div>
                `;

                if (noCommentsDiv) noCommentsDiv.style.display = 'none';
                commentsList.insertAdjacentHTML('afterbegin', commentHTML);

                // Update review count
                if (reviewCountSpan) {
                    let currentCount = parseInt(reviewCountSpan.textContent.replace(/\D/g, '')) || 0;
                    reviewCountSpan.textContent = `(${currentCount + 1})`;
                }

                // Clear inputs
                userInput.value = '';
                textInput.value = '';

                showNotification('Review submitted successfully!');
            } catch (err) {
                errorDiv.style.display = 'block';
                errorDiv.textContent = `Failed to submit review: ${err.message}`;
            }
        });
    }

    // Escape HTML utility function to avoid XSS in injected HTML
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, (match) => {
            const escapeMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return escapeMap[match];
        });
    }

    // Initial setup
    updateCartButtons();
});
