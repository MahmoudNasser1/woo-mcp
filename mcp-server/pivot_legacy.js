import axios from 'axios';

const siteUrl = "https://fixzzone.com";
const consumerKey = "ck_4f07c8102d1451a5a9d35aef7884a3ba80bb61bb";
const consumerSecret = "cs_b087226ca47dbdab3eacf5bce7b16519e2a0ec32";

async function run() {
    try {
        console.log("Team: PIVOTING to HP Charger (Legacy URL Mode)...");
        const url = `${siteUrl}/wp-json/wc/v3/products/1110?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
        
        const data = {
            name: "شاحن لابتوب HP 65W USB-C الأصلي – Spare Part L04650-850",
            short_description: "شاحن HP أصلي 65 واط بمنفذ USB-C. الخيار المثالي لأجهزة EliteBook و ProBook و Spectre. ضمان 3 شهور من Fix Zone مصر."
        };

        const response = await axios.put(url, data);
        console.log("LEGACY_SUCCESS: " + response.data.name);
    } catch (error) {
        console.log("LEGACY_FAIL: " + error.message);
    }
}

run();
