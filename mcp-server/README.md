# WooCommerce MCP Server

A Model Context Protocol (MCP) server for WooCommerce integration, compatible with Windows, macOS, and Linux.

## Overview

This MCP server enables interaction with WooCommerce stores through the WordPress REST API. It provides comprehensive tools for managing products, orders, customers, and more using the standard MCP protocol.

## What's Fixed

This version has been updated to properly implement the Model Context Protocol standard using the official `@modelcontextprotocol/sdk`. The previous version used a custom JSON-RPC implementation that wasn't compatible with MCP clients.

### Key Changes:
- ✅ Full MCP protocol support using official SDK
- ✅ Proper `initialize` handshake
- ✅ Standard `tools/list` and `tools/call` endpoints
- ✅ Better error handling and response formatting
- ✅ Compatible with Claude Desktop and other MCP clients

## Installation

1. Clone the repository:
```bash
git clone https://github.com/techspawn/woocommerce-mcp-server.git
cd woocommerce-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

### For Claude Desktop

Add the server to your MCP settings file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "woocommerce": {
      "command": "node",
      "args": ["/absolute/path/to/woocommerce-mcp-server/build/index.js"],
      "env": {
        "WORDPRESS_SITE_URL": "https://your-wordpress-site.com",
        "WOOCOMMERCE_CONSUMER_KEY": "ck_xxxxxxxxxxxxx",
        "WOOCOMMERCE_CONSUMER_SECRET": "cs_xxxxxxxxxxxxx",
        "WORDPRESS_USERNAME": "your-username",
        "WORDPRESS_PASSWORD": "your-password"
      }
    }
  }
}
```

### Environment Variables

#### Required for WooCommerce API access:
- `WORDPRESS_SITE_URL`: Your WordPress site URL (e.g., https://example.com)
- `WOOCOMMERCE_CONSUMER_KEY`: WooCommerce REST API consumer key (starts with `ck_`)
- `WOOCOMMERCE_CONSUMER_SECRET`: WooCommerce REST API consumer secret (starts with `cs_`)

#### Required only for WordPress API methods (posts, pages):
- `WORDPRESS_USERNAME`: WordPress username with appropriate permissions
- `WORDPRESS_PASSWORD`: WordPress application password

### Getting WooCommerce API Credentials

1. Log into your WordPress admin panel
2. Go to **WooCommerce → Settings → Advanced → REST API**
3. Click **Add key**
4. Give it a description (e.g., "MCP Server")
5. Select a User (with appropriate permissions)
6. Set Permissions to **Read/Write**
7. Click **Generate API key**
8. Copy the Consumer key and Consumer secret

## Available Tools

### WooCommerce Products
- `get_products` - Retrieve a list of products
- `get_product` - Get a single product by ID
- `create_product` - Create a new product
- `update_product` - Update an existing product
- `delete_product` - Delete a product

### Product Categories
- `get_product_categories` - Retrieve product categories
- `get_product_category` - Get a single category by ID
- `create_product_category` - Create a new category
- `update_product_category` - Update an existing category

### Product Variations
- `get_product_variations` - Retrieve product variations
- `create_product_variation` - Create a new variation
- `update_product_variation` - Update an existing variation

### Orders
- `get_orders` - Retrieve a list of orders
- `get_order` - Get a single order by ID
- `create_order` - Create a new order
- `update_order` - Update an existing order

### WordPress Posts (requires username/password)
- `create_post` - Create a new WordPress post
- `get_posts` - Retrieve WordPress posts
- `update_post` - Update an existing post

## Usage Examples

### Example 1: Create a Product

```javascript
{
  "name": "create_product",
  "arguments": {
    "productData": {
      "name": "بطارية لابتوب Dell 6MT4T",
      "type": "variable",
      "status": "publish",
      "description": "بطارية أصلية عالية الجودة لأجهزة Dell Latitude",
      "short_description": "بطارية Dell 6MT4T - High Copy & Original",
      "categories": [
        {
          "id": 15
        }
      ],
      "attributes": [
        {
          "id": 1,
          "name": "الجودة",
          "position": 0,
          "visible": true,
          "variation": true,
          "options": ["High Copy", "Original"]
        }
      ]
    }
  }
}
```

### Example 2: Create Product Variations

After creating a variable product, add variations:

```javascript
{
  "name": "create_product_variation",
  "arguments": {
    "productId": 123,
    "variationData": {
      "regular_price": "1100",
      "attributes": [
        {
          "id": 1,
          "option": "High Copy"
        }
      ]
    }
  }
}
```

### Example 3: Get Products

```javascript
{
  "name": "get_products",
  "arguments": {
    "perPage": 20,
    "page": 1,
    "filters": {
      "status": "publish",
      "category": "15"
    }
  }
}
```

## Fix Zone Integration

This server is specifically configured for Fix Zone's product management workflow:

1. **Product Creation**: Creates products with Arabic names and English keywords for SEO
2. **Variations Support**: Handles High Copy and Original quality variations
3. **Category Management**: Organizes products into categories (Batteries, Keyboards, Screens, etc.)
4. **Metadata**: Supports custom fields for part numbers, compatibility, specifications

## Troubleshooting

### "WordPress site URL not provided"
Make sure `WORDPRESS_SITE_URL` is set in your environment variables or passed in the request.

### "WooCommerce API credentials not provided"
Ensure you've generated API keys in WooCommerce and set them as environment variables.

### Connection refused / timeout
- Check that your WordPress site is accessible
- Verify WooCommerce REST API is enabled
- Make sure your firewall allows the connection

### SSL certificate errors
If using a self-signed certificate, you may need to set:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
```
(Not recommended for production)

## Development

### Run in development mode:
```bash
npm run dev
```

### Build:
```bash
npm run build
```

### Start the built server:
```bash
npm start
```

## License

MIT

## Author

techspawn

Modified and fixed for Fix Zone by Mahmoud
