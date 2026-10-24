const $ = (id) => document.getElementById(id);
const money = (value) => new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY"
}).format(Number(value || 0));
const dateText = (value) =>
  value ? new Date(value).toLocaleString("tr-TR") : "—";

let productsCache = [];
let allOrders = [];
let currentPage = 1;
const PAGE_SIZE = 10;

function setMessage(id, text, type = "") {
  const element = $(id);
  element.textContent = text || "";
  element.className = "message" + (type ? ` ${type}` : "");
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (response.status === 401 && url !== "/api/admin/login") {
    showLogin("Oturum süren dolmuş olabilir. Yeniden giriş yap.");
    throw new Error(data.message || "Yönetici girişi gerekli.");
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "İşlem başarısız.");
  }

  return data;
}

function showLogin(message = "") {
  $("loginView").hidden = false;
  $("dashboardView").hidden = true;
  setMessage("loginMessage", message, message ? "error" : "");
}

function showDashboard() {
  $("loginView").hidden = true;
  $("dashboardView").hidden = false;
}

$("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("loginMessage", "Giriş kontrol ediliyor…");

  const button = $("loginForm").querySelector('button[type="submit"]');
  button.disabled = true;

  try {
    await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({
        username: $("username").value.trim(),
        password: $("password").value
      })
    });

    $("password").value = "";
    showDashboard();
    await loadAll();
  } catch (error) {
    setMessage("loginMessage", error.message, "error");
  } finally {
    button.disabled = false;
  }
});

$("logoutBtn").addEventListener("click", async () => {
  try {
    await api("/api/admin/logout", { method: "POST" });
  } catch {}

  showLogin("Çıkış yapıldı.");
});

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    $("productsSection").hidden =
      button.dataset.tab !== "productsSection";
    $("ordersSection").hidden =
      button.dataset.tab !== "ordersSection";
  });
});

async function loadAll() {
  await Promise.all([loadStats(), loadProducts(), loadOrders()]);
}

