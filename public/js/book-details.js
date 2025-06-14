document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const removeFromCartBtn = document.getElementById('remove-from-cart-btn');
    const gotoCartBtn = document.getElementById('goto-cart-btn');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    
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





    // Get bookId from data attribute (try addToCart or removeFromCart)
   const bookId = addToCartBtn?.getAttribute('data-id');

const updateCartButtons = async () => {
  if (!bookId) return;

  try {
    const res = await fetch(`/cart/api/status/${bookId}`)
    const inCart = await res.json();
    console.log('Cart status:', inCart);

    if (inCart) {
      addToCartBtn.style.display = 'none';
      removeFromCartBtn.style.display = 'inline-block';
      gotoCartBtn.style.display = 'inline-block';
    } else {
      addToCartBtn.style.display = 'inline-block';
      removeFromCartBtn.style.display = 'none';
      gotoCartBtn.style.display = 'none';
    }
  } catch (err) {
    console.error('Failed to update cart buttons', err);
  }
};

if (addToCartBtn) {
  addToCartBtn.addEventListener('click', async () => {
    console.log(addToCartBtn.dataset.image)
    try {
      const res = await fetch('/cart/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookId,
          // Include any other necessary book data if not populating
          
          price: addToCartBtn.dataset.price,
          imagePath: addToCartBtn.dataset.image
        })
      });
      
      if (res.ok) {
        const cartData = await res.json();
        showNotification('Added to cart!');
        await updateCartButtons();
        
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

if (removeFromCartBtn) {
  removeFromCartBtn.addEventListener('click', async () => {
    try {
        const res = await fetch('/cart/api/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                bookId: removeFromCartBtn.dataset.id,
                // Include any other necessary data for verification
                price: removeFromCartBtn.dataset.price
            })
        });
        
        if (res.ok) {
            const cartData = await res.json();
            showNotification('Removed from cart!');
            await updateCartButtons();
            
            // Dispatch event with full cart data
            document.dispatchEvent(new CustomEvent('cartUpdated', { 
                detail: { 
                    bookId: removeFromCartBtn.dataset.id,
                    cart: cartData  // Pass the updated cart data
                } 
            }));
        } else {
            const err = await res.json();
            showNotification(err.error || 'Error removing from cart');
            throw new Error(err.error || 'Failed to remove from cart');
        }
    } catch (error) {
        console.error('Remove from cart error:', error);
    }
});
}    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const commentData = {
                user: formData.get('user') || 'Anonymous',
                text: formData.get('text')
            };
            
            if (!commentData.text) {
                document.getElementById('comment-error').textContent = 'Please write a review';
                document.getElementById('comment-error').style.display = 'block';
                return;
            }
            
            try {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                
                // Send to backend
                const response = await fetch(`/books/${bookId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `user=${encodeURIComponent(commentData.user)}&text=${encodeURIComponent(commentData.text)}`
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Add new comment to display
                    addNewComment(data.comment);
                    // Update comment count
                    document.getElementById('review-count').textContent = `(${data.commentCount} reviews)`;
                    // Clear form
                    this.reset();
                    // Hide error if visible
                    document.getElementById('comment-error').style.display = 'none';
                } else {
                    document.getElementById('comment-error').textContent = data.error || 'Failed to submit review';
                    document.getElementById('comment-error').style.display = 'block';
                }
            } catch (err) {
                console.error('Error:', err);
                document.getElementById('comment-error').textContent = 'Network error. Please try again.';
                document.getElementById('comment-error').style.display = 'block';
            } finally {
                // Reset button state
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
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

    // Initial setup
    updateCartButtons();
});
// Initialize comment form
function initCommentForm() {
    const commentForm = document.getElementById('comment-form');
    if (!commentForm) return;

    commentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(commentForm);
        const bookId = commentForm.getAttribute('action').split('/')[2];
        const errorElement = document.getElementById('comment-error');
        errorElement.style.display = 'none';
        
        try {
            const response = await fetch(`/books/${bookId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: formData.get('user') || 'Guest',
                    text: formData.get('text')
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add comment');
            }
            
            // Add the new comment to the UI
            addCommentToUI(data.comment);
            
            // Reset the form
            commentForm.reset();
            
            // Update the review count
            updateReviewCount();
            
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
            console.error('Error submitting comment:', error);
        }
    });
}

// Add new comment to the DOM
function addCommentToUI(comment) {
    const commentsList = document.getElementById('comments-list');
    const noComments = document.getElementById('no-comments');
    
    // Hide "no comments" message if it exists
    if (noComments) {
        noComments.style.display = 'none';
    }
    
    // Format the date
    const commentDate = new Date(comment.createdAt);
    const formattedDate = commentDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Create comment element
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <div class="comment-header">
            <span class="comment-user">${comment.userName}</span>
            <span class="comment-date">${formattedDate}</span>
        </div>
        <p class="comment-text">"${comment.text}"</p>
    `;
    
    // Add to the top of the comments list
    commentsList.prepend(commentElement);
}

// Update the review count display
function updateReviewCount() {
    const reviewCountElement = document.getElementById('review-count');
    if (!reviewCountElement) return;
    
    const commentsList = document.getElementById('comments-list');
    const commentCount = commentsList.querySelectorAll('.comment').length;
    
    reviewCountElement.textContent = `(${commentCount} ${commentCount === 1 ? 'review' : 'reviews'})`;
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initCommentForm();
});