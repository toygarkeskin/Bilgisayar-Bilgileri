
const form = document.getElementById("siparisForm");
const ozet = document.getElementById("siparisOzeti");
const mesaj = document.getElementById("sonucMesaji");
const buton = document.getElementById("siparisButonu");

function sepetiOku() {
    try {
        const sepet = JSON.parse(localStorage.getItem("sepet") || "[]");

        if (!Array.isArray(sepet)) return [];

        return sepet.filter(
            urun =>
                urun &&
                typeof urun.ad === "string" &&
                urun.ad.trim()
        );
    } catch {
        return [];
    }
}

function ozetiGoster() {
    const sepet = sepetiOku();

    if (!sepet.length) {
        ozet.textContent = "Sepetiniz boş. Önce ürün ekleyin.";
        buton.disabled = true;
        return;
    }

    ozet.replaceChildren();

    const baslik = document.createElement("h4");
    baslik.textContent = "Siparişinizdeki ürünler";
    ozet.appendChild(baslik);

    sepet.forEach(urun => {
        const satir = document.createElement("p");
        satir.textContent = urun.ad;
        ozet.appendChild(satir);
    });

    const bilgi = document.createElement("p");
    bilgi.textContent =
        "Bu işlem test ödeme ekranına yönlendirir. Gerçek para çekilmez.";

    ozet.appendChild(bilgi);
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const sepet = sepetiOku();

    if (!sepet.length) {
        mesaj.textContent = "Sepetiniz boş.";
        return;
    }

    buton.disabled = true;
    mesaj.textContent = "Sipariş hazırlanıyor...";

    try {
        const cevap = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                adSoyad: form.elements["adSoyad"].value.trim(),
                email: form.elements["email"].value.trim(),
                telefon: form.elements["telefon"].value.trim(),
                adres: form.elements["adres"].value.trim(),
                items: sepet.map(urun => ({
                    name: urun.ad
                }))
            })
        });

        const veri = await cevap.json();

        if (!cevap.ok || !veri.success) {
            throw new Error(
                veri.message || "Sipariş oluşturulamadı."
            );
        }

        // Sunucunun ürettiği sipariş takip kodunu sakla.
        if (
            typeof veri.trackingCode !== "string" ||
            !veri.trackingCode
        ) {
            throw new Error(
                "Sipariş oluşturuldu ancak takip kodu alınamadı. " +
                "Sipariş numaranız: " + veri.orderId
            );
        }

        sessionStorage.setItem(
            "siparisTakipKodu",
            veri.trackingCode
        );

        sessionStorage.setItem(
            "siparisTakipNo",
            String(veri.orderId)
        );

        // Test ödeme sayfasına yönlendir.
        window.location.href =
            "odeme-test.html?orderId=" +
            encodeURIComponent(veri.orderId);

    } catch (hata) {
        mesaj.textContent = hata.message;
        buton.disabled = false;
    }
});

ozetiGoster();