async function loadStats() {
  const data = await api("/api/admin/stats");
  const stats = data.stats;

  $("statProducts").textContent = stats.product_count;
  $("statOrders").textContent = stats.order_count;
  $("statPending").textContent = stats.pending_count;
  $("statSuccess").textContent = stats.test_success_count;
  $("statFailed").textContent = stats.test_failed_count;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// Ürün yönetimi
async function loadProducts() {
  const data = await api("/api/admin/products");
  productsCache = data.products;

  const target = $("productsTable");

  if (!data.products.length) {
    target.innerHTML = '<p class="muted">Henüz ürün yok.</p>';
    return;
  }

  target.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Ürün</th>
          <th>Kategori</th>
          <th>Fiyat</th>
          <th>Stok</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        ${data.products.map((p) => `
          <tr>
            <td>${p.id}</td>
            <td>
              <strong>${escapeHtml(p.name)}</strong>
              <div class="muted">${escapeHtml(p.description)}</div>
              <div class="muted">${escapeHtml(p.image)}</div>
            </td>
            <td>${escapeHtml(p.category)}</td>
            <td>${money(p.price)}</td>
            <td><strong>${Number(p.stock) || 0}</strong> adet</td>
            <td>
              <div class="actions">
                <button class="secondary" data-edit="${p.id}" type="button">
                  Düzenle
                </button>
                <button class="danger" data-delete="${p.id}" type="button">
                  Sil
                </button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;

  target.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      editProduct(Number(button.dataset.edit));
    });
  });

  target.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteProduct(Number(button.dataset.delete));
    });
  });
}

function editProduct(id) {
  const p = productsCache.find((item) => item.id === id);
  if (!p) return;

  $("productId").value = p.id;
  $("productName").value = p.name;
  $("productCategory").value = p.category;
  $("productPrice").value = Number(p.price);
  $("productImage").value = p.image;
  $("productDescription").value = p.description;
  $("productStock").value = Number(p.stock) || 0;
  $("productFormTitle").textContent = "Ürünü düzenle";
  $("productForm").hidden = false;

  $("productForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function resetProductForm() {
  $("productForm").reset();
  $("productId").value = "";
  $("productFormTitle").textContent = "Yeni ürün";
  $("productForm").hidden = true;
}

$("newProductBtn").addEventListener("click", () => {
  resetProductForm();
  $("productForm").hidden = false;
  $("productFormTitle").textContent = "Yeni ürün";

  $("productForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

$("cancelProductBtn").addEventListener("click", resetProductForm);

$("productForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = $("productId").value;
  const product = {
    name: $("productName").value.trim(),
    category: $("productCategory").value.trim(),
    price: Number($("productPrice").value),
    image: $("productImage").value.trim(),
    description: $("productDescription").value.trim(),
    stock: Number($("productStock").value)
  };

  try {
    await api(
      id ? `/api/admin/products/${id}` : "/api/admin/products",
      {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(product)
      }
    );

    setMessage(
      "productMessage",
      id ? "Ürün güncellendi." : "Ürün eklendi.",
      "success"
    );

    resetProductForm();
    await Promise.all([loadProducts(), loadStats()]);
  } catch (error) {
    setMessage("productMessage", error.message, "error");
  }
});

async function deleteProduct(id) {
  const p = productsCache.find((item) => item.id === id);
  if (!p || !confirm(`"${p.name}" ürününü silmek istiyor musun?`)) {
    return;
  }

  try {
    await api(`/api/admin/products/${id}`, { method: "DELETE" });
    setMessage("productMessage", "Ürün silindi.", "success");
    await Promise.all([loadProducts(), loadStats()]);
  } catch (error) {
    setMessage("productMessage", error.message, "error");
  }
}

// Sipariş yönetimi
async function loadOrders() {
  const data = await api("/api/admin/orders");
  allOrders = data.orders;
  currentPage = 1;
  renderOrders();
}

function filteredOrders() {
  const query = $("orderSearch").value
    .trim()
    .toLocaleLowerCase("tr-TR");

  const status = $("statusFilter").value;

  const from = $("dateFrom").value
    ? new Date(`${$("dateFrom").value}T00:00:00`)
    : null;

  const to = $("dateTo").value
    ? new Date(`${$("dateTo").value}T23:59:59.999`)
    : null;

  return allOrders.filter((order) => {
    const itemsText = (order.items || [])
      .map((item) => item.name)
      .join(" ");

    const haystack = [
      order.id,
      order.customer_name,
      order.email,
      order.phone,
      order.address,
      order.status,
      order.shipping_company,
      order.tracking_number,
      itemsText
    ].join(" ").toLocaleLowerCase("tr-TR");

    const date = new Date(order.created_at);

    return (!query || haystack.includes(query)) &&
      (!status || order.status === status) &&
      (!from || date >= from) &&
      (!to || date <= to);
  });
}

function statusClass(status) {
  if (status === "Test başarılı" || status === "Tamamlandı") {
    return "good";
  }

  if (status === "Test başarısız" || status === "İptal edildi") {
    return "bad";
  }

  if (status === "Ödeme bekleniyor") {
    return "wait";
  }

  return "";
}

function renderOrders() {
  const rows = filteredOrders();
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

  currentPage = Math.min(currentPage, pages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = rows.slice(start, start + PAGE_SIZE);

  $("orderCount").textContent = `${rows.length} sipariş bulundu`;
  $("pageInfo").textContent = `Sayfa ${currentPage} / ${pages}`;
  $("prevPageBtn").disabled = currentPage <= 1;
  $("nextPageBtn").disabled = currentPage >= pages;

  const target = $("ordersTable");

  if (!visible.length) {
    target.innerHTML =
      '<p class="muted">Bu filtrelerle eşleşen sipariş bulunamadı.</p>';
    return;
  }

  const statuses = [
    "Ödeme bekleniyor",
    "Test başarılı",
    "Test başarısız",
    "Hazırlanıyor",
    "Kargoya verildi",
    "Teslim edildi",
    "Tamamlandı",
    "İptal edildi"
  ];

  target.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Sipariş</th>
          <th>Müşteri</th>
          <th>Ürünler</th>
          <th>Tutar</th>
          <th>Durum</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        ${visible.map((o) => {
          const isTest =
            o.status === "Test başarılı" ||
            o.status === "Test başarısız";

          const options = statuses.map((s) => `
            <option value="${s}" ${s === o.status ? "selected" : ""}>
              ${s}
            </option>
          `).join("");

          const itemSummary = (o.items || [])
            .map((i) => `${escapeHtml(i.name)} × ${i.quantity}`)
            .join("<br>") || "Ürün bilgisi yok";

          return `
            <tr>
              <td>
                <strong>#${o.id}</strong>
                <div class="muted">${dateText(o.created_at)}</div>
              </td>
              <td>
                ${escapeHtml(o.customer_name)}
                <div class="muted">${escapeHtml(o.email)}</div>
              </td>
              <td class="order-items">${itemSummary}</td>
              <td><strong>${money(o.total)}</strong></td>
              <td>
                <span class="status-pill ${statusClass(o.status)}">
                  ${escapeHtml(o.status)}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button class="secondary" data-detail="${o.id}" type="button">
                    Detay
                  </button>
                  ${isTest
                    ? '<span class="muted">Test sonucu korunuyor</span>'
                    : `
                      <select class="status-select"
                        aria-label="Sipariş ${o.id} durumu"
                        data-order-status="${o.id}">
                        ${options}
                      </select>
                      <button class="secondary"
                        data-save-status="${o.id}" type="button">
                        Kaydet
                      </button>
                    `
                  }
                </div>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>`;

  target.querySelectorAll("[data-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      showOrderDetails(Number(button.dataset.detail));
    });
  });

  target.querySelectorAll("[data-save-status]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.saveStatus;
      const select = target.querySelector(
        `[data-order-status="${id}"]`
      );

      button.disabled = true;

      try {
        await api(`/api/admin/orders/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: select.value })
        });

        setMessage(
          "ordersMessage",
          `#${id} siparişinin durumu güncellendi.`,
          "success"
        );

        await Promise.all([loadOrders(), loadStats()]);
      } catch (error) {
        setMessage("ordersMessage", error.message, "error");
      } finally {
        button.disabled = false;
      }
    });
  });
}

