document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    errorMessage.textContent = "";

    if (!username || !password) {
      errorMessage.style.color = "red";
      errorMessage.textContent = "❌ Please enter both username and password.";
    } else if (password === "admin1") {
      errorMessage.style.color = "green";
      errorMessage.textContent = `✅ Welcome, ${username}! Redirecting to admin dashboard...`;
      localStorage.setItem("username", username);
      setTimeout(() => {
        window.location.href = "adminMain.html";
      }, 1500);
    } else {
      errorMessage.style.color = "green";
      errorMessage.textContent = `✅ Welcome, ${username}! Redirecting...`;
      localStorage.setItem("username", username);
      setTimeout(() => {
        window.location.href = "Home.html";
      }, 1500);
    }
  });
});
