document.addEventListener("DOMContentLoaded", () => {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function generateId(productId, name, size) {
    const base = (productId != null ? String(productId) : name);
    return (base + "-" + (size || ""))
      .replace(/["']/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();
  }

  cart = cart.map((item) => {
    const productId =
      item.productId != null
        ? Number(item.productId)
        : (item.productID != null ? Number(item.productID) : null);

    const name = item.name;
    const size = item.size || "";
    const id = generateId(productId, name, size);

    return {
      id,
      productId,
      name,
      price: Number(item.price),
      image: item.image || item.img,
      quantity: item.quantity || 1,
      size
    };
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  const cartCountEl = document.getElementById("cart-count");
  const cartContainer = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const dropdownItems = document.getElementById("dropdown-items");
  const dropdownTotal = document.getElementById("dropdown-total");

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartCount() {
    if (cartCountEl) cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function addProductToCart(product) {
    const productId = product.productId != null ? Number(product.productId) : null;

    product.id = generateId(productId, product.name, product.size);
    product.productId = productId;

    const existing = cart.find(p => p.id === product.id);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      cart.push(product);
    }

    saveCart();
    updateCartCount();
    displayMiniCart();
    displayCartPage();
  }

  function displayCartPage() {
    if (!cartContainer || !cartTotalEl) return;

    cartContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "space-between";
      div.style.gap = "15px";

      div.innerHTML = `
        <img src="${item.image}" width="80" alt="${item.name}">
        <span style="flex:1;">
          ${item.name}${item.size ? " (" + item.size + ")" : ""}
          ${item.productId != null ? `<small style="opacity:.7;"> [ID:${item.productId}]</small>` : ""}
        </span>
        <span>$${item.price.toFixed(2)} × ${item.quantity}</span>
        <span>$${itemTotal.toFixed(2)}</span>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      `;

      cartContainer.appendChild(div);
    });

    cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;

    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = e.target.dataset.id;
        removeFromCart(id);
      });
    });
  }

  function displayMiniCart() {
    if (!dropdownItems || !dropdownTotal) return;

    dropdownItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const div = document.createElement("div");
      div.className = "dropdown-item";
      div.innerHTML = `
        <img src="${item.image}" width="40" alt="${item.name}">
        <span>${item.name}${item.size ? " (" + item.size + ")" : ""} × ${item.quantity}</span>
        <span>$${itemTotal.toFixed(2)}</span>
      `;

      dropdownItems.appendChild(div);
    });

    dropdownTotal.textContent = `Total: $${total.toFixed(2)}`;
  }

  window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    displayMiniCart();
    displayCartPage();
  };


document.addEventListener("click", (e) => {
  const btn = e.target.closest(".products .card button, .products .card .add-to-cart-btn");
  if (!btn) return;

  const card = btn.closest(".card");
  if (!card) return;

  const productId = card.dataset.productId ? Number(card.dataset.productId) : null;

  const name = card.querySelector("h3")?.textContent?.trim() || "";
  const priceText = card.querySelector("p")?.textContent || "$0";
  const price = parseFloat(priceText.replace("$", ""));
  const image = card.querySelector("img")?.src || "";
  const size = "";

  addProductToCart({
    productId,
    name,
    price,
    image,
    quantity: 1,
    size
  });

  alert(`${name} added to cart!`);
});

  const addToCartBtn = document.getElementById("add-to-cart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const name = document.querySelector(".product-info h1").textContent.trim();
      const price = parseFloat(document.querySelector(".price").textContent.replace("$",""));
      const image = document.querySelector(".product-image img").src;
      const quantity = parseInt(document.getElementById("quantity").value);
      const size = document.getElementById("size")?.value || "";

      const productIdRaw = document.body?.dataset?.productId;
      const productId = productIdRaw ? Number(productIdRaw) : null;

      if (productId == null || Number.isNaN(productId)) {
        console.warn("Missing data-product-id on <body>. Example: <body data-product-id=\"13\">");
      }

      addProductToCart({
        productId,
        name,
        price,
        image,
        quantity,
        size
      });

      alert(`${quantity} × ${name} (${size || "N/A"}) added to cart`);
    });
  }

  const cartContainerEl = document.getElementById("cart-container");
  const cartDropdown = document.getElementById("cart-dropdown");

  if (cartContainerEl && cartDropdown) {
    let timeout;
    cartContainerEl.addEventListener("mouseenter", () => {
      clearTimeout(timeout);
      cartDropdown.style.display = "block";
      displayMiniCart();
    });
    cartContainerEl.addEventListener("mouseleave", () => {
      timeout = setTimeout(() => {
        cartDropdown.style.display = "none";
      }, 300);
    });
  }

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "/cart.html";
    });
  }

  updateCartCount();
  displayMiniCart();
  displayCartPage();

});

document.addEventListener("click", (e) => {
  if (e.target.id === "cart-checkout-btn") {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    window.location.href = "checkout.html";
  }
});





