# Testing Guide - WooCommerce MCP Server

## Quick Test

To verify the server is working correctly, you can test it using the MCP Inspector tool or directly with Claude Desktop.

## Option 1: Test with MCP Inspector

Install the MCP Inspector:
```bash
npm install -g @modelcontextprotocol/inspector
```

Run the inspector:
```bash
mcp-inspector node /absolute/path/to/build/index.js
```

Set environment variables when prompted:
- WORDPRESS_SITE_URL
- WOOCOMMERCE_CONSUMER_KEY
- WOOCOMMERCE_CONSUMER_SECRET

## Option 2: Test with Claude Desktop

1. Configure Claude Desktop as described in SETUP_GUIDE_AR.md
2. Restart Claude Desktop
3. Start a new conversation
4. Try these test prompts:

### Test 1: List Tools
```
Can you show me what WooCommerce tools are available?
```

Expected: Claude should list all available WooCommerce tools.

### Test 2: Get Products
```
Can you get the first 5 products from my WooCommerce store?
```

Expected: Claude should call `get_products` and show you the results.

### Test 3: Get Categories
```
Show me all the product categories in my store.
```

Expected: Claude should call `get_product_categories` and display them.

## Option 3: Manual Test with Node

Create a test file `test.js`:

```javascript
import { spawn } from 'child_process';

const server = spawn('node', ['build/index.js'], {
  env: {
    ...process.env,
    WORDPRESS_SITE_URL: 'https://your-site.com',
    WOOCOMMERCE_CONSUMER_KEY: 'ck_xxx',
    WOOCOMMERCE_CONSUMER_SECRET: 'cs_xxx'
  }
});

// Test initialize
server.stdin.write(JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  }
}) + '\n');

// Test tools/list
setTimeout(() => {
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  }) + '\n');
}, 1000);

server.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});
```

Run:
```bash
node test.js
```

## Expected Behavior

### Successful Startup
You should see in stderr:
```
WooCommerce MCP Server running on stdio
```

### Tools List Response
The `tools/list` call should return JSON with all available tools including:
- create_product
- get_products
- get_product
- update_product
- delete_product
- get_product_categories
- create_product_category
- etc.

### Error Cases
If you see errors, check:
1. Environment variables are set correctly
2. WordPress site is accessible
3. WooCommerce API credentials are valid
4. WooCommerce REST API is enabled

## Common Issues

### "Cannot connect to site"
- Verify WORDPRESS_SITE_URL is correct (include https://)
- Check if site is accessible from your network
- Verify firewall settings

### "Authentication failed"
- Regenerate WooCommerce API keys
- Make sure keys have Read/Write permissions
- Check if the user associated with keys has proper WordPress capabilities

### "Tools not showing in Claude"
- Restart Claude Desktop completely (not just the window)
- Check the config file path is correct
- Verify the build/index.js path is absolute, not relative
- Look for errors in Claude's developer console

## Debugging Tips

### Enable Verbose Logging
Modify `src/index.ts` to add logging:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.error(`Tool called: ${request.params.name}`);
  console.error(`Arguments:`, JSON.stringify(request.params.arguments, null, 2));
  // ... rest of handler
});
```

### Check Network Requests
Add axios interceptors in `src/index.ts`:

```typescript
client.interceptors.request.use((config) => {
  console.error(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

client.interceptors.response.use(
  (response) => {
    console.error(`Response: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`Error: ${error.message}`);
    throw error;
  }
);
```

## Performance Test

Create a simple performance test:

```javascript
// Time a simple product fetch
console.time('get_products');
// Call get_products through MCP
console.timeEnd('get_products');
```

Expected: Should complete in under 2 seconds for a typical WooCommerce store.

## Integration Test

For a full integration test, try creating a complete product with variations:

1. Create a variable product
2. Get the product ID from response
3. Create two variations (High Copy, Original)
4. Fetch the product to verify
5. Update the product
6. Delete the product (cleanup)

## Success Criteria

✅ Server starts without errors
✅ Tools are listed correctly
✅ Can fetch products
✅ Can create products
✅ Can update products
✅ Can create variations
✅ Error messages are clear and helpful

If all criteria pass, your installation is successful! 🎉

