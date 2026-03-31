# دليل التثبيت والإعداد - WooCommerce MCP Server

## المشكلة التي تم إصلاحها ✅

الإصدار السابق من السيرفر كان يستخدم بروتوكول JSON-RPC مخصص وغير متوافق مع بروتوكول MCP القياسي. تم إصلاح المشكلة بالكامل الآن!

### التحديثات الجديدة:
- ✅ دعم كامل لبروتوكول MCP باستخدام SDK الرسمي
- ✅ التوافق مع Claude Desktop وجميع عملاء MCP
- ✅ معالجة أفضل للأخطاء
- ✅ واجهات قياسية للأدوات

---

## متطلبات التشغيل

1. **Node.js** (الإصدار 18 أو أحدث)
2. **متجر WooCommerce** يعمل على WordPress
3. **صلاحيات API** لـ WooCommerce

---

## خطوات التثبيت

### 1. تحضير السيرفر

```bash
cd /home/eldrwal/Desktop/Fix\ Zone\ Agint/woocommerce-mcp-server-main
npm install
npm run build
```

### 2. الحصول على بيانات الاعتماد (API Credentials)

#### أ. مفاتيح WooCommerce API:
1. ادخل لوحة تحكم WordPress
2. اذهب إلى: **WooCommerce → الإعدادات → متقدم → REST API**
3. اضغط **Add key**
4. اختر المستخدم (User)
5. اجعل الصلاحيات **Read/Write**
6. احفظ المفتاحين:
   - Consumer Key (يبدأ بـ `ck_`)
   - Consumer Secret (يبدأ بـ `cs_`)

#### ب. كلمة مرور تطبيق WordPress (للمقالات فقط):
1. اذهب إلى: **المستخدمون → ملفك الشخصي**
2. انزل لأسفل لـ **Application Passwords**
3. أدخل اسم للتطبيق (مثل: MCP Server)
4. اضغط **Add New Application Password**
5. احفظ كلمة المرور (تظهر مرة واحدة فقط)

---

## 3. إعداد Claude Desktop

### على macOS:
افتح الملف:
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

### على Windows:
افتح الملف:
```
%APPDATA%\Claude\claude_desktop_config.json
```

### على Linux:
افتح الملف:
```bash
~/.config/Claude/claude_desktop_config.json
```

### أضف هذا الكود (غيّر البيانات بالقيم الحقيقية):

```json
{
  "mcpServers": {
    "woocommerce": {
      "command": "node",
      "args": ["/home/eldrwal/Desktop/Fix Zone Agint/woocommerce-mcp-server-main/build/index.js"],
      "env": {
        "WORDPRESS_SITE_URL": "https://fixzone.com.eg",
        "WOOCOMMERCE_CONSUMER_KEY": "ck_xxxxxxxxxxxxxxxxxxxx",
        "WOOCOMMERCE_CONSUMER_SECRET": "cs_xxxxxxxxxxxxxxxxxxxx",
        "WORDPRESS_USERNAME": "mahmoud",
        "WORDPRESS_PASSWORD": "xxxx xxxx xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

⚠️ **ملاحظة**: غيّر:
- `/home/eldrwal/Desktop/Fix Zone Agint/...` للمسار الصحيح عندك
- `https://fixzone.com.eg` لرابط موقعك
- المفاتيح باللي حصلت عليها

---

## 4. إعادة تشغيل Claude Desktop

بعد حفظ الملف:
1. أغلق Claude Desktop تماماً
2. افتحه من جديد
3. تأكد إنك شايف WooCommerce في قائمة الأدوات المتاحة

---

## الأدوات المتاحة

### إدارة المنتجات
- **get_products** - عرض قائمة المنتجات
- **get_product** - عرض منتج واحد بالـ ID
- **create_product** - إنشاء منتج جديد
- **update_product** - تحديث منتج موجود
- **delete_product** - حذف منتج

### التصنيفات
- **get_product_categories** - عرض التصنيفات
- **create_product_category** - إنشاء تصنيف جديد
- **update_product_category** - تحديث تصنيف

### التنويعات (Variations)
- **get_product_variations** - عرض تنويعات المنتج
- **create_product_variation** - إنشاء تنويعة جديدة
- **update_product_variation** - تحديث تنويعة

