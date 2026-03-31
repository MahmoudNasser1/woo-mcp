import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const siteUrl = "https://fixzzone.com";
const username = "mahmoudeldrwal";
const password = "rYr2 hBHb uqYB mz1j 5wOn 29Db";
const consumerKey = "ck_4f07c8102d1451a5a9d35aef7884a3ba80bb61bb";
const consumerSecret = "cs_b087226ca47dbdab3eacf5bce7b16519e2a0ec32";

const auth = Buffer.from(`${username}:${password}`).toString('base64');

async function createUsbCChargerSimple() {
    const filePath = '/home/eldrwal/.openclaw/workspace/FZ-Website-Agent/mcp-server/usbc-wm.jpg';
    
    try {
        console.log("Team Processing: 65W USB-C Charger (Simple)...");

        // 1. Upload Media
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('title', 'شاحن 65W USB-C الأصلي');

        const uploadRes = await axios.post(`${siteUrl}/wp-json/wp/v2/media`, formData, {
            headers: { ...formData.getHeaders(), 'Authorization': `Basic ${auth}` }
        });
        const imageId = uploadRes.data.id;
        console.log("✅ Image Uploaded! ID:", imageId);

        // 2. Create Product
        const wooClient = axios.create({
            baseURL: `${siteUrl}/wp-json/wc/v3`,
            params: { consumer_key: consumerKey, consumer_secret: consumerSecret }
        });

        const productData = {
            name: "شاحن لابتوب 65W USB-C – Universal USB Type-C Power Adapter",
            type: "simple",
            status: "publish",
            regular_price: "1450",
            description: "شاحن لابتوب أصلي 65 واط USB-C متوافق مع جميع الأجهزة.",
            categories: [{ id: 62 }],
            images: [{ id: imageId }]
        };

        const response = await wooClient.post('/products', productData);
        console.log("✅ Product Created! ID:", response.data.id);
        console.log(`Live Link: https://fixzzone.com/?p=${response.data.id}`);

    } catch (error) {
        console.error("FAILED Simple.");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Message:", error.message);
        }
    }
}

createUsbCChargerSimple();
