const https = require('https');

// Initialize API Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const productId = 1023;

// --- CONTENT BUILDER ---
const title = "كيبورد لابتوب Dell Latitude E6540 - Replacement Keyboard US Backlit";
const shortDesc = "كيبورد لابتوب Dell Latitude E6540 بديل بجودة عالية (Original). متوفر بإضاءة خلفية (Backlit) وتخطيط US English. متوافق مع موديلات E6520, E6530, E5530. ضمان 3 شهور من Fix Zone.";

const description = `
<style>
  .fz-container { font-family: 'Cairo', sans-serif; direction: rtl; }
  .fz-gradient-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
  .fz-inner-box { background: white; padding: 25px; border-radius: 10px; }
  .fz-title { font-size: 22px; font-weight: 800; margin: 0 0 20px 0; color: #4a5568; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #edf2f7; padding-bottom: 10px; }
  .fz-table-wrapper { overflow-x: auto; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; }
  .fz-responsive-table { width: 100%; border-collapse: collapse; min-width: 300px; }
  .fz-responsive-table td { padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center; }
  .fz-responsive-table tr:last-child td { border-bottom: none; }
  .fz-responsive-table tr:nth-child(even) { background-color: #f7fafc; }
  .fz-responsive-table tr:hover { background-color: #ebf4ff; transition: background 0.2s; }
</style>

<div class="fz-container">

  <h3>كيبورد Dell Latitude E6540 - دقة وأداء عالي</h3>
  <p>جدد كيبورد جهازك مع كيبورد Dell Latitude E6540 الأصلي من Fix Zone. مصمم ليوفر تجربة كتابة مريحة وسريعة الاستجابة، مع دعم كامل للإضاءة الخلفية للعمل في الظروف المظلمة. هذا الكيبورد هو الخيار الأمثل لاستعادة كفاءة اللابتوب الخاص بك.</p>

  <!-- Part Numbers Table -->
  <div class="fz-gradient-box">
    <div class="fz-inner-box">
      <h4 class="fz-title">⚙️ أرقام القطع المتوافقة (Part Numbers)</h4>
      <div class="fz-table-wrapper">
        <table class="fz-responsive-table">
          <tr>
             <td>0HG3G3</td>
             <td>HG3G3</td>
             <td>07T425</td>
             <td>7T425</td>
          </tr>
          <tr>
             <td>NSK-DW2BC</td>
             <td>PK130FH1A00</td>
             <td>M8F00</td>
             <td>0F5YDT</td>
          </tr>
        </table>
      </div>
    </div>
  </div>

  <!-- Compatible Models Table -->
  <div class="fz-gradient-box">
    <div class="fz-inner-box">
      <h4 class="fz-title">💻 موديلات اللابتوب المتوافقة (Compatible Models)</h4>
      <div class="fz-table-wrapper">
        <table class="fz-responsive-table">
          <tr>
            <td>Dell Latitude E6540</td>
            <td>Dell Latitude E6520</td>
            <td>Dell Latitude E6530</td>
          </tr>
          <tr>
            <td>Dell Latitude E5520</td>
            <td>Dell Latitude E5530</td>
            <td>Dell Precision M4800</td>
          </tr>
          <tr>
            <td>Dell Precision M6800</td>
            <td>Dell Precision M4600</td>
            <td>Dell Precision M6600</td>
          </tr>
        </table>
      </div>
    </div>
  </div>

  <div class="fz-gradient-box" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
    <div class="fz-inner-box">
          <h4 class="fz-title" style="color: #059669;">✨ المواصفات الفنية</h4>
          <ul style="list-style: none; padding: 0; font-weight: 600; color: #2d3748;">
              <li style="margin-bottom: 10px;">✅ الحالة: Original New</li>
              <li style="margin-bottom: 10px;">✅ اللغة: US English (QWERTY)</li>
              <li style="margin-bottom: 10px;">✅ الإضاءة: نعم (Backlit)</li>
              <li style="margin-bottom: 10px;">✅ الضمان: 3 شهور (استبدال فوري)</li>
              <li style="margin-bottom: 0;">✅ اللون: أسود</li>
          </ul>
    </div>
  </div>

</div>
`;

// SEO Data
const metaData = [
    { key: 'rank_math_title', value: 'كيبورد لابتوب Dell Latitude E6540 | Backlit US - Fix Zone' },
    { key: 'rank_math_description', value: 'كيبورد Dell Latitude E6540 الأصلي بإضاءة خلفية. متوافق مع E6520/E6530/M4800. ضمان 3 شهور من Fix Zone. اطلب الآن لتوصيل سريع!' },
    { key: 'rank_math_focus_keyword', value: 'dell latitude e6540 keyboard' }
];

// Product Data Object
const productData = {
    name: title,
    description: description,
    short_description: shortDesc,
    meta_data: metaData,
    attributes: [
        { name: 'Brand', visible: true, options: ['Dell'] },
        { name: 'Warranty', visible: true, options: ['3 Months'] },
        { name: 'Condition', visible: true, options: ['Original New'] },
        { name: 'Language', visible: true, options: ['US English'] },
        { name: 'Backlight', visible: true, options: ['Yes'] }
    ]
    // Note: Images are purposely omitted as we don't have local files to upload.
};

// --- UPDATE FUNCTION ---
const request = https.request(`${baseUrl}/products/${productId}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FixZone-Repair-Agent'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ Product 1023 updated successfully!');
            const response = JSON.parse(data);
            console.log(`   - New Title: ${response.name}`);
            console.log(`   - Status: ${response.status}`);
            console.log(`   - Link: ${response.permalink}`);
        } else {
            console.error(`❌ Failed to update. Status: ${res.statusCode}`);
            console.error(data);
        }
    });
});

request.on('error', (e) => {
    console.error(`❌ Request Error: ${e.message}`);
});

request.write(JSON.stringify(productData));
request.end();
