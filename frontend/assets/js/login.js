document.addEventListener("DOMContentLoaded", () => {

  // -----------------------
  // LOGIN
  // -----------------------
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email")?.value?.trim();
      const password = document.getElementById("login-password")?.value?.trim();

      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }

      const res = await fetch("https://luxurylife.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);

      alert("Logged in!");
      window.location.href = "../index.html";
    });
  }

  // -----------------------
  // REGISTER
  // -----------------------
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("register-email")?.value?.trim();
      const password = document.getElementById("register-password")?.value?.trim();

      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }

      const res = await fetch("https://luxurylife.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Register failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);

      alert("Registered + logged in!");
      window.location.href = "../index.html";
    });
  }
});
