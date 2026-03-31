const https = require('https');

// Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const productId = 1023;

// --- CSS GRID STYLES ---
const s = {
    container: "font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; max-width: 100%;",
    gradientBox: "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
    gradientBoxGreen: "background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 2px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
    innerBox: "background: white; padding: 15px; border-radius: 10px;",

    title: "font-size: 18px; font-weight: 800; margin: 0 0 15px 0; color: #4a5568; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; border-bottom: 2px solid #edf2f7; padding-bottom: 10px; margin-bottom: 15px;",
    titleGreen: "font-size: 18px; font-weight: 800; margin: 0 0 10px 0; color: #059669; border-bottom: 2px solid #edf2f7; padding-bottom: 8px;",

    // GRID CONTAINER
    // auto-fill with minmax ensures items take at least 110px but expand to fill row nicely
    gridparts: "display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px;",
    gridmodels: "display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;",

    // GRID ITEM
    cell: "background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 5px; border-radius: 6px; text-align: center; color: #2d3748; font-weight: 600; font-size: 13px; word-break: break-all; display: flex; align-items: center; justify-content: center; min-height: 40px;",

    cellHighlight: "background: #ebf8ff; border: 1px solid #bee3f8; padding: 10px 5px; border-radius: 6px; text-align: center; color: #2b6cb0; font-weight: 700; font-size: 13px; word-break: break-all; display: flex; align-items: center; justify-content: center; min-height: 40px;"
};

function createCell(text, highlight = false) {
    return `<div style="${highlight ? s.cellHighlight : s.cell}">${text}</div>`;
}

const description = `
<div style="${s.container}">

  <h3 style="color: #2d3748; margin-bottom: 10px; font-size: 20px;">كيبورد Dell Latitude E6540 - دقة وأداء عالي</h3>
  <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px; font-size: 15px;">جدد كيبورد جهازك مع كيبورد Dell Latitude E6540 الأصلي من Fix Zone. مصمم ليوفر تجربة كتابة مريحة وسريعة الاستجابة، مع دعم كامل للإضاءة الخلفية للعمل في الظروف المظلمة. هذا الكيبورد هو الخيار الأمثل لاستعادة كفاءة اللابتوب الخاص بك.</p>

  <!-- Part Numbers -->
  <div style="${s.gradientBox}">
    <div style="${s.innerBox}">
      <h4 style="${s.title}">
        ⚙️ <span style="display:inline-block">أرقام القطع</span>
        <span style="font-size: 14px; color: #718096; font-weight: normal;">(Part Numbers)</span>
      </h4>
      <div style="${s.gridparts}">
        ${createCell('0HG3G3')} ${createCell('HG3G3')} ${createCell('07T425')} ${createCell('7T425')}
        ${createCell('NSK-DW2BC')} ${createCell('PK130FH1A00')} ${createCell('M8F00')} ${createCell('0F5YDT')}
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
        ${createCell('Dell Latitude E6540', true)}
        ${createCell('Dell Latitude E6520', true)}
        ${createCell('Dell Latitude E6530', true)}
        ${createCell('Dell Latitude E5520')}
        ${createCell('Dell Latitude E5530')}
        ${createCell('Dell Precision M4800')}
        ${createCell('Dell Precision M6800')}
        ${createCell('Dell Precision M4600')}
        ${createCell('Dell Precision M6600')}
      </div>
    </div>
  </div>

  <div style="${s.gradientBoxGreen}">
    <div style="${s.innerBox}">
          <h4 style="${s.titleGreen}">✨ المواصفات الفنية</h4>
          <ul style="list-style: none; padding: 0; font-weight: 600; color: #2d3748; margin: 0; font-size: 14px;">
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

// Only updating description
const productData = {
    description: description
};

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
            console.log('✅ Product description layout fixed using CSS GRID!');
        } else {
            console.error(`❌ Failed. Status: ${res.statusCode}`);
            console.error(data);
        }
    });
});

req.write(JSON.stringify(productData));
req.end();
