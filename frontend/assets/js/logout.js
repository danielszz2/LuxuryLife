document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById('logout-btn');
  if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = "/Login_Register/index.html";
    });
  }
});
