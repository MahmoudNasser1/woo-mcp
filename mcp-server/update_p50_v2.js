import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const siteUrl = "https://fixzzone.com";
const username = "mahmoudeldrwal";
const password = "rYr2 hBHb uqYB mz1j 5wOn 29Db";
const consumerKey = "ck_4f07c8102d1451a5a9d35aef7884a3ba80bb61bb";
const consumerSecret = "cs_b087226ca47dbdab3eacf5bce7b16519e2a0ec32";

const auth = Buffer.from(`${username}:${password}`).toString('base64');
const productId = 1105;

async function updateP50() {
    const filePath = '/home/eldrwal/.openclaw/workspace/FZ-Website-Agent/mcp-server/p50_final_wm_v2.jpg';
    
    try {
        console.log("Pricing Agent & Media Agent: Updating Lenovo P50...");

        // 1. Upload Clean Watermarked Image
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('title', 'كيبورد Lenovo ThinkPad P50 Original No Watermark From Source');
        formData.append('alt_text', 'كيبورد لابتوب Lenovo P50 أصلية - فيكس زون مصر');

        const uploadRes = await axios.post(`${siteUrl}/wp-json/wp/v2/media`, formData, {
            headers: { ...formData.getHeaders(), 'Authorization': `Basic ${auth}` }
        });
        const imageId = uploadRes.data.id;

        // 2. Update Product (Price + Image)
        const wooClient = axios.create({
            baseURL: `${siteUrl}/wp-json/wc/v3`,
            params: { consumer_key: consumerKey, consumer_secret: consumerSecret }
        });

        await wooClient.put(`/products/${productId}`, {
            regular_price: "2450",
            images: [{ id: imageId }]
        });

        console.log("✅ Lenovo P50 Updated: Clean Image + Market Price (2450 EGP).");
        console.log(`Live Link: https://fixzzone.com/?p=${productId}`);

    } catch (error) {
        console.error("Update Failed:", error.message);
    }
}

updateP50();
