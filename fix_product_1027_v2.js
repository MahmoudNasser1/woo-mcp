const https = require('https');

// Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const productId = 1027;

const batteryImage = "https://www.laptopbatteryexpress.com/v/vspfiles/photos/HP-CI03XL-2.jpg";

// --- CONSTRAINED FLEX STYLES ---
// The solution to "Wide Bars": Limit the max-width of items.
const s = {
    container: "font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; max-width: 100%;",

    gradientBox: "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
    gradientBoxGreen: "background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 2px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
    innerBox: "background: white; padding: 15px; border-radius: 10px;",

    title: "font-size: 18px; font-weight: 800; margin: 0 0 15px 0; color: #4a5568; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; border-bottom: 2px solid #edf2f7; padding-bottom: 10px; margin-bottom: 15px;",
    titleGreen: "font-size: 18px; font-weight: 800; margin: 0 0 10px 0; color: #059669; border-bottom: 2px solid #edf2f7; padding-bottom: 8px;",

    // FLEX CONTAINER
    // justify-content: center keeps them balanced.
    // gap: 8px for spacing.
    flexContainer: "display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;",

    // FLEX ITEM (The Chip)
    // flex: 1 0 120px -> Grow: 1, Shrink: 0, Basis: 120px (Minimum width)
    // max-width: 200px -> STOP stretching before it becomes a 'bar'.
    cell: "background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px; text-align: center; color: #2d3748; font-weight: 600; font-size: 13px; display: flex; align-items: center; justify-content: center; min-height: 35px; flex: 1 0 120px; max-width: 220px;"
};

function createCell(text) {
    return `<div style="${s.cell}">${text}</div>`;
}

// Data
const partNumbers = ['CI03XL', 'CI03', 'HSTNN-UB6Q', '801517-421', '801554-001', 'T7B31AA'];
const models = ['ProBook 640 G2', 'ProBook 645 G2', 'ProBook 650 G2', 'ProBook 655 G2', 'ProBook 640 G3', 'ProBook 650 G3'];

const description = `
<div style="${s.container}">

  <h3 style="color: #2d3748; margin-bottom: 10px; font-size: 20px;">بطارية HP CI03XL - طاقة تدوم طويلاً</h3>
  <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px; font-size: 15px;">استعد كفاءة لابتوب HP ProBook مع بطارية CI03XL الأصلية. توفر أداء موثوق وعمر افتراضي طويل بفضل خلايا الليثيوم عالية الجودة. الخيار الأمثل للعمل المتواصل دون انقطاع.</p>

  <!-- Part Numbers -->
  <div style="${s.gradientBox}">
    <div style="${s.innerBox}">
      <h4 style="${s.title}">
        ⚙️ <span style="display:inline-block">أرقام القطع</span>
        <span style="font-size: 14px; color: #718096; font-weight: normal;">(Part Numbers)</span>
      </h4>
      <div style="${s.flexContainer}">
        ${partNumbers.map(p => createCell(p)).join(' ')}
      </div>
    </div>
  </div>

  <!-- Compatible Models -->
  <div style="${s.gradientBox}">
    <div style="${s.innerBox}">
      <h4 style="${s.title}">
        💻 <span style="display:inline-block">الموديلات المتوافقة</span>
        <span style="font-size: 14px; color: #718096; font-weight: normal;">(Models)</span>
      </h4>
      <div style="${s.flexContainer}">
        ${models.map(m => createCell(m)).join(' ')}
      </div>
    </div>
  </div>

  <div style="${s.gradientBoxGreen}">
    <div style="${s.innerBox}">
          <h4 style="${s.titleGreen}">✨ المواصفات الفنية</h4>
          <ul style="list-style: none; padding: 0; font-weight: 600; color: #2d3748; margin: 0; font-size: 14px;">
              <li style="margin-bottom: 10px;">✅ الفولت: 11.4V</li>
              <li style="margin-bottom: 10px;">✅ السعة: 48Wh (3-Cell)</li>
              <li style="margin-bottom: 10px;">✅ النوع: Li-ion Polymer</li>
              <li style="margin-bottom: 10px;">✅ الضمان: 3 شهور (استبدال فوري)</li>
              <li style="margin-bottom: 0;">✅ الحالة: Original New</li>
          </ul>
    </div>
  </div>

</div>
`;

// Reuse previous SEO/Attribute data, just update desc
const productData = {
    description: description
};

// PUT Request
const req = https.request(`${baseUrl}/products/${productId}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FixZone-Agent'
    }
}, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ Product 1027 Fixed: Constrained Flexbox!');
        } else {
            console.error(`❌ Failed. Status: ${res.statusCode}`);
            console.error(data);
        }
    });
});

req.write(JSON.stringify(productData));
req.end();
