document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    status.style.display = "block";
    status.textContent = "Thank you! Your message has been sent.";

    form.reset();
  });
});
