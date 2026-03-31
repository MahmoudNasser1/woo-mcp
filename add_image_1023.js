const https = require('https');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Credentials
const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const baseUrl = 'https://fixzzone.com/wp-json/wc/v3';
const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
const productId = 1023;

// Image to upload
const imagePath = path.join(__dirname, 'temp_images', 'dell-e6540.jpg');

if (!fs.existsSync(imagePath)) {
    console.error('❌ Image file not found!');
    process.exit(1);
}

// 1. Upload Image to WordPress Media Library
function uploadImage() {
    console.log('📤 Uploading image...');

    // Note: WooCommerce API doesn't support direct file upload via 'products' endpoint easily with local files without a plugin or complex multipart.
    // However, we can use the WordPress Media API if enabled, OR we can try to POST to /wp-json/wp/v2/media
    // But since we are using WooCommerce keys, we assume they have access.

    // For simplicity in this environment, and since we don't have the WP Media credentials explicitly separated (often they are same), we will try the /wp/v2/media endpoint with Basic Auth (assuming Application Passwords or Basic Auth plugin is active, which is implied by WC setup).
    // IF that fails, we might need to host the image temporarily. But let's try pushing the binary.

    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));
    form.append('title', 'Dell Latitude E6540 Keyboard Backlit');
    form.append('alt_text', 'كيبورد Dell Latitude E6540 أصلي بإضاءة خلفية - Fix Zone');
    form.append('caption', 'Dell E6540 Backlit Keyboard');

    const req = https.request('https://fixzzone.com/wp-json/wp/v2/media', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            ...form.getHeaders()
        }
    }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            if (res.statusCode === 201) {
                const media = JSON.parse(data);
                console.log(`✅ Image uploaded! Media ID: ${media.id}`);
                attachImageToProduct(media.id);
            } else {
                console.error(`❌ Upload failed: ${res.statusCode}`);
                console.error(data);

                // Fallback: If media upload fails (permissions), we might skip image or try a public URL method if we had one.
            }
        });
    });

    form.pipe(req);
}

// 2. Attach Image to Product
function attachImageToProduct(mediaId) {
    console.log(`🔗 Attaching Media ID ${mediaId} to Product ${productId}...`);

    const updateData = {
        images: [
            { id: mediaId } // Set as main image
        ]
    };

    const req = https.request(`${baseUrl}/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
        }
    }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('🎉 Product images updated successfully!');
            } else {
                console.error('❌ Failed to attach image.');
                console.error(data);
            }
        });
    });

    req.write(JSON.stringify(updateData));
    req.end();
}

uploadImage();
