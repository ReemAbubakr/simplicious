document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const fullName = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmpassword").value.trim();
  
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
  
      if (!fullName || !email || !username || !password || !confirmPassword) {
        message.textContent = "❌ Please fill in all fields.";
      } else if (password !== confirmPassword) {
        message.textContent = "❌ Passwords do not match.";
      } else if (password.length < 8) {
    message.textContent = "❌ Password must be at least 8 characters";
      } else if (restrictedChars.test(username)) {
    message.textContent = "❌ Username cannot contain: < > ' \" \\ /";
      } else {
        message.style.color = "green";
        message.textContent = "✅ Account created successfully!";
      }
    });
  });
  