# 📸 دليل رفع الصور - WooCommerce MCP

## ✅ تم إضافة أداة رفع الصور بنجاح!

بناءً على **WordPress REST API Documentation** من Context7، تم إضافة أداة `upload_media` لرفع الصور مباشرة إلى WordPress Media Library.

---

## 🎯 الأداة الجديدة: `upload_media`

### الوصف:
رفع صورة أو ملف وسائط إلى WordPress Media Library والحصول على ID و URL للاستخدام في المنتجات.

### المدخلات (Parameters):

| المعامل | النوع | مطلوب؟ | الوصف |
|---------|------|--------|-------|
| `filePath` | string | ✅ نعم | المسار المحلي للملف (مثل: `/home/user/image.jpg`) |
| `title` | string | ❌ لا | عنوان الصورة |
| `alt_text` | string | ❌ لا | النص البديل (Alt Text) للوصول |
| `caption` | string | ❌ لا | تعليق الصورة |
| `description` | string | ❌ لا | وصف الصورة |
| `siteUrl` | string | ❌ لا | رابط الموقع (إذا لم يكن محدد في ENV) |
| `username` | string | ❌ لا | اسم المستخدم (إذا لم يكن محدد في ENV) |
| `password` | string | ❌ لا | كلمة المرور (إذا لم تكن محددة في ENV) |

### المخرجات (Response):

```json
{
  "id": 123,
  "source_url": "https://fixzzone.com/wp-content/uploads/2025/11/battery.jpg",
  "title": "Dell 6MT4T Battery",
  "alt_text": "Dell Laptop Battery",
  "mime_type": "image/jpeg",
  "media_details": {
    "width": 1024,
    "height": 768,
    "file": "2025/11/battery.jpg",
    "sizes": {
      "thumbnail": {...},
      "medium": {...},
      "large": {...}
    }
  }
}
```

---

## 📋 أمثلة الاستخدام

### مثال 1: رفع صورة بسيطة

```
@woocommerce ارفع الصورة دي:
/home/eldrwal/Pictures/battery-dell-6mt4t.jpg
```

**النتيجة:**
```json
{
  "id": 125,
  "source_url": "https://fixzzone.com/wp-content/uploads/2025/11/battery-dell-6mt4t.jpg"
}
```

---

### مثال 2: رفع صورة مع معلومات كاملة

```
@woocommerce ارفع الصورة دي مع المعلومات التالية:
- المسار: /home/eldrwal/Desktop/battery.jpg
- العنوان: بطارية Dell 6MT4T
- Alt Text: بطارية لابتوب Dell عالية الجودة
- Caption: بطارية أصلية Dell 6MT4T
```

**سيتم تحويله إلى:**
```json
{
  "filePath": "/home/eldrwal/Desktop/battery.jpg",
  "title": "بطارية Dell 6MT4T",
  "alt_text": "بطارية لابتوب Dell عالية الجودة",
  "caption": "بطارية أصلية Dell 6MT4T"
}
```

---

### مثال 3: رفع صورة واستخدامها في منتج

#### الخطوة 1: رفع الصورة
```
@woocommerce ارفع الصورة:
/home/eldrwal/Pictures/dell-battery.jpg

عنوان: Dell 6MT4T Battery
Alt Text: Dell Laptop Battery for E5470
```

**النتيجة:**
```json
{
  "id": 150,
  "source_url": "https://fixzzone.com/wp-content/uploads/2025/11/dell-battery.jpg"
}
```

#### الخطوة 2: استخدام ID الصورة في المنتج
```
@woocommerce أنشئ منتج جديد:
- الاسم: بطارية Dell 6MT4T
- السعر: 1100
- الصور: [{"id": 150}]
```

---

## 🔄 سير العمل الكامل (Workflow)

### لإضافة منتج مع صور:

```
1️⃣ ارفع الصور:
@woocommerce ارفع الصور التالية:
- /home/eldrwal/Pictures/battery-front.jpg
- /home/eldrwal/Pictures/battery-back.jpg

2️⃣ احفظ IDs:
ID 1: 151
ID 2: 152

3️⃣ أنشئ المنتج:
@woocommerce أنشئ منتج:
{
  "name": "بطارية Dell 6MT4T",
  "type": "variable",
  "regular_price": "1100",
  "images": [
    {"id": 151},
    {"id": 152}
  ],
  "categories": [{"id": 15}]
}

4️⃣ أضف التنويعات:
@woocommerce أضف تنويعات للمنتج 883:
- High Copy: 1100 جنيه
- Original: 1850 جنيه
```

---

## 📁 أنواع الملفات المدعومة

