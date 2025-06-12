document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const passwordConfirm = document.getElementById("passwordConfirm").value.trim();
      const errorMessage = document.getElementById('error-message');
  
      // Create or find message container
      let message = document.getElementById("signup-message");
      if (!message) {
        message = document.createElement("div");
        message.id = "signup-message";
        message.style.marginTop = "10px";
        form.appendChild(message);
      }
      const restrictedChars = /[<>'"\/\\]/; 
  
      // Reset message
      message.textContent = "";
      message.style.color = "red";
  
      if (!username || !email || !password || !passwordConfirm) {
        message.textContent = "❌ Please fill in all fields.";
      } else if (password !== passwordConfirm) {
        message.textContent = "❌ Passwords do not match.";
      } else if (password.length < 8) {
    message.textContent = "❌ Password must be at least 8 characters";
      } else if (restrictedChars.test(username)) {
    message.textContent = "❌ Username cannot contain: < > ' \" \\ /";
      } else {
        message.style.color = "green";
        message.textContent = "✅ Account created successfully!";
  
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, passwordConfirm })
          });
          
          const data = await response.json();
          
          if (response.ok) {
            // Store the token
            localStorage.setItem('token', data.token);
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redirect to home page
            window.location.href = '/';
          } else {
            errorMessage.textContent = data.message || 'Signup failed';
          }
        } catch (err) {
          errorMessage.textContent = 'An error occurred. Please try again.';
          console.error('Signup error:', err);
        }
      }
    });
  });
  