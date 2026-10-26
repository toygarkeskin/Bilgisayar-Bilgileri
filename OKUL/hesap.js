const form = document.getElementById("loginForm");
const girisSekme = document.getElementById("girisSekme");
const kayitSekme = document.getElementById("kayitSekme");

const adAlani = document.getElementById("adAlani");
const adInput = document.getElementById("ad");
const emailInput = document.getElementById("email");
const sifreInput = document.getElementById("sifre");

const uyari = document.getElementById("uyari");
const gonderButonu = document.getElementById("gonderButonu");

const oturumAlani = document.getElementById("oturumAlani");
const parolaLinki = document.querySelector(".parola");

let mod = "giris";

function mesajGoster(mesaj, basarili = false) {
    uyari.textContent = mesaj;
    uyari.classList.toggle("basarili", basarili);
}

function sekmeDegistir(yeniMod) {
    mod = yeniMod;

    const kayitModu = mod === "kayit";

    adAlani.hidden = !kayitModu;
    adInput.required = kayitModu;

    oturumAlani.hidden = kayitModu;
    parolaLinki.hidden = kayitModu;

    sifreInput.autocomplete = kayitModu
        ? "new-password"
        : "current-password";

    gonderButonu.textContent = kayitModu
        ? "KAYIT OL"
        : "OTURUM AÇ";

    girisSekme.className = kayitModu
        ? "btn btn-outline-dark w-50"
        : "btn btn-dark w-50";

    kayitSekme.className = kayitModu
        ? "btn btn-dark w-50"
        : "btn btn-outline-dark w-50";

    mesajGoster("");
}

girisSekme.addEventListener("click", function () {
    sekmeDegistir("giris");
});

kayitSekme.addEventListener("click", function () {
    sekmeDegistir("kayit");
});

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const sifre = sifreInput.value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mesajGoster("Geçerli bir e-posta adresi gir.");
        return;
    }

    if (sifre.length < 8 || sifre.length > 128) {
        mesajGoster("Şifre 8-128 karakter arasında olmalı.");
        return;
    }

    const body = {
        email: email,
        password: sifre
    };

    let url = "/api/customers/login";

    if (mod === "kayit") {
        const name = adInput.value.trim();

        if (name.length < 2 || name.length > 150) {
            mesajGoster("Ad soyad 2-150 karakter arasında olmalı.");
            return;
        }

        body.name = name;
        url = "/api/customers/register";
    }

    gonderButonu.disabled = true;
    mesajGoster("İşlem yapılıyor...");

    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            mesajGoster(data.message || "İşlem başarısız.");
            return;
        }

        if (mod === "kayit") {
            mesajGoster(
                "Kayıt başarılı! Şimdi giriş yapabilirsin.",
                true
            );

            form.reset();
            sekmeDegistir("giris");
            return;
        }

        mesajGoster("Giriş başarılı! Yönlendiriliyorsun.", true);

        window.location.href = "anasayfa.html";

    } catch (error) {
        console.error("Hesap işlemi hatası:", error);

        mesajGoster(
            "Sunucuya bağlanılamadı. Sunucunun çalıştığını kontrol et."
        );

    } finally {
        gonderButonu.disabled = false;
    }
});

oturumAlani.hidden = false;
parolaLinki.hidden = false;
adAlani.hidden = true;