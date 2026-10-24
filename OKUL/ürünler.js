
async function urunleriGetir() {
    const urunListesi = document.getElementById("urunListesi");

    if (!urunListesi) return;

    try {
        const cevap = await fetch("/api/products");

        if (!cevap.ok) {
            throw new Error("Ürünler alınamadı: HTTP " + cevap.status);
        }

        const veri = await cevap.json();
        urunListesi.replaceChildren();

        if (!veri.products || veri.products.length === 0) {
            urunListesi.textContent = "Henüz ürün bulunmuyor.";
            return;
        }

        veri.products.forEach(function (urun) {
            const kart = document.createElement("div");
            kart.className = "card";

            const resim = document.createElement("img");
            resim.className = "kutu-img";
            resim.src = urun.image;
            resim.alt = urun.name;

            const aciklama = document.createElement("strong");
            aciklama.textContent = urun.description;

            const fiyat = document.createElement("h1");
            fiyat.textContent =
                Number(urun.price).toLocaleString("tr-TR") + " TL";

            const stok = document.createElement("p");
            const stokAdedi = Number(urun.stock || 0);
            stok.textContent = stokAdedi > 0 ? `Stokta: ${stokAdedi} adet` : "Stokta yok";
            stok.className = stokAdedi > 0 ? "stok-bilgisi" : "stok-bilgisi stok-yok";

            const buton = document.createElement("button");
            buton.textContent = stokAdedi > 0 ? "Sepete Ekle" : "Stokta Yok";
            buton.className = "bg-warning text-white";
            buton.type = "button";
            buton.disabled = stokAdedi <= 0;

            buton.addEventListener("click", function () {
                if (stokAdedi > 0) sepeteEkle(urun.name, Number(urun.price));
            });

            kart.append(resim, aciklama, fiyat, stok, buton);
            urunListesi.appendChild(kart);
        });

    } catch (hata) {
        console.error("Ürün yükleme hatası:", hata);
        urunListesi.textContent =
            "Ürünler yüklenemedi. Sunucuyu kontrol edin.";
    }
}

function sepeteEkle(urunAdi, fiyat) {
    let sepet = JSON.parse(localStorage.getItem("sepet")) || [];

    sepet.push({
        ad: urunAdi,
        fiyat: fiyat
    });

    localStorage.setItem("sepet", JSON.stringify(sepet));

    const mesaj = document.getElementById("bildirimMesaji");
    const bildirim = document.getElementById("bildirim");

    if (mesaj && bildirim) {
        mesaj.textContent = urunAdi + " Sepete Eklendi!";
        bildirim.style.display = "block";
    }
}

function bildirimiKapat() {
    const bildirim = document.getElementById("bildirim");

    if (bildirim) {
        bildirim.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", urunleriGetir);
