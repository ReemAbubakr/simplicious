
document.addEventListener('DOMContentLoaded', function () {
  const showCheckoutBtn = document.getElementById('showCheckoutBtn');
  const backToCartBtn = document.getElementById('backToCartBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const cartItems = document.getElementById('cartItems');
  const cartSummary = document.querySelector('.cart-summary');

  if (showCheckoutBtn) {
    showCheckoutBtn.addEventListener('click', function () {
      if (checkoutForm) checkoutForm.style.display = 'block';
      if (cartItems) cartItems.style.display = 'none';
      if (cartSummary) cartSummary.style.display = 'none';
    });
  }

  if (backToCartBtn) {
    backToCartBtn.addEventListener('click', function () {
      if (checkoutForm) checkoutForm.style.display = 'none';
      if (cartItems) cartItems.style.display = 'block';
      if (cartSummary) cartSummary.style.display = 'block';
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.remove-from-cart-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const bookId = form.dataset.id;
      const price = form.dataset.price;

      try {
        const res = await fetch('/cart/api/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            bookId,
            price
          })
        });

        if (res.ok) {
          const cartData = await res.json();

          // Dispatch event with full cart data
          document.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { 
              bookId,
              cart: cartData
            } 
          }));

          // Optionally, remove the item from the DOM:
          // form.closest('.cart-item').remove();

        } else {
          const err = await res.json();
          throw new Error(err.error || 'Failed to remove from cart');
        }
      } catch (error) {
        console.error('Remove from cart error:', error);
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const clearCartForm = document.getElementById('clearCartForm');
  const cartItems = document.getElementById('cartItems');
  const cartSummary = document.querySelector('.cart-summary');
  const emptyCart = document.getElementById('emptyCart');

  if (clearCartForm) {
    clearCartForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(clearCartForm.action, { method: 'POST' });
        if (res.ok) {
          // Hide cart items & summary, show empty cart message
          if (cartItems) cartItems.style.display = 'none';
          if (cartSummary) cartSummary.style.display = 'none';
          if (emptyCart) emptyCart.style.display = '';
        } else {
          alert('Failed to clear cart!');
        }
      } catch (err) {
        alert('Error clearing cart!');
        console.error(err);
      }
    });
  }
});