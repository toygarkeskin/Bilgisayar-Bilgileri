document.getElementById("sifreForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let email = document.getElementById("email").value.trim();

    if (email === "") {
        alert("E-posta adresinizi giriniz!");
        return;
    }

    if (!email.includes("@")) {
        alert("Geçerli bir e-posta adresi giriniz!");
        return;
    }

    alert("Parola sıfırlama bağlantısı e-posta adresinize gönderildi.");

    window.location.href = "hesap.html";
});