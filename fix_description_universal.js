const https = require('https');

// Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const productId = 1023;

// --- UNIVERSAL FLEX STYLES ---
const s = {
    container: "font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; max-width: 100%;",
    gradientBox: "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
    gradientBoxGreen: "background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 2px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
    innerBox: "background: white; padding: 20px; border-radius: 10px;",

    title: "font-size: 18px; font-weight: 800; margin: 0 0 15px 0; color: #4a5568; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;",
    titleGreen: "font-size: 18px; font-weight: 800; margin: 0 0 15px 0; color: #059669; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;",

    // THE MAGIC: Universal Flex Container
    flexContainer: "display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;", // Center items for balanced look

    // The Chip/Badge Style
    chip: "background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 8px; color: #2d3748; font-weight: 600; font-size: 14px; text-align: center; flex: 1 1 auto; min-width: 80px; max-width: 100%; word-break: break-word;",

    // Highlight Chip (optional, for main model)
    chipHighlight: "background: #ebf8ff; border: 1px solid #bee3f8; padding: 10px 14px; border-radius: 8px; color: #2c5282; font-weight: 700; font-size: 14px; text-align: center; flex: 1 1 auto; min-width: 100px;"
};

// Helper builder
function createChip(text, highlight = false) {
    return `<span style="${highlight ? s.chipHighlight : s.chip}">${text}</span>`;
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
      <div style="${s.flexContainer}">
        ${createChip('0HG3G3')} ${createChip('HG3G3')} ${createChip('07T425')} ${createChip('7T425')}
        ${createChip('NSK-DW2BC')} ${createChip('PK130FH1A00')} ${createChip('M8F00')} ${createChip('0F5YDT')}
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
        ${createChip('Dell Latitude E6540', true)}
        ${createChip('Dell Latitude E6520', true)}
        ${createChip('Dell Latitude E6530', true)}
        ${createChip('Dell Latitude E5520')}
        ${createChip('Dell Latitude E5530')}
        ${createChip('Dell Precision M4800')}
        ${createChip('Dell Precision M6800')}
        ${createChip('Dell Precision M4600')}
        ${createChip('Dell Precision M6600')}
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
            console.log('✅ Product description fixed with UNIVERSAL FLEXBOX!');
        } else {
            console.error(`❌ Failed. Status: ${res.statusCode}`);
            console.error(data);
        }
    });
});

req.write(JSON.stringify(productData));
req.end();
