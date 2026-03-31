import axios from 'axios';

const siteUrl = "https://fixzzone.com";
const consumerKey = "ck_4f07c8102d1451a5a9d35aef7884a3ba80bb61bb";
const consumerSecret = "cs_b087226ca47dbdab3eacf5bce7b16519e2a0ec32";

async function run() {
    try {
        console.log("Check if product exists via API before update...");
        const res = await axios.get(`${siteUrl}/wp-json/wc/v3/products/1110`, {
            params: {
                consumer_key: consumerKey,
                consumer_secret: consumerSecret
            }
        });
        console.log("Product Name: " + res.data.name);
    } catch (e) {
        console.log("Check Fail: " + e.message);
    }
}
run();
