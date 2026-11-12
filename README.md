# TaskFlow - Görev Yönetim REST API

TaskFlow, küçük bir ekipte görevlerin oluşturulması, çalışanlara atanması ve durumlarının takip edilmesi için geliştirilmiş bir **Node.js / Express.js REST API** projesidir. Proje, backend eğitiminin zorunlu kapsamı olan CRUD, routing ve temel logger middleware konularına odaklanır.

> Bu proje bir **backend uygulamasıdır**. İnternette açılan görsel bir görev panosu yoktur. İstekler Postman ile gönderilir; cevaplar JSON olarak alınır.

## 1. Gereken programlar

- **Node.js 20 veya üzeri (LTS)**: https://nodejs.org/
- **Postman (masaüstü uygulaması)**: https://www.postman.com/downloads/
- Kodları görmek/düzenlemek için isteğe bağlı **Visual Studio Code**: https://code.visualstudio.com/
- Teslim için isteğe bağlı **Git**: https://git-scm.com/downloads

Node.js kurulunca `npm` de gelir. Kurulumdan sonra bir terminal açıp kontrol edin:

```powershell
node -v
npm -v
```

Her ikisi de sürüm numarası yazmalıdır.

## 2. Windows'ta çalıştırma (adım adım)

1. ZIP dosyasını bilgisayarınıza indirin ve **Tümünü ayıkla** ile açın.
2. İçindeki **TaskFlow** klasörünü açın (içinde `package.json` bulunmalıdır).
3. Dosya Gezgini'nin adres çubuğuna `cmd` yazıp Enter'a basın. Komut penceresi bu klasörde açılır.
4. Önce bağımlılıkları yükleyin:

   ```bat
   npm install
   ```

   Bu komut internet gerektirir ve `node_modules` ile `package-lock.json` dosyasını oluşturur.
5. Ardından sunucuyu başlatın:

   ```bat
   npm start
   ```

6. Komut penceresinde şu mesaj çıkmalıdır:

   ```text
   TaskFlow API http://localhost:3000 adresinde çalışıyor.
   ```

7. Tarayıcıdan **http://localhost:3000/** adresini açın. `TaskFlow API çalışıyor.` mesajını içeren JSON görmelisiniz. Görevler için adres: **http://localhost:3000/tasks**.
8. Sunucuyu kapatmak için komut penceresinde **Ctrl + C** tuşlarına basın.

**Dikkat:** `npm start` çalışırken terminal açık kalmalıdır. `npm install` komutunu sadece ilk kurulumda, bağımlılıklar değiştiğinde veya `node_modules` silinirse tekrar çalıştırmanız yeterlidir.

**Kolay yol:** Windows kullanıyorsanız Node.js kurulu olduktan sonra `BASLAT.bat` dosyasına çift tıklayabilirsiniz. Bu dosya paketler eksikse `npm install` komutunu çalıştırır ve sunucuyu açar. Manuel yöntemi öğrenmek için yukarıdaki adımları da inceleyin.

## 3. Postman ile CRUD testleri

1. Sunucu açık kalsın; Postman uygulamasını açın.
2. **Import** düğmesinden `postman/TaskFlow.postman_collection.json` dosyasını seçin.
3. Sol tarafta **TaskFlow - CRUD Testleri** adlı koleksiyon açılır.
4. `01 - Görev Ekle (POST)` isteğini açıp **Send** düğmesine basın. Durum **201 Created** olmalı ve dönen yanıtta bir `id` bulunmalı. Bu ID koleksiyon değişkenine otomatik kaydedilir.
5. Sırayla `02 - Görevleri Listele`, `03 - Görev Detayı`, `04 - Görev Güncelle` ve `05 - Görev Sil` isteklerini gönderin.
6. İsteğe bağlı olarak `06 - Silinen Görev Kontrolü` isteğinde **404 Not Found** aldığınızı kontrol edin.
7. Her beş ana adımda Postman'ın **istek yöntemi + URL + yanıt JSON'u + HTTP durum kodu** görünecek şekilde ekran görüntüsü alın. Dosya adları ve ayrıntılar `docs/Test_ve_Teslim_Rehberi.md` içindedir.

