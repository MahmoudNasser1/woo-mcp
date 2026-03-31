const https = require('https');

const ck = 'process.env.WOOCOMMERCE_CONSUMER_KEY';
const cs = 'process.env.WOOCOMMERCE_CONSUMER_SECRET';
const url = 'https://fixzzone.com/wp-json/wc/v3/products?per_page=3';

const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

const options = {
  headers: {
    'Authorization': `Basic ${auth}`,
    'User-Agent': 'FixZone-Agent-Check'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error('Error:', res.statusCode, data);
      process.exit(1);
    }
    const products = JSON.parse(data);
    console.log('✅ Connected to WooCommerce!');
    console.log(`✅ Found ${products.length} products in test fetch.`);
    products.forEach(p => {
      console.log(`- [${p.id}] ${p.name} (${p.stock_status}) - ${p.price} EGP`);
    });
  });
}).on('error', err => {
  console.error('Connection Error:', err.message);
});
