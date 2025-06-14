

 document.addEventListener('DOMContentLoaded', function() {const showCheckoutBtn = document.getElementById('showCheckoutBtn');
  if (showCheckoutBtn) {
                showCheckoutBtn.addEventListener('click', function() {
                      document.querySelector('.cart-summary').style.display = 'none';
                     document.getElementById('checkoutForm').style.display = 'block';
                });
            } const checkoutFormElement = document.getElementById('checkoutFormElement');
            if (checkoutFormElement) {
                checkoutFormElement.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Here you would typically validate the form and submit via AJAX
                    // For now, we'll just submit normally
                    this.submit();
                });
            }
          });