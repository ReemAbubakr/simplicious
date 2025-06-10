const addToCartBtn = document.getElementById('add-to-cart-btn');
const removeFromCartBtn = document.getElementById('remove-from-cart-btn');
const gotoCartBtn = document.getElementById('goto-cart-btn');
const cartNotification = document.getElementById('cart-notification');
const cartCount = document.getElementById('cart-count');

// Show notification function
const showCartNotification = (message) => {
  if (cartNotification) {
    cartNotification.textContent = message;
    cartNotification.style.display = 'block';
    clearTimeout(showCartNotification.timeout);
    showCartNotification.timeout = setTimeout(() => {
      cartNotification.style.display = 'none';
    }, 3000);
  }
};

// Update cart count
const updateCartCount = async () => {
  try {
    const response = await fetch('/api/carts', {
      credentials: 'include'
    });
    if (response.ok) {
      const cart = await response.json();
      cartCount.textContent = cart.data.totalItems || 0;
      cartCount.style.display = (cart.data.totalItems > 0) ? 'block' : 'none';
    }
  } catch (error) {
    console.error('Error updating cart count:', error);
  }
};

// Check if book is in cart
const updateCartButtons = async (bookId) => {
  try {
    const response = await fetch(`/api/carts/check?bookId=${bookId}`, {
      credentials: 'include'
    });
    
    if (response.ok) {
      const { inCart } = await response.json();
      
      if (inCart) {
        addToCartBtn?.style.setProperty('display', 'none');
        removeFromCartBtn?.style.setProperty('display', 'inline-block');
        gotoCartBtn?.style.setProperty('display', 'inline-block');
      } else {
        addToCartBtn?.style.setProperty('display', 'inline-block');
        removeFromCartBtn?.style.setProperty('display', 'none');
        gotoCartBtn?.style.setProperty('display', 'none');
      }
    }
  } catch (error) {
    console.error('Error checking cart status:', error);
  }
};

// Initialize cart UI
const initCart = async (bookId) => {
  await updateCartCount();
  await updateCartButtons(bookId);
};

// Add to cart handler
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', async () => {
    const bookId = addToCartBtn.dataset.id;
    if (!bookId) return;

    try {
      const response = await fetch('/api/carts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId }),
        credentials: 'include'
      });

      if (response.ok) {
        await initCart(bookId);
        showCartNotification('Added to cart!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showCartNotification(error.message || 'Failed to add to cart');
    }
  });
}

// Remove from cart handler
if (removeFromCartBtn) {
  removeFromCartBtn.addEventListener('click', async () => {
    const bookId = removeFromCartBtn.dataset.id;
    if (!bookId) return;

    try {
      const response = await fetch('/api/carts/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId }),
        credentials: 'include'
      });

      if (response.ok) {
        await initCart(bookId);
        showCartNotification('Removed from cart!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      showCartNotification(error.message || 'Failed to remove from cart');
    }
  });
}

// Initialize on page load
const initCartOnLoad = async () => {
  const bookId = addToCartBtn?.dataset.id || removeFromCartBtn?.dataset.id;
  if (bookId) {
    await updateCartCount();
    await updateCartButtons(bookId);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCartOnLoad);
