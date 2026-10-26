const yukleniyor = document.getElementById("yukleniyor");
const bilgiAlani = document.getElementById("bilgiAlani");
const hataAlani = document.getElementById("hataAlani");
const genelMesaj = document.getElementById("genelMesaj");

const cikisBtn = document.getElementById("cikisBtn");
const adresForm = document.getElementById("adresForm");
const adresMesaj = document.getElementById("adresMesaj");
const adresKaydetBtn = document.getElementById("adresKaydetBtn");
const siparislerAlani = document.getElementById("siparisler");

async function apiIstegi(url, secenekler = {}) {
    const response = await fetch(url, {
        credentials: "same-origin",
        ...secenekler,
        headers: {
            ...(secenekler.body
                ? { "Content-Type": "application/json" }
                : {}),
            ...(secenekler.headers || {})
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Bir hata oluştu.");
    }

    return data;
}

function mesajGoster(alani, mesaj, hata = false) {
    alani.textContent = mesaj;
    alani.classList.toggle("text-danger", hata);
    alani.classList.toggle("text-success", !hata && mesaj !== "");
}

function paraBicimlendir(tutar) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY"
    }).format(Number(tutar) || 0);
}

function tarihBicimlendir(tarih) {
    const date = new Date(tarih);

    if (Number.isNaN(date.getTime())) {
        return "Tarih belirtilmemiş";
    }

    return new Intl.DateTimeFormat("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
}

function elemanOlustur(tag, className, metin) {
    const eleman = document.createElement(tag);

    if (className) {
        eleman.className = className;
    }

    if (metin !== undefined) {
        eleman.textContent = metin;
    }

    return eleman;
}

async function hesapBilgileriniYukle() {
    try {
        const data = await apiIstegi("/api/customers/session");

        if (!data.authenticated || !data.customer) {
            window.location.href = "hesap.html";
            return;
        }

        document.getElementById("adSoyad").textContent =
            data.customer.name || "-";

        document.getElementById("email").textContent =
            data.customer.email || "-";

        document.getElementById("adresAd").value =
            data.customer.name || "";

        bilgiAlani.hidden = false;
        yukleniyor.hidden = true;

        await adresBilgileriniYukle();
        await siparisleriYukle();

    } catch (error) {
        yukleniyor.hidden = true;
        hataAlani.hidden = false;
        hataAlani.textContent =
            error.message || "Hesap bilgileri yüklenemedi.";
    }
}

async function adresBilgileriniYukle() {
    try {
        const data = await apiIstegi("/api/customers/address");

        if (data.address) {
            document.getElementById("adresAd").value =
                data.address.fullName || "";

            document.getElementById("adresTelefon").value =
                data.address.phone || "";

            document.getElementById("adresMetni").value =
                data.address.address || "";
        }
    } catch (error) {
        mesajGoster(adresMesaj, error.message, true);
    }
}

adresForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    adresKaydetBtn.disabled = true;
    mesajGoster(adresMesaj, "Adres kaydediliyor...");

    const adresBilgileri = {
        fullName: document.getElementById("adresAd").value.trim(),
        phone: document.getElementById("adresTelefon").value.trim(),
        address: document.getElementById("adresMetni").value.trim()
    };

    if (
        !adresBilgileri.fullName ||
        !adresBilgileri.phone ||
        !adresBilgileri.address
    ) {
        mesajGoster(
            adresMesaj,
            "Lütfen tüm adres alanlarını doldur.",
            true
        );

        adresKaydetBtn.disabled = false;
        return;
    }

    try {
        const data = await apiIstegi("/api/customers/address", {
            method: "PUT",
            body: JSON.stringify(adresBilgileri)
        });

        mesajGoster(
            adresMesaj,
            data.message || "Adres başarıyla kaydedildi."
        );

    } catch (error) {
        mesajGoster(adresMesaj, error.message, true);

    } finally {
        adresKaydetBtn.disabled = false;
    }
});

async function siparisleriYukle() {
    siparislerAlani.replaceChildren(
        elemanOlustur("p", "text-muted", "Siparişler yükleniyor...")
    );

    try {
        const data = await apiIstegi("/api/customers/orders");
        siparislerAlani.replaceChildren();

        const siparisler = data.orders || [];

        if (siparisler.length === 0) {
            siparislerAlani.appendChild(
                elemanOlustur(
                    "div",
                    "bos-siparis",
                    "Henüz hesabına bağlı bir sipariş bulunmuyor."
                )
            );

            return;
        }

        siparisler.forEach(function (siparis) {
            const kart = elemanOlustur("article", "siparis-karti");

            const ust = elemanOlustur("div", "siparis-ust");
            const sol = document.createElement("div");

            sol.appendChild(
                elemanOlustur(
                    "div",
                    "siparis-numara",
                    "Sipariş #" + siparis.id
                )
            );

            sol.appendChild(
                elemanOlustur(
                    "div",
                    "siparis-tarih",
                    tarihBicimlendir(siparis.createdAt)
                )
            );

            ust.appendChild(sol);

            ust.appendChild(
                elemanOlustur(
                    "span",
                    "siparis-durum",
                    siparis.status || "Durum belirtilmemiş"
                )
            );

            kart.appendChild(ust);

            const urunlerAlani = elemanOlustur(
                "div",
                "siparis-urunler"
            );

            const urunler = Array.isArray(siparis.items)
                ? siparis.items
                : [];

            urunler.forEach(function (urun) {
                const urunSatiri = elemanOlustur(
                    "div",
                    "siparis-urun"
                );

                urunSatiri.appendChild(
                    elemanOlustur(
                        "span",
                        "",
                        `${urun.name} × ${urun.quantity}`
                    )
                );

                const toplamFiyat =
                    Number(urun.unitPrice) * Number(urun.quantity);

                urunSatiri.appendChild(
                    elemanOlustur(
                        "strong",
                        "",
                        paraBicimlendir(toplamFiyat)
                    )
                );

                urunlerAlani.appendChild(urunSatiri);
            });

            kart.appendChild(urunlerAlani);

            const alt = elemanOlustur("div", "siparis-alt");

            alt.appendChild(
                elemanOlustur(
                    "span",
                    "",
                    siparis.address
                        ? "Teslimat: " + siparis.address
                        : "Teslimat adresi"
                )
            );

            alt.appendChild(
                elemanOlustur(
                    "span",
                    "siparis-toplam",
                    paraBicimlendir(siparis.total)
                )
            );

            kart.appendChild(alt);
            siparislerAlani.appendChild(kart);
        });

    } catch (error) {
        siparislerAlani.replaceChildren(
            elemanOlustur(
                "div",
                "bos-siparis",
                error.message || "Siparişler yüklenemedi."
            )
        );
    }
}

cikisBtn.addEventListener("click", async function () {
    cikisBtn.disabled = true;

    try {
        await apiIstegi("/api/customers/logout", {
            method: "POST"
        });

        window.location.href = "hesap.html";

    } catch (error) {
        mesajGoster(genelMesaj, error.message, true);
        genelMesaj.hidden = false;
        cikisBtn.disabled = false;
    }
});

hesapBilgileriniYukle();