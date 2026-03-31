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

async function checkAuth() {
    try {
        console.log("Checking connection and auth...");
        const res = await client.get('/products', { params: { per_page: 1 } });
        console.log("AUTH_OK: Found product: " + res.data[0].name);
    } catch (e) { 
        console.log("AUTH_FAILED: " + e.message); 
        if (e.response) {
            console.log("Status: " + e.response.status);
            console.log("Data: " + JSON.stringify(e.response.data));
        }
    }
}

checkAuth();
