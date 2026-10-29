
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("supportContactForm");

  if (!form) return;

  const result = document.getElementById("supportSubmitMessage");
  const submit = document.getElementById("supportSubmitBtn");

  if (!result) {
    console.error("supportSubmitMessage alanı bulunamadı.");
    return;
  }

  // Mesaj kutusunun ortak görünümü
  result.style.display = "none";
  result.style.marginTop = "16px";
  result.style.padding = "12px 16px";
  result.style.borderRadius = "8px";
  result.style.fontWeight = "600";
  result.style.lineHeight = "1.5";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    result.textContent = "";
    result.style.display = "none";

    if (submit) {
      submit.disabled = true;
      submit.textContent = "Gönderiliyor...";
    }

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: document.getElementById("supportName").value.trim(),
          email: document.getElementById("supportEmail").value.trim(),
          phone: document.getElementById("supportPhone").value.trim(),
          message: document.getElementById("supportMessage").value.trim()
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Talep gönderilemedi.");
      }

      result.textContent =
        `${data.message || "Destek talebiniz alındı."} Talep numaranız: #${data.request.id}`;

      // Başarı mesajı: yeşil arka plan
      result.style.display = "block";
      result.style.backgroundColor = "#d1fae5";
      result.style.color = "#065f46";
      result.style.border = "1px solid #10b981";

      form.reset();

    } catch (error) {
      result.textContent =
        error.message || "Bir hata oluştu. Lütfen tekrar deneyin.";

      // Hata mesajı: kırmızı arka plan
      result.style.display = "block";
      result.style.backgroundColor = "#fee2e2";
      result.style.color = "#991b1b";
      result.style.border = "1px solid #ef4444";

      console.error("Destek talebi gönderme hatası:", error);

    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = "Gönder";
      }
    }
  });
});
