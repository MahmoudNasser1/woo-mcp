const https = require('https');

// Initialize API Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

// Product Data
const title = "بطارية لابتوب Dell Latitude 5401 5501 Precision 3541 – 3HWPP Original";
const shortDesc = "بطارية لابتوب Dell 3HWPP الأصلية (Original New) و High Copy. سعة 68Wh / 15.2V. متوافق مع موديلات Latitude 5401, 5501, Precision 3541. متوفرة بسعرين مختلفين حسب الجودة.";

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

  <h3>بطارية Dell 3HWPP - طاقة تدوم طويلاً</h3>
  <p>استعد كفاءة جهازك مع بطارية Dell 3HWPP المتوفرة بجودة Original New و High Copy. تضمن لك أداءً موثوقاً وساعات عمل طويلة بفضل سعة 68Wh الحقيقية.</p>

  <!-- Part Numbers Table -->
  <div class="fz-gradient-box">
    <div class="fz-inner-box">
      <h4 class="fz-title">⚙️ أرقام القطع المتوافقة (Part Numbers)</h4>
      <div class="fz-table-wrapper">
        <table class="fz-responsive-table">
          <tr>
             <td>3HWPP</td>
             <td>03HWPP</td>
             <td>10X1J</td>
          </tr>
          <tr>
             <td>N2NLL</td>
             <td>1VY7F</td>
             <td>01VY7F</td>
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
            <td>Dell Latitude 5401</td>
            <td>Dell Latitude 5501</td>
            <td>Dell Latitude 5410</td>
          </tr>
          <tr>
            <td>Dell Latitude 5510</td>
            <td>Dell Precision 3541</td>
            <td>Dell Precision 3551</td>
          </tr>
        </table>
      </div>
    </div>
  </div>

  <div class="fz-gradient-box" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
    <div class="fz-inner-box">
          <h4 class="fz-title" style="color: #059669;">✨ المواصفات الفنية</h4>
          <ul style="list-style: none; padding: 0; font-weight: 600; color: #2d3748;">
              <li style="margin-bottom: 10px;">✅ الفولت: 15.2V</li>
              <li style="margin-bottom: 10px;">✅ السعة: 68Wh</li>
              <li style="margin-bottom: 10px;">✅ الخلايا: 4 Cell</li>
              <li style="margin-bottom: 10px;">✅ الضمان: 3 شهور</li>
          </ul>
    </div>
  </div>

</div>
`;

// Helper function for sending requests
function sendRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(`${baseUrl}${path}`, {
            method: method,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'User-Agent': 'FixZone-Repair-Agent'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject({ statusCode: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (e) => reject({ message: e.message }));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

// SEO Data
const metaData = [
    { key: 'rank_math_title', value: 'بطارية لابتوب Dell Latitude 5401 5501 | 3HWPP Original - Fix Zone' },
    { key: 'rank_math_description', value: 'بطارية Dell 3HWPP الأصلية. متوافقة مع Latitude 5401, 5501, Precision 3541. متوفرة High Copy و Original. ضمان 3 شهور. اطلب الآن!' },
    { key: 'rank_math_focus_keyword', value: 'dell 3hwpp battery' }
];

async function main() {
    try {
        console.log("🚀 Creating Parent Product...");
        const parentProduct = await sendRequest('POST', '/products', {
            name: title,
            type: 'variable',
            description: description,
            short_description: shortDesc,
            meta_data: metaData,
            attributes: [
                {
                    name: 'Brand',
                    visible: true,
                    variation: false,
                    options: ['Dell']
                },
                {
                    name: 'Condition',
                    visible: true,
                    variation: true, // Used for variations
                    options: ['Original New', 'High Copy']
                },
                {
                    name: 'Warranty',
                    visible: true,
                    variation: false,
                    options: ['3 Months']
                }
            ]
        });

        const productId = parentProduct.id;
        console.log(`✅ Parent Product Created! ID: ${productId}`);
        console.log(`🔗 Link: ${parentProduct.permalink}`);

        console.log("Variations creation...");

        // Variation 1: High Copy
        console.log("   - Creating High Copy Variation...");
        await sendRequest('POST', `/products/${productId}/variations`, {
            regular_price: '1350',
            attributes: [
                {
                    id: 0, // Custom attribute or global ID if known, 0 works for custom added above
                    name: 'Condition',
                    option: 'High Copy'
                }
            ]
        });
        console.log("     ✅ High Copy created (1350 EGP)");

        // Variation 2: Original New
        console.log("   - Creating Original New Variation...");
        await sendRequest('POST', `/products/${productId}/variations`, {
            regular_price: '2450',
            attributes: [
                {
                    id: 0,
                    name: 'Condition',
                    option: 'Original New'
                }
            ]
        });
        console.log("     ✅ Original New created (2450 EGP)");

        console.log("\n🎉 All Done! Please verify the link above.");

    } catch (error) {
        console.error("❌ Error:");
        console.error(error);
    }
}

main();
