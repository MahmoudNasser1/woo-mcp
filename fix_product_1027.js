const https = require('https');

// Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const productId = 1027;

// Valid Image URL (from reputable source for CI03XL)
// Using a direct placeholder if a perfect clean white background URL is hard to find directly hotlinkable.
// Let's use a very likely valid one or a cleaner one if possible. 
// WIT Computers often has good clean images. But hotlinking might be blocked.
// Let's try Amazon/Newegg type hotlink or similar from the search results if possible.
// Result 1 from search had: https://m.media-amazon.com/ ... (was blocked)
// Let's try to search for the specific image filename from a known open directory or just use a generic reliable path.
// For now, I will use a placeholder logic that worked before (LaptopKeys) but for battery.
// Actually, I'll search for a specific clean URL or utilize a known one.
// Let's try this one found on many battery sites:
const imageUrl = "https://i.imgur.com/example.jpg"; // Placeholder? No, let's use a real one if possible.
// Better strategy: Use a generic "Battery" placeholder if I can't find a guaranteed hotlink, BUT the user wants expertise.
// Let's try sourcing from a common open CDN if available.
// Failing that, I will use a specific search result that looks hotlinkable.
// Let's try: https://www.laptopbatteryexpress.com/v/vspfiles/photos/HP-CI03XL-2.jpg (from search result 2)
const batteryImage = "https://www.laptopbatteryexpress.com/v/vspfiles/photos/HP-CI03XL-2.jpg";

// --- CSS GRID STYLES (THE GOLD STANDARD) ---
const s = {
    container: "font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; max-width: 100%;",
    gradientBox: "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
    gradientBoxGreen: "background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 2px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
    innerBox: "background: white; padding: 15px; border-radius: 10px;",

    title: "font-size: 18px; font-weight: 800; margin: 0 0 15px 0; color: #4a5568; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; border-bottom: 2px solid #edf2f7; padding-bottom: 10px; margin-bottom: 15px;",
    titleGreen: "font-size: 18px; font-weight: 800; margin: 0 0 10px 0; color: #059669; border-bottom: 2px solid #edf2f7; padding-bottom: 8px;",

    gridparts: "display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px;",
    gridmodels: "display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;",

    cell: "background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 5px; border-radius: 6px; text-align: center; color: #2d3748; font-weight: 600; font-size: 13px; word-break: break-all; display: flex; align-items: center; justify-content: center; min-height: 40px;",
    cellHighlight: "background: #ebf8ff; border: 1px solid #bee3f8; padding: 10px 5px; border-radius: 6px; text-align: center; color: #2b6cb0; font-weight: 700; font-size: 13px; word-break: break-all; display: flex; align-items: center; justify-content: center; min-height: 40px;"
};

function createCell(text, highlight = false) {
    return `<div style="${highlight ? s.cellHighlight : s.cell}">${text}</div>`;
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
      <div style="${s.gridparts}">
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
      <div style="${s.gridmodels}">
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

// SEO & Attributes
const metaData = [
    { key: 'rank_math_title', value: 'بطارية لابتوب HP CI03XL | ProBook 640 G2/G3 - Fix Zone' },
    { key: 'rank_math_description', value: 'بطارية HP CI03XL الأصلية بسعة 48Wh. متوافقة مع ProBook 640/650 G2/G3. ضمان 3 شهور من Fix Zone. شحن سريع لجميع المحافظات. اطلبها الآن!' },
    { key: 'rank_math_focus_keyword', value: 'hp ci03xl battery' }
];

const attributes = [
    { name: 'Brand', visible: true, options: ['HP'] },
    { name: 'Warranty', visible: true, options: ['3 Months'] },
    { name: 'Condition', visible: true, options: ['Original New'] }
];

const productData = {
    name: "بطارية لابتوب HP CI03XL – Replacement Battery for ProBook 640/650 G2",
    description: description,
    short_description: "بطارية HP ProBook موديل CI03XL أصلية بسعة 48Wh و 11.4V. متوافقة مع موديلات 640 G2, 650 G2. ضمان 3 شهور.",
    meta_data: metaData,
    attributes: attributes,
    images: [{ src: batteryImage, name: "HP CI03XL Battery", alt: "بطارية لابتوب HP CI03XL أصلية - Fix Zone" }]
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
            console.log('✅ Product 1027 fixed with GRID LAYOUT!');
        } else {
            console.error(`❌ Failed. Status: ${res.statusCode}`);
            console.error(data);
        }
    });
});

req.write(JSON.stringify(productData));
req.end();
