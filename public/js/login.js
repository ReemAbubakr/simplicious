document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  // Check if user is already logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (token && user) {
    if (user.isAdmin) {
      window.location.replace('/admin-dashboard');
    } else {
      window.location.replace('/');
    }
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    errorMessage.textContent = "";

    if (!email || !password) {
      errorMessage.style.color = "red";
      errorMessage.textContent = "❌ Please enter both email and password.";
    } else {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Store the token
          localStorage.setItem('token', data.token);
          // Store user data
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect based on user role
          if (data.user.isAdmin) {
            window.location.replace('/admin-dashboard');
          } else {
            window.location.replace('/');
          }
        } else {
          errorMessage.textContent = data.message || 'Login failed';
          errorMessage.style.display = 'block';
        }
      } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
    }
  });
});
