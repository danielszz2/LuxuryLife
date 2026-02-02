document.addEventListener("DOMContentLoaded", () => {
  const checkoutItemsEl = document.getElementById("checkout-items");
  const checkoutTotalEl = document.getElementById("checkout-total");
  const placeOrderBtn = document.getElementById("place-order-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!checkoutItemsEl || !checkoutTotalEl || !placeOrderBtn) return;

  // ---------------------------
  // Render checkout summary
  // ---------------------------
  if (cart.length === 0) {
    checkoutItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    placeOrderBtn.disabled = true;
    return;
  }

  let total = 0;
  checkoutItemsEl.innerHTML = "";

  cart.forEach(item => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;

    const itemTotal = price * qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "checkout-item";
    div.innerHTML = `
      <img src="${item.image}">
      <span>${item.name} ${item.size ? "(" + item.size + ")" : ""}</span>
      <span>${qty} × $${price.toFixed(2)}</span>
      <strong>$${itemTotal.toFixed(2)}</strong>
    `;
    checkoutItemsEl.appendChild(div);
  });

  checkoutTotalEl.textContent = `Total: $${total.toFixed(2)}`;

  // ---------------------------
  // Place order (calls backend) - Step F requires token
  // ---------------------------
  placeOrderBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to place an order.");
      return;
    }

    // refresh cart in case it changed
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // require productId
    const missing = cart.find(i => i.productId == null || Number.isNaN(Number(i.productId)));
    if (missing) {
      alert(
        "Some items in your cart don't have productId.\n\n" +
        "Fix:\n" +
        "1) Add productId to cards (data-product-id) OR product page body (data-product-id)\n" +
        "2) Add to cart again\n"
      );
      return;
    }

    // Read delivery fields (make sure your checkout.html has these IDs)
    const firstName = document.getElementById("firstName")?.value?.trim() || "";
    const lastName  = document.getElementById("lastName")?.value?.trim() || "";
    const phone     = document.getElementById("phone")?.value?.trim() || "";
    const email     = document.getElementById("email")?.value?.trim() || "";
    const address   = document.getElementById("address")?.value?.trim() || "";
    const city      = document.getElementById("city")?.value?.trim() || "";
    const zip       = document.getElementById("zip")?.value?.trim() || "";
    const country   = document.getElementById("country")?.value?.trim() || "";

    if (!firstName || !lastName || !email || !address || !city || !zip || !country) {
      alert("Please fill in all delivery details (name, email, address, city, zip, country).");
      return;
    }

    const payload = {
      customer: { firstName, lastName, phone, email, address, city, zip, country },
      items: cart.map(i => ({
        productId: Number(i.productId),
        quantity: Number(i.quantity) || 1,
        size: i.size || "M"
      }))
    };

    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Placing order...";

    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Backend returned non-JSON:", text);
      }

      console.log("ORDER RESPONSE:", data);

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          alert("Session expired or not authorized. Please login again.");
        } else {
          alert(data.message || `Order failed (status ${res.status}). Check console.`);
        }
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = "Place Order";
        return;
      }

      alert(`🎉 Order placed successfully!\nOrder ID: ${data.id}\nTotal: $${data.total}`);

      localStorage.removeItem("cart");
      window.location.href = "index.html";
    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Fetch error: " + err.message);
      placeOrderBtn.disabled = false;
      placeOrderBtn.textContent = "Place Order";
    }
  });
});

