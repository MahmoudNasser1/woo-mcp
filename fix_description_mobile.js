const https = require('https');

// Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const productId = 1023;

// --- MOBILE OPTIMIZED STYLES ---
const s = {
    container: "font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; max-width: 100%; overflow-x: hidden;",
    // Reduced padding on mobile wrapper
    gradientBox: "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
    gradientBoxGreen: "background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 2px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
    innerBox: "background: white; padding: 15px; border-radius: 10px;",

    // Header wraps cleanly
    title: "font-size: 18px; font-weight: 800; margin: 0 0 15px 0; color: #4a5568; display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; flex-wrap: wrap;",
    titleGreen: "font-size: 18px; font-weight: 800; margin: 0 0 15px 0; color: #059669; display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; flex-wrap: wrap;",

    // Critical for scrolling
    tableWrapper: "overflow-x: auto; -webkit-overflow-scrolling: touch; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 5px;",
    table: "width: 100%; border-collapse: collapse; min-width: 250px; white-space: nowrap;",

    td: "padding: 10px 8px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center; font-size: 14px;",
    tdLast: "padding: 10px 8px; border-bottom: none; color: #2d3748; font-weight: 600; text-align: center; font-size: 14px;",
    trEven: "background-color: #f7fafc;",

    hint: "text-align: center; color: #a0aec0; font-size: 11px; margin-top: 5px; display: block;"
};

const description = `
<div style="${s.container}">

  <h3 style="color: #2d3748; margin-bottom: 10px; font-size: 20px;">كيبورد Dell Latitude E6540 - دقة وأداء عالي</h3>
  <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px; font-size: 15px;">جدد كيبورد جهازك مع كيبورد Dell Latitude E6540 الأصلي من Fix Zone. مصمم ليوفر تجربة كتابة مريحة وسريعة الاستجابة، مع دعم كامل للإضاءة الخلفية للعمل في الظروف المظلمة. هذا الكيبورد هو الخيار الأمثل لاستعادة كفاءة اللابتوب الخاص بك.</p>

  <!-- Part Numbers Table -->
  <div style="${s.gradientBox}">
    <div style="${s.innerBox}">
      <h4 style="${s.title}">
        ⚙️ <span style="display:inline-block">أرقام القطع</span>
        <span style="font-size: 14px; color: #718096; font-weight: normal;">(Part Numbers)</span>
      </h4>
      <div style="${s.tableWrapper}">
        <table style="${s.table}">
          <tr>
             <td style="${s.td}">0HG3G3</td>
             <td style="${s.td}">HG3G3</td>
             <td style="${s.td}">07T425</td>
             <td style="${s.td}">7T425</td>
          </tr>
          <tr style="${s.trEven}">
             <td style="${s.tdLast}">NSK-DW2BC</td>
             <td style="${s.tdLast}">PK130FH1A00</td>
             <td style="${s.tdLast}">M8F00</td>
             <td style="${s.tdLast}">0F5YDT</td>
          </tr>
        </table>
      </div>
      <small style="${s.hint}">↔️ اسحب الجدول لليسار في الموبايل</small>
    </div>
  </div>

  <!-- Compatible Models Table -->
  <div style="${s.gradientBox}">
    <div style="${s.innerBox}">
      <h4 style="${s.title}">
        💻 <span style="display:inline-block">الموديلات المتوافقة</span>
        <span style="font-size: 14px; color: #718096; font-weight: normal;">(Models)</span>
      </h4>
      <div style="${s.tableWrapper}">
        <table style="${s.table}">
          <tr>
            <td style="${s.td}">Latitude E6540</td>
            <td style="${s.td}">Latitude E6520</td>
            <td style="${s.td}">Latitude E6530</td>
          </tr>
          <tr style="${s.trEven}">
            <td style="${s.td}">Latitude E5520</td>
            <td style="${s.td}">Latitude E5530</td>
            <td style="${s.td}">Precision M4800</td>
          </tr>
          <tr>
            <td style="${s.tdLast}">Precision M6800</td>
            <td style="${s.tdLast}">Precision M4600</td>
            <td style="${s.tdLast}">Precision M6600</td>
          </tr>
        </table>
      </div>
       <small style="${s.hint}">↔️ اسحب الجدول لليسار في الموبايل</small>
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
            console.log('✅ Product description optimized for MOBILE!');
        } else {
            console.error(`❌ Failed. Status: ${res.statusCode}`);
            console.error(data);
        }
    });
});

req.write(JSON.stringify(productData));
req.end();
