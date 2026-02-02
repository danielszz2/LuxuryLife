document.addEventListener("DOMContentLoaded", () => {
  const API = "http://localhost:8080";
  const token = localStorage.getItem("token");

  const statusEl = document.getElementById("admin-status");
  const logoutBtn = document.getElementById("logout-btn");
  const tbody = document.getElementById("products-tbody");

  // form inputs
  const idEl = document.getElementById("p-id");
  const nameEl = document.getElementById("p-name");
  const priceEl = document.getElementById("p-price");
  const imagePathEl = document.getElementById("p-imagePath");
  const categoryEl = document.getElementById("p-category");
  const subCategoryEl = document.getElementById("p-subCategory");
  const sizesCsvEl = document.getElementById("p-sizesCsv");
  const stockEl = document.getElementById("p-stock");
  const descEl = document.getElementById("p-description");

  const saveBtn = document.getElementById("save-btn");
  const clearBtn = document.getElementById("clear-btn");
  const refreshBtn = document.getElementById("refresh-btn");

  function authHeadersJson() {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  function authHeaderOnly() {
    return { "Authorization": `Bearer ${token}` };
  }

  function toNumber(val, fallback = 0) {
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  }

  function clearForm() {
    idEl.value = "";
    nameEl.value = "";
    priceEl.value = "";
    imagePathEl.value = "";
    categoryEl.value = "";
    subCategoryEl.value = "";
    sizesCsvEl.value = "";
    stockEl.value = "";
    descEl.value = "";
  }

  function fillForm(p) {
    idEl.value = p.id ?? "";
    nameEl.value = p.name ?? "";
    priceEl.value = p.price ?? "";
    imagePathEl.value = p.imagePath ?? "";
    categoryEl.value = p.category ?? "";
    subCategoryEl.value = p.subCategory ?? "";
    sizesCsvEl.value = p.sizesCsv ?? "";
    stockEl.value = p.stock ?? "";
    descEl.value = p.description ?? "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function assertAdminOrRedirect() {
    if (!token) {
      alert("You must be logged in as admin.");
      window.location.href = "index.html"; // change if your login page name differs
      return false;
    }

    try {
      const res = await fetch(`${API}/api/admin/products`, {
        method: "GET",
        headers: authHeaderOnly()
      });

      if (res.status === 403) {
        statusEl.textContent = "Not admin (403)";
        alert("You are not an admin.");
        window.location.href = "index.html";
        return false;
      }

      if (!res.ok) {
        const text = await res.text();
        console.error("Admin check failed:", res.status, text);
        statusEl.textContent = `Error (${res.status})`;
        alert("Admin check failed. Please login again.");
        window.location.href = "index.html";
        return false;
      }

      statusEl.textContent = "Admin ✅";
      return true;
    } catch (e) {
      console.error(e);
      statusEl.textContent = "Backend unreachable";
      alert("Cannot reach backend. Is Spring Boot running on port 8080?");
      return false;
    }
  }

  async function loadProducts() {
    tbody.innerHTML = `<tr><td colspan="6">Loading…</td></tr>`;

    try {
      const res = await fetch(`${API}/api/admin/products`, {
        method: "GET",
        headers: authHeaderOnly()
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Load products failed:", res.status, text);
        tbody.innerHTML = `<tr><td colspan="6">Failed to load products (${res.status}).</td></tr>`;
        return;
      }

      const products = await res.json();

      if (!Array.isArray(products) || products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No products found.</td></tr>`;
        return;
      }

      tbody.innerHTML = "";
      products.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${p.id}</td>
          <td>
            <strong>${p.name}</strong><br/>
            <small>${p.imagePath}</small>
          </td>
          <td>${p.category} / ${p.subCategory}</td>
          <td>$${Number(p.price).toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>
            <div class="action-row">
              <button class="admin-btn" data-edit="${p.id}">Edit</button>
              <button class="admin-btn danger" data-del="${p.id}">Delete</button>
            </div>
          </td>
        `;

        tbody.appendChild(tr);

        tr.querySelector(`[data-edit="${p.id}"]`).addEventListener("click", () => fillForm(p));
        tr.querySelector(`[data-del="${p.id}"]`).addEventListener("click", () => deleteProduct(p.id, p.name));
      });

    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="6">Network error.</td></tr>`;
    }
  }

  async function saveProduct() {
    const id = idEl.value.trim();
    const payload = {
      name: nameEl.value.trim(),
      price: toNumber(priceEl.value.trim(), 0),
      imagePath: imagePathEl.value.trim(),
      category: categoryEl.value.trim(),
      subCategory: subCategoryEl.value.trim(),
      description: descEl.value.trim(),
      sizesCsv: sizesCsvEl.value.trim(),
      stock: toNumber(stockEl.value.trim(), 0)
    };

    if (!payload.name || !payload.imagePath || !payload.category || !payload.subCategory || !payload.description || !payload.sizesCsv) {
      alert("Please fill all fields.");
      return;
    }
    if (payload.price <= 0) { alert("Price must be greater than 0."); return; }
    if (payload.stock < 0) { alert("Stock cannot be negative."); return; }

    const isUpdate = id.length > 0;
    const url = isUpdate ? `${API}/api/admin/products/${id}` : `${API}/api/admin/products`;
    const method = isUpdate ? "PUT" : "POST";

    saveBtn.disabled = true;
    saveBtn.textContent = isUpdate ? "Updating…" : "Creating…";

    try {
      const res = await fetch(url, {
        method,
        headers: authHeadersJson(),
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch {}

      if (!res.ok) {
        console.error("Save failed:", res.status, text);
        alert(data.message || `Save failed (${res.status}).`);
        return;
      }

      alert(isUpdate ? "✅ Product updated!" : "✅ Product created!");
      clearForm();
      await loadProducts();
    } catch (e) {
      console.error(e);
      alert("Network error. Cannot reach backend.");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save (Create/Update)";
    }
  }

  async function deleteProduct(id, name) {
    if (!confirm(`Delete product "${name}" (ID ${id})?`)) return;

    try {
      const res = await fetch(`${API}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: authHeaderOnly()
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete failed:", res.status, text);
        alert(`Delete failed (${res.status}).`);
        return;
      }

      alert("🗑️ Deleted.");
      await loadProducts();
    } catch (e) {
      console.error(e);
      alert("Network error.");
    }
  }

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    alert("Logged out.");
    window.location.href = "index.html";
  });

  clearBtn?.addEventListener("click", clearForm);
  refreshBtn?.addEventListener("click", loadProducts);
  saveBtn?.addEventListener("click", saveProduct);

  (async () => {
    const ok = await assertAdminOrRedirect();
    if (ok) await loadProducts();
  })();
});
