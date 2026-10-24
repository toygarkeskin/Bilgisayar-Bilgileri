
const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");

const siparisNo = document.getElementById("siparisNo");
const tutar = document.getElementById("tutar");
const mesaj = document.getElementById("mesaj");
const onayla = document.getElementById("onayla");
const basarisiz = document.getElementById("basarisiz");

siparisNo.textContent = orderId || "Geçersiz";

onayla.disabled = true;
basarisiz.disabled = true;

async function siparisiYukle() {
    if (!orderId || !/^\d+$/.test(orderId)) {
        mesaj.textContent = "Geçersiz sipariş numarası.";
        return;
    }

    try {
        const cevap = await fetch(
            "/api/orders/" + encodeURIComponent(orderId)
        );
        const veri = await cevap.json();

        if (!cevap.ok || !veri.success) {
            throw new Error(veri.message || "Sipariş bulunamadı.");
        }

        tutar.textContent =
            Number(veri.order.total).toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY"
            });

        if (veri.order.status !== "Ödeme bekleniyor") {
            mesaj.textContent = "Bu sipariş daha önce işlenmiş.";
            return;
        }

        onayla.disabled = false;
        basarisiz.disabled = false;
    } catch (hata) {
        mesaj.textContent = hata.message;
    }
}

async function testSonuc(basarili) {
    onayla.disabled = true;
    basarisiz.disabled = true;
    mesaj.textContent = "Test sonucu işleniyor...";

    try {
        const cevap = await fetch(
            "/api/orders/" + encodeURIComponent(orderId) + "/test-payment",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ successful: basarili })
            }
        );

        const veri = await cevap.json();

        if (!cevap.ok || !veri.success) {
            throw new Error(veri.message || "İşlem tamamlanamadı.");
        }

        if (basarili) {
            localStorage.removeItem("sepet");
            mesaj.textContent =
                "TEST BAŞARILI! Sipariş numaranız: " + orderId +
                ". Gerçek ödeme alınmadı.";
        } else {
            mesaj.textContent =
                "Test ödemesi başarısız olarak işaretlendi. " +
                "Gerçek ödeme alınmadı.";
        }
    } catch (hata) {
        mesaj.textContent = hata.message;
        onayla.disabled = false;
        basarisiz.disabled = false;
    }
}

onayla.addEventListener("click", () => testSonuc(true));
basarisiz.addEventListener("click", () => testSonuc(false));

siparisiYukle();




const takipKoduAlani = document.getElementById("gosterilenTakipKodu");
const takipKoduKutusu = document.getElementById("takipKoduBilgisi");
const kopyalaButonu = document.getElementById("takipKoduKopyala");

const kayitliTakipKodu = sessionStorage.getItem("siparisTakipKodu");

const takipSiparisNo = document.getElementById("takipSiparisNo");

if (takipSiparisNo) {
    takipSiparisNo.textContent =
        sessionStorage.getItem("siparisTakipNo") || orderId || "Bilinmiyor";
}

if (takipKoduAlani && takipKoduKutusu && kayitliTakipKodu) {
    takipKoduAlani.value = kayitliTakipKodu;
    takipKoduKutusu.classList.remove("d-none");
}

if (kopyalaButonu && takipKoduAlani) {
    kopyalaButonu.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(takipKoduAlani.value);
            kopyalaButonu.textContent = "Kopyalandı!";
        } catch {
            takipKoduAlani.select();
            kopyalaButonu.textContent = "Kodu seçtim; Ctrl+C ile kopyala";
        }
    });
}
