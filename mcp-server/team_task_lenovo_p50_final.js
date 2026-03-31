import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const siteUrl = "https://fixzzone.com";
const username = "mahmoudeldrwal";
const password = "rYr2 hBHb uqYB mz1j 5wOn 29Db";
const consumerKey = "ck_4f07c8102d1451a5a9d35aef7884a3ba80bb61bb";
const consumerSecret = "cs_b087226ca47dbdab3eacf5bce7b16519e2a0ec32";

const auth = Buffer.from(`${username}:${password}`).toString('base64');

async function createLenovoKeyboardFull() {
    const filePath = '/home/eldrwal/.openclaw/workspace/FZ-Website-Agent/mcp-server/lenovo-p50-wm.jpg';
    
    try {
        console.log("Team Processing: Lenovo ThinkPad P50 Keyboard...");

        // 1. Upload Media
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('title', 'كيبورد Lenovo ThinkPad P50 Backlit - Fix Zone');
        formData.append('alt_text', 'Lenovo ThinkPad P50 Keyboard Original Backlit');

        const uploadRes = await axios.post(`${siteUrl}/wp-json/wp/v2/media`, formData, {
            headers: { ...formData.getHeaders(), 'Authorization': `Basic ${auth}` }
        });
        const imageId = uploadRes.data.id;
        console.log("✅ Image Uploaded! ID:", imageId);

        // 2. Prepare HTML Description
        const descriptionHTML = `
<h3>كيبورد لابتوب Lenovo ThinkPad P50</h3>
<p>استعد دقة الكتابة المعهودة من سلسلة ThinkPad مع هذه الكيبورد البديلة المخصصة لأجهزة العمل الشاق (Workstations). صممت لتتحمل ساعات العمل الطويلة بفضل هيكلها المتين واستجابة مفاتيحها المثالية، بالإضافة إلى إضاءة خلفية (Backlit) توفر لك الراحة أثناء العمل في البيئات المظلمة.</p>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 12px; margin: 25px 0;">
  <div style="background: white; padding: 20px; border-radius: 10px;">
    <h4 style="font-size: 20px; font-weight: 700; margin: 0 0 15px 0; color: #667eea;">⚙️ أرقام القطع المتوافقة (FRU)</h4>
    <div style="margin: 0; padding: 20px; background: #f5f5f5; border-radius: 10px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">00PA288</td>
          <td style="padding: 10px; border: 1px solid #ddd;">00PA370</td>
          <td style="padding: 10px; border: 1px solid #ddd;">01HW200</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">01HW282</td>
          <td style="padding: 10px; border: 1px solid #ddd;">01HW230</td>
          <td style="padding: 10px; border: 1px solid #ddd;">SN20K85152</td>
        </tr>
      </table>
    </div>
  </div>
</div>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 12px; margin: 25px 0;">
  <div style="background: white; padding: 20px; border-radius: 10px;">
    <h4 style="font-size: 20px; font-weight: 700; margin: 0 0 15px 0; color: #667eea;">💻 الأجهزة المتوافقة</h4>
    <div style="margin: 0; padding: 20px; background: #f5f5f5; border-radius: 10px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Lenovo ThinkPad P50, P51</td>
          <td style="padding: 10px; border: 1px solid #ddd;">Lenovo ThinkPad P70, P71</td>
        </tr>
      </table>
    </div>
  </div>
</div>

<h3>🛠️ المواصفات التقنية</h3>
<ul>
<li><strong>اللغة:</strong> English (US Layout)</li>
<li><strong>الإضاءة:</strong> Backlit (إضاءة خلفية)</li>
<li><strong>اللون:</strong> أسود (Black)</li>
<li><strong>الجودة:</strong> Original Quality (أصلية)</li>
<li><strong>الضمان:</strong> 3 شهور</li>
</ul>

<blockquote style="background: #f9f9f9; border-right: 10px solid #667eea; margin: 1.5em 10px; padding: 0.5em 10px; direction: rtl;">
هذه الكيبورد لا تتوافق مع موديلات P50s أو P70s، يرجى مطابقة شكل الكيبورد والـ FRU Number قبل الطلب لضمان التوافق التام.
</blockquote>

<div style="display: flex; align-items: center; background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 20px; direction: rtl;">
<div style="font-size: 24px; margin-left: 15px;">🔧</div>
<div>
<strong>خدمة التركيب الاحترافية:</strong> متوفرة في مركز فيكس زون مصر لضمان تركيب آمن لجهازك والحفاظ على سلامة الـ Chassis.
</div>
</div>
        `;

        // 3. Create Product via WooCommerce API
        const wooClient = axios.create({
            baseURL: `${siteUrl}/wp-json/wc/v3`,
            params: { consumer_key: consumerKey, consumer_secret: consumerSecret }
        });

        const productData = {
            name: "كيبورد لابتوب Lenovo ThinkPad P50 / P51 / P70 – Original Backlit Keyboard",
            type: "simple",
            status: "publish",
            regular_price: "0",
            description: descriptionHTML,
            short_description: "كيبورد Lenovo ThinkPad P50 أصلية بإضاءة خلفية. متوافقة مع موديلات P51 و P70 و P71. أداء كتابة فائق مع ضمان Fix Zone مصر.",
            categories: [{ id: 69 }],
            images: [{ id: imageId }],
            tags: [
                { name: "Lenovo" }, { name: "ThinkPad" }, { name: "P50" }, { name: "P51" }, { name: "P70" },
                { name: "Keyboard" }, { name: "كيبورد لابتوب" }, { name: "Backlit" }, { name: "Fix Zone مصر" }
            ],
            attributes: [
                { name: "Brand", options: ["Lenovo"], visible: true, variation: false },
                { name: "Quality", options: ["Original"], visible: true, variation: false },
                { name: "Backlight", options: ["Backlit"], visible: true, variation: false },
                { name: "Language", options: ["English (US)"], visible: true, variation: false }
            ],
            meta_data: [
                { key: "rank_math_title", value: "كيبورد Lenovo ThinkPad P50 أصلية | إضاءة خلفية - فيكس زون مصر" },
                { key: "rank_math_description", value: "اشتري كيبورد لابتوب Lenovo ThinkPad P50 أصلية (Backlit). متوافقة مع P51, P70, P71. ضمان Fix Zone مصر مع خدمة تركيب احترافية. اطلب الآن!" },
                { key: "rank_math_focus_keyword", value: "lenovo p50 keyboard, كيبورد lenovo p50" }
            ]
        };

        const response = await wooClient.post('/products', productData);
        console.log("✅ Team finished successfully! Product ID:", response.data.id);
        console.log(`Live Link: https://fixzzone.com/?p=${response.data.id}`);

    } catch (error) {
        console.error("FAILED.");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Message:", error.message);
        }
    }
}

createLenovoKeyboardFull();
