
let silinecekIndex = null;


// SEPETİ GÖSTER
function sepetiGoster() {

    let sepet = JSON.parse(localStorage.getItem("sepet")) || [];

    let liste = document.getElementById("sepetListesi");


    // SEPET BOŞSA
    if (sepet.length === 0) {

        liste.innerHTML = `

            <div class="text-center py-5">

                <h2>SEPET BOŞ</h2>

                <p>
                    Sepetinde henüz ürün yok.
                </p>

                <a href="ürünler.html" class="btn btn-dark">
                    Ürünlere Git
                </a>

            </div>

        `;

        return;
    }


    // TOPLAM FİYAT
    let toplam = 0;


    liste.innerHTML = `

        <div class="row">

            <!-- ÜRÜNLER -->
            <div class="col-md-8">

                ${sepet.map((urun, index) => {

                    toplam += Number(urun.fiyat);

                    return `

                        <div class="card mb-3 shadow-sm">

                            <div class="card-body">

                                <div class="d-flex justify-content-between align-items-center">

                                    <div>

                                        <h4>
                                            ${urun.ad}
                                        </h4>

                                        <p class="mb-0">
                                            ${Number(urun.fiyat).toLocaleString("tr-TR")} TL
                                        </p>

                                    </div>


                                    <button
                                        class="btn btn-danger"
                                        onclick="urunSil(${index})">

                                        <i class="bi bi-trash"></i>

                                        Sil

                                    </button>

                                </div>

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>


            <!-- SİPARİŞ ÖZETİ -->
            <div class="col-md-4">

                <div class="card shadow-sm">

                    <div class="card-body">

                        <h3>
                            Sipariş Özeti
                        </h3>

                        <hr>


                        <h4>

                            Toplam:

                            ${toplam.toLocaleString("tr-TR")}

                            TL

                        </h4>


                        <!-- SATIN AL -->
                        <button
                            class="btn btn-success w-100 mt-3"
                            onclick="satinAl()">

                            Satın Al

                        </button>


                        <!-- SEPETİ TEMİZLE -->
                        <button
                            class="btn btn-outline-danger w-100 mt-2"
                            onclick="sepetiTemizle()">

                            Sepeti Temizle

                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;
}



// ÜRÜN SİL
function urunSil(index) {

    let sepet =
        JSON.parse(localStorage.getItem("sepet")) || [];


    silinecekIndex = index;


    document.getElementById("silinecekUrun").textContent =
        sepet[index].ad;


    document.getElementById("silmeKutusu").style.display =
        "block";
}



// SİLMEYİ ONAYLA
function silmeOnayla() {

    let sepet =
        JSON.parse(localStorage.getItem("sepet")) || [];


    sepet.splice(silinecekIndex, 1);


    localStorage.setItem(
        "sepet",
        JSON.stringify(sepet)
    );


    document.getElementById("silmeKutusu").style.display =
        "none";


    sepetiGoster();
}



// SİLME KUTUSUNU KAPAT
function silmeKapat() {

    document.getElementById("silmeKutusu").style.display =
        "none";

}



// SEPETİ TEMİZLE
function sepetiTemizle() {

    localStorage.removeItem("sepet");

    sepetiGoster();

}



// SATIN AL
function satinAl() {

    window.location.href = "satinalma.html";

}



// SAYFA AÇILDIĞINDA SEPETİ GÖSTER
sepetiGoster();
