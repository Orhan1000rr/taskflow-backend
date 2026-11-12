# Test ve Teslim Rehberi

## 1. Postman ile beş temel test

Önce `npm start` ile sunucuyu başlatın. `postman/TaskFlow.postman_collection.json` dosyasını **Import** ile yükleyin. Koleksiyondaki istekleri **01 → 02 → 03 → 04 → 05** sırasıyla tek tek gönderin. İlk istek dönen `id` değerini kaydeder. Diğer istekler bu ID'yi kullanır.

| Sıra | İstek | Beklenen durum | Ekran görüntüsü için dosya adı |
|---|---|---|---|
| 01 | POST `/tasks` | `201 Created`, yeni görevin ID'si | `01-gorev-ekleme.png` |
| 02 | GET `/tasks` | `200 OK`, dizi içinde eklenen görev | `02-gorev-listeleme.png` |
| 03 | GET `/tasks/{{taskId}}` | `200 OK`, tek görev | `03-gorev-detayi.png` |
| 04 | PUT `/tasks/{{taskId}}` | `200 OK`, durum `in-progress` | `04-gorev-guncelleme.png` |
| 05 | DELETE `/tasks/{{taskId}}` | `200 OK`, silme mesajı | `05-gorev-silme.png` |

İsteğe bağlı `06 - Silinen Görev Kontrolü` isteği, silinmiş göreve `GET` yapınca `404 Not Found` döndüğünü kanıtlar.

**Ekran görüntülerini sizin bilgisayarınızdan çekmeniz gerekir.** Dosyanın içinde önceden alınmış/sunulmuş gibi görünen ekran görüntüleri yoktur. Postman'da her isteği gönderin, istek yöntemini, URL'yi, yanıtı ve HTTP durumunu aynı karede gösterin. Windows'ta **Win + Shift + S** ile alan seçip görüntüyü `docs/screenshots/` klasörüne kaydedebilirsiniz. İdeal olarak beş görüntünün tamamını tek tek alın.

## 2. Otomatik test (ek kontrol)

Terminalde sunucuyu açmanız gerekmeden:

```bat
npm test
```

Bu testler verileri geçici dosyada tutar ve mevcut görevlerinizi bozmaz. Bu komut Postman ekran görüntülerinin yerine **geçmez**.

## 3. GitHub üzerinde teslim

1. https://github.com/ adresine girip oturum açın.
2. Sağ üstteki **+ → New repository** ile örneğin `taskflow-api` isimli repo oluşturun.
3. **Public** seçin ve repoyu oluşturun.
4. Bilgisayarınızda **TaskFlow** klasöründe terminal açın. Git kuruluysa komutlarla yükleyebilirsiniz:

   ```bat
   git init
   git add .
   git commit -m "TaskFlow temel CRUD API"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/taskflow-api.git
   git push -u origin main
   ```

   `KULLANICI_ADINIZ` bölümünü GitHub kullanıcı adınızla değiştirin. GitHub kimlik doğrulaması isteyebilir.

5. Alternatif olarak GitHub repo sayfasında **Add file → Upload files** ile ZIP'in içindeki **TaskFlow klasörünün içeriğini** yükleyebilirsiniz. `node_modules` klasörünü yüklemeyin.
6. Repo sayfasında `README.md`, `package.json`, `src/`, `docs/`, `postman/` ve **beş gerçek ekran görüntüsünün** göründüğünü kontrol edin.

## 4. Son teslim kontrol listesi

- [ ] Express sunucusu çalışıyor (`npm start`)
- [ ] Beş CRUD endpoint'i çalışıyor
- [ ] Logger terminale zaman + yöntem + URL yazıyor
- [ ] README içinde kurulum ve çalışma adımları var
- [ ] 1-2 sayfalık proje tanıtım dokümanı var (`docs/Proje_Tanitim.pdf`)
- [ ] Veri modeli / API adresleri belgelenmiş
- [ ] Postman koleksiyonu içe aktarıldı ve test edildi
- [ ] `docs/screenshots/` içinde gerçek beş Postman görüntüsü var
- [ ] GitHub deposu **public** durumda
- [ ] `node_modules` ve yerel veri dosyası repo dışında
