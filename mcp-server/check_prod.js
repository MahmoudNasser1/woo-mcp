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

async function checkProduct() {
    try {
        const res = await client.get('/products/1110');
        console.log("SUCCESS_TOKEN_99");
        console.log("Title:" + res.data.name);
    } catch (e) { console.log("ERROR_TOKEN_99:" + e.message); }
}

checkProduct();
