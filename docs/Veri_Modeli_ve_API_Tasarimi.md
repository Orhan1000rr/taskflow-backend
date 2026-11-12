# Veri Modeli ve API Tasarımı

## Senaryo ve kapsam

TaskFlow'da bir ekip üyesi yeni görev açar; görevin sorumlusu, önceliği ve durumu kaydedilir. Var olan görevler listelenir, detayları incelenir, değiştirilebilir veya silinebilir. Bu sürümde yalnızca **görev yönetimi** ele alınmıştır. Ayrı proje/çalışan tabloları, yetkilendirme, filtreleme ve raporlama zorunlu kapsamda değildir.

## Görev (Task) veri modeli

| Alan | Tür | Açıklama |
|---|---|---|
| `id` | string | Sunucu tarafından üretilen benzersiz kimlik (UUID) |
| `title` | string | Görevin başlığı; boş bırakılamaz |
| `description` | string | Görev açıklaması; varsayılan `""` |
| `assignee` | string | Sorumlu çalışan adı; boş bırakılamaz |
| `priority` | string | `low`, `medium`, `high`; varsayılan `medium` |
| `status` | string | `pending`, `in-progress`, `completed`; varsayılan `pending` |
| `createdAt` | string | Oluşturulma tarihi (ISO 8601) |
| `updatedAt` | string | Son güncelleme tarihi (ISO 8601) |

Örnek görev kaydı:

```json
{
  "id": "47ab21a2-9f80-4b9c-ae3f-785af08d1548",
  "title": "API dokümantasyonu hazırlanması",
  "description": "Görev endpointlerinin açıklamaları yazılacak.",
  "assignee": "Musa",
  "priority": "high",
  "status": "pending",
  "createdAt": "2026-11-11T15:30:00.000Z",
  "updatedAt": "2026-11-11T15:30:00.000Z"
}
```

*Bu kayıt sadece formatı göstermek için verilmiştir. Gerçek ID ve tarih her istekte farklı oluşur.*

## API mimarisi

```text
Postman / istemci
    |
    v
Express app (app.js)
    |
    +--> logger.js: tarih + HTTP yöntemi + adres
    |
    v
routes/taskRoutes.js: doğru adres ve yönteme yönlendirir
    |
    v
controllers/taskController.js: iş kuralı ve cevap
    |
    v
models/taskStore.js: JSON veri dosyasını okur/yazar
    |
    v
data/tasks.json
```

## Endpoint tasarımı

| İşlem | Yöntem + yol | Gönderilen veri | Sonuç |
|---|---|---|---|
| Listele | `GET /tasks` | - | Görev dizisi, 200 |
| Detay | `GET /tasks/:id` | URL'de görev ID | Görev nesnesi, 200; yoksa 404 |
| Oluştur | `POST /tasks` | JSON görev alanları | Oluşan görev, 201; hatalıysa 400 |
| Güncelle | `PUT /tasks/:id` | Değişecek alanların JSON'u | Güncellenen görev, 200; yoksa 404 |
| Sil | `DELETE /tasks/:id` | URL'de görev ID | Silme mesajı, 200; yoksa 404 |

### Örnek güncelleme

`PUT /tasks/47ab21a2-9f80-4b9c-ae3f-785af08d1548`

```json
{ "status": "completed", "priority": "low" }
```

## Veri saklama tercihi

Eğitimin temel CRUD ve JSON konularına uygun olması için bir veritabanı yerine yerel JSON dosyası kullanılmıştır. Bu yaklaşım küçük örnek projeler için yeterlidir. Çok sayıda eş zamanlı istek veya canlı kullanım için daha sonra bir veritabanına geçmek gerekir.

## Kapsam dışında tutulanlar

Filtreleme/arama, sayfalama, raporlama, ayrıca validation middleware ve kullanıcı giriş sistemi bu sürümde yoktur. Bu karar, yönergede teslim için **zorunlu olan** dört aşamaya odaklanmak için alınmıştır.
