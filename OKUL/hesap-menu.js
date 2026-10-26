
document.addEventListener("DOMContentLoaded", async () => {
  const menu = document.getElementById("hesapMenu");
  if (!menu) return;

  try {
    const response = await fetch("/api/customers/session", {
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error("Oturum kontrol edilemedi.");
    }

    const data = await response.json();

    if (data.authenticated && data.customer) {
      menu.classList.add("dropdown");

      menu.innerHTML = `
        <button
          type="button"
          class="btn p-0 border-0 rounded-circle d-flex align-items-center justify-content-center"
          id="hesapMenuButon"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-label="Hesap menüsü"
          style="width: 42px; height: 42px; background: white;">
          <i class="bi bi-person-circle fs-3 text-dark"></i>
        </button>

        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <span class="dropdown-item-text">
              ${escapeText(data.customer.name)}
            </span>
          </li>
          <li>
            
            <a class="dropdown-item" href="bilgilerim.html">
                <i class="bi bi-person-vcard me-2"></i>Bilgilerim
            </a>

          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <button
              class="dropdown-item"
              type="button"
              id="hesapCikis">
              <i class="bi bi-box-arrow-right me-2"></i>Çıkış Yap
            </button>
          </li>
        </ul>
      `;

      document
        .getElementById("hesapCikis")
        .addEventListener("click", async () => {
          try {
            const logoutResponse = await fetch(
              "/api/customers/logout",
              {
                method: "POST",
                credentials: "same-origin"
              }
            );

            if (!logoutResponse.ok) {
              throw new Error("Çıkış yapılamadı.");
            }

            window.location.reload();
          } catch (error) {
            alert("Çıkış yapılamadı. Lütfen tekrar dene.");
            console.error(error);
          }
        });
    }
  } catch (error) {
    console.error("Hesap menüsü yüklenemedi:", error);
  }
});

function escapeText(value) {
  const element = document.createElement("span");
  element.textContent = String(value ?? "");
  return element.innerHTML;
}
