const form = document.getElementById("takipForm");
const mesaj = document.getElementById("mesaj");
const sonuc = document.getElementById("sonuc");
const sorgulaBtn = document.getElementById("sorgulaBtn");

// Checkout sayfası bu kodu sessionStorage'a koyarsa otomatik doldurulur.
const savedCode = sessionStorage.getItem("siparisTakipKodu");
if (savedCode) {
  document.getElementById("trackingCode").value = savedCode;
}

const siparisNo = sessionStorage.getItem("siparisTakipNo");

if (siparisNo) {
    document.getElementById("orderId").value = siparisNo;
}

const params = new URLSearchParams(window.location.search);
if (params.has("orderId")) {
  document.getElementById("orderId").value = params.get("orderId");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  mesaj.textContent = "Sipariş sorgulanıyor...";
  sonuc.replaceChildren();
  sonuc.classList.add("d-none");
  sorgulaBtn.disabled = true;

  try {
    const response = await fetch("/api/order-tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: document.getElementById("orderId").value.trim(),
        trackingCode: document.getElementById("trackingCode").value.trim()
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Sipariş bulunamadı.");
    }

    const order = data.order;
    addField("Sipariş numarası", order.id);
    addField("Sipariş durumu", order.status);
    addField("Kargo firması", order.shipping_company);
    addField("Kargo takip numarası", order.tracking_number);

    if (order.tracking_url) {
      try {
        const url = new URL(order.tracking_url);
        if (["http:", "https:"].includes(url.protocol)) {
          const link = document.createElement("a");
          link.href = url.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = "Kargo takibini aç";
          link.className = "btn btn-outline-primary align-self-start mt-2";
          sonuc.appendChild(link);
        }
      } catch (_) {
        // Geçersiz takip bağlantısı kullanıcıya gösterilmez.
      }
    }

    sonuc.classList.remove("d-none");
    mesaj.textContent = "";
  } catch (error) {
    mesaj.textContent = error.message || "Bir hata oluştu.";
  } finally {
    sorgulaBtn.disabled = false;
  }
});

function addField(label, value) {
  const row = document.createElement("p");
  row.className = "mb-2";
  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;
  row.append(strong, document.createTextNode(
    value === null || value === undefined || value === "" ? "Henüz girilmedi" : String(value)
  ));
  sonuc.appendChild(row);
}