// Sipariş detayı ve kargo bilgileri
function showOrderDetails(id) {
  const o = allOrders.find((order) => Number(order.id) === id);
  if (!o) return;

  const trackingUrl = String(o.tracking_url || "").trim();
  const safeTrackingUrl = /^https?:\/\//i.test(trackingUrl)
    ? trackingUrl
    : "";

  $("dialogTitle").textContent = `Sipariş #${o.id}`;

  $("orderDetails").innerHTML = `
    <div class="detail-grid">
      <div class="detail-card">
        <span>Müşteri</span>
        <strong>${escapeHtml(o.customer_name)}</strong>
      </div>
      <div class="detail-card">
        <span>Tarih</span>
        <strong>${dateText(o.created_at)}</strong>
      </div>
      <div class="detail-card">
        <span>E-posta</span>
        <strong>${escapeHtml(o.email)}</strong>
      </div>
      <div class="detail-card">
        <span>Telefon</span>
        <strong>${escapeHtml(o.phone)}</strong>
      </div>
      <div class="detail-card">
        <span>Adres</span>
        <strong>${escapeHtml(o.address)}</strong>
      </div>
      <div class="detail-card">
        <span>Durum</span>
        <strong>${escapeHtml(o.status)}</strong>
      </div>
    </div>

    <table class="detail-items">
      <thead>
        <tr>
          <th>Ürün</th>
          <th>Adet</th>
          <th>Birim fiyat</th>
          <th>Ara toplam</th>
        </tr>
      </thead>
      <tbody>
        ${(o.items || []).map((i) => `
          <tr>
            <td>${escapeHtml(i.name)}</td>
            <td>${i.quantity}</td>
            <td>${money(i.unit_price)}</td>
            <td>${money(Number(i.unit_price) * Number(i.quantity))}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="detail-total">
      <span>Sipariş toplamı</span>
      <span>${money(o.total)}</span>
    </div>

    ${o.status.startsWith("Test ")
      ? '<p class="muted">Bu sipariş test ödeme akışından geçmiştir; gerçek ödeme alındığı anlamına gelmez.</p>'
      : ""
    }

    <h3 class="shipping-title">Kargo takip bilgileri</h3>

    ${safeTrackingUrl
      ? `<p>
          <a class="tracking-link"
            href="${escapeHtml(safeTrackingUrl)}"
            target="_blank"
            rel="noopener noreferrer">
            Kargo takip sayfasını aç
          </a>
        </p>`
      : ""
    }

    <form id="shippingForm" class="shipping-form">
      <label>
        Kargo firması
        <input id="shippingCompany"
          maxlength="100"
          value="${escapeHtml(o.shipping_company || "")}"
          placeholder="Örn. Yurtiçi Kargo">
      </label>

      <label>
        Takip numarası
        <input id="trackingNumber"
          maxlength="100"
          value="${escapeHtml(o.tracking_number || "")}"
          placeholder="Kargo takip numarası">
      </label>

      <label class="wide">
        Takip bağlantısı (isteğe bağlı)
        <input id="trackingUrl"
          type="url"
          maxlength="500"
          value="${escapeHtml(o.tracking_url || "")}"
          placeholder="https://...">
      </label>

      <div class="form-actions wide">
        <button id="saveShippingBtn" type="submit">
          Kargo bilgilerini kaydet
        </button>
        <p id="shippingMessage" class="message" role="status"></p>
      </div>
    </form>`;

  $("shippingForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = $("saveShippingBtn");
    const company = $("shippingCompany").value.trim();
    const number = $("trackingNumber").value.trim();
    const url = $("trackingUrl").value.trim();

    if (url && !/^https?:\/\//i.test(url)) {
      setMessage(
        "shippingMessage",
        "Takip bağlantısı http:// veya https:// ile başlamalı.",
        "error"
      );
      return;
    }

    button.disabled = true;
    setMessage("shippingMessage", "Kargo bilgileri kaydediliyor…");

    try {
      const result = await api(`/api/admin/orders/${id}/shipping`, {
        method: "PATCH",
        body: JSON.stringify({
          shipping_company: company,
          tracking_number: number,
          tracking_url: url
        })
      });

      const index = allOrders.findIndex(
        (order) => Number(order.id) === id
      );

      if (index !== -1 && result.order) {
        allOrders[index] = {
          ...allOrders[index],
          ...result.order
        };
      } else if (index !== -1) {
        allOrders[index].shipping_company = company;
        allOrders[index].tracking_number = number;
        allOrders[index].tracking_url = url;
      }

      showOrderDetails(id);
      setMessage(
        "shippingMessage",
        "Kargo bilgileri kaydedildi.",
        "success"
      );
      renderOrders();
    } catch (error) {
      setMessage("shippingMessage", error.message, "error");
    } finally {
      const currentButton = $("saveShippingBtn");
      if (currentButton) currentButton.disabled = false;
    }
  });

  if (!$("orderDialog").open) {
    $("orderDialog").showModal();
  }
}

$("closeDialogBtn").addEventListener("click", () => {
  $("orderDialog").close();
});

$("orderDialog").addEventListener("click", (event) => {
  if (event.target === $("orderDialog")) {
    $("orderDialog").close();
  }
});

["orderSearch", "statusFilter", "dateFrom", "dateTo"].forEach((id) => {
  $(id).addEventListener(
    id === "orderSearch" ? "input" : "change",
    () => {
      currentPage = 1;
      renderOrders();
    }
  );
});

$("clearFiltersBtn").addEventListener("click", () => {
  $("orderSearch").value = "";
  $("statusFilter").value = "";
  $("dateFrom").value = "";
  $("dateTo").value = "";
  currentPage = 1;
  renderOrders();
});

$("prevPageBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderOrders();
  }
});

$("nextPageBtn").addEventListener("click", () => {
  const pages = Math.max(
    1,
    Math.ceil(filteredOrders().length / PAGE_SIZE)
  );

  if (currentPage < pages) {
    currentPage++;
    renderOrders();
  }
});

$("refreshOrdersBtn").addEventListener("click", async () => {
  const button = $("refreshOrdersBtn");
  button.disabled = true;

  try {
    await Promise.all([loadOrders(), loadStats()]);
    setMessage("ordersMessage", "Siparişler yenilendi.", "success");
  } catch (error) {
    setMessage("ordersMessage", error.message, "error");
  } finally {
    button.disabled = false;
  }
});

$("exportOrdersBtn").addEventListener("click", () => {
  const rows = filteredOrders();

  if (!rows.length) {
    setMessage("ordersMessage", "Dışa aktarılacak sipariş yok.", "error");
    return;
  }

  const csvCell = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csv = [
    [
      "Sipariş No",
      "Tarih",
      "Müşteri",
      "E-posta",
      "Telefon",
      "Adres",
      "Ürünler",
      "Tutar (TRY)",
      "Durum",
      "Kargo Firması",
      "Kargo Takip No",
      "Kargo Takip Bağlantısı"
    ],
    ...rows.map((o) => [
      o.id,
      dateText(o.created_at),
      o.customer_name,
      o.email,
      o.phone,
      o.address,
      (o.items || [])
        .map((i) => `${i.name} x ${i.quantity}`)
        .join("; "),
      Number(o.total).toFixed(2),
      o.status,
      o.shipping_company || "",
      o.tracking_number || "",
      o.tracking_url || ""
    ])
  ]
    .map((row) => row.map(csvCell).join(";"))
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download =
    `siparisler-${new Date().toISOString().slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  setMessage(
    "ordersMessage",
    `${rows.length} sipariş CSV olarak dışa aktarıldı.`,
    "success"
  );
});

// Sayfa başlangıcı
(async function boot() {
  try {
    const data = await api("/api/admin/session");

    if (data.authenticated) {
      showDashboard();
      await loadAll();
    } else {
      showLogin();
    }
  } catch {
    showLogin();
  }
})();