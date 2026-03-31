# 🎉 مرحباً بك في Fix Zone Agent - WooCommerce MCP

## ✅ تم تنظيم المشروع بنجاح!

تمت إعادة هيكلة المشروع ليكون منظم ومناسب للعمل:

---

## 📁 محتويات المشروع الجديدة

```
Fix Zone Agint/
├── mcp-server/                           (السيرفر الأساسي)
│   ├── src/                              (الكود المصدري)
│   ├── build/                            (الكود المُنفَّذ)
│   ├── README.md                         (دليل فني مفصل)
│   ├── SETUP_GUIDE_AR.md                 (دليل التثبيت)
│   └── claude_desktop_config.example.json
│
├── scripts/                              (سكربتات المعالجة - Python)
├── docs/                                 (المكتبة والوثائق)
│   ├── archive/                          (أرشيف الملفات القديمة)
│   ├── fixzone-product-agent-prompt.md   (البرومبت الأساسي)
│   └── README_FIRST.md                   (هذا الملف)
│
├── assets/                               (الصور)
├── data/                                 (البيانات)
└── .agent/workflows/                     (سير العمل)
```

---

## 🚀 ابدأ من هنا (Quick Start)

### 1️⃣ تشغيل السيرفر
```bash
cd mcp-server
npm install
npm run build
```

### 2️⃣ مراجعة الأدلة
كل الأدلة المهمة موجودة الآن في مجلد `docs/`.

### 3️⃣ العمل مع الوكيل
استخدم الوكيل بناءً على الملفات الموجودة في `docs/` و سير العمل في `.agent/workflows/`.

---

## 📖 الملفات المهمة (المحدثة)

| الملف | المكان | الغرض |
|------|--------|-------|
| **fixzone-product-agent-prompt.md** | `docs/` | العقل المدبر لإضافة المنتجات |
| **fixzone-market-research-agent.md** | `docs/` | دليل بحث السوق |
| **RANK_MATH_SEO_GUIDE.md** | `docs/` | دليل تحسين محركات البحث |
| **README.md** | `mcp-server/` | الدليل التقني للسيرفر |

---

## ⚡ الأوامر المهمة

### بناء السيرفر:
```bash
cd mcp-server
npm install
npm run build
```

---

## 🎓 ملاحظة
تم نقل جميع التقارير القديمة وملفات الحالة السابقة إلى مجلد `docs/archive` للحفاظ على نظافة المشروع.

**بالتوفيق! 🚀**

بيانات فيكس زون 
  "woocommerce": {
            "command": "node",
            "args": [
                "/home/eldrwal/Desktop/Fix Zone Agint/woocommerce-mcp-server-main/build/index.js"
            ],
            "env": {
                "WORDPRESS_SITE_URL": "https://fixzzone.com",
                "WOOCOMMERCE_CONSUMER_KEY": "process.env.WOOCOMMERCE_CONSUMER_KEY",
                "WOOCOMMERCE_CONSUMER_SECRET": "process.env.WOOCOMMERCE_CONSUMER_SECRET",
                "WORDPRESS_USERNAME": "mahmoudeldrwal",
                "WORDPRESS_PASSWORD": "rYr2 hBHb uqYB mz1j 5wOn 29Db"
            }
        },

