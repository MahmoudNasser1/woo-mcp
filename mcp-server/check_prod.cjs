const axios = require('axios');

const siteUrl = "https://fixzzone.com";
const consumerKey = "ck_4f07c8102d1451a5a9d35aef7884a3ba80bb61bb";
const consumerSecret = "cs_b087226ca47dbdab3eacf5bce7b16519e2a0ec32";

const client = axios.create({
    baseURL: `${siteUrl}/wp-json/wc/v3`,
    params: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
    }
});

async function checkProduct() {
    try {
        const res = await client.get('/products/1110');
        console.log("Product Title:", res.data.name);
        console.log("Product Desc Length:", res.data.description.length);
    } catch (e) { console.error("Error:", e.message); }
}

checkProduct();
