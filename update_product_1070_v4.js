const https = require('https');

// Initialize API Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const productId = 1070;

// REFINED HELP SECTION (EXACT URLS)
const helpSection = `
  <div style="background-color: #f0fff4; border: 1px solid #c6f6d5; border-right: 5px solid #2f855a; border-radius: 8px; padding: 20px; margin-top: 30px; direction: rtl;">
    <h3 style="color: #2f855a; display: flex; align-items: center; gap: 10px; margin-top: 0; font-weight: bold;">
      👨‍🔧 محتاج مساعدة في التركيب؟
    </h3>
    <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
      <b>لو مش متخصص في صيانة اللابتوبات، متقلقش!</b> فيكس زون هنا عشان نساعدك:
    </p>
    
    <ul style="color: #4a5568; padding-right: 20px; margin-bottom: 25px; line-height: 1.8;">
        <li style="margin-bottom: 8px;">🏛️ <b>زورنا في المركز:</b> فريقنا هيركب لك القطعة باحترافية</li>
        <li>🚗 <b>احجز زيارة ميدانية:</b> هنبعتلك فني متخصص يركبها عندك (داخل القاهرة)</li>
    </ul>
    
    <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end;">
      <!-- Button 1: Home Visit (Red) -->
      <a href="https://fixzzone.com/visits/" style="background-color: #e53e3e; color: white; text-decoration: none; padding: 10px 20px; border-radius: 25px; font-weight: bold; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 14px;">
        🚗 احجز زيارة ميدانية
      </a>
      
      <!-- Button 2: WhatsApp (Green) -->
      <a href="https://api.whatsapp.com/send/?phone=201270388043&text&type=phone_number&app_absent=0" style="background-color: #25d366; color: white; text-decoration: none; padding: 10px 20px; border-radius: 25px; font-weight: bold; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 14px;">
         💬 201270388043
      </a>
  
      <!-- Button 3: Location (Blue) -->
      <a href="https://fixzzone.com/contact/" style="background-color: #3182ce; color: white; text-decoration: none; padding: 10px 20px; border-radius: 25px; font-weight: bold; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 14px;">
         📍 موقعنا والعنوان
      </a>
    </div>
  </div>
  
  <div style="margin-top: 20px; padding: 10px; border-right: 3px solid #3182ce; background: #ebf8ff; color: #2c5282;">
    <b>تأكد من التوافق:</b> تأكد من موديل الجهاز قبل الطلب للتأكد من التوافق الكامل. لو محتاج مساعدة، تواصل معانا!
  </div>
`;

// FULL DESCRIPTION (Updated Copy + Refined Help Section)
const description = `
<div style="font-family: 'Cairo', sans-serif; direction: rtl;">

  <h3>بطارية Dell 3HWPP - طاقة تدوم طويلاً</h3>
  <p>استعد كفاءة جهازك مع بطارية Dell 3HWPP المتوفرة بجودة Original New و High Copy. تضمن لك أداءً موثوقاً وساعات عمل طويلة بفضل سعة 68Wh الحقيقية.</p>

  <!-- Part Numbers Table -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <div style="background: white; padding: 25px; border-radius: 10px;">
      <h4 style="font-size: 22px; font-weight: 800; margin: 0 0 20px 0; color: #4a5568; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #edf2f7; padding-bottom: 10px;">⚙️ أرقام القطع المتوافقة (Part Numbers)</h4>
      <div style="overflow-x: auto; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse; min-width: 300px;">
          <tr style="background-color: #f7fafc;">
             <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">3HWPP</td>
             <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">03HWPP</td>
             <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">10X1J</td>
          </tr>
          <tr>
             <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">N2NLL</td>
             <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">1VY7F</td>
             <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">01VY7F</td>
          </tr>
        </table>
      </div>
    </div>
  </div>

  <!-- Compatible Models Table -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <div style="background: white; padding: 25px; border-radius: 10px;">
      <h4 style="font-size: 22px; font-weight: 800; margin: 0 0 20px 0; color: #4a5568; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #edf2f7; padding-bottom: 10px;">💻 موديلات اللابتوب المتوافقة (Compatible Models)</h4>
      <div style="overflow-x: auto; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse; min-width: 300px;">
          <tr style="background-color: #f7fafc;">
            <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">Dell Latitude 5401</td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">Dell Latitude 5501</td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">Dell Latitude 5410</td>
          </tr>
          <tr>
            <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">Dell Latitude 5510</td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">Dell Precision 3541</td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: center;">Dell Precision 3551</td>
          </tr>
        </table>
      </div>
    </div>
  </div>

  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 3px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <div style="background: white; padding: 25px; border-radius: 10px;">
          <h4 style="font-size: 22px; font-weight: 800; margin: 0 0 20px 0; color: #059669; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #edf2f7; padding-bottom: 10px;">✨ المواصفات الفنية</h4>
          <ul style="list-style: none; padding: 0; font-weight: 600; color: #2d3748;">
              <li style="margin-bottom: 10px;">✅ الفولت: 15.2V</li>
              <li style="margin-bottom: 10px;">✅ السعة: 68Wh</li>
              <li style="margin-bottom: 10px;">✅ الخلايا: 4 Cell</li>
              <li style="margin-bottom: 10px;">✅ الضمان: 3 شهور</li>
          </ul>
    </div>
  </div>

  ${helpSection}

</div>
`;

// API Helper
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

async function main() {
    try {
        console.log(`🚀 Updating Product ${productId} with Exact Links (V4)...`);

        const response = await sendRequest('PUT', `/products/${productId}`, {
            description: description
        });

        console.log("✅ Product Updated Successfully!");
        console.log("   - Button URLs updated");
        console.log(`🔗 Link: ${response.permalink}`);

    } catch (error) {
        console.error("❌ Error:");
        console.error(error);
    }
}

main();