**Önemli:** Koleksiyondaki görev detayı / güncelleme / silme istekleri `{{taskId}}` kullanır. **Önce ekleme isteğini çalıştırın.** Postman, test koduyla oluşan ID'yi saklar.

## 4. API adresleri

| Yöntem | Adres | İşlem | Başarılı yanıt |
|---|---|---|---|
| `GET` | `/tasks` | Tüm görevler | `200 OK` |
| `GET` | `/tasks/:id` | Tek görevin bilgileri | `200 OK` |
| `POST` | `/tasks` | Yeni görev | `201 Created` |
| `PUT` | `/tasks/:id` | Görev alanlarını güncelleme | `200 OK` |
| `DELETE` | `/tasks/:id` | Görevi silme | `200 OK` |

**Örnek görev ekleme:** Postman'da `POST http://localhost:3000/tasks`, Body → raw → JSON seçin:

```json
{
  "title": "Giriş sayfası hatasını düzelt",
  "description": "Giriş ekranındaki yönlendirme sorunu incelenecek.",
  "assignee": "Musa",
  "priority": "high",
  "status": "pending"
}
```

`priority` değerleri `low`, `medium`, `high`; `status` değerleri `pending`, `in-progress`, `completed` olabilir. `title` ve `assignee` zorunludur. `description` boş bırakılabilir; `priority` girilmezse `medium`, `status` girilmezse `pending` atanır. `PUT` isteğinde yalnızca değiştirilecek alanları göndermek yeterlidir.

Bir görev bulunamadığında `404`, geçersiz veri gönderildiğinde `400` döndürülür. Görevler `data/tasks.json` dosyasına yazılır; sunucu yeniden başlatılınca kaybolmaz. Dosya ilk görev eklendiğinde otomatik oluşur.

## 5. Klasörlerin görevi

```text
TaskFlow/
├── src/
│   ├── app.js                     # Express ve middleware bağlantıları
│   ├── server.js                  # Sunucuyu başlatır
│   ├── routes/taskRoutes.js       # Endpoint tanımları
│   ├── controllers/taskController.js # İsteklerin işlem mantığı
│   ├── models/taskStore.js        # JSON dosyası okuma/yazma
│   └── middleware/logger.js       # İstek kaydı
├── data/                          # Görevler burada saklanır
├── postman/                       # Hazır Postman koleksiyonu
├── tests/                         # Otomatik kontrol testleri
├── docs/                          # Tanıtım, API tasarımı, teslim rehberi
├── package.json
└── README.md
```

## 6. Ek kontroller ve sorun giderme

Bağımlılıklar yüklendikten sonra otomatik testleri çalıştırabilirsiniz:

```bat
npm test
```

- **`node` tanınmıyor:** Node.js'i kurup terminali kapatıp yeniden açın.
- **`Cannot find module 'express'`:** `package.json` dosyasının bulunduğu klasörde `npm install` çalıştırın.
- **`EADDRINUSE` / port dolu:** 3000 portunda başka bir uygulama çalışıyordur. Diğer uygulamayı kapatın veya Windows CMD'de `set PORT=3001` ardından `npm start` kullanın. Bu durumda Postman'daki `baseUrl` değişkenini de `http://localhost:3001` yapın.
- **`npm` ağ/sertifika hatası:** İnternet bağlantınızı ve ağ/proxy ayarlarınızı kontrol edin; ilk kurulumda Express'in indirilmesi gerekir.
- **PowerShell script politikası hatası:** PowerShell yerine Windows `cmd` ile çalıştırın.
- **Temiz başlangıç:** Sunucuyu durdurun, `data/tasks.json` dosyasını silin, ardından yeniden açın. Bu işlem kayıtlı görevleri siler.

## 7. Teslim

Yönergeye göre GitHub üzerinde **public** bir repo açılmalı, `src`, `docs`, `postman`, `tests`, `package.json`, `README.md` ve gerçek Postman test görüntüleri eklenmelidir. `node_modules` ve kişisel ayarlar yüklenmemelidir. Ayrıntılar için `docs/Test_ve_Teslim_Rehberi.md` dosyasını inceleyin.

Gelişmiş filtreleme, raporlama ve ayrı validation middleware, proje yönergesinde **isteğe bağlı** olduğu için bu sürüme eklenmemiştir.
