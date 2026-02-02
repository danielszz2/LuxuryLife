document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("products-grid");

  if (!grid) {
    alert("❌ products-grid not found in HTML. Check: <div class='products' id='products-grid'></div>");
    return;
  }

  grid.innerHTML = "<p style='padding:20px; color:white;'>Loading products from backend...</p>";

  try {
    const res = await fetch("http://localhost:8080/api/products");

    const text = await res.text();
    console.log("RAW /api/products response:", text);

    if (!res.ok) {
      grid.innerHTML = `<p style="padding:20px; color:red;">❌ Backend error: ${res.status}</p>`;
      return;
    }

    const products = JSON.parse(text);

    if (!Array.isArray(products)) {
      grid.innerHTML = `<p style="padding:20px; color:red;">❌ Response is not an array.</p>`;
      return;
    }

    if (products.length === 0) {
      grid.innerHTML = `<p style="padding:20px; color:yellow;">⚠️ No products found in DB.</p>`;
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="card" data-product-id="${p.id}">
        <img src="${p.imagePath}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${Number(p.price).toFixed(2)}</p>
        <button>Add to Cart</button>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="padding:20px; color:red;">❌ Network error. Is backend running on port 8080?</p>`;
  }
});
