document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const myOrdersBtn = document.getElementById("my-orders-btn");
  const adminBtn = document.getElementById("admin-btn");

  if (!token) {
    if (myOrdersBtn) myOrdersBtn.style.display = "none";
    if (adminBtn) adminBtn.style.display = "none";
    return;
  }

  if (myOrdersBtn) {
    myOrdersBtn.style.display = "inline-flex";
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const roles =
      payload.roles ||
      payload.role ||
      payload.authorities ||
      [];

    const isAdmin =
      roles === "ADMIN" ||
      roles === "ROLE_ADMIN" ||
      (Array.isArray(roles) && roles.includes("ROLE_ADMIN"));

    if (adminBtn) {
      adminBtn.style.display = isAdmin ? "inline-flex" : "none";
    }

  } catch (err) {
    console.error("Invalid token:", err);
    if (adminBtn) adminBtn.style.display = "none";
  }
});
