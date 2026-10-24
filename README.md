# Bilgisayar Bilgileri — E-ticaret Web Projesi

Bilgisayar bileşenleri ve çevre birimleri için hazırlanmış, ürün listeleme ve sepet akışının yanında Node.js/Express tabanlı bir sunucu ve PostgreSQL entegrasyonu içeren web projesi.

> **Önemli:** Ödeme akışı test amaçlıdır; gerçek ödeme alınmaz. Bu proje, gerçek müşterilerden ödeme almak için hazır bir üretim sistemi olarak değerlendirilmemelidir.

## Özellikler

- Ürünleri ve markaları görüntüleme
- Sepete ürün ekleme ve sepet içeriğini yönetme
- Sipariş formu ve test ödeme akışı
- PostgreSQL üzerinden ürün ve sipariş verileri
- Stok kontrolü ve sipariş sırasında stok güncelleme
- Yönetici panelinden ürünleri yönetme
- Siparişleri görüntüleme, filtreleme ve durumlarını yönetme
- Sipariş listesini CSV olarak dışa aktarma
- Sipariş takip kodu oluşturma
- Sağlık kontrolü için `/api/health` uç noktası

## Kullanılan Teknolojiler

- HTML, CSS ve JavaScript
- Node.js
- Express
- PostgreSQL
- `pg` ve `dotenv` paketleri

## Proje Yapısı

```text
Bilgisayar-Bilgileri/
├── OKUL/                  # Web arayüzü ve istemci dosyaları
├── server.js              # Express sunucusu ve API uç noktaları
├── package.json           # Paket bilgileri ve komutlar
├── package-lock.json      # Bağımlılık sürümleri
├── .gitignore             # Git dışında tutulacak dosyalar
├── STOK_KURULUM.txt       # Stok ve kurulum notları
└── README.md
```

`OKUL/` klasöründe ana sayfa, ürünler, markalar, hakkımızda, iletişim, sepet, satın alma, sipariş takibi ve yönetici paneliyle ilgili HTML, CSS ve JavaScript dosyaları bulunur.

## Kurulum

### Gereksinimler

- Desteklenen bir Node.js sürümü ve npm
- PostgreSQL
- Proje için hazırlanmış veritabanı ve tablolar

### Adımlar

1. Depoyu bilgisayarınıza klonlayın:

   ```bash
   git clone https://github.com/toygarkeskin/Bilgisayar-Bilgileri.git
   cd Bilgisayar-Bilgileri
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

3. Proje kökünde yerel bir `.env` dosyası oluşturun. Aşağıdaki değişkenleri kendi yerel ortamınıza göre ayarlayın:

   ```dotenv
   PORT=3000
   NODE_ENV=development
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=veritabani_adi
   DB_USER=veritabani_kullanicisi
   DB_PASSWORD=yerel_veritabani_parolaniz
   ADMIN_USERNAME=yerel_yonetici_kullanici
   ADMIN_PASSWORD=yerel_yonetici_parolasi
   SESSION_SECRET=uzun_rastgele_oturum_anahtari
   ```

   Örnek değerleri gerçek kimlik bilgileriyle değiştirin. `.env` dosyasını GitHub'a yüklemeyin ve gerçek parolaları README'ye yazmayın.

4. PostgreSQL veritabanı ve gerekli tabloları proje kurulum notlarına göre hazırlayın. Ayrıntılar için [STOK_KURULUM.txt](STOK_KURULUM.txt) dosyasını inceleyin.

5. Sunucuyu başlatın:

   ```bash
   npm start
   ```

6. Tarayıcıdan `http://localhost:3000` adresini açın.

## Kontrol Komutları

Sunucu dosyasının sözdizimini kontrol etmek için:

```bash
npm run check
```

Sunucu çalışırken temel sağlık kontrolü:

```text
http://localhost:3000/api/health
```

Veritabanı bağlantısını doğrulamak için sunucu çalışırken `/api/db-test` uç noktası da kullanılabilir. Veritabanı yapılandırılmamışsa bağlantı testi başarısız olabilir.

## Güvenlik ve Sınırlar

- `.env`, parola ve oturum anahtarı gibi gizli değerleri içerir; depoya eklenmemelidir.
- Yönetici giriş bilgilerini güçlü ve benzersiz seçin.
- Test ödeme akışı gerçek ödeme işlemi gerçekleştirmez.
- Canlı kullanımdan önce kimlik doğrulama, oturum çerezleri, HTTPS, hata yönetimi, veritabanı yedekleme ve ödeme başarısız olduğunda stok iadesi gibi konular ayrıca test edilmelidir.
- Gerçek müşteri verileriyle çalıştırmadan önce gizlilik, veri koruma ve erişim izinlerini değerlendirin.

## Ekran Görüntüleri

Projenin arayüz ekran görüntüleri depoya eklendiğinde bu bölüme görseller ve kısa açıklamaları eklenecektir.

## Lisans

Depoda ayrıca bir lisans dosyası yoksa, kodun kullanım ve yeniden dağıtım koşulları otomatik olarak açık lisans kapsamında değildir.