### الطلبات
- **get_orders** - عرض الطلبات
- **get_order** - عرض طلب واحد
- **create_order** - إنشاء طلب جديد
- **update_order** - تحديث طلب

---

## أمثلة الاستخدام

### مثال 1: إنشاء منتج بتنويعات (High Copy & Original)

```json
{
  "name": "create_product",
  "arguments": {
    "productData": {
      "name": "بطارية لابتوب Dell 6MT4T – Replacement Battery for Dell Latitude E5470",
      "type": "variable",
      "status": "publish",
      "description": "<h3>Compatible Battery Part Numbers</h3><ul><li>6MT4T</li><li>79VRK</li><li>451-BBVS</li></ul><h3>Compatible Models</h3><ul><li>Dell Latitude E5450</li><li>Dell Latitude E5470</li><li>Dell Latitude E5550</li></ul>",
      "short_description": "بطارية Dell 6MT4T - High Copy & Original - ضمان Fix Zone",
      "categories": [{"id": 15}],
      "attributes": [
        {
          "name": "الجودة",
          "visible": true,
          "variation": true,
          "options": ["High Copy", "Original"]
        },
        {
          "name": "Part Number",
          "visible": true,
          "variation": false,
          "options": ["6MT4T"]
        }
      ],
      "tags": [
        {"name": "Dell"},
        {"name": "Latitude"},
        {"name": "Battery"}
      ]
    }
  }
}
```

### مثال 2: إضافة التنويعات

بعد إنشاء المنتج (لنفترض ID = 123):

```json
// High Copy Variation
{
  "name": "create_product_variation",
  "arguments": {
    "productId": 123,
    "variationData": {
      "regular_price": "1100",
      "stock_status": "instock",
      "manage_stock": true,
      "stock_quantity": 10,
      "attributes": [
        {
          "name": "الجودة",
          "option": "High Copy"
        }
      ]
    }
  }
}

// Original Variation
{
  "name": "create_product_variation",
  "arguments": {
    "productId": 123,
    "variationData": {
      "regular_price": "1850",
      "stock_status": "instock",
      "manage_stock": true,
      "stock_quantity": 5,
      "attributes": [
        {
          "name": "الجودة",
          "option": "Original"
        }
      ]
    }
  }
}
```

### مثال 3: عرض المنتجات

```json
{
  "name": "get_products",
  "arguments": {
    "perPage": 20,
    "page": 1,
    "filters": {
      "status": "publish",
      "category": "15"
    }
  }
}
```

---

## حل المشاكل الشائعة

### 1. "WordPress site URL not provided"
**الحل**: تأكد من وجود `WORDPRESS_SITE_URL` في ملف التكوين

### 2. "WooCommerce API credentials not provided"
**الحل**: تأكد من المفاتيح صحيحة وموجودة في ملف التكوين

### 3. Claude لا يرى الأدوات
**الحل**:
- تأكد إنك حفظت ملف التكوين
- أعد تشغيل Claude Desktop بالكامل
- تأكد من المسار الكامل للملف `index.js` صحيح

### 4. أخطاء SSL
إذا كان الموقع يستخدم شهادة غير موثوقة:
```json
"env": {
  "NODE_TLS_REJECT_UNAUTHORIZED": "0",
  ...
}
```
⚠️ **تحذير**: لا تستخدم هذا في الإنتاج

### 5. الاتصال بطيء أو timeout
- تأكد إن النت شغال
- تأكد إن السيرفر يستجيب
- جرب زيادة timeout في إعدادات axios

---

## التحديثات القادمة

- [ ] دعم رفع الصور
- [ ] دعم Product Attributes المخصصة
- [ ] دعم Bulk Operations
- [ ] دعم التقارير والإحصائيات

---

## الدعم الفني

في حالة وجود أي مشاكل:
1. تأكد من تحديث الحزم: `npm update`
2. أعد البناء: `npm run build`
3. راجع ملف التكوين
4. تحقق من logs في terminal

---

## الترخيص

MIT License

تم التعديل والإصلاح لـ Fix Zone بواسطة محمود 🚀

