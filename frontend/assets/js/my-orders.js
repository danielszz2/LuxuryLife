document.addEventListener("DOMContentLoaded", async () => {
  const el = document.getElementById("orders-list");
  const token = localStorage.getItem("token");

  if (!token) {
    el.innerHTML = `<p>You are not logged in. Please login first.</p>`;
    return;
  }

  try {
    const res = await fetch("https://luxurylife.onrender.com/api/orders/my", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      el.innerHTML = `<p>Failed to load orders (status ${res.status}).</p>`;
      return;
    }

    const orders = await res.json();

    if (!orders.length) {
      el.innerHTML = `<p>No orders yet.</p>`;
      return;
    }

    el.innerHTML = orders.map(o => `
      <div style="border:1px solid #333; border-radius:12px; padding:16px; margin-bottom:12px;">
        <div><strong>Order #${o.id}</strong></div>
        <div>Status: ${o.status}</div>
        <div>Total: $${o.total}</div>
        <div>Date: ${o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}</div>
        <hr style="opacity:.3; margin:12px 0;">
        <div>
          ${(o.items || []).map(i => `
            <div style="display:flex; justify-content:space-between; gap:10px;">
              <span>${i.product?.name || "Product"} ${i.size ? `(${i.size})` : ""}</span>
              <span>${i.quantity} × $${i.unitPrice}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    el.innerHTML = `<p>Network error: ${err.message}</p>`;
  }
});
