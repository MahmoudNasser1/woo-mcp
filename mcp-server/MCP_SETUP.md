# 🔧 إعداد WooCommerce MCP Server

## الإعدادات الجاهزة للاستخدام

أضف هذا الإعداد في ملف تكوين MCP الخاص بك (مثل `claude_desktop_config.json` أو `mcp_config.json`):

```json
{
  "mcpServers": {
    "woocommerce": {
      "command": "node",
      "args": ["/home/eldrwal/Desktop/Fix Zone Agint/woocommerce-mcp-server-main/build/index.js"],
      "env": {
        "WORDPRESS_SITE_URL": "https://fixzzone.com",
        "WOOCOMMERCE_CONSUMER_KEY": "process.env.WOOCOMMERCE_CONSUMER_KEY",
        "WOOCOMMERCE_CONSUMER_SECRET": "process.env.WOOCOMMERCE_CONSUMER_SECRET",
        "WORDPRESS_USERNAME": "mahmoudeldrwal",
        "WORDPRESS_PASSWORD": "rYr2 hBHb uqYB mz1j 5wOn 29Db"
      }
    }
  }
}
```

## الأدوات المتاحة (v1.1.0)

### 🆕 الأدوات الجديدة:

| الأداة | الوصف |
|--------|-------|
| `search_products` | البحث عن منتجات بالاسم أو SKU أو Part Number |
| `check_duplicate` | التحقق من وجود منتج مكرر قبل الإنشاء |
| `get_product_tags` | عرض كل Tags المتجر |
| `create_product_tag` | إنشاء Tag جديد |
| `get_media` | عرض الصور من مكتبة الوسائط |
| `delete_media` | حذف صورة من مكتبة الوسائط |

### الأدوات الموجودة:

| الفئة | الأدوات |
|-------|---------|
| **Products** | `get_products`, `get_product`, `create_product`, `update_product`, `delete_product` |
| **Categories** | `get_product_categories`, `get_product_category`, `create_product_category`, `update_product_category` |
| **Variations** | `get_product_variations`, `create_product_variation`, `update_product_variation` |
| **Orders** | `get_orders`, `get_order`, `create_order`, `update_order` |
| **Media** | `upload_media`, `get_media`, `delete_media` |
| **Rank Math SEO** | `get_rank_math_seo`, `update_rank_math_seo` |
| **WordPress** | `create_post`, `get_posts`, `update_post` |

## أمثلة الاستخدام

### 1. البحث عن منتج قبل الإنشاء:
```
@woocommerce search_products search="Dell E5470"
```

### 2. التحقق من التكرار:
```
@woocommerce check_duplicate partNumber="6MT4T"
```

### 3. عرض Tags الموجودة:
```
@woocommerce get_product_tags perPage=100
```

### 4. إنشاء Tag جديد:
```
@woocommerce create_product_tag name="Dell Latitude"
```

### 5. تحديث SEO للمنتج:
```
@woocommerce update_rank_math_seo productId=1007 title="بطارية Dell 6MT4T | Fix Zone" focusKeyword="dell 6mt4t battery"
```

## ✅ تم اختبار الاتصال بنجاح!

- ✅ المتجر: https://fixzzone.com
- ✅ المنتجات: يتم استرجاعها بنجاح
- ✅ البحث: يعمل بشكل صحيح
- ✅ Tags: يتم عرضها (20+ tags موجودة)

---
*Version: 1.1.0*
*آخر تحديث: ديسمبر 2025*
