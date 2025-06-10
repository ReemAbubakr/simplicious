document.getElementById('paymentMethod')?.addEventListener('change', function () {
  const cardDetails = document.getElementById('cardDetails');
  const cardInputs = cardDetails.querySelectorAll('input');
  if (this.value === 'card') {
    cardDetails.style.display = 'block';
    cardInputs.forEach(input => input.required = true);
  } else {
    cardDetails.style.display = 'none';
    cardInputs.forEach(input => input.required = false);
  }
});

document.getElementById('couponForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const couponCode = document.getElementById('couponCode');
  const messageDiv = document.getElementById('couponMessage');
  messageDiv.textContent = '';

  if (!couponCode.value.trim()) return;

  couponCode.disabled = true;
  try {
    const res = await fetch('/cart/apply-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponCode: couponCode.value.trim() })
    });
    const data = await res.json();
    if (res.ok) {
      location.reload();
    } else {
      messageDiv.textContent = data.message || 'Invalid coupon';
    }
  } catch (err) {
    console.error(err);
    messageDiv.textContent = 'Something went wrong applying the coupon';
  } finally {
    couponCode.disabled = false;
  }
});

document.getElementById('removeCoupon')?.addEventListener('click', async function () {
  try {
    const res = await fetch('/cart/remove-coupon', { method: 'POST' });
    if (res.ok) location.reload();
  } catch (err) {
    console.error(err);
    alert('Failed to remove coupon');
  }
});

document.getElementById('checkoutForm')?.addEventListener('submit', function () {
  const shippingAddress = {
    firstName: document.getElementById('firstName')?.value.trim(),
    lastName: document.getElementById('lastName')?.value.trim(),
    email: document.getElementById('email')?.value.trim(),
    phone: document.getElementById('phone')?.value.trim(),
    address: document.getElementById('address')?.value.trim(),
    city: document.getElementById('city')?.value.trim(),
    state: document.getElementById('state')?.value.trim(),
    postalCode: document.getElementById('postalCode')?.value.trim(),
    country: document.getElementById('country')?.value.trim()
  };

  const form = this;
  let hiddenInput = document.querySelector('input[name="shippingAddress"]');
  if (!hiddenInput) {
    hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'shippingAddress';
    form.appendChild(hiddenInput);
  }
  hiddenInput.value = JSON.stringify(shippingAddress);

  if (!window.checkoutUser) {
    const fullName = shippingAddress.firstName + ' ' + shippingAddress.lastName;
    let nameInput = document.querySelector('input[name="name"]');
    if (!nameInput) {
      nameInput = document.createElement('input');
      nameInput.type = 'hidden';
      nameInput.name = 'name';
      form.appendChild(nameInput);
    }
    nameInput.value = fullName;
  }

  this.querySelector('button[type="submit"]')?.setAttribute('disabled', true);
});
