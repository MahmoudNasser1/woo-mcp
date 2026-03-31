import axios from 'axios';

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

async function updateP50Price() {
    try {
        await client.put('/products/1105', {
            regular_price: "2450"
        });
        console.log("Price updated to 2450");
    } catch (e) { console.error(e.message); }
}

updateP50Price();
