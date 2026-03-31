const https = require('https');

// Initialize API Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const productId = 1070;

// NEW HTML SECTION
const helpSection = `
  <div style="background-color: #f0fff4; border: 1px solid #c6f6d5; border-right: 5px solid #2f855a; border-radius: 8px; padding: 20px; margin-top: 30px; direction: rtl;">
    <h3 style="color: #2f855a; display: flex; align-items: center; gap: 10px; margin-top: 0;">
      👨‍🔧 محتاج مساعدة في التركيب؟
    </h3>
    <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
      لو مش متخصص في صيانة اللابتوب، متقلقش! فيكس زون هنا عشان نساعدك. اختار الطريقة اللي تريحك:
    </p>
    
    <div style="display: flex; flex-wrap: wrap; gap: 15px;">
      <!-- Button 1: Home Visit -->
      <a href="https://fixzzone.com/visits/" style="flex: 1; min-width: 200px; background-color: #e53e3e; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; text-align: center; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        🚗 احجز زيارة منزلية
      </a>
      
      <!-- Button 2: Location -->
      <a href="https://fixzzone.com/contact/" style="flex: 1; min-width: 200px; background-color: #3182ce; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; text-align: center; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
         🏛️ زورنا في الفروع
      </a>
  
      <!-- Button 3: WhatsApp -->
      <a href="https://wa.me/201270388043" style="flex: 1; min-width: 200px; background-color: #25d366; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; text-align: center; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
         💬 كلمنا واتساب
      </a>
    </div>
  </div>
`;

// FULL DESCRIPTION (Updated Copy of Previous + Help Section)
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
        console.log(`🚀 Updating Product ${productId}...`);

        const response = await sendRequest('PUT', `/products/${productId}`, {
            description: description,
            default_attributes: [
                {
                    name: 'Condition',
                    option: 'High Copy'
                }
            ]
        });

        console.log("✅ Product Updated Successfully!");
        console.log("   - Help Section Added");
        console.log("   - Default Variation set to 'High Copy'");
        console.log(`🔗 Link: ${response.permalink}`);

    } catch (error) {
        console.error("❌ Error:");
        console.error(error);
    }
}

main();
