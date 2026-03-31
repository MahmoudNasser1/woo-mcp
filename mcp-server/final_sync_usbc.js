import axios from 'axios';

const siteUrl = "https://fixzzone.com";
const consumerKey = "ck_4f07c8102d1451a5a9d35aef7884a3ba80bb61bb";
const consumerSecret = "cs_b087226ca47dbdab3eacf5bce7b16519e2a0ec32";

const client = axios.create({
    baseURL: `${siteUrl}/wp-json/wc/v3`,
    params: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
    }
});

async function finalSync() {
    const productId = 1110;
    const descriptionHTML = `
<h3>شاحن لابتوب 65W USB-C الأصلي</h3>
<p>استمتع بتجربة شحن ذكية وسريعة مع شاحن 65W USB-C المتعدد الاستخدامات. صمم هذا الشاحن ليدعم تقنية Power Delivery (PD)، مما يجعله الخيار الأمثل لشحن مجموعة واسعة من أجهزة اللابتوب، التابلت، والهواتف الذكية بأعلى كفاءة وأمان.</p>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 12px; margin: 25px 0;">
  <div style="background: white; padding: 20px; border-radius: 10px;">
    <h4 style="font-size: 20px; font-weight: 700; margin: 0 0 15px 0; color: #667eea;">💻 الأجهزة المتوافقة</h4>
    <div style="margin: 0; padding: 20px; background: #f5f5f5; border-radius: 10px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Lenovo ThinkPad / Yoga</td>
          <td style="padding: 10px; border: 1px solid #ddd;">HP EliteBook / Spectre</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Dell Latitude / XPS</td>
          <td style="padding: 10px; border: 1px solid #ddd;">Apple MacBook Air / Pro</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">ASUS ZenBook / VivoBook</td>
          <td style="padding: 10px; border: 1px solid #ddd;">And other USB-C Devices</td>
        </tr>
      </table>
    </div>
  </div>
</div>

<h3>🛠️ المواصفات التقنية</h3>
<ul>
<li><strong>نوع الموصل:</strong> USB Type-C (USB-C)</li>
<li><strong>القدرة الإجمالية:</strong> 65 واط (65W)</li>
<li><strong>الجهد الذكي:</strong> يدعم 5V / 9V / 12V / 15V / 20V</li>
<li><strong>التيار:</strong> بحد أقصى 3.25 أمبير</li>
<li><strong>الجودة:</strong> أصلية (Original Quality)</li>
<li><strong>الضمان:</strong> 3 شهور</li>
</ul>

<blockquote style="background: #f9f9f9; border-right: 10px solid #667eea; margin: 1.5em 10px; padding: 0.5em 10px; direction: rtl;">
هذا الشاحن يدعم الأجهزة التي تتطلب 65 واط أو أقل. يرجى التأكد من أن جهازك يدعم الشحن عبر منفذ USB-C.
</blockquote>

<div style="display: flex; align-items: center; background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 20px; direction: rtl;">
<div style="font-size: 24px; margin-left: 15px;">🔧</div>
<div>
<strong>خدمة الفحص المجاني:</strong> متوفرة في مركز فيكس زون مصر للتأكد من توافق الشاحن مع جهازك واختبار سرعة الشحن قبل الاستلام.
</div>
</div>
    `;

    try {
        console.log("Syncing Details...");
        await client.put(`/products/${productId}`, {
            description: descriptionHTML,
            short_description: "شاحن لابتوب 65 واط بمنفذ USB-C. يدعم تقنية الشحن السريع PD لجميع الماركات (Lenovo, HP, Dell, MacBook). ضمان 3 شهور من Fix Zone مصر.",
            tags: [{ name: "USB-C" }, { name: "Charger" }, { name: "65W" }, { name: "Fix Zone مصر" }],
            attributes: [
                { name: "Brand", options: ["Universal"], visible: true },
                { name: "Quality", options: ["Original"], visible: true }
            ],
            meta_data: [
                { key: "rank_math_title", value: "شاحن 65W USB-C أصلي لجميع أنواع اللابتوب - فيكس زون مصر" },
                { key: "rank_math_description", value: "اشتري شاحن 65W USB-C أصلي متوافق مع Lenovo, HP, Dell, MacBook. شحن سريع وأمان تام مع ضمان 3 شهور. متوفر الآن في فيكس زون مصر." },
                { key: "rank_math_focus_keyword", value: "65w usb-c charger" }
            ]
        });
        console.log("FINAL_SUCCESS_99");
    } catch (e) { console.log("FINAL_ERROR_99:" + e.message); }
}

finalSync();
