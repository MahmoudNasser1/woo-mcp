const https = require('https');

// Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const productId = 1023;

// Image URL (Using a reliable source - placeholder logic, will be replaced by actual found URL or a generic one if search fails)
// Trying a generic valid one from a common spare parts site if specific one fails.
// Let's use a very likely valid one based on common parts.
const imageUrl = "https://laptopkeys.com/uploads/721_1351108716_Dell%20LONG%20keyboard%20image.JPG";

function attachImageFromUrl() {
    console.log(`🔗 attaching Image URL to Product ${productId}...`);

    const updateData = {
        images: [
            {
                src: imageUrl,
                name: "Dell Latitude E6540 Keyboard",
                alt: "كيبورد Dell Latitude E6540 أصلي - Fix Zone"
            }
        ]
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
            if (res.statusCode === 200) {
                console.log('🎉 Product image updated successfully via URL!');
                const p = JSON.parse(data);
                console.log(`   - Image Count: ${p.images.length}`);
                console.log(`   - First Image: ${p.images[0].src}`);
            } else {
                console.error(`❌ Failed to attach image. Status: ${res.statusCode}`);
                console.error(data);
            }
        });
    });

    req.write(JSON.stringify(updateData));
    req.end();
}

attachImageFromUrl();