| النوع | الامتدادات | MIME Type |
|------|------------|-----------|
| **الصور** | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg` | image/* |
| **المستندات** | `.pdf`, `.doc`, `.docx` | application/* |
| **الفيديو** | `.mp4` | video/mp4 |
| **الصوت** | `.mp3` | audio/mpeg |

---

## 🔧 التفاصيل التقنية

### كيف تعمل الأداة؟

1. **قراءة الملف**:
   - يتحقق من وجود الملف في المسار المحدد
   - يقرأ محتوى الملف كـ Buffer

2. **تحديد MIME Type**:
   - يحدد نوع الملف تلقائياً من الامتداد
   - يدعم جميع الأنواع الشائعة

3. **إنشاء Form Data**:
   - يستخدم `multipart/form-data` للرفع
   - يضيف metadata (title, alt_text, etc.)

4. **الرفع إلى WordPress**:
   - يستخدم `POST /wp/v2/media`
   - Basic Authentication مع username/password
   - يرجع ID و URL للملف المرفوع

### الكود المستخدم:

```typescript
// Read file
const fileBuffer = fs.readFileSync(params.filePath);
const fileName = path.basename(params.filePath);
const mimeType = getMimeType(fileName);

// Create form data
const formData = new FormData();
formData.append("file", fileBuffer, {
  filename: fileName,
  contentType: mimeType,
});

// Add metadata
if (params.title) formData.append("title", params.title);
if (params.alt_text) formData.append("alt_text", params.alt_text);

// Upload to WordPress
const uploadResponse = await axios.post(
  `${siteUrl}/wp-json/wp/v2/media`,
  formData,
  {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Basic ${auth}`,
    },
  }
);
```

---

## ⚠️ ملاحظات مهمة

### 1. **الصلاحيات المطلوبة**
- لازم يكون عندك `WORDPRESS_USERNAME` و `WORDPRESS_PASSWORD` في ENV
- المستخدم لازم يكون عنده صلاحية رفع الملفات

### 2. **حجم الملف**
- WordPress عنده حد أقصى لحجم الملف (عادة 2-8 MB)
- تقدر تزوده من PHP settings: `upload_max_filesize`

### 3. **المسار المحلي**
- لازم تستخدم المسار الكامل (Absolute Path)
- مثال صحيح: `/home/eldrwal/Pictures/image.jpg`
- مثال خاطئ: `~/Pictures/image.jpg` أو `./image.jpg`

### 4. **Alt Text مهم لـ SEO**
- دايماً أضف `alt_text` للصور
- يساعد في SEO وإمكانية الوصول

---

## 🎯 نصائح للاستخدام الأمثل

### 1. **تسمية الملفات**
```
✅ جيد:
- battery-dell-6mt4t-front.jpg
- keyboard-hp-840-g3-arabic.jpg

❌ سيئ:
- IMG_20231015.jpg
- صورة1.jpg
```

### 2. **تحسين الصور قبل الرفع**
- ضغط الصور لتقليل الحجم
- استخدام أبعاد مناسبة (800x800 للمنتجات)
- استخدام JPG للصور الفوتوغرافية
- استخدام PNG للصور مع خلفية شفافة

### 3. **استخدام Alt Text وصفي**
```
✅ جيد:
"بطارية لابتوب Dell 6MT4T أصلية لموديلات E5470 و E5570"

❌ سيئ:
"صورة"
"battery"
```

---

## 🧪 اختبار الأداة

### اختبار سريع:

1. **جهز صورة اختبار**:
```bash
# أنشئ صورة اختبار بسيطة
convert -size 100x100 xc:blue /tmp/test-image.jpg
```

2. **ارفعها باستخدام MCP**:
```
@woocommerce ارفع الصورة:
/tmp/test-image.jpg

عنوان: Test Image
```

3. **تحقق من النتيجة**:
- المفروض تحصل على ID
- افتح `source_url` في المتصفح للتأكد

---

## 📚 المصادر

تم بناء هذه الأداة بناءً على:
- **WordPress REST API Documentation** (Context7: `/wp-api/docs`)
- **WordPress Media Endpoint**: `POST /wp/v2/media`
- **Form Data Specification**: RFC 7578

---

## ✅ الخلاصة

الآن عندك القدرة الكاملة على:
- ✅ رفع الصور من جهازك المحلي
- ✅ إضافة معلومات كاملة للصور (Title, Alt Text, Caption)
- ✅ الحصول على ID و URL لاستخدامها في المنتجات
- ✅ رفع أنواع مختلفة من الملفات (صور، PDF، فيديو)

---

**جاهز للاستخدام! 🚀**

*تم التطوير بناءً على WordPress REST API Documentation*
*Fix Zone - نوفمبر 2025*

