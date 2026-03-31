import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const siteUrl = "https://fixzzone.com";
const username = "mahmoudeldrwal";
const password = "rYr2 hBHb uqYB mz1j 5wOn 29Db";
const consumerKey = "ck_4f07c8102d1451a5a9d35aef7884a3ba80bb61bb";
const consumerSecret = "cs_b087226ca47dbdab3eacf5bce7b16519e2a0ec32";

const auth = Buffer.from(`${username}:${password}`).toString('base64');
const productId = 1110;

async function updateHpImage() {
    const filePath = '/home/eldrwal/.openclaw/workspace/FZ-Website-Agent/mcp-server/hp-charger-wm.jpg';
    
    try {
        console.log("Media Agent: Uploading the new HP Charger image...");

        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('title', 'شاحن لابتوب HP 65W USB-C الأصلي - Fix Zone');
        formData.append('alt_text', 'شاحن HP أصلي 65 واط USB-C - فيكس زون مصر');

        const uploadRes = await axios.post(`${siteUrl}/wp-json/wp/v2/media`, formData, {
            headers: { ...formData.getHeaders(), 'Authorization': `Basic ${auth}` }
        });
        const imageId = uploadRes.data.id;

        const wooClient = axios.create({
            baseURL: `${siteUrl}/wp-json/wc/v3`,
            params: { consumer_key: consumerKey, consumer_secret: consumerSecret }
        });

        await wooClient.put(`/products/${productId}`, {
            images: [{ id: imageId }]
        });

        console.log("✅ HP Charger Image Updated successfully!");
        console.log(`Review Link: https://fixzzone.com/?p=${productId}`);

    } catch (error) {
        console.error("Update Failed:", error.message);
    }
}

updateHpImage();
