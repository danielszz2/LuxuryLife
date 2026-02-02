document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("add-to-cart");
  if (!addToCartBtn) return;

  addToCartBtn.addEventListener("click", () => {
    const product = {
      name: document.querySelector(".product-info h1").textContent.trim(),
      price: parseFloat(
        document.querySelector(".product-info .price").textContent.replace("$", "")
      ),
      image: normalizeImagePath(
        document.querySelector(".product-image img").getAttribute("src")
      ),
      size: document.getElementById("size")?.value || "",
      quantity: Number(document.getElementById("quantity")?.value || 1)
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    updateMiniCart();

    alert(`${product.quantity} x ${product.name} added to cart`);
  });
});
function normalizeImagePath(path) {
  if (path.startsWith("http")) return path;
  if (path.startsWith("../")) return path.replace("../", "/");
  if (!path.startsWith("/")) return "/" + path;
  return path;
}
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = cart.length;
}
 
