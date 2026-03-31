const https = require('https');

const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const url = 'https://fixzzone.com/wp-json/wc/v3/products?per_page=3';

const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

const options = {
    headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'FixZone-Audit-Agent'
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const products = JSON.parse(data);
        products.forEach(p => {
            console.log(`\n📦 Product Audit: [${p.id}] ${p.name}`);
            console.log(`   - Status: ${p.status}`);
            console.log(`   - Price: ${p.price} EGP`);
            console.log(`   - Images: ${p.images.length}`);
            console.log(`   - SEO Title: ${p.meta_data.find(m => m.key === 'rank_math_title')?.value || 'N/A'}`);
            console.log(`   - Focus KW: ${p.meta_data.find(m => m.key === 'rank_math_focus_keyword')?.value || 'N/A'}`);
            console.log(`   - Short Desc Length: ${p.short_description.length}`);
            console.log(`   - Attributes: ${p.attributes.map(a => a.name).join(', ')}`);
        });
    });
});
