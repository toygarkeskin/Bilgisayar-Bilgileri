document.getElementById("loginForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let sifre = document.getElementById("sifre").value.trim();
    let uyari = document.getElementById("uyari");


    if (email === "") {

        uyari.innerHTML = "E-posta giriniz!";

        return;
    }


    if (!email.includes("@")) {

        uyari.innerHTML = "Geçerli bir e-posta giriniz!";

        return;
    }


    if (sifre === "") {

        uyari.innerHTML = "Şifre giriniz!";

        return;
    }


    uyari.innerHTML = "";

    window.location.href = "anasayfa.html";

});